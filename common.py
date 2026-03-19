from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any


APP_DIR = Path(__file__).resolve().parent
DATA_DIR = APP_DIR / "data"
ACTIVITIES_DIR = DATA_DIR / "activities"
LEADERBOARDS_DIR = DATA_DIR / "leaderboards"
ASSETS_DIR = APP_DIR / "assets"
ITEMS_DIR = ASSETS_DIR / "items"
ACTIVITY_IMAGES_DIR = ASSETS_DIR / "activities"
STATIC_DIR = APP_DIR / "static"
CONFIG_DIR = APP_DIR / "config"
VENDOR_DIR = APP_DIR / "vendor"


def ensure_dirs() -> None:
    for path in (
        DATA_DIR,
        ACTIVITIES_DIR,
        LEADERBOARDS_DIR,
        ASSETS_DIR,
        ITEMS_DIR,
        ACTIVITY_IMAGES_DIR,
        STATIC_DIR,
        CONFIG_DIR,
        VENDOR_DIR,
    ):
        path.mkdir(parents=True, exist_ok=True)


def slugify(value: str) -> str:
    value = value.lower().replace("&amp;", "and").replace("&", "and")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "item"


def read_json(path: Path, default: Any | None = None) -> Any:
    if not path.exists():
        return default
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=True)
        handle.write("\n")


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def parse_int(value: str | None) -> int | None:
    if value is None:
        return None
    digits = re.sub(r"[^\d-]", "", value)
    if not digits or digits == "-":
        return None
    return int(digits)
