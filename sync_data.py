from __future__ import annotations

import argparse
import re
import sys
import time
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import quote, urljoin

import requests

from common import (
    ACTIVITY_IMAGES_DIR,
    ACTIVITIES_DIR,
    APP_DIR,
    DATA_DIR,
    ITEMS_DIR,
    LEADERBOARDS_DIR,
    VENDOR_DIR,
    clean_text,
    ensure_dirs,
    parse_int,
    read_json,
    slugify,
    write_json,
)

if str(VENDOR_DIR) not in sys.path:
    sys.path.insert(0, str(VENDOR_DIR))

from bs4 import BeautifulSoup  # type: ignore


WIKI_API_URL = "https://oldschool.runescape.wiki/api.php"
WIKI_BASE_URL = "https://oldschool.runescape.wiki"
HISCORES_URL = "https://secure.runescape.com/m=hiscore_oldschool/overall?category_type=1"
USER_AGENT = "osrs-drop-sim-local/1.0 (+local desktop cache builder)"
SECTION_KEYWORDS = ("drop", "reward", "loot")
SUPPORTED_HISCORES_TABLE_IDS = set(range(8, 14)) | set(range(20, 89))
CLUE_NOTE = "Clue caskets roll multiple reward slots per opening using the wiki reward tables."
CLUE_REWARD_ROLLS: dict[str, tuple[int, int]] = {
    "Clue Scrolls (beginner)": (1, 3),
    "Clue Scrolls (easy)": (2, 4),
    "Clue Scrolls (medium)": (3, 5),
    "Clue Scrolls (hard)": (4, 6),
    "Clue Scrolls (elite)": (4, 6),
    "Clue Scrolls (master)": (5, 7),
}

MANUAL_SOURCE_OVERRIDES: dict[str, dict[str, Any]] = {
    "Clue Scrolls (beginner)": {
        "pages": ["Reward casket (beginner)"],
        "section_terms": ["Rewards"],
        "note": f"{CLUE_NOTE} Beginner caskets roll 1-3 reward slots.",
        "reward_rolls_min": 1,
        "reward_rolls_max": 3,
    },
    "Clue Scrolls (easy)": {
        "pages": ["Reward casket (easy)"],
        "section_terms": ["Rewards"],
        "note": f"{CLUE_NOTE} Easy caskets roll 2-4 reward slots.",
        "reward_rolls_min": 2,
        "reward_rolls_max": 4,
    },
    "Clue Scrolls (medium)": {
        "pages": ["Reward casket (medium)"],
        "section_terms": ["Rewards"],
        "note": f"{CLUE_NOTE} Medium caskets roll 3-5 reward slots.",
        "reward_rolls_min": 3,
        "reward_rolls_max": 5,
    },
    "Clue Scrolls (hard)": {
        "pages": ["Reward casket (hard)"],
        "section_terms": ["Rewards"],
        "note": f"{CLUE_NOTE} Hard caskets roll 4-6 reward slots.",
        "reward_rolls_min": 4,
        "reward_rolls_max": 6,
    },
    "Clue Scrolls (elite)": {
        "pages": ["Reward casket (elite)"],
        "section_terms": ["Rewards"],
        "note": f"{CLUE_NOTE} Elite caskets roll 4-6 reward slots.",
        "reward_rolls_min": 4,
        "reward_rolls_max": 6,
    },
    "Clue Scrolls (master)": {
        "pages": ["Reward casket (master)"],
        "section_terms": ["Rewards"],
        "note": f"{CLUE_NOTE} Master caskets roll 5-7 reward slots.",
        "reward_rolls_min": 5,
        "reward_rolls_max": 7,
    },
    "Barrows Chests": {"pages": ["Chest (Barrows)"], "section_terms": ["Rewards"]},
    "Chambers of Xeric": {"pages": ["Ancient chest"], "section_terms": ["Loot table"]},
    "Chambers of Xeric: Challenge Mode": {
        "pages": ["Ancient chest", "Chambers of Xeric/Challenge Mode"],
        "section_terms": ["Loot table"],
        "note": "Challenge Mode reward weighting differs from standard Chambers and is approximated from wiki tables.",
    },
    "Crazy Archaeologist": {"pages": ["Crazy archaeologist"]},
    "Deranged Archaeologist": {"pages": ["Deranged archaeologist"]},
    "Kree'Arra": {"pages": ["Kree'arra"]},
    "Lunar Chests": {"pages": ["Lunar Chest"], "section_terms": ["Rewards"]},
    "Mimic": {
        "pages": ["The Mimic"],
        "section_terms": ["Elite drops", "Master drops"],
        "note": "Choose the elite or master mimic variant in the simulator.",
    },
    "Nightmare": {"pages": ["The Nightmare"]},
    "Nex": {"pages": ["Nex"], "section_terms": ["Drops"]},
    "Sol Heredit": {
        "pages": ["Fortis Colosseum"],
        "section_terms": ["Rewards"],
        "note": "Sol Heredit rewards are sourced from the Fortis Colosseum reward table.",
    },
    "Tempoross": {"pages": ["Reward pool"], "section_terms": ["Rewards"]},
    "The Gauntlet": {"pages": ["Reward Chest (The Gauntlet)"], "section_terms": ["The Gauntlet Completed"]},
    "The Corrupted Gauntlet": {
        "pages": ["Reward Chest (The Gauntlet)"],
        "section_terms": ["Corrupted Gauntlet Completed"],
    },
    "Theatre of Blood": {"pages": ["Monumental chest"], "section_terms": ["Normal mode"]},
    "Theatre of Blood: Hard Mode": {"pages": ["Monumental chest"], "section_terms": ["Hard mode"]},
    "Thermonuclear Smoke Devil": {"pages": ["Thermonuclear smoke devil"]},
    "Tombs of Amascut": {
        "pages": ["Chest (Tombs of Amascut)"],
        "section_terms": ["Loot table"],
        "note": "The Tombs of Amascut reward model varies by raid level; the cached wiki tables are approximate.",
    },
    "Tombs of Amascut: Expert Mode": {
        "pages": ["Chest (Tombs of Amascut)"],
        "section_terms": ["Loot table"],
        "note": "Expert Mode reward weighting varies by raid level; the cached wiki tables are approximate.",
    },
    "Wintertodt": {"pages": ["Reward Cart"], "section_terms": ["Rewards"]},
}


