from __future__ import annotations

import random
import re
from collections import defaultdict
from typing import Any


def sample_quantity(quantity_text: str, rng: random.Random) -> int:
    cleaned = quantity_text.replace(",", "").replace("(noted)", "").replace("noted", "").strip()
    range_match = re.search(r"(\d+)\s*[–-]\s*(\d+)", cleaned)
    if range_match:
        low = int(range_match.group(1))
        high = int(range_match.group(2))
        return rng.randint(low, high)

    numbers = [int(value) for value in re.findall(r"\d+", cleaned)]
    if not numbers:
        return 1
    if len(numbers) == 1:
        return numbers[0]
    if any(separator in cleaned for separator in (";", " or ", "/")):
        return rng.choice(numbers)
    return numbers[0]


def pick_exclusive_item(rows: list[dict[str, Any]], rng: random.Random) -> dict[str, Any] | None:
    usable_rows = [row for row in rows if row.get("probability") and row["probability"] > 0]
    if not usable_rows:
        return None

    total_probability = sum(row["probability"] for row in usable_rows)
    if total_probability < 1.0:
        if rng.random() > total_probability:
            return None
        threshold = rng.random() * total_probability
    else:
        threshold = rng.random() * total_probability

    cursor = 0.0
    for row in usable_rows:
        cursor += row["probability"]
        if threshold <= cursor:
            return row
    return usable_rows[-1]


def sample_section_rolls(section: dict[str, Any], simulation: dict[str, Any], rng: random.Random) -> int:
    explicit_rolls = section.get("rolls")
    if isinstance(explicit_rolls, int) and explicit_rolls > 0:
        return explicit_rolls

    reward_roll_range = simulation.get("reward_roll_range")
    if section.get("label") == "Main pool" and isinstance(reward_roll_range, dict):
        minimum = int(reward_roll_range.get("min", 1))
        maximum = int(reward_roll_range.get("max", minimum))
        return rng.randint(minimum, maximum)

    return 1


def is_notable_drop(row: dict[str, Any], quantity: int) -> bool:
    total_ge = (row.get("ge_unit_estimate") or 0) * quantity
    section = row.get("section", "").lower()
    probability = row.get("probability")
    return (
        total_ge >= 100_000
        or (probability is not None and probability <= 0.02)
        or "tertiary" in section
        or "unique" in section
        or "pet" in row.get("item_name", "").lower()
    )


