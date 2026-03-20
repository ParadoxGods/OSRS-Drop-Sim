function createRng(seed) {
  let state = 0;
  if (typeof seed === "number" && Number.isFinite(seed)) {
    state = seed >>> 0;
  } else if (typeof seed === "string" && seed.trim()) {
    for (let i = 0; i < seed.length; i += 1) {
      state = Math.imul(31, state) + seed.charCodeAt(i);
      state >>>= 0;
    }
  } else {
    state = (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
  }

  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sampleQuantity(quantityText, rng) {
  const cleaned = String(quantityText || "1").replace(/,/g, "").replace(/\(noted\)/g, "").replace(/noted/g, "").trim();
  const rangeMatch = cleaned.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (rangeMatch) {
    const low = Number.parseInt(rangeMatch[1], 10);
    const high = Number.parseInt(rangeMatch[2], 10);
    return Math.floor(rng() * (high - low + 1)) + low;
  }

  const numbers = Array.from(cleaned.matchAll(/\d+/g), (match) => Number.parseInt(match[0], 10));
  if (!numbers.length) {
    return 1;
  }
  if (numbers.length === 1) {
    return numbers[0];
  }
  if (cleaned.includes(";") || cleaned.includes(" or ") || cleaned.includes("/")) {
    return numbers[Math.floor(rng() * numbers.length)];
  }
  return numbers[0];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function pickExclusiveItem(rows, rng, options = {}) {
  const { normalizeNearUnity = false } = options;
  const usableRows = rows.filter((row) => row.probability && row.probability > 0);
  if (!usableRows.length) {
    return null;
  }

  const totalProbability = usableRows.reduce((sum, row) => sum + row.probability, 0);
  let threshold;
  if (totalProbability < 1) {
    if (!normalizeNearUnity && rng() > totalProbability) {
      return null;
    }
    threshold = rng() * totalProbability;
  } else {
    threshold = rng() * totalProbability;
  }

  let cursor = 0;
  for (const row of usableRows) {
    cursor += row.probability;
    if (threshold <= cursor) {
      return row;
    }
  }
  return usableRows[usableRows.length - 1];
}

function sampleSectionRolls(section, simulation, rng) {
  if (Number.isInteger(section?.rolls) && section.rolls > 0) {
    return section.rolls;
  }

  const rewardRollRange = simulation?.reward_roll_range;
  if (section?.label === "Main pool" && rewardRollRange) {
    const min = Number.parseInt(rewardRollRange.min ?? 1, 10);
    const max = Number.parseInt(rewardRollRange.max ?? min, 10);
    return Math.floor(rng() * (max - min + 1)) + min;
  }

  return 1;
}

function isNotableDrop(row, quantity) {
  const totalGe = (row.ge_unit_estimate || 0) * quantity;
  const section = String(row.section || "").toLowerCase();
  const probability = row.probability;
  return (
    totalGe >= 100000 ||
    (probability !== null && probability !== undefined && probability <= 0.02) ||
    section.includes("tertiary") ||
    section.includes("unique") ||
    String(row.item_name || "").toLowerCase().includes("pet")
  );
}

function addToCollection(collection, row, quantity, sectionOverride) {
  const stackGeValue = (row.ge_unit_estimate || 0) * quantity;
  const entry = collection.get(row.item_slug) || {
    item_name: row.item_name,
    item_slug: row.item_slug,
    item_asset_path: row.item_asset_path,
    quantity: 0,
    ge_value_each: row.ge_unit_estimate,
    total_ge_value: 0,
    section: sectionOverride || row.section,
  };
  entry.quantity += quantity;
  entry.total_ge_value += stackGeValue;
  collection.set(row.item_slug, entry);
  return stackGeValue;
}

function addRowLoot(collection, notableDrops, row, quantity, killCount, extra = {}) {
  const totalGe = addToCollection(collection, row, quantity, extra.sectionOverride);
  if (notableDrops.length < 40 && isNotableDrop(row, quantity)) {
    notableDrops.push({
      kill: killCount,
      item_name: row.item_name,
      quantity,
      section: extra.sectionOverride || row.section,
      rarity_fraction: row.rarity_fraction,
      ...extra.notable,
    });
  }
  return totalGe;
}

function getSimulationMode(options) {
  const targetGpValue = Math.max(0, Number(options.target_gp_value) || 0);
  if (targetGpValue > 0) {
    return "gp";
  }
  if (options.target_item_slug !== null && options.target_item_slug !== undefined && options.target_item_slug !== "") {
    return "target";
  }
  return "fixed";
}

function getSimulationLimit(options) {
  if (getSimulationMode(options) === "fixed") {
    return Math.max(0, Number(options.kills) || 0);
  }
  return Math.max(1, Number(options.max_chase_kills) || 25000000);
}

function hasReachedSimulationGoal(collected, totalGeValue, options) {
  const mode = getSimulationMode(options);
  if (mode === "target") {
    return (collected.get(options.target_item_slug)?.quantity || 0) >= (options.target_count || 1);
  }
  if (mode === "gp") {
    return totalGeValue >= Math.max(1, Number(options.target_gp_value) || 0);
  }
  return false;
}

function finalizeSimulationResult(activityData, simulation, collected, notableDrops, totalGeValue, killsCompleted, options, extra = {}) {
  const totals = Array.from(collected.values()).sort((a, b) => {
    if (b.total_ge_value !== a.total_ge_value) {
      return b.total_ge_value - a.total_ge_value;
    }
    if (b.quantity !== a.quantity) {
      return b.quantity - a.quantity;
    }
    return a.item_name.localeCompare(b.item_name);
  });

  const mode = getSimulationMode(options);

  return {
    mode,
    kills_requested: options.kills,
    kills_completed: killsCompleted,
    target_item_slug: options.target_item_slug || null,
    target_count: mode === "target" ? options.target_count || 1 : null,
    target_reached: mode === "target" ? (collected.get(options.target_item_slug)?.quantity || 0) >= (options.target_count || 1) : null,
    target_gp_value: mode === "gp" ? Math.max(1, Number(options.target_gp_value) || 0) : null,
    target_gp_reached: mode === "gp" ? totalGeValue >= Math.max(1, Number(options.target_gp_value) || 0) : null,
    seed: options.seed,
    total_ge_value: totalGeValue,
    distinct_items: totals.length,
    totals: totals.slice(0, 150),
    top_items: totals.slice(0, 12),
    notable_drops: notableDrops,
    note: simulation.note,
    ...extra,
  };
}

const TOB_COMMON_TABLE = [
  { item_name: "Vial of blood", item_slug: "vial-of-blood", item_asset_path: null, quantity_text: "50–60 (noted)", base_quantity: 50, probability: 2 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Death rune", item_slug: "death-rune", item_asset_path: "assets/items/death-rune.png", quantity_text: "500–600", base_quantity: 500, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 8 },
  { item_name: "Blood rune", item_slug: "blood-rune", item_asset_path: "assets/items/blood-rune.png", quantity_text: "500–600", base_quantity: 500, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Swamp tar", item_slug: "swamp-tar", item_asset_path: "assets/items/swamp-tar.png", quantity_text: "500–600", base_quantity: 500, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 2 },
  { item_name: "Coal", item_slug: "coal", item_asset_path: "assets/items/coal.png", quantity_text: "500–600 (noted)", base_quantity: 500, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Gold ore", item_slug: "gold-ore", item_asset_path: "assets/items/gold-ore.png", quantity_text: "300–360 (noted)", base_quantity: 300, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 6 },
  { item_name: "Molten glass", item_slug: "molten-glass", item_asset_path: "assets/items/molten-glass.png", quantity_text: "200–240 (noted)", base_quantity: 200, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Adamantite ore", item_slug: "adamantite-ore", item_asset_path: "assets/items/adamantite-ore.png", quantity_text: "130–156 (noted)", base_quantity: 130, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Runite ore", item_slug: "runite-ore", item_asset_path: "assets/items/runite-ore.png", quantity_text: "60–72 (noted)", base_quantity: 60, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Wine of zamorak", item_slug: "wine-of-zamorak", item_asset_path: "assets/items/wine-of-zamorak.png", quantity_text: "50–60", base_quantity: 50, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Potato cactus", item_slug: "potato-cactus", item_asset_path: "assets/items/potato-cactus.png", quantity_text: "50–60", base_quantity: 50, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy cadantine", item_slug: "grimy-cadantine", item_asset_path: "assets/items/grimy-cadantine.png", quantity_text: "50–60", base_quantity: 50, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy avantoe", item_slug: "grimy-avantoe", item_asset_path: "assets/items/grimy-avantoe.png", quantity_text: "40–48", base_quantity: 40, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy toadflax", item_slug: "grimy-toadflax", item_asset_path: "assets/items/grimy-toadflax.png", quantity_text: "37–44", base_quantity: 37, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy kwuarm", item_slug: "grimy-kwuarm", item_asset_path: "assets/items/grimy-kwuarm.png", quantity_text: "36–43", base_quantity: 36, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy irit leaf", item_slug: "grimy-irit-leaf", item_asset_path: "assets/items/grimy-irit-leaf.png", quantity_text: "34–40", base_quantity: 34, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy ranarr weed", item_slug: "grimy-ranarr-weed", item_asset_path: "assets/items/grimy-ranarr-weed.png", quantity_text: "30–36", base_quantity: 30, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy snapdragon", item_slug: "grimy-snapdragon", item_asset_path: "assets/items/grimy-snapdragon.png", quantity_text: "27–32", base_quantity: 27, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy lantadyme", item_slug: "grimy-lantadyme", item_asset_path: "assets/items/grimy-lantadyme.png", quantity_text: "26–31", base_quantity: 26, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy dwarf weed", item_slug: "grimy-dwarf-weed", item_asset_path: "assets/items/grimy-dwarf-weed.png", quantity_text: "24–28", base_quantity: 24, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy torstol", item_slug: "grimy-torstol", item_asset_path: "assets/items/grimy-torstol.png", quantity_text: "20–24", base_quantity: 20, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Battlestaff", item_slug: "battlestaff", item_asset_path: "assets/items/battlestaff.png", quantity_text: "15–18", base_quantity: 15, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Mahogany seed", item_slug: "mahogany-seed", item_asset_path: "assets/items/mahogany-seed.png", quantity_text: "10–12", base_quantity: 10, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Rune battleaxe", item_slug: "rune-battleaxe", item_asset_path: "assets/items/rune-battleaxe.png", quantity_text: "4", base_quantity: 4, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Rune platebody", item_slug: "rune-platebody", item_asset_path: "assets/items/rune-platebody.png", quantity_text: "4", base_quantity: 4, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Rune chainbody", item_slug: "rune-chainbody", item_asset_path: "assets/items/rune-chainbody.png", quantity_text: "4", base_quantity: 4, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Palm tree seed", item_slug: "palm-tree-seed", item_asset_path: "assets/items/palm-tree-seed.png", quantity_text: "3", base_quantity: 3, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Yew seed", item_slug: "yew-seed", item_asset_path: "assets/items/yew-seed.png", quantity_text: "3", base_quantity: 3, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Magic seed", item_slug: "magic-seed", item_asset_path: "assets/items/magic-seed.png", quantity_text: "3", base_quantity: 3, probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
];

const TOA_COMMON_DIVISORS = {
  "cache-of-runes": 0,
  coins: 1,
  "death-rune": 20,
  "soul-rune": 40,
  "gold-ore": 90,
  "dragon-dart-tip": 100,
  "mahogany-logs": 180,
  sapphire: 200,
  emerald: 250,
  "gold-bar": 250,
  "potato-cactus": 250,
  "raw-shark": 250,
  ruby: 300,
  diamond: 400,
  "raw-manta-ray": 450,
  "cactus-spine": 600,
  dragonstone: 600,
  battlestaff: 1100,
  "coconut-milk": 1100,
  "lily-of-the-sands": 1100,
  "toadflax-seed": 2000,
  "ranarr-seed": 2500,
  "torstol-seed": 3200,
  "snapdragon-seed": 3200,
  "dragon-med-helm": 4000,
  "magic-seed": 6500,
  "blood-essence": 7500,
};

const TOA_UNIQUE_WEIGHT_TABLES = [
  { min: 0, max: 349, weights: { "osmumten-s-fang": 1 / 3.43, lightbearer: 1 / 3.43, "elidinis-ward": 1 / 8, "masori-mask": 1 / 12, "masori-body": 1 / 12, "masori-chaps": 1 / 12, "tumeken-s-shadow-uncharged": 1 / 24 } },
  { min: 350, max: 399, weights: { "osmumten-s-fang": 1 / 3.67, lightbearer: 1 / 3.67, "elidinis-ward": 1 / 7.34, "masori-mask": 1 / 11, "masori-body": 1 / 11, "masori-chaps": 1 / 11, "tumeken-s-shadow-uncharged": 1 / 22 } },
  { min: 400, max: 449, weights: { "osmumten-s-fang": 1 / 4.1, lightbearer: 1 / 4.1, "elidinis-ward": 1 / 6.48, "masori-mask": 1 / 9.72, "masori-body": 1 / 9.72, "masori-chaps": 1 / 9.72, "tumeken-s-shadow-uncharged": 1 / 20.47 } },
  { min: 450, max: 499, weights: { "osmumten-s-fang": 1 / 4.5, lightbearer: 1 / 4.5, "elidinis-ward": 1 / 6, "masori-mask": 1 / 9, "masori-body": 1 / 9, "masori-chaps": 1 / 9, "tumeken-s-shadow-uncharged": 1 / 18 } },
  { min: 500, max: 600, weights: { "osmumten-s-fang": 1 / 5.24, lightbearer: 1 / 5.24, "elidinis-ward": 1 / 5.4, "masori-mask": 1 / 8.11, "masori-body": 1 / 8.11, "masori-chaps": 1 / 8.11, "tumeken-s-shadow-uncharged": 1 / 15.72 } },
];

const CLUE_MIMIC_CHANCES = {
  "clue-scrolls-elite": 1 / 35,
  "clue-scrolls-master": 1 / 15,
};

const MIMIC_THIRD_AGE_ITEMS = [
  { item_slug: "3rd-age-full-helmet", item_name: "3rd age full helmet" },
  { item_slug: "3rd-age-platebody", item_name: "3rd age platebody" },
  { item_slug: "3rd-age-platelegs", item_name: "3rd age platelegs" },
  { item_slug: "3rd-age-plateskirt", item_name: "3rd age plateskirt" },
  { item_slug: "3rd-age-kiteshield", item_name: "3rd age kiteshield" },
  { item_slug: "3rd-age-range-coif", item_name: "3rd age range coif" },
  { item_slug: "3rd-age-range-top", item_name: "3rd age range top" },
  { item_slug: "3rd-age-range-legs", item_name: "3rd age range legs" },
  { item_slug: "3rd-age-vambraces", item_name: "3rd age vambraces" },
  { item_slug: "3rd-age-mage-hat", item_name: "3rd age mage hat" },
  { item_slug: "3rd-age-robe-top", item_name: "3rd age robe top" },
  { item_slug: "3rd-age-robe", item_name: "3rd age robe" },
  { item_slug: "3rd-age-amulet", item_name: "3rd age amulet" },
  { item_slug: "3rd-age-longsword", item_name: "3rd age longsword" },
  { item_slug: "3rd-age-bow", item_name: "3rd age bow" },
  { item_slug: "3rd-age-wand", item_name: "3rd age wand" },
  { item_slug: "3rd-age-cloak", item_name: "3rd age cloak" },
  { item_slug: "3rd-age-druidic-robe-top", item_name: "3rd age druidic robe top" },
  { item_slug: "3rd-age-druidic-robe-bottoms", item_name: "3rd age druidic robe bottoms" },
  { item_slug: "3rd-age-druidic-cloak", item_name: "3rd age druidic cloak" },
  { item_slug: "3rd-age-druidic-staff", item_name: "3rd age druidic staff" },
  { item_slug: "3rd-age-pickaxe", item_name: "3rd age pickaxe" },
  { item_slug: "3rd-age-axe", item_name: "3rd age axe" },
];

const MIMIC_COMMON_ITEMS = [
  { item_slug: "death-rune", item_name: "Death rune" },
  { item_slug: "blood-rune", item_name: "Blood rune" },
  { item_slug: "grimy-ranarr-weed", item_name: "Grimy ranarr weed" },
  { item_slug: "wine-of-zamorak", item_name: "Wine of zamorak" },
  { item_slug: "raw-manta-ray", item_name: "Raw manta ray" },
];

const MIMIC_CONFIG = {
  elite: {
    max_attempts: 5,
    any_third_age_first: 1 / 250,
    any_third_age_repeat: 1 / 264,
    ring_multiplier: 6,
    plank_slug: "mahogany-plank",
    plank_name: "Mahogany plank",
    common_quantities: {
      "death-rune": [600, 480, 360, 240, 120],
      "blood-rune": [500, 400, 300, 200, 100],
      "grimy-ranarr-weed": [25, 20, 15, 10, 5],
      "wine-of-zamorak": [25, 20, 15, 10, 5],
      "raw-manta-ray": [15, 12, 9, 6, 3],
    },
  },
  master: {
    max_attempts: 6,
    any_third_age_first: 1 / 228,
    any_third_age_repeat: 1 / 240,
    ring_multiplier: 6,
    plank_slug: "mahogany-plank",
    plank_name: "Mahogany plank",
    common_quantities: {
      "death-rune": [600, 500, 400, 300, 200, 100],
      "blood-rune": [500, 416, 333, 250, 166, 83],
      "grimy-ranarr-weed": [25, 20, 16, 12, 8, 4],
      "wine-of-zamorak": [25, 20, 16, 12, 8, 4],
      "raw-manta-ray": [15, 12, 10, 7, 5, 2],
    },
  },
};

const TOA_LOW_LEVEL_50_ITEMS = new Set(["osmumten-s-fang", "lightbearer"]);
const TOA_LOW_LEVEL_150_ITEMS = new Set([
  "elidinis-ward",
  "masori-mask",
  "masori-body",
  "masori-chaps",
  "tumeken-s-shadow-uncharged",
]);

function getRowsFromSection(activityData, label) {
  const rowMap = new Map((activityData.drop_rows || []).map((row) => [row.row_id, row]));
  const section = (activityData.simulation?.exclusive_sections || []).find((entry) => entry.label === label);
  if (!section) {
    return [];
  }
  return (section.row_ids || []).map((rowId) => rowMap.get(rowId)).filter(Boolean);
}

function getIndependentRows(activityData, label) {
  const rowMap = new Map((activityData.drop_rows || []).map((row) => [row.row_id, row]));
  const section = (activityData.simulation?.independent_sections || []).find((entry) => entry.label === label);
  if (!section) {
    return [];
  }
  return (section.row_ids || []).map((rowId) => rowMap.get(rowId)).filter(Boolean);
}

function getRowBySlug(activityData, slug) {
  return (activityData.drop_rows || []).find((row) => row.item_slug === slug) || null;
}

function getRowByPredicate(activityData, predicate) {
  return (activityData.drop_rows || []).find((row) => predicate(row)) || null;
}

function createSyntheticRow(item_slug, item_name, section) {
  return {
    item_slug,
    item_name,
    item_asset_path: item_slug ? `assets/items/${item_slug}.png` : null,
    quantity_text: "1",
    ge_unit_estimate: 0,
    section,
  };
}

function pickWeightedValue(entries, rng) {
  const usable = entries.filter((entry) => entry.weight > 0);
  if (!usable.length) {
    return null;
  }
  const totalWeight = usable.reduce((sum, entry) => sum + entry.weight, 0);
  let threshold = rng() * totalWeight;
  for (const entry of usable) {
    threshold -= entry.weight;
    if (threshold <= 0) {
      return entry.value;
    }
  }
  return usable[usable.length - 1].value;
}

function pickDistinctExclusiveRows(rows, count, rng) {
  const picks = [];
  const remaining = rows.filter((row) => row.probability && row.probability > 0);
  while (picks.length < count && remaining.length) {
    const picked = pickExclusiveItem(remaining, rng);
    if (!picked) {
      break;
    }
    picks.push(picked);
    const pickedIndex = remaining.findIndex((row) => row.row_id === picked.row_id);
    if (pickedIndex >= 0) {
      remaining.splice(pickedIndex, 1);
    }
  }
  return picks;
}

function rollExclusiveSection(collection, notableDrops, rows, rolls, killCount, sectionOverride, rng) {
  let totalGeValue = 0;
  for (let roll = 0; roll < rolls; roll += 1) {
    const picked = pickExclusiveItem(rows, rng);
    if (!picked) {
      continue;
    }
    const quantity = sampleQuantity(picked.quantity_text || "1", rng);
    totalGeValue += addRowLoot(collection, notableDrops, picked, quantity, killCount, { sectionOverride });
  }
  return totalGeValue;
}

function rollIndependentSection(collection, notableDrops, rows, killCount, rng) {
  let totalGeValue = 0;
  for (const row of rows) {
    const probability = row.probability;
    if (probability === null || probability === undefined || probability <= 0) {
      continue;
    }
    if (rng() <= probability) {
      const quantity = sampleQuantity(row.quantity_text || "1", rng);
      totalGeValue += addRowLoot(collection, notableDrops, row, quantity, killCount);
    }
  }
  return totalGeValue;
}

function isRaidSlug(slug) {
  return ["chambers-of-xeric", "chambers-of-xeric-challenge-mode", "tombs-of-amascut", "tombs-of-amascut-expert-mode", "theatre-of-blood", "theatre-of-blood-hard-mode"].includes(slug);
}

function getClueMimicTier(activityData) {
  if (activityData.slug === "clue-scrolls-elite") {
    return "elite";
  }
  if (activityData.slug === "clue-scrolls-master") {
    return "master";
  }
  if (activityData.slug === "mimic") {
    return activityData.variant_id || "elite";
  }
  return null;
}

function getMimicAttemptCount(tier, attempts) {
  const config = MIMIC_CONFIG[tier];
  if (!config) {
    return 1;
  }
  return clamp(Math.round(Number(attempts) || 1), 1, config.max_attempts);
}

function getMimicRareChance(tier, attemptCount) {
  const config = MIMIC_CONFIG[tier];
  if (!config) {
    return 0;
  }
  return attemptCount > 1 ? config.any_third_age_repeat : config.any_third_age_first;
}

function getMimicRow(activityData, slug, fallbackName, section) {
  return getRowBySlug(activityData, slug) || createSyntheticRow(slug, fallbackName, section);
}

function getMimicCommonQuantity(tier, slug, attemptCount) {
  const config = MIMIC_CONFIG[tier];
  const values = config?.common_quantities?.[slug];
  if (!values?.length) {
    return 1;
  }
  return values[Math.min(values.length - 1, Math.max(0, attemptCount - 1))];
}

function rollMimicRewardBundle(activityData, collection, notableDrops, tier, attemptCount, killCount, sectionOverride, rng) {
  const config = MIMIC_CONFIG[tier];
  if (!config) {
    return 0;
  }

  let totalGeValue = 0;
  const plankRow = getMimicRow(activityData, config.plank_slug, config.plank_name, sectionOverride);
  totalGeValue += addRowLoot(collection, notableDrops, plankRow, 1, killCount, { sectionOverride });

  const rareChance = getMimicRareChance(tier, attemptCount);
  const roll = rng();
  let rewardRow = null;
  let quantity = 1;

  if (roll < rareChance * config.ring_multiplier) {
    rewardRow = getMimicRow(activityData, "ring-of-3rd-age", "Ring of 3rd age", sectionOverride);
  } else if (roll < rareChance * (config.ring_multiplier + 1)) {
    const pickedThirdAge = MIMIC_THIRD_AGE_ITEMS[Math.floor(rng() * MIMIC_THIRD_AGE_ITEMS.length)];
    rewardRow = getMimicRow(activityData, pickedThirdAge.item_slug, pickedThirdAge.item_name, sectionOverride);
  } else {
    const pickedCommon = MIMIC_COMMON_ITEMS[Math.floor(rng() * MIMIC_COMMON_ITEMS.length)];
    rewardRow = getMimicRow(activityData, pickedCommon.item_slug, pickedCommon.item_name, sectionOverride);
    quantity = getMimicCommonQuantity(tier, pickedCommon.item_slug, attemptCount);
  }

  if (rewardRow) {
    totalGeValue += addRowLoot(collection, notableDrops, rewardRow, quantity, killCount, { sectionOverride });
  }
  return totalGeValue;
}

function simulateMimicActivity(activityData, options, rng) {
  const tier = getClueMimicTier(activityData);
  const simulation = activityData.simulation || {};
  const collected = new Map();
  const notableDrops = [];
  let totalGeValue = 0;
  let killsCompleted = 0;
  const fixedMode = getSimulationMode(options) === "fixed";
  const limit = getSimulationLimit(options);
  const attemptCount = getMimicAttemptCount(tier, options.clue_mimic_attempts ?? options.mimic_attempts);

  while (killsCompleted < limit) {
    killsCompleted += 1;
    totalGeValue += rollMimicRewardBundle(activityData, collected, notableDrops, tier, attemptCount, killsCompleted, `${tier} mimic`, rng);

    if (!fixedMode && hasReachedSimulationGoal(collected, totalGeValue, options)) {
      break;
    }
  }

  return finalizeSimulationResult(activityData, simulation, collected, notableDrops, totalGeValue, killsCompleted, options, {
    clue_model: "mimic",
    clue_context: {
      mimic_tier: tier,
      mimic_attempts: attemptCount,
    },
  });
}

function simulateYamaActivity(activityData, options, rng) {
  const simulation = activityData.simulation || {};
  const collected = new Map();
  const notableDrops = [];
  let totalGeValue = 0;
  let killsCompleted = 0;
  const fixedMode = getSimulationMode(options) === "fixed";
  const limit = getSimulationLimit(options);

  const uniqueRows = [
    { ...getRowBySlug(activityData, "oathplate-helm"), probability: 1 / 5 },
    { ...getRowBySlug(activityData, "oathplate-chest"), probability: 1 / 5 },
    { ...getRowBySlug(activityData, "oathplate-legs"), probability: 1 / 5 },
    { ...getRowBySlug(activityData, "soulflame-horn"), probability: 2 / 5 },
  ].filter((row) => row.item_slug);

  const dossierRow = getRowBySlug(activityData, "dossier");
  const lockboxRow = getRowBySlug(activityData, "forgotten-lockbox");
  const shardsRow = getRowBySlug(activityData, "oathplate-shards");
  const clueRow = getRowBySlug(activityData, "clue-scroll-elite");
  const petRow = getRowBySlug(activityData, "yami");
  const eliteClueChance = options.yama_elite_ca ? 1 / 28 : 1 / 30;

  const foodRows = [
    getRowBySlug(activityData, "pineapple-pizza"),
    getRowBySlug(activityData, "wild-pie"),
  ].filter(Boolean);
  const restoreRows = [
    getRowBySlug(activityData, "prayer-potion-3"),
    getRowBySlug(activityData, "super-restore-mix-2"),
  ].filter(Boolean);
  const combatRows = [
    getRowBySlug(activityData, "super-combat-potion-1"),
    getRowBySlug(activityData, "zamorak-mix-2"),
  ].filter(Boolean);

  const standardRows = [
    { row: getRowBySlug(activityData, "rune-chainbody"), weight: 5 },
    { row: getRowBySlug(activityData, "battlestaff"), weight: 4 },
    { row: getRowBySlug(activityData, "rune-platebody"), weight: 3 },
    { row: getRowBySlug(activityData, "dragon-plateskirt"), weight: 2 },
    { row: getRowBySlug(activityData, "dragon-platelegs"), weight: 2 },
    { row: getRowBySlug(activityData, "blood-rune"), weight: 3 },
    { row: getRowBySlug(activityData, "law-rune"), weight: 3 },
    { row: getRowBySlug(activityData, "smoke-rune"), weight: 2 },
    { row: getRowByPredicate(activityData, (row) => row.item_slug === "soul-rune" && String(row.quantity_text || "").includes("500")), weight: 2 },
    { row: getRowByPredicate(activityData, (row) => row.item_slug === "soul-rune" && String(row.quantity_text || "").includes("1,000")), weight: 2 },
    { row: getRowBySlug(activityData, "fire-rune"), weight: 1 },
    { row: getRowBySlug(activityData, "wrath-rune"), weight: 1 },
    { row: getRowBySlug(activityData, "aether-catalyst"), weight: 7 },
    { row: getRowBySlug(activityData, "diabolic-worms"), weight: 7 },
    { row: getRowBySlug(activityData, "barrel-of-demonic-tallow-full"), weight: 5 },
    { row: getRowBySlug(activityData, "chasm-teleport-scroll"), weight: 4 },
    { row: getRowBySlug(activityData, "emerald"), weight: 3 },
    { row: getRowBySlug(activityData, "ruby"), weight: 3 },
    { row: getRowBySlug(activityData, "diamond"), weight: 3 },
    { row: getRowBySlug(activityData, "onyx-bolt-tips"), weight: 1 },
  ].filter((entry) => entry.row && entry.weight > 0);

  while (killsCompleted < limit) {
    killsCompleted += 1;

    if (rng() <= (1 / 120)) {
      const picked = pickExclusiveItem(uniqueRows, rng);
      if (picked) {
        totalGeValue += addRowLoot(collected, notableDrops, picked, sampleQuantity(picked.quantity_text || "1", rng), killsCompleted, {
          sectionOverride: "Unique",
        });
      }
    } else if (dossierRow && rng() <= (1 / 12)) {
      totalGeValue += addRowLoot(collected, notableDrops, dossierRow, 1, killsCompleted, { sectionOverride: "Unique" });
    } else if (lockboxRow && rng() <= (1 / 30)) {
      totalGeValue += addRowLoot(collected, notableDrops, lockboxRow, 1, killsCompleted, { sectionOverride: "Unique" });
    } else if (shardsRow && rng() <= (1 / 15)) {
      totalGeValue += addRowLoot(collected, notableDrops, shardsRow, sampleQuantity(shardsRow.quantity_text || "12", rng), killsCompleted, {
        sectionOverride: "Unique",
      });
    } else if (rng() <= (15 / 78)) {
      const foodRow = pickWeightedValue(foodRows.map((row) => ({ weight: 1, value: row })), rng);
      const restoreRow = pickWeightedValue(restoreRows.map((row) => ({ weight: 1, value: row })), rng);
      const combatRow = pickWeightedValue(combatRows.map((row) => ({ weight: 1, value: row })), rng);

      for (const row of [foodRow, restoreRow, combatRow]) {
        if (!row) {
          continue;
        }
        totalGeValue += addRowLoot(collected, notableDrops, row, sampleQuantity(row.quantity_text || "1", rng), killsCompleted, {
          sectionOverride: "Supplies",
        });
      }
    } else {
      const picked = pickWeightedValue(standardRows.map((entry) => ({ weight: entry.weight, value: entry.row })), rng);
      if (picked) {
        totalGeValue += addRowLoot(collected, notableDrops, picked, sampleQuantity(picked.quantity_text || "1", rng), killsCompleted);
      }
    }

    if (petRow && rng() <= (1 / 2500)) {
      totalGeValue += addRowLoot(collected, notableDrops, petRow, 1, killsCompleted, { sectionOverride: "Tertiary" });
    }
    if (clueRow && rng() <= eliteClueChance) {
      totalGeValue += addRowLoot(collected, notableDrops, clueRow, 1, killsCompleted, { sectionOverride: "Tertiary" });
    }

    if (!fixedMode && hasReachedSimulationGoal(collected, totalGeValue, options)) {
      break;
    }
  }

  return finalizeSimulationResult(activityData, simulation, collected, notableDrops, totalGeValue, killsCompleted, options, {
    note: "Yama uses the base solo reward model from the OSRS Wiki. Contract fights and duo contribution scaling are not currently simulated.",
    yama_context: {
      elite_clue_chance: eliteClueChance,
      elite_ca_clue_boost: Boolean(options.yama_elite_ca),
    },
  });
}

function rollCoxUniqueCount(groupPoints, rng) {
  let remainingPoints = Math.max(0, Number(groupPoints) || 0);
  let rolls = 0;
  let uniques = 0;
  while (remainingPoints > 0 && rolls < 6) {
    const chance = Math.min(0.657, remainingPoints / 867600);
    if (rng() <= chance) {
      uniques += 1;
    }
    remainingPoints -= 570000;
    rolls += 1;
  }
  return uniques;
}

function coxUniqueShareChance(personalPoints, groupPoints) {
  const teamPoints = Math.max(1, Number(groupPoints) || 1);
  return clamp((Number(personalPoints) || 0) / teamPoints, 0, 1);
}

function toaScaledRaidLevel(raidLevel) {
  const level = Math.max(0, Number(raidLevel) || 0);
  if (level <= 310) {
    return level;
  }
  if (level <= 430) {
    return 310 + (level - 310) / 3;
  }
  return 310 + (430 + (level - 430) / 2 - 310) / 3;
}

function toaUniqueChance(rewardPoints, raidLevel) {
  const points = Math.max(0, Number(rewardPoints) || 0);
  const scaledLevel = toaScaledRaidLevel(raidLevel);
  const divisor = 10500 - 20 * scaledLevel;
  if (divisor <= 0) {
    return 0.55;
  }
  return clamp((points / divisor) / 100, 0, 0.55);
}

function toaPetScaledRaidLevel(raidLevel) {
  const level = Math.max(0, Number(raidLevel) || 0);
  if (level <= 400) {
    return level;
  }
  if (level <= 550) {
    return 400 + (level - 400) / 3;
  }
  return 450;
}

function toaPetChance(teamPoints, raidLevel) {
  const divisor = 350000 - 700 * toaPetScaledRaidLevel(raidLevel);
  if (divisor <= 0) {
    return 1;
  }
  return clamp(((Math.max(0, Number(teamPoints) || 0) / divisor) / 100), 0, 1);
}

function getToaUniqueWeightTable(raidLevel) {
  const level = clamp(Number(raidLevel) || 0, 0, 600);
  return TOA_UNIQUE_WEIGHT_TABLES.find((entry) => level >= entry.min && level <= entry.max) || TOA_UNIQUE_WEIGHT_TABLES[0];
}

function pickToaUniqueRow(activityData, raidLevel, rng) {
  const uniqueRows = getRowsFromSection(activityData, "Uniques");
  const table = getToaUniqueWeightTable(raidLevel);
  return pickWeightedValue(
    uniqueRows.map((row) => ({
      value: row,
      weight: table.weights[row.item_slug] || 0,
    })),
    rng,
  );
}

function toaRestrictedUniqueFails(row, raidLevel, rng) {
  if (!row) {
    return false;
  }
  const raidLevelValue = Math.max(0, Number(raidLevel) || 0);
  const requiresExtraRoll =
    (raidLevelValue < 50 && TOA_LOW_LEVEL_50_ITEMS.has(row.item_slug)) ||
    (raidLevelValue < 150 && TOA_LOW_LEVEL_150_ITEMS.has(row.item_slug));
  return requiresExtraRoll && rng() > 0.02;
}

function calculateToaCommonQuantity(row, personalPoints, raidLevel) {
  if (row.item_slug === "cache-of-runes") {
    return 1;
  }
  const divisor = TOA_COMMON_DIVISORS[row.item_slug];
  if (!divisor) {
    return sampleQuantity(row.quantity_text || "1", Math.random);
  }
  const points = Math.max(0, Number(personalPoints) || 0);
  const level = Math.max(0, Number(raidLevel) || 0);
  let quantity = points / divisor;
  if (level >= 300) {
    quantity *= 1.15 + 0.01 * Math.floor((level - 300) / 5);
  }
  return Math.max(1, Math.floor(quantity));
}

function interpolateBadLuckChance(baseChance, completions, maxMultiplier, capCompletions) {
  const progress = clamp((Number(completions) || 0) / capCompletions, 0, 1);
  return baseChance + (baseChance * maxMultiplier - baseChance) * progress;
}

function getToaThreadChance(completions, threadOwned) {
  if (threadOwned) {
    return 1 / 50;
  }
  return interpolateBadLuckChance(1 / 10, completions, 3, 15);
}

function getToaJewelChance(completions) {
  return interpolateBadLuckChance(4 / 50, completions, 3, 75);
}

function getToaEliteClueChance(personalPoints) {
  return clamp((Math.max(0, Number(personalPoints) || 0) / 2000) / 100, 0, 0.25);
}

function getOwnedToaJewels(options) {
  if (Array.isArray(options.toa_owned_jewels)) {
    return new Set(options.toa_owned_jewels.filter(Boolean));
  }
  return new Set([
    options.toa_owned_eye ? "eye-of-the-corruptor" : null,
    options.toa_owned_sun ? "jewel-of-the-sun" : null,
    options.toa_owned_scarab ? "breach-of-the-scarab" : null,
    options.toa_owned_amascut ? "jewel-of-amascut" : null,
  ].filter(Boolean));
}

function calculateTobContext(activityData, options) {
  const isHardMode = String(activityData.slug || "").includes("hard-mode");
  const teamSize = clamp(Number(options.tob_team_size ?? options.tobTeamSize) || 4, 1, 5);
  const yourDeaths = Math.max(0, Number(options.tob_deaths ?? options.tobDeaths) || 0);
  const teamDeaths = Math.max(0, Number(options.tob_team_deaths ?? options.tobTeamDeaths) || 0);
  const yourSkipped = Math.max(0, Number(options.tob_skipped_rooms ?? options.tobSkippedRooms) || 0);
  const teamSkipped = Math.max(0, Number(options.tob_team_skipped_rooms ?? options.tobTeamSkippedRooms) || 0);
  const mvpBonus = clamp(Number(options.tob_mvp_bonus ?? options.tobMvpBonus) || 0, 0, 14);
  const timedHardMode = Boolean(options.tob_timed_hm ?? options.tobTimedHm);
  const maxpoints = 18 * teamSize + 14;
  const playerpoints = Math.max(0, (6 - yourSkipped) * 3 + mvpBonus - yourDeaths * 4);
  const teampoints = Math.max(
    playerpoints,
    (6 * teamSize - yourSkipped - teamSkipped) * 3 + 14 - (yourDeaths + teamDeaths) * 4,
  );
  const ratio = teampoints > 0 ? teampoints / maxpoints : 0;
  const teamUniqueChance = (isHardMode ? 1 / 7.7 : 1 / 9.1) * ratio;
  const playerUniqueChance = teampoints > 0 ? teamUniqueChance * (playerpoints / teampoints) : 0;
  const commonMultiplier = isHardMode ? 1 + 0.15 + (timedHardMode ? 0.15 : 0) : 1;

  return {
    isHardMode,
    teamSize,
    yourDeaths,
    teamDeaths,
    yourSkipped,
    teamSkipped,
    mvpBonus,
    timedHardMode,
    maxpoints,
    playerpoints,
    teampoints,
    ratio: clamp(ratio, 0, 1),
    teamUniqueChance: clamp(teamUniqueChance, 0, 1),
    playerUniqueChance: clamp(playerUniqueChance, 0, 1),
    commonMultiplier,
  };
}

function sampleTobCommonQuantity(row, ratio, commonMultiplier, rng) {
  const scaledBase = Math.floor((row.base_quantity || sampleQuantity(row.quantity_text || "1", rng)) * ratio * commonMultiplier);
  const low = Math.max(0, scaledBase);
  const high = Math.max(low, Math.floor(low * 1.2));
  if (high <= low) {
    return low;
  }
  return low + Math.floor(rng() * (high - low + 1));
}

function simulateCoxRaid(activityData, options, rng) {
  const simulation = activityData.simulation || {};
  const collected = new Map();
  const notableDrops = [];
  let totalGeValue = 0;
  let killsCompleted = 0;
  const limit = getSimulationLimit(options);
  const uniqueRows = getRowsFromSection(activityData, "Unique drop table");
  const mainRows = getRowsFromSection(activityData, "Main pool");
  const personalPoints = options.cox_personal_points ?? options.coxPersonalPoints ?? 30000;
  const groupPoints = options.cox_group_points ?? options.coxGroupPoints ?? personalPoints;
  const shareChance = coxUniqueShareChance(personalPoints, groupPoints);
  const eliteClueChance = options.cox_elite_ca ? 1 / 11 : 1 / 12;
  const timedCmClear = Boolean(options.cox_timed_cm ?? options.coxTimedCm);
  const olmletRow = getRowBySlug(activityData, "olmlet");
  const eliteClueRow = getRowBySlug(activityData, "clue-scroll-elite");
  const colourKitRow = getRowBySlug(activityData, "twisted-ancestral-colour-kit");
  const dustRow = getRowBySlug(activityData, "metamorphic-dust");
  let personalUniquesAwarded = 0;

  while (killsCompleted < limit) {
    killsCompleted += 1;

    const groupUniqueRolls = rollCoxUniqueCount(groupPoints, rng);
    let personalUniqueCount = 0;
    for (let roll = 0; roll < groupUniqueRolls; roll += 1) {
      if (rng() <= shareChance) {
        const picked = pickExclusiveItem(uniqueRows, rng);
        if (picked) {
          const quantity = sampleQuantity(picked.quantity_text || "1", rng);
          totalGeValue += addRowLoot(collected, notableDrops, picked, quantity, killsCompleted, { sectionOverride: "Unique drop table" });
          personalUniqueCount += 1;
          personalUniquesAwarded += 1;
        }
      }
    }

    if (personalUniqueCount === 0) {
      const commonRows = pickDistinctExclusiveRows(mainRows, 2, rng);
      for (const row of commonRows) {
        const quantity = sampleQuantity(row.quantity_text || "1", rng);
        totalGeValue += addRowLoot(collected, notableDrops, row, quantity, killsCompleted, { sectionOverride: "Main pool" });
      }
      if (eliteClueRow && rng() <= eliteClueChance) {
        totalGeValue += addRowLoot(collected, notableDrops, eliteClueRow, 1, killsCompleted, { sectionOverride: "Tertiary" });
      }
    } else if (olmletRow && rng() <= (olmletRow.probability || 0)) {
      totalGeValue += addRowLoot(collected, notableDrops, olmletRow, 1, killsCompleted, { sectionOverride: "Tertiary" });
    }

    if (activityData.slug === "chambers-of-xeric-challenge-mode" && timedCmClear) {
      if (colourKitRow && rng() <= (colourKitRow.probability || 0)) {
        totalGeValue += addRowLoot(collected, notableDrops, colourKitRow, 1, killsCompleted, { sectionOverride: "Challenge mode tertiary" });
      }
      if (dustRow && rng() <= (dustRow.probability || 0)) {
        totalGeValue += addRowLoot(collected, notableDrops, dustRow, 1, killsCompleted, { sectionOverride: "Challenge mode tertiary" });
      }
    }

    if (getSimulationMode(options) !== "fixed" && hasReachedSimulationGoal(collected, totalGeValue, options)) {
      break;
    }
  }

  return finalizeSimulationResult(activityData, simulation, collected, notableDrops, totalGeValue, killsCompleted, options, {
    raid_model: "cox",
    raid_context: {
      personal_points: Number(personalPoints) || 0,
      group_points: Number(groupPoints) || 0,
      unique_share_chance: shareChance,
      elite_clue_chance: eliteClueChance,
      timed_cm_clear: timedCmClear,
      personal_uniques_awarded: personalUniquesAwarded,
    },
  });
}

function simulateToaRaid(activityData, options, rng) {
  const simulation = activityData.simulation || {};
  const collected = new Map();
  const notableDrops = [];
  let totalGeValue = 0;
  let killsCompleted = 0;
  const limit = getSimulationLimit(options);
  const commonRows = getRowsFromSection(activityData, "Common rewards");
  const raidLevel = options.toa_raid_level ?? options.toaRaidLevel ?? 300;
  const personalPoints = options.toa_personal_points ?? options.toaPersonalPoints ?? 15000;
  const teamPoints = options.toa_team_points ?? options.toaTeamPoints ?? personalPoints;
  const completions = Math.max(0, Number(options.toa_completions ?? options.toaCompletions) || 0);
  const threadOwned = Boolean(options.toa_thread_obtained ?? options.toaThreadObtained);
  const uniqueChance = toaUniqueChance(teamPoints, raidLevel);
  const receiveChance = clamp((Number(personalPoints) || 0) / Math.max(1, Number(teamPoints) || 1), 0, 1);
  const threadChance = getToaThreadChance(completions, threadOwned);
  const jewelChance = getToaJewelChance(completions);
  const eliteClueChance = getToaEliteClueChance(personalPoints);
  const petChance = toaPetChance(teamPoints, raidLevel) * receiveChance;
  const dungRow = getRowBySlug(activityData, "fossilised-dung");
  const threadRow = getRowBySlug(activityData, "thread-of-elidinis");
  const jewelRows = [
    getRowBySlug(activityData, "eye-of-the-corruptor"),
    getRowBySlug(activityData, "jewel-of-the-sun"),
    getRowBySlug(activityData, "breach-of-the-scarab"),
    getRowBySlug(activityData, "jewel-of-amascut"),
  ].filter(Boolean);
  const ownedJewels = getOwnedToaJewels(options);
  const eliteClueRow = getRowBySlug(activityData, "clue-scroll-elite");
  const petRow = getRowBySlug(activityData, "tumeken-s-guardian");
  let restrictedUniqueMisses = 0;

  while (killsCompleted < limit) {
    killsCompleted += 1;

    const uniqueRolled = rng() <= uniqueChance;
    const personalUnique = uniqueRolled && rng() <= receiveChance;
    if (personalUnique) {
      const picked = pickToaUniqueRow(activityData, raidLevel, rng);
      if (picked && !toaRestrictedUniqueFails(picked, raidLevel, rng)) {
        totalGeValue += addRowLoot(collected, notableDrops, picked, 1, killsCompleted, { sectionOverride: "Uniques" });
      } else {
        restrictedUniqueMisses += 1;
      }
    } else {
      if (Number(personalPoints) < 1500 && dungRow) {
        totalGeValue += addRowLoot(collected, notableDrops, dungRow, 1, killsCompleted, { sectionOverride: "Pre-roll" });
      } else {
        for (let roll = 0; roll < 3; roll += 1) {
          const picked = pickExclusiveItem(commonRows, rng);
          if (!picked) {
            continue;
          }
          const quantity = calculateToaCommonQuantity(picked, personalPoints, raidLevel);
          totalGeValue += addRowLoot(collected, notableDrops, picked, quantity, killsCompleted, { sectionOverride: "Common rewards" });
        }
      }
    }

    if (threadRow && rng() <= threadChance) {
      totalGeValue += addRowLoot(collected, notableDrops, threadRow, 1, killsCompleted, { sectionOverride: "Tertiary rewards" });
    }
    if (jewelRows.length && rng() <= jewelChance) {
      const availableJewels = jewelRows.filter((row) => !ownedJewels.has(row.item_slug));
      const jewelPool = availableJewels.length ? availableJewels : jewelRows;
      const pickedJewel = jewelPool[Math.floor(rng() * jewelPool.length)];
      totalGeValue += addRowLoot(collected, notableDrops, pickedJewel, 1, killsCompleted, { sectionOverride: "Tertiary rewards" });
    }
    if (eliteClueRow && rng() <= eliteClueChance) {
      totalGeValue += addRowLoot(collected, notableDrops, eliteClueRow, 1, killsCompleted, { sectionOverride: "Tertiary rewards" });
    }
    if (petRow && rng() <= petChance) {
      totalGeValue += addRowLoot(collected, notableDrops, petRow, 1, killsCompleted, { sectionOverride: "Tertiary rewards" });
    }

    if (getSimulationMode(options) !== "fixed" && hasReachedSimulationGoal(collected, totalGeValue, options)) {
      break;
    }
  }

  return finalizeSimulationResult(activityData, simulation, collected, notableDrops, totalGeValue, killsCompleted, options, {
    raid_model: "toa",
    raid_context: {
      raid_level: Number(raidLevel) || 0,
      personal_points: Number(personalPoints) || 0,
      team_points: Number(teamPoints) || 0,
      completions,
      unique_chance: uniqueChance,
      receive_chance: receiveChance,
      thread_chance: threadChance,
      jewel_chance_any: jewelChance,
      owned_jewel_count: ownedJewels.size,
      elite_clue_chance: eliteClueChance,
      pet_chance: petChance,
      restricted_unique_misses: restrictedUniqueMisses,
    },
  });
}

function simulateTobRaid(activityData, options, rng) {
  const simulation = activityData.simulation || {};
  const collected = new Map();
  const notableDrops = [];
  let totalGeValue = 0;
  let killsCompleted = 0;
  const limit = getSimulationLimit(options);
  const uniqueRows = getRowsFromSection(activityData, String((activityData.simulation?.exclusive_sections || [])[0]?.label || "Normal mode"));
  const context = calculateTobContext(activityData, options);
  const commonRows = TOB_COMMON_TABLE;

  while (killsCompleted < limit) {
    killsCompleted += 1;

    if (context.playerpoints <= 0) {
      const cabbage = getRowBySlug(activityData, "cabbage") || createSyntheticRow("cabbage", "Cabbage", "No-score reward");
      const message = getRowBySlug(activityData, "message-theatre-of-blood") || createSyntheticRow("message-theatre-of-blood", "Message (Theatre of Blood)", "No-score reward");
      totalGeValue += addRowLoot(collected, notableDrops, cabbage, 1, killsCompleted, { sectionOverride: "No-score reward" });
      totalGeValue += addRowLoot(collected, notableDrops, message, 1, killsCompleted, { sectionOverride: "No-score reward" });
    } else if (rng() <= context.playerUniqueChance) {
      const picked = pickExclusiveItem(uniqueRows, rng);
      if (picked) {
        const quantity = sampleQuantity(picked.quantity_text || "1", rng);
        totalGeValue += addRowLoot(collected, notableDrops, picked, quantity, killsCompleted, { sectionOverride: picked.section || "Unique drop table" });
      }
    } else {
      for (let roll = 0; roll < 3; roll += 1) {
        const picked = pickExclusiveItem(commonRows, rng);
        if (!picked) {
          continue;
        }
        const quantity = sampleTobCommonQuantity(picked, context.ratio, context.commonMultiplier, rng);
        if (quantity > 0) {
          totalGeValue += addRowLoot(collected, notableDrops, picked, quantity, killsCompleted, { sectionOverride: "Common rewards" });
        }
      }
    }

    if (getSimulationMode(options) !== "fixed" && hasReachedSimulationGoal(collected, totalGeValue, options)) {
      break;
    }
  }

  return finalizeSimulationResult(activityData, simulation, collected, notableDrops, totalGeValue, killsCompleted, options, {
    raid_model: "tob",
    raid_context: {
      team_size: context.teamSize,
      player_points: context.playerpoints,
      team_points: context.teampoints,
      score_ratio: context.ratio,
      player_unique_chance: context.playerUniqueChance,
      team_unique_chance: context.teamUniqueChance,
      your_deaths: context.yourDeaths,
      team_deaths: context.teamDeaths,
      your_skipped_rooms: context.yourSkipped,
      team_skipped_rooms: context.teamSkipped,
      mvp_bonus: context.mvpBonus,
      timed_hard_mode: context.timedHardMode,
    },
  });
}

export function simulateActivity(activityData, options = {}) {
  const {
    kills = 0,
    seed = null,
    target_item_slug: targetItemSlug = null,
    target_count: targetCount = 1,
    target_gp_value: targetGpValue = null,
    max_chase_kills: maxChaseKills = 25000000,
  } = options;

  if (activityData?.simulation_disabled) {
    throw new Error(activityData.note || "Simulation is disabled for this activity.");
  }
  if (!activityData?.supported) {
    throw new Error("This activity does not have cached drop data yet.");
  }

  const rng = createRng(seed);
  if (activityData.slug === "mimic") {
    return simulateMimicActivity(activityData, options, rng);
  }
  if (activityData.slug === "yama") {
    return simulateYamaActivity(activityData, options, rng);
  }
  if (isRaidSlug(activityData.slug)) {
    if (activityData.slug === "chambers-of-xeric" || activityData.slug === "chambers-of-xeric-challenge-mode") {
      return simulateCoxRaid(activityData, options, rng);
    }
    if (activityData.slug === "tombs-of-amascut" || activityData.slug === "tombs-of-amascut-expert-mode") {
      return simulateToaRaid(activityData, options, rng);
    }
    if (activityData.slug === "theatre-of-blood" || activityData.slug === "theatre-of-blood-hard-mode") {
      return simulateTobRaid(activityData, options, rng);
    }
  }

  const rowMap = new Map((activityData.drop_rows || []).map((row) => [row.row_id, row]));
  const simulation = activityData.simulation || {};
  const guaranteedRows = (simulation.guaranteed_row_ids || []).map((rowId) => rowMap.get(rowId)).filter(Boolean);
  const independentSections = (simulation.independent_sections || []).map((section) =>
    (section.row_ids || []).map((rowId) => rowMap.get(rowId)).filter(Boolean),
  );
  const mimicTier = getClueMimicTier(activityData);
  const clueMimicEnabled = mimicTier && activityData.slug !== "mimic" ? options.clue_mimic_enabled !== false : false;
  const clueMimicAttempts = getMimicAttemptCount(mimicTier, options.clue_mimic_attempts);
  const exclusiveSectionMeta = (simulation.exclusive_sections || []).filter((section) => section.label !== "Mimic rewards");
  const exclusiveSections = exclusiveSectionMeta.map((section) =>
    (section.row_ids || []).map((rowId) => rowMap.get(rowId)).filter(Boolean),
  );

  const collected = new Map();
  const notableDrops = [];
  let totalGeValue = 0;
  let killsCompleted = 0;
  const fixedMode = getSimulationMode(options) === "fixed";
  const limit = getSimulationLimit(options);

  while (killsCompleted < limit) {
    killsCompleted += 1;

    for (const row of guaranteedRows) {
      const quantity = sampleQuantity(row.quantity_text || "1", rng);
      totalGeValue += addToCollection(collected, row, quantity);
      if (notableDrops.length < 40 && isNotableDrop(row, quantity)) {
        notableDrops.push({
          kill: killsCompleted,
          item_name: row.item_name,
          quantity,
          section: row.section,
          rarity_fraction: row.rarity_fraction,
        });
      }
    }

    for (const sectionRows of independentSections) {
      for (const row of sectionRows) {
        const probability = row.probability;
        if (probability === null || probability === undefined || probability <= 0) {
          continue;
        }
        if (rng() <= probability) {
          const quantity = sampleQuantity(row.quantity_text || "1", rng);
          totalGeValue += addToCollection(collected, row, quantity);
          if (notableDrops.length < 40 && isNotableDrop(row, quantity)) {
            notableDrops.push({
              kill: killsCompleted,
              item_name: row.item_name,
              quantity,
              section: row.section,
              rarity_fraction: row.rarity_fraction,
            });
          }
        }
      }
    }

    for (const [sectionMeta, sectionRows] of exclusiveSectionMeta.map((section, index) => [section, exclusiveSections[index]])) {
      const rolls = sampleSectionRolls(sectionMeta, simulation, rng);
      if (rolls <= 0) {
        continue;
      }
      for (let roll = 0; roll < rolls; roll += 1) {
        const picked = pickExclusiveItem(sectionRows, rng, {
          normalizeNearUnity: sectionMeta.label === "Main pool" && Boolean(simulation.reward_roll_range) && sectionRows.length > 0,
        });
        if (!picked) {
          continue;
        }
        const quantity = sampleQuantity(picked.quantity_text || "1", rng);
        totalGeValue += addToCollection(collected, picked, quantity);
        if (notableDrops.length < 40 && isNotableDrop(picked, quantity)) {
          notableDrops.push({
            kill: killsCompleted,
            item_name: picked.item_name,
            quantity,
            section: picked.section,
            rarity_fraction: picked.rarity_fraction,
          });
        }
      }
    }

    if (clueMimicEnabled && rng() <= (CLUE_MIMIC_CHANCES[activityData.slug] || 0)) {
      totalGeValue += rollMimicRewardBundle(activityData, collected, notableDrops, mimicTier, clueMimicAttempts, killsCompleted, "Mimic bonus", rng);
    }

    if (!fixedMode && hasReachedSimulationGoal(collected, totalGeValue, options)) {
      break;
    }
  }

  return finalizeSimulationResult(activityData, simulation, collected, notableDrops, totalGeValue, killsCompleted, {
    kills,
    seed,
    target_item_slug: targetItemSlug,
    target_count: targetCount,
    target_gp_value: targetGpValue,
    max_chase_kills: maxChaseKills,
  }, {
    clue_context: clueMimicEnabled
      ? {
          mimic_enabled: true,
          mimic_chance: CLUE_MIMIC_CHANCES[activityData.slug],
          mimic_attempts: clueMimicAttempts,
        }
      : undefined,
  });
}