class SyncClient:
    def __init__(self) -> None:
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": USER_AGENT})
        self.section_cache: dict[tuple[str, str], list[dict[str, Any]]] = {}
        self.section_html_cache: dict[tuple[str, str], str] = {}
        self.search_cache: dict[str, list[str]] = {}
        self.page_image_cache: dict[str, str | None] = {}

    def get(self, url: str, **kwargs: Any) -> requests.Response:
        last_error: Exception | None = None
        for attempt in range(4):
            try:
                response = self.session.get(url, timeout=45, **kwargs)
                response.raise_for_status()
                return response
            except requests.RequestException as exc:
                last_error = exc
                if attempt == 3:
                    raise
                time.sleep(1.2 * (attempt + 1))
        if last_error:
            raise last_error
        raise RuntimeError("Unexpected request failure with no error details.")

    def wiki_api(self, **params: Any) -> dict[str, Any]:
        response = self.get(WIKI_API_URL, params={**params, "format": "json"})
        return response.json()

    def get_sections(self, page: str) -> list[dict[str, Any]]:
        cache_key = (page, "sections")
        if cache_key in self.section_cache:
            return self.section_cache[cache_key]
        payload = self.wiki_api(action="parse", page=page, prop="sections")
        sections = payload.get("parse", {}).get("sections", [])
        self.section_cache[cache_key] = sections
        return sections

    def get_section_html(self, page: str, section_index: str) -> str:
        cache_key = (page, section_index)
        if cache_key in self.section_html_cache:
            return self.section_html_cache[cache_key]
        payload = self.wiki_api(action="parse", page=page, prop="text", section=section_index)
        html = payload.get("parse", {}).get("text", {}).get("*", "")
        self.section_html_cache[cache_key] = html
        return html

    def search_titles(self, query: str) -> list[str]:
        if query in self.search_cache:
            return self.search_cache[query]
        payload = self.wiki_api(action="query", list="search", srsearch=query, srlimit=5)
        titles = [hit["title"] for hit in payload.get("query", {}).get("search", [])]
        self.search_cache[query] = titles
        return titles

    def get_page_image(self, page: str) -> str | None:
        if page in self.page_image_cache:
            return self.page_image_cache[page]
        payload = self.wiki_api(
            action="query",
            titles=page,
            prop="pageimages",
            piprop="thumbnail|name|original",
            pithumbsize=300,
        )
        pages = payload.get("query", {}).get("pages", {})
        image_url = None
        for info in pages.values():
            image_url = info.get("thumbnail", {}).get("source") or info.get("original", {}).get("source")
            if image_url:
                break
        self.page_image_cache[page] = image_url
        return image_url