def simulate_activity(
    activity_data: dict[str, Any],
    kills: int,
    seed: int | None = None,
    target_item_slug: str | None = None,
    target_count: int = 1,
    max_chase_kills: int = 250_000,
) -> dict[str, Any]:
    if activity_data.get("simulation_disabled"):
        raise ValueError(activity_data.get("note") or "Simulation is disabled for this activity.")
    if not activity_data.get("supported"):
        raise ValueError("This activity does not have cached drop data yet.")

    rng = random.Random(seed)
    row_map = {row["row_id"]: row for row in activity_data.get("drop_rows", [])}
    simulation = activity_data.get("simulation", {})
    guaranteed_rows = [row_map[row_id] for row_id in simulation.get("guaranteed_row_ids", []) if row_id in row_map]
    independent_sections = [
        [row_map[row_id] for row_id in section["row_ids"] if row_id in row_map]
        for section in simulation.get("independent_sections", [])
    ]
    exclusive_sections = [
        [row_map[row_id] for row_id in section["row_ids"] if row_id in row_map]
        for section in simulation.get("exclusive_sections", [])
    ]

    collected: dict[str, dict[str, Any]] = {}
    notable_log: list[dict[str, Any]] = []
    total_ge_value = 0
    kills_completed = 0
    fixed_mode = target_item_slug is None
    limit = kills if fixed_mode else max_chase_kills

    while kills_completed < limit:
        kills_completed += 1

        for row in guaranteed_rows:
            quantity = sample_quantity(row.get("quantity_text", "1"), rng)
            stack_ge_value = (row.get("ge_unit_estimate") or 0) * quantity
            total_ge_value += stack_ge_value
            entry = collected.setdefault(
                row["item_slug"],
                {
                    "item_name": row["item_name"],
                    "item_slug": row["item_slug"],
                    "item_asset_path": row.get("item_asset_path"),
                    "quantity": 0,
                    "ge_value_each": row.get("ge_unit_estimate"),
                    "total_ge_value": 0,
                    "section": row.get("section"),
                },
            )
            entry["quantity"] += quantity
            entry["total_ge_value"] += stack_ge_value
            if len(notable_log) < 40 and is_notable_drop(row, quantity):
                notable_log.append(
                    {
                        "kill": kills_completed,
                        "item_name": row["item_name"],
                        "quantity": quantity,
                        "section": row.get("section"),
                        "rarity_fraction": row.get("rarity_fraction"),
                    }
                )

        for section_rows in independent_sections:
            for row in section_rows:
                probability = row.get("probability")
                if probability is None or probability <= 0:
                    continue
                if rng.random() <= probability:
                    quantity = sample_quantity(row.get("quantity_text", "1"), rng)
                    stack_ge_value = (row.get("ge_unit_estimate") or 0) * quantity
                    total_ge_value += stack_ge_value
                    entry = collected.setdefault(
                        row["item_slug"],
                        {
                            "item_name": row["item_name"],
                            "item_slug": row["item_slug"],
                            "item_asset_path": row.get("item_asset_path"),
                            "quantity": 0,
                            "ge_value_each": row.get("ge_unit_estimate"),
                            "total_ge_value": 0,
                            "section": row.get("section"),
                        },
                    )
                    entry["quantity"] += quantity
                    entry["total_ge_value"] += stack_ge_value
                    if len(notable_log) < 40 and is_notable_drop(row, quantity):
                        notable_log.append(
                            {
                                "kill": kills_completed,
                                "item_name": row["item_name"],
                                "quantity": quantity,
                                "section": row.get("section"),
                                "rarity_fraction": row.get("rarity_fraction"),
                            }
                        )

        for section_meta, section_rows in zip(simulation.get("exclusive_sections", []), exclusive_sections):
            rolls = sample_section_rolls(section_meta, simulation, rng)
            if rolls <= 0:
                continue
            for _ in range(rolls):
                picked = pick_exclusive_item(section_rows, rng)
                if picked is None:
                    continue
                quantity = sample_quantity(picked.get("quantity_text", "1"), rng)
                stack_ge_value = (picked.get("ge_unit_estimate") or 0) * quantity
                total_ge_value += stack_ge_value
                entry = collected.setdefault(
                    picked["item_slug"],
                    {
                        "item_name": picked["item_name"],
                        "item_slug": picked["item_slug"],
                        "item_asset_path": picked.get("item_asset_path"),
                        "quantity": 0,
                        "ge_value_each": picked.get("ge_unit_estimate"),
                        "total_ge_value": 0,
                        "section": picked.get("section"),
                    },
                )
                entry["quantity"] += quantity
                entry["total_ge_value"] += stack_ge_value
                if len(notable_log) < 40 and is_notable_drop(picked, quantity):
                    notable_log.append(
                        {
                            "kill": kills_completed,
                            "item_name": picked["item_name"],
                            "quantity": quantity,
                            "section": picked.get("section"),
                            "rarity_fraction": picked.get("rarity_fraction"),
                        }
                    )

        if not fixed_mode:
            found = collected.get(target_item_slug or "", {}).get("quantity", 0)
            if found >= target_count:
                break

    totals = sorted(
        collected.values(),
        key=lambda item: (item["total_ge_value"], item["quantity"], item["item_name"]),
        reverse=True,
    )

    target_reached = None
    if not fixed_mode:
        target_reached = collected.get(target_item_slug or "", {}).get("quantity", 0) >= target_count

    return {
        "mode": "fixed" if fixed_mode else "target",
        "kills_requested": kills,
        "kills_completed": kills_completed,
        "target_item_slug": target_item_slug,
        "target_count": target_count if not fixed_mode else None,
        "target_reached": target_reached,
        "seed": seed,
        "total_ge_value": total_ge_value,
        "distinct_items": len(totals),
        "totals": totals[:150],
        "top_items": totals[:12],
        "notable_drops": notable_log,
        "note": simulation.get("note"),
    }
