from __future__ import annotations

import argparse
import json
import mimetypes
import os
import sys
import webbrowser
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from common import APP_DIR, DATA_DIR, STATIC_DIR, ensure_dirs, read_json
from simulator import simulate_activity


class AppState:
    def __init__(self) -> None:
        self.index_path = DATA_DIR / "index.json"
        self.index = self.load_index()
        self.activity_cache: dict[str, dict] = {}

    def load_index(self) -> dict:
        payload = read_json(
            self.index_path,
            default={
                "generated_at": None,
                "activity_count": 0,
                "supported_count": 0,
                "simulation_enabled_count": 0,
                "activities": [],
            },
        )
        return payload or {"activities": []}

    def refresh(self) -> None:
        self.index = self.load_index()

    def list_activities(self, search: str | None = None, supported_only: bool = False) -> list[dict]:
        activities = self.index.get("activities", [])
        if search:
            needle = search.lower()
            activities = [activity for activity in activities if needle in activity["name"].lower()]
        if supported_only:
            activities = [activity for activity in activities if activity.get("supported")]
        return activities

    def get_activity(self, slug: str) -> dict | None:
        if slug in self.activity_cache:
            return self.activity_cache[slug]
        path = DATA_DIR / "activities" / f"{slug}.json"
        payload = read_json(path)
        if payload:
            self.activity_cache[slug] = payload
        return payload


def json_response(handler: BaseHTTPRequestHandler, payload: dict | list, status: int = 200) -> None:
    data = json.dumps(payload).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(data)))
    handler.end_headers()
    handler.wfile.write(data)


def text_response(handler: BaseHTTPRequestHandler, body: str, status: int = 200) -> None:
    data = body.encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "text/plain; charset=utf-8")
    handler.send_header("Content-Length", str(len(data)))
    handler.end_headers()
    handler.wfile.write(data)


def serve_file(handler: BaseHTTPRequestHandler, path: Path) -> None:
    if not path.exists() or not path.is_file():
        text_response(handler, "Not found", status=404)
        return
    data = path.read_bytes()
    mime_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    handler.send_response(200)
    handler.send_header("Content-Type", mime_type)
    handler.send_header("Content-Length", str(len(data)))
    handler.end_headers()
    handler.wfile.write(data)


def make_handler(state: AppState):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, format: str, *args) -> None:  # noqa: A003
            return

        def do_GET(self) -> None:  # noqa: N802
            parsed = urlparse(self.path)
            if parsed.path == "/api/status":
                state.refresh()
                json_response(self, state.index)
                return

            if parsed.path == "/api/activities":
                state.refresh()
                params = parse_qs(parsed.query)
                search = params.get("search", [None])[0]
                supported_only = params.get("supported", ["0"])[0] == "1"
                json_response(self, state.list_activities(search=search, supported_only=supported_only))
                return

            if parsed.path.startswith("/api/activities/"):
                slug = parsed.path.removeprefix("/api/activities/").strip("/")
                payload = state.get_activity(slug)
                if not payload:
                    json_response(self, {"error": "Unknown activity."}, status=404)
                    return
                json_response(self, payload)
                return

            if parsed.path in {"/", "/index.html"}:
                serve_file(self, APP_DIR / "index.html")
                return

            if parsed.path in {"/app.js", "/styles.css", "/simulator.js", "/activity-time-profiles.js"}:
                serve_file(self, APP_DIR / parsed.path.lstrip("/"))
                return

            if parsed.path.startswith("/data/"):
                serve_file(self, APP_DIR / parsed.path.lstrip("/"))
                return

            if parsed.path.startswith("/static/"):
                serve_file(self, APP_DIR / parsed.path.lstrip("/"))
                return

            if parsed.path.startswith("/assets/"):
                serve_file(self, APP_DIR / parsed.path.lstrip("/"))
                return

            text_response(self, "Not found", status=404)

        def do_POST(self) -> None:  # noqa: N802
            if self.path != "/api/simulate":
                json_response(self, {"error": "Not found."}, status=404)
                return

            try:
                length = int(self.headers.get("Content-Length", "0"))
                raw = self.rfile.read(length)
                payload = json.loads(raw.decode("utf-8"))
            except (ValueError, json.JSONDecodeError):
                json_response(self, {"error": "Invalid JSON body."}, status=400)
                return

            slug = payload.get("slug")
            if not isinstance(slug, str):
                json_response(self, {"error": "Missing activity slug."}, status=400)
                return

            activity_data = state.get_activity(slug)
            if not activity_data:
                json_response(self, {"error": "Unknown activity slug."}, status=404)
                return

            variant_id = payload.get("variant_id")
            if activity_data.get("variants"):
                variants = activity_data.get("variants", [])
                if variant_id:
                    selected_variant = next((variant for variant in variants if variant.get("id") == variant_id), None)
                else:
                    selected_variant = variants[0] if variants else None
                if not selected_variant:
                    json_response(self, {"error": "Unknown activity variant."}, status=400)
                    return
                activity_data = {
                    **activity_data,
                    **selected_variant,
                    "name": f"{activity_data['name']} ({selected_variant['label']})",
                }

            kills = int(payload.get("kills", 0) or 0)
            if kills <= 0:
                json_response(self, {"error": "Kills must be a positive integer."}, status=400)
                return

            seed = payload.get("seed")
            if seed in ("", None):
                seed = None
            elif not isinstance(seed, int):
                try:
                    seed = int(seed)
                except ValueError:
                    json_response(self, {"error": "Seed must be an integer."}, status=400)
                    return

            target_item_slug = payload.get("target_item_slug") or None
            target_count = int(payload.get("target_count", 1) or 1)

            try:
                result = simulate_activity(
                    activity_data=activity_data,
                    kills=kills,
                    seed=seed,
                    target_item_slug=target_item_slug,
                    target_count=target_count,
                )
            except ValueError as exc:
                json_response(self, {"error": str(exc)}, status=400)
                return

            json_response(self, result)

    return Handler


def main() -> int:
    parser = argparse.ArgumentParser(description="Launch the local OSRS drop table simulator GUI.")
    parser.add_argument("--host", default=os.environ.get("HOST", "0.0.0.0"))
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORT", "8765")))
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()

    ensure_dirs()
    state = AppState()
    server = ThreadingHTTPServer((args.host, args.port), make_handler(state))
    url = f"http://{args.host}:{args.port}/"

    print(f"OSRS Sim running at {url}", flush=True)
    if not args.no_browser:
        try:
            webbrowser.open(url)
        except Exception:
            pass

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.", flush=True)
    finally:
        server.server_close()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