def normalize_wiki_asset_url(url: str | None) -> str | None:
    if not url:
        return None
    if url.startswith("//"):
        return f"https:{url}"
    if url.startswith("/"):
        return urljoin(WIKI_BASE_URL, url)
    return url


def relative_path(path: Path) -> str:
    return path.relative_to(APP_DIR).as_posix()


def fetch_activity_catalog(client: SyncClient) -> list[dict[str, Any]]:
    html = client.get(HISCORES_URL).text
    pattern = re.compile(
        r'href="overall\?category_type=1&table=(\d+)#headerHiscores" class="activity-link [^"]+">([^<]+)</a>'
    )
    activities = []
    for table_id, name in pattern.findall(html):
        if int(table_id) not in SUPPORTED_HISCORES_TABLE_IDS:
            continue
        activities.append(
            {
                "name": name,
                "slug": slugify(name),
                "table_id": int(table_id),
                "hiscores_url": f"{HISCORES_URL}&table={table_id}",
            }
        )
    return activities


def fetch_leaderboard(client: SyncClient, activity: dict[str, Any], limit: int = 25) -> dict[str, Any]:
    html = client.get(activity["hiscores_url"]).text
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table")
    entries: list[dict[str, Any]] = []
    if table:
        for row in table.find_all("tr")[1 : limit + 1]:
            cells = [clean_text(cell.get_text(" ", strip=True)) for cell in row.find_all("td")]
            if len(cells) < 3:
                continue
            entries.append(
                {
                    "rank": parse_int(cells[0]),
                    "name": cells[1],
                    "score": parse_int(cells[2]),
                }
            )
    payload = {
        "activity": activity["name"],
        "table_id": activity["table_id"],
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "entries": entries,
    }
    write_json(LEADERBOARDS_DIR / f"{activity['slug']}.json", payload)
    return payload


def section_matches(section_name: str, allowed_terms: list[str] | None) -> bool:
    normalized = clean_text(section_name).lower()
    if allowed_terms:
        return any(clean_text(term).lower() == normalized for term in allowed_terms)
    return any(keyword in normalized for keyword in SECTION_KEYWORDS)


def count_drop_rows(html: str) -> int:
    soup = BeautifulSoup(html, "html.parser")
    attr_rows = len(soup.select("span[data-drop-fraction], span[data-drop-percent]"))
    if attr_rows:
        return attr_rows

    rows = 0
    for table in soup.find_all("table"):
        header_cells = [clean_text(cell.get_text(" ", strip=True)).lower() for cell in table.find_all("th")]
        if any("rarity" in text or "chance" in text for text in header_cells):
            rows += max(len(table.find_all("tr")) - 1, 0)
    return rows


def build_candidate_pages(client: SyncClient, activity_name: str) -> list[str]:
    override = MANUAL_SOURCE_OVERRIDES.get(activity_name, {})
    candidates: list[str] = []
    for title in override.get("pages", []):
        if title not in candidates:
            candidates.append(title)
    for title in [activity_name, *client.search_titles(activity_name)]:
        if title not in candidates:
            candidates.append(title)
    return candidates


def resolve_activity_source(client: SyncClient, activity_name: str) -> dict[str, Any]:
    override = MANUAL_SOURCE_OVERRIDES.get(activity_name, {})
    allowed_terms = override.get("section_terms")
    best: dict[str, Any] | None = None
    first_relevant: dict[str, Any] | None = None

    for page in build_candidate_pages(client, activity_name):
        sections = client.get_sections(page)
        relevant = [section for section in sections if section_matches(section.get("line", ""), allowed_terms)]
        if not relevant:
            continue
        if first_relevant is None:
            first_relevant = {"page": page, "sections": relevant, "score": 0}

        scored_sections: list[dict[str, Any]] = []
        total_score = 0
        for section in relevant:
            html = client.get_section_html(page, section["index"])
            row_count = count_drop_rows(html)
            if row_count <= 0 and allowed_terms:
                continue
            scored_sections.append({**section, "row_count": row_count})
            total_score += row_count

        if not scored_sections:
            continue

        candidate = {"page": page, "sections": scored_sections, "score": total_score}
        if best is None or candidate["score"] > best["score"]:
            best = candidate

    if best is None:
        return {
            "page": first_relevant["page"] if first_relevant else None,
            "sections": [],
            "score": 0,
            "note": override.get("note") or "No parsable drop or reward section was found on the wiki.",
            "simulation_disabled": True,
        }

    best["note"] = override.get("note")
    best["simulation_disabled"] = bool(override.get("simulation_disabled"))
    for key in ("reward_rolls_min", "reward_rolls_max"):
        if key in override:
            best[key] = override[key]
    return best


def parse_probability(fraction: str | None, percent: str | None) -> float | None:
    if fraction:
        value = fraction.replace(",", "").strip().lower()
        if value in {"always", "100%"}:
            return 1.0
        match = re.search(r"(\d+(?:\.\d+)?)\s*/\s*(\d+(?:\.\d+)?)", value)
        if match:
            try:
                numerator = float(match.group(1))
                denominator = float(match.group(2))
                if denominator:
                    return numerator / denominator
            except ValueError:
                pass
        if value.endswith("%"):
            try:
                return float(value[:-1]) / 100.0
            except ValueError:
                pass
    if percent:
        try:
            return float(percent) / 100.0
        except ValueError:
            return None
    return None


def parse_price_value(value: str) -> int | None:
    value = value.replace(",", "").replace("coins", "").strip()
    if not value or value.lower() == "n/a":
        return None
    match = re.search(r"-?\d+", value)
    return int(match.group(0)) if match else None


def estimate_quantity_value(quantity_text: str) -> float:
    cleaned = quantity_text.replace(",", "").replace("(noted)", "").replace("noted", "").strip()
    range_match = re.search(r"(\d+)\s*[–-]\s*(\d+)", cleaned)
    if range_match:
        low = int(range_match.group(1))
        high = int(range_match.group(2))
        return (low + high) / 2

    numbers = [int(value) for value in re.findall(r"\d+", cleaned)]
    if not numbers:
        return 1.0
    if len(numbers) == 1:
        return float(numbers[0])
    return sum(numbers) / len(numbers)


def save_image(client: SyncClient, url: str | None, output_path: Path) -> str | None:
    if not url:
        return None
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if not output_path.exists():
        response = client.get(url, stream=True)
        with output_path.open("wb") as handle:
            for chunk in response.iter_content(chunk_size=65536):
                if chunk:
                    handle.write(chunk)
    return relative_path(output_path)


def asset_extension(url: str | None) -> str:
    if not url:
        return ".png"
    clean_url = url.split("?", 1)[0]
    suffix = Path(clean_url).suffix
    return suffix if suffix else ".png"


def parse_tables_from_section_html(
    client: SyncClient,
    html: str,
    activity_slug: str,
    item_asset_index: dict[str, dict[str, Any]],
    section_prefix: str | None = None,
) -> list[dict[str, Any]]:
    soup = BeautifulSoup(html, "html.parser")
    current_heading = section_prefix or "Drops"
    rows: list[dict[str, Any]] = []

    for node in soup.find_all(["h2", "h3", "h4", "table"]):
        if node.name in {"h2", "h3", "h4"}:
            heading = clean_text(node.get_text(" ", strip=True))
            if heading:
                current_heading = f"{section_prefix} / {heading}" if section_prefix else heading
            continue

        header_cells = [clean_text(cell.get_text(" ", strip=True)).lower() for cell in node.find_all("th")]
        has_rarity_header = any("rarity" in text or "chance" in text for text in header_cells)
        if not node.select("span[data-drop-fraction], span[data-drop-percent]") and not has_rarity_header and "100%" not in current_heading:
            continue

        for tr in node.find_all("tr"):
            tds = tr.find_all("td")
            if len(tds) < 3:
                continue

            rarity_span = tr.select_one("span[data-drop-fraction], span[data-drop-percent]")
            name_anchor = tr.select_one("td.item-col a[title]") or tr.find("a", title=True)
            if name_anchor is None:
                continue

            name = clean_text(name_anchor.get_text(" ", strip=True)) or clean_text(name_anchor.get("title", ""))
            if not name:
                continue

            quantity_text = ""
            if len(tds) >= 3:
                quantity_text = clean_text(tds[2].get_text(" ", strip=True))

            rarity_cell = rarity_span.find_parent("td") if rarity_span else None
            if rarity_cell is None:
                for candidate in tds[2:]:
                    candidate_text = clean_text(candidate.get_text(" ", strip=True))
                    lowered = candidate_text.lower()
                    if "/" in candidate_text or "%" in candidate_text or lowered in {"always", "common", "uncommon", "rare"}:
                        rarity_cell = candidate
                        break
            if rarity_cell is None and "100%" in current_heading:
                rarity_fraction = "Always"
                rarity_percent = "100"
            else:
                rarity_fraction = (
                    rarity_span.get("data-drop-fraction")
                    if rarity_span
                    else clean_text(rarity_cell.get_text(" ", strip=True)) if rarity_cell else None
                )
                rarity_percent = rarity_span.get("data-drop-percent") if rarity_span else None
            probability = parse_probability(rarity_fraction, rarity_percent)

            ge_value = parse_price_value(tds[4].get_text(" ", strip=True)) if len(tds) >= 5 else None
            ha_value = parse_price_value(tds[5].get_text(" ", strip=True)) if len(tds) >= 6 else None
            quantity_estimate = estimate_quantity_value(quantity_text or "1")
            ge_unit_estimate = int(round(ge_value / quantity_estimate)) if ge_value and quantity_estimate else None
            ha_unit_estimate = int(round(ha_value / quantity_estimate)) if ha_value and quantity_estimate else None

            image_tag = tr.find("img")
            image_url = normalize_wiki_asset_url(image_tag.get("src") if image_tag else None)
            item_slug = slugify(name)
            item_asset_path = None
            if item_slug not in item_asset_index and image_url:
                extension = asset_extension(image_url)
                output_path = ITEMS_DIR / f"{item_slug}{extension}"
                rel_path = save_image(client, image_url, output_path)
                item_asset_index[item_slug] = {"asset_path": rel_path, "source_url": image_url}
            item_asset_path = item_asset_index.get(item_slug, {}).get("asset_path")

            rows.append(
                {
                    "item_name": name,
                    "item_slug": item_slug,
                    "item_page": urljoin(WIKI_BASE_URL, name_anchor.get("href", f"/w/{quote(name)}")),
                    "item_asset_path": item_asset_path,
                    "section": current_heading,
                    "quantity_text": quantity_text or "1",
                    "quantity_estimate": quantity_estimate,
                    "rarity_fraction": rarity_fraction,
                    "rarity_percent": rarity_percent,
                    "probability": probability,
                    "ge_value": ge_value,
                    "ge_unit_estimate": ge_unit_estimate,
                    "ha_value": ha_value,
                    "ha_unit_estimate": ha_unit_estimate,
                }
            )

    deduped: list[dict[str, Any]] = []
    seen: set[tuple[str, str, str, str]] = set()
    for row in rows:
        key = (
            row["section"],
            row["item_name"],
            row["quantity_text"],
            row["rarity_fraction"] or "",
        )
        if key in seen:
            continue
        seen.add(key)
        deduped.append(row)
    return deduped


def build_simulation_groups(
    rows: list[dict[str, Any]],
    reward_rolls_min: int | None = None,
    reward_rolls_max: int | None = None,
) -> dict[str, Any]:
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in rows:
        grouped[row["section"]].append(row)

    guaranteed: list[str] = []
    independent_sections: list[dict[str, Any]] = []
    exclusive_sections: list[dict[str, Any]] = []
    merged_pool_rows: list[str] = []

    for section, section_rows in grouped.items():
        normalized = section.lower()
        row_ids = [f"{row['section']}::{row['item_slug']}::{row['rarity_fraction']}" for row in section_rows]
        probabilities = [row["probability"] for row in section_rows if row.get("probability") is not None]
        total_probability = sum(probabilities) if probabilities else None

        if "100%" in normalized or "always" in normalized:
            guaranteed.extend(row_ids)
            continue

        if any(keyword in normalized for keyword in ("tertiary", "pre-roll", "frozen tears", "wilderness slayer tertiary")):
            independent_sections.append({"label": section, "row_ids": row_ids})
            continue

        if total_probability is not None and 0.85 <= total_probability <= 1.15:
            exclusive_sections.append({"label": section, "row_ids": row_ids, "total_probability": total_probability})
            continue

        merged_pool_rows.extend(row_ids)

    if merged_pool_rows:
        exclusive_sections.append({"label": "Main pool", "row_ids": merged_pool_rows, "total_probability": None})

    simulation = {
        "guaranteed_row_ids": guaranteed,
        "independent_sections": independent_sections,
        "exclusive_sections": exclusive_sections,
        "note": "Simulation uses wiki-listed per-row rarities. Activities with custom multi-roll reward systems remain approximations.",
    }
    if reward_rolls_min is not None and reward_rolls_max is not None:
        simulation["reward_roll_range"] = {"min": reward_rolls_min, "max": reward_rolls_max}
        simulation["note"] = (
            f"Clue caskets roll {reward_rolls_min}-{reward_rolls_max} reward slots per opening. "
            + simulation["note"]
        )
    return simulation


def enrich_rows_with_ids(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    enriched = []
    for row in rows:
        new_row = dict(row)
        new_row["row_id"] = f"{row['section']}::{row['item_slug']}::{row['rarity_fraction']}"
        enriched.append(new_row)
    return enriched


def summarize_sections(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    sections_summary = []
    for section_name in sorted({row["section"] for row in rows}):
        section_rows = [row for row in rows if row["section"] == section_name]
        sections_summary.append(
            {
                "name": section_name,
                "row_count": len(section_rows),
                "total_probability": sum(row["probability"] for row in section_rows if row["probability"] is not None),
            }
        )
    return sections_summary


def build_rows_from_sections(
    client: SyncClient,
    source_page: str,
    source_sections: list[dict[str, Any]],
    item_asset_index: dict[str, dict[str, Any]],
    activity_slug: str,
    section_prefix: str | None = None,
) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for section in source_sections:
        section_html = client.get_section_html(source_page, section["index"])
        rows.extend(
            parse_tables_from_section_html(
                client,
                section_html,
                activity_slug,
                item_asset_index,
                section_prefix=section_prefix,
            )
        )
    return enrich_rows_with_ids(rows)


def build_mimic_variants(
    client: SyncClient,
    activity: dict[str, Any],
    source: dict[str, Any],
    item_asset_index: dict[str, dict[str, Any]],
) -> list[dict[str, Any]]:
    source_page = source.get("page") or "The Mimic"
    section_map = {section["line"]: section for section in source.get("sections", [])}
    variants: list[dict[str, Any]] = []
    for variant_id, section_name, label in (
        ("elite", "Elite drops", "Elite mimic"),
        ("master", "Master drops", "Master mimic"),
    ):
        section = section_map.get(section_name)
        if not section:
            continue
        rows = build_rows_from_sections(
            client,
            source_page,
            [section],
            item_asset_index,
            activity["slug"],
            section_prefix=label,
        )
        variants.append(
            {
                "id": variant_id,
                "label": label,
                "wiki_page": source_page,
                "wiki_url": f"{WIKI_BASE_URL}/w/{quote(source_page.replace(' ', '_'))}",
                "wiki_sections": [section_name],
                "supported": bool(rows),
                "simulation_disabled": False,
                "note": f"{label} reward table.",
                "drop_rows": rows,
                "sections": summarize_sections(rows),
                "simulation": build_simulation_groups(rows),
            }
        )
    return variants


def build_activity_payload(
    client: SyncClient,
    activity: dict[str, Any],
    source: dict[str, Any],
    leaderboard_payload: dict[str, Any],
    item_asset_index: dict[str, dict[str, Any]],
) -> dict[str, Any]:
    source_page = source.get("page")
    rows: list[dict[str, Any]] = []
    variants: list[dict[str, Any]] = []

    if activity["name"] == "Mimic":
        variants = build_mimic_variants(client, activity, source, item_asset_index)
    elif source_page:
        rows = build_rows_from_sections(client, source_page, source.get("sections", []), item_asset_index, activity["slug"])

    sections_summary = summarize_sections(rows)
    supported = bool(rows) or any(variant.get("supported") for variant in variants)
    simulation_disabled = bool(source.get("simulation_disabled"))
    if variants:
        simulation_disabled = all(variant.get("simulation_disabled") for variant in variants)

    image_url = client.get_page_image(source_page or activity["name"])
    activity_image_path = None
    if image_url:
        extension = asset_extension(image_url)
        activity_image_path = save_image(client, image_url, ACTIVITY_IMAGES_DIR / f"{activity['slug']}{extension}")

    payload = {
        "name": activity["name"],
        "slug": activity["slug"],
        "table_id": activity["table_id"],
        "hiscores_url": activity["hiscores_url"],
        "wiki_page": source_page,
        "wiki_url": f"{WIKI_BASE_URL}/w/{quote(source_page.replace(' ', '_'))}" if source_page else None,
        "wiki_sections": [section["line"] for section in source.get("sections", [])],
        "activity_image_path": activity_image_path,
        "supported": supported,
        "note": source.get("note"),
        "simulation_disabled": simulation_disabled,
        "leaderboard_path": relative_path(LEADERBOARDS_DIR / f"{activity['slug']}.json"),
        "leaderboard_preview": leaderboard_payload["entries"][:10],
        "drop_rows": rows,
        "variants": variants,
        "sections": sections_summary,
        "simulation": build_simulation_groups(
            rows,
            reward_rolls_min=source.get("reward_rolls_min"),
            reward_rolls_max=source.get("reward_rolls_max"),
        ),
        "fetched_at": datetime.now(timezone.utc).isoformat(),
    }
    return payload


def write_activity_payload(activity_payload: dict[str, Any]) -> None:
    write_json(ACTIVITIES_DIR / f"{activity_payload['slug']}.json", activity_payload)


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync OSRS boss data, drops, leaderboards, and images.")
    parser.add_argument("--limit", type=int, default=0, help="Only sync the first N hiscore activities.")
    parser.add_argument("--pause", type=float, default=0.0, help="Optional sleep between activity requests.")
    args = parser.parse_args()

    ensure_dirs()
    client = SyncClient()
    activities = fetch_activity_catalog(client)
    if args.limit > 0:
        activities = activities[: args.limit]

    item_asset_index = read_json(DATA_DIR / "item_assets.json", default={}) or {}
    summary: list[dict[str, Any]] = []

    for index, activity in enumerate(activities, start=1):
        print(f"[{index}/{len(activities)}] Syncing {activity['name']}...", flush=True)
        leaderboard_payload = fetch_leaderboard(client, activity)
        source = resolve_activity_source(client, activity["name"])
        activity_payload = build_activity_payload(client, activity, source, leaderboard_payload, item_asset_index)
        write_activity_payload(activity_payload)
        activity_row_count = len(activity_payload["drop_rows"]) + sum(
            len(variant.get("drop_rows", [])) for variant in activity_payload.get("variants", [])
        )
        summary.append(
            {
                "name": activity_payload["name"],
                "slug": activity_payload["slug"],
                "table_id": activity_payload["table_id"],
                "supported": activity_payload["supported"],
                "simulation_disabled": activity_payload["simulation_disabled"],
                "note": activity_payload["note"],
                "row_count": activity_row_count,
                "wiki_page": activity_payload["wiki_page"],
                "activity_image_path": activity_payload["activity_image_path"],
                "activity_path": relative_path(ACTIVITIES_DIR / f"{activity_payload['slug']}.json"),
                "leaderboard_path": activity_payload["leaderboard_path"],
            }
        )
        if args.pause:
            time.sleep(args.pause)

    write_json(DATA_DIR / "item_assets.json", item_asset_index)
    write_json(
        DATA_DIR / "index.json",
        {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "activity_count": len(summary),
            "supported_count": sum(1 for activity in summary if activity["supported"]),
            "simulation_enabled_count": sum(
                1 for activity in summary if activity["supported"] and not activity["simulation_disabled"]
            ),
            "activities": summary,
        },
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
