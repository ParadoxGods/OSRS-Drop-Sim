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

function pickExclusiveItem(rows, rng) {
  const usableRows = rows.filter((row) => row.probability && row.probability > 0);
  if (!usableRows.length) {
    return null;
  }

  const totalProbability = usableRows.reduce((sum, row) => sum + row.probability, 0);
  let threshold;
  if (totalProbability < 1) {
    if (rng() > totalProbability) {
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

  const fixedMode = options.target_item_slug === null || options.target_item_slug === undefined || options.target_item_slug === "";

  return {
    mode: fixedMode ? "fixed" : "target",
    kills_requested: options.kills,
    kills_completed: killsCompleted,
    target_item_slug: options.target_item_slug || null,
    target_count: fixedMode ? null : options.target_count || 1,
    target_reached: fixedMode ? null : (collected.get(options.target_item_slug)?.quantity || 0) >= (options.target_count || 1),
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
  { item_name: "Vial of blood", item_slug: "vial-of-blood", item_asset_path: null, quantity_text: "45–60 (noted)", probability: 2 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Death rune", item_slug: "death-rune", item_asset_path: "assets/items/death-rune.png", quantity_text: "500–600", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 8 },
  { item_name: "Blood rune", item_slug: "blood-rune", item_asset_path: "assets/items/blood-rune.png", quantity_text: "500–600", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Swamp tar", item_slug: "swamp-tar", item_asset_path: "assets/items/swamp-tar.png", quantity_text: "500–600", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 2 },
  { item_name: "Coal", item_slug: "coal", item_asset_path: "assets/items/coal.png", quantity_text: "500–600 (noted)", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Gold ore", item_slug: "gold-ore", item_asset_path: "assets/items/gold-ore.png", quantity_text: "300–360 (noted)", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 6 },
  { item_name: "Molten glass", item_slug: "molten-glass", item_asset_path: "assets/items/molten-glass.png", quantity_text: "200–240 (noted)", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Adamantite ore", item_slug: "adamantite-ore", item_asset_path: "assets/items/adamantite-ore.png", quantity_text: "130–156 (noted)", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Runite ore", item_slug: "runite-ore", item_asset_path: "assets/items/runite-ore.png", quantity_text: "60–72 (noted)", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Wine of zamorak", item_slug: "wine-of-zamorak", item_asset_path: "assets/items/wine-of-zamorak.png", quantity_text: "50–60", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Potato cactus", item_slug: "potato-cactus", item_asset_path: "assets/items/potato-cactus.png", quantity_text: "50–60", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy cadantine", item_slug: "grimy-cadantine", item_asset_path: "assets/items/grimy-cadantine.png", quantity_text: "50–60", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy avantoe", item_slug: "grimy-avantoe", item_asset_path: "assets/items/grimy-avantoe.png", quantity_text: "40–48", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy toadflax", item_slug: "grimy-toadflax", item_asset_path: "assets/items/grimy-toadflax.png", quantity_text: "37–44", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy kwuarm", item_slug: "grimy-kwuarm", item_asset_path: "assets/items/grimy-kwuarm.png", quantity_text: "36–43", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy irit leaf", item_slug: "grimy-irit-leaf", item_asset_path: "assets/items/grimy-irit-leaf.png", quantity_text: "34–40", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy ranarr weed", item_slug: "grimy-ranarr-weed", item_asset_path: "assets/items/grimy-ranarr-weed.png", quantity_text: "30–36", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy snapdragon", item_slug: "grimy-snapdragon", item_asset_path: "assets/items/grimy-snapdragon.png", quantity_text: "27–32", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy lantadyme", item_slug: "grimy-lantadyme", item_asset_path: "assets/items/grimy-lantadyme.png", quantity_text: "26–31", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy dwarf weed", item_slug: "grimy-dwarf-weed", item_asset_path: "assets/items/grimy-dwarf-weed.png", quantity_text: "24–28", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Grimy torstol", item_slug: "grimy-torstol", item_asset_path: "assets/items/grimy-torstol.png", quantity_text: "20–24", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Battlestaff", item_slug: "battlestaff", item_asset_path: "assets/items/battlestaff.png", quantity_text: "15–18", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Rune battleaxe", item_slug: "rune-battleaxe", item_asset_path: "assets/items/rune-battleaxe.png", quantity_text: "1", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Rune platebody", item_slug: "rune-platebody", item_asset_path: "assets/items/rune-platebody.png", quantity_text: "1", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Rune chainbody", item_slug: "rune-chainbody", item_asset_path: "assets/items/rune-chainbody.png", quantity_text: "1", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Palm tree seed", item_slug: "palm-tree-seed", item_asset_path: "assets/items/palm-tree-seed.png", quantity_text: "1", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Yew seed", item_slug: "yew-seed", item_asset_path: "assets/items/yew-seed.png", quantity_text: "1", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Magic seed", item_slug: "magic-seed", item_asset_path: "assets/items/magic-seed.png", quantity_text: "1", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
  { item_name: "Mahogany seed", item_slug: "mahogany-seed", item_asset_path: "assets/items/mahogany-seed.png", quantity_text: "1", probability: 1 / 30, section: "Common rewards", ge_unit_estimate: 0 },
];

function getSectionRows(activityData, label) {
  const rowMap = new Map((activityData.drop_rows || []).map((row) => [row.row_id, row]));
  return (activityData.simulation?.exclusive_sections || [])
    .find((section) => section.label === label);
}

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

function rollCoxUniqueCount(groupPoints, rng) {
  let remainingPoints = Math.max(0, Number(groupPoints) || 0);
  let rolls = 0;
  let uniques = 0;
  while (remainingPoints > 0 && rolls < 6) {
    const chance = Math.min(0.657, remainingPoints / 867500);
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

function tobUniqueChance(activityData, deaths, skippedRooms, mvpBonus) {
  const isHardMode = String(activityData.slug || "").includes("hard-mode");
  const baseChance = isHardMode ? 1 / 7.7 : 1 / 9.1;
  const deathPenalty = clamp(1 - (Math.max(0, Number(deaths) || 0) * 0.18), 0.1, 1);
  const skipPenalty = clamp(1 - (Math.max(0, Number(skippedRooms) || 0) * 0.05), 0.15, 1);
  const mvpBonusScale = 1 + clamp(Number(mvpBonus) || 0, 0, 14) / 100;
  return clamp(baseChance * deathPenalty * skipPenalty * mvpBonusScale, 0, 1);
}

function simulateCoxRaid(activityData, options, rng) {
  const simulation = activityData.simulation || {};
  const collected = new Map();
  const notableDrops = [];
  let totalGeValue = 0;
  let killsCompleted = 0;
  const limit = options.target_item_slug ? Math.max(1, Number(options.max_chase_kills) || 250000) : Math.max(0, Number(options.kills) || 0);
  const uniqueRows = getRowsFromSection(activityData, "Unique drop table");
  const mainRows = getRowsFromSection(activityData, "Main pool");
  const tertiaryRows = getIndependentRows(activityData, "Tertiary");
  const personalPoints = options.cox_personal_points ?? options.coxPersonalPoints ?? 30000;
  const groupPoints = options.cox_group_points ?? options.coxGroupPoints ?? personalPoints;
  const shareChance = coxUniqueShareChance(personalPoints, groupPoints);

  while (killsCompleted < limit) {
    killsCompleted += 1;
    totalGeValue += rollIndependentSection(collected, notableDrops, tertiaryRows, killsCompleted, rng);

    const groupUniqueRolls = rollCoxUniqueCount(groupPoints, rng);
    let personalUniqueCount = 0;
    for (let roll = 0; roll < groupUniqueRolls; roll += 1) {
      if (rng() <= shareChance) {
        const picked = pickExclusiveItem(uniqueRows, rng);
        if (picked) {
          const quantity = sampleQuantity(picked.quantity_text || "1", rng);
          totalGeValue += addRowLoot(collected, notableDrops, picked, quantity, killsCompleted, { sectionOverride: "Unique drop table" });
          personalUniqueCount += 1;
        }
      }
    }

    if (personalUniqueCount === 0) {
      totalGeValue += rollExclusiveSection(collected, notableDrops, mainRows, 2, killsCompleted, "Main pool", rng);
    }

    if (options.target_item_slug) {
      const found = collected.get(options.target_item_slug)?.quantity || 0;
      if (found >= (options.target_count || 1)) {
        break;
      }
    }
  }

  return finalizeSimulationResult(activityData, simulation, collected, notableDrops, totalGeValue, killsCompleted, options, {
    raid_model: "cox",
    raid_context: {
      personal_points: Number(personalPoints) || 0,
      group_points: Number(groupPoints) || 0,
      unique_share_chance: shareChance,
    },
  });
}

function simulateToaRaid(activityData, options, rng) {
  const simulation = activityData.simulation || {};
  const collected = new Map();
  const notableDrops = [];
  let totalGeValue = 0;
  let killsCompleted = 0;
  const limit = options.target_item_slug ? Math.max(1, Number(options.max_chase_kills) || 250000) : Math.max(0, Number(options.kills) || 0);
  const uniqueRows = getRowsFromSection(activityData, "Uniques");
  const commonRows = getRowsFromSection(activityData, "Common rewards");
  const tertiaryRows = getIndependentRows(activityData, "Tertiary rewards");
  const raidLevel = options.toa_raid_level ?? options.toaRaidLevel ?? 300;
  const personalPoints = options.toa_personal_points ?? options.toaPersonalPoints ?? 15000;
  const teamPoints = options.toa_team_points ?? options.toaTeamPoints ?? personalPoints;
  const uniqueChance = toaUniqueChance(teamPoints, raidLevel);
  const receiveChance = clamp((Number(personalPoints) || 0) / Math.max(1, Number(teamPoints) || 1), 0, 1);

  while (killsCompleted < limit) {
    killsCompleted += 1;
    totalGeValue += rollIndependentSection(collected, notableDrops, tertiaryRows, killsCompleted, rng);

    const uniqueRolled = rng() <= uniqueChance;
    if (uniqueRolled && rng() <= receiveChance) {
      const picked = pickExclusiveItem(uniqueRows, rng);
      if (picked) {
        const quantity = sampleQuantity(picked.quantity_text || "1", rng);
        totalGeValue += addRowLoot(collected, notableDrops, picked, quantity, killsCompleted, { sectionOverride: "Uniques" });
      }
    } else {
      totalGeValue += rollExclusiveSection(collected, notableDrops, commonRows, 1, killsCompleted, "Common rewards", rng);
    }

    if (options.target_item_slug) {
      const found = collected.get(options.target_item_slug)?.quantity || 0;
      if (found >= (options.target_count || 1)) {
        break;
      }
    }
  }

  return finalizeSimulationResult(activityData, simulation, collected, notableDrops, totalGeValue, killsCompleted, options, {
    raid_model: "toa",
    raid_context: {
      raid_level: Number(raidLevel) || 0,
      personal_points: Number(personalPoints) || 0,
      team_points: Number(teamPoints) || 0,
      unique_chance: uniqueChance,
      receive_chance: receiveChance,
    },
  });
}

function simulateTobRaid(activityData, options, rng) {
  const simulation = activityData.simulation || {};
  const collected = new Map();
  const notableDrops = [];
  let totalGeValue = 0;
  let killsCompleted = 0;
  const limit = options.target_item_slug ? Math.max(1, Number(options.max_chase_kills) || 250000) : Math.max(0, Number(options.kills) || 0);
  const uniqueRows = getRowsFromSection(activityData, String((activityData.simulation?.exclusive_sections || [])[0]?.label || "Normal mode"));
  const deaths = options.tob_deaths ?? options.tobDeaths ?? 0;
  const skippedRooms = options.tob_skipped_rooms ?? options.tobSkippedRooms ?? 0;
  const mvpBonus = options.tob_mvp_bonus ?? options.tobMvpBonus ?? 4;
  const uniqueChance = tobUniqueChance(activityData, deaths, skippedRooms, mvpBonus);
  const commonRows = TOB_COMMON_TABLE;

  while (killsCompleted < limit) {
    killsCompleted += 1;

    if (rng() <= uniqueChance) {
      const picked = pickExclusiveItem(uniqueRows, rng);
      if (picked) {
        const quantity = sampleQuantity(picked.quantity_text || "1", rng);
        totalGeValue += addRowLoot(collected, notableDrops, picked, quantity, killsCompleted, { sectionOverride: picked.section || "Unique drop table" });
      }
    } else {
      totalGeValue += rollExclusiveSection(collected, notableDrops, commonRows, 3, killsCompleted, "Common rewards", rng);
    }

    if (options.target_item_slug) {
      const found = collected.get(options.target_item_slug)?.quantity || 0;
      if (found >= (options.target_count || 1)) {
        break;
      }
    }
  }

  return finalizeSimulationResult(activityData, simulation, collected, notableDrops, totalGeValue, killsCompleted, options, {
    raid_model: "tob",
    raid_context: {
      deaths: Number(deaths) || 0,
      skipped_rooms: Number(skippedRooms) || 0,
      mvp_bonus: Number(mvpBonus) || 0,
      unique_chance: uniqueChance,
    },
  });
}

export function simulateActivity(activityData, options = {}) {
  const {
    kills = 0,
    seed = null,
    target_item_slug: targetItemSlug = null,
    target_count: targetCount = 1,
    max_chase_kills: maxChaseKills = 25000000,
  } = options;

  if (activityData?.simulation_disabled) {
    throw new Error(activityData.note || "Simulation is disabled for this activity.");
  }
  if (!activityData?.supported) {
    throw new Error("This activity does not have cached drop data yet.");
  }

  const rng = createRng(seed);
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
  const exclusiveSections = (simulation.exclusive_sections || []).map((section) =>
    (section.row_ids || []).map((rowId) => rowMap.get(rowId)).filter(Boolean),
  );

  const collected = new Map();
  const notableDrops = [];
  let totalGeValue = 0;
  let killsCompleted = 0;
  const fixedMode = targetItemSlug === null || targetItemSlug === undefined || targetItemSlug === "";
  const limit = fixedMode ? kills : maxChaseKills;

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

    for (const [sectionMeta, sectionRows] of (simulation.exclusive_sections || []).map((section, index) => [section, exclusiveSections[index]])) {
      const rolls = sampleSectionRolls(sectionMeta, simulation, rng);
      if (rolls <= 0) {
        continue;
      }
      for (let roll = 0; roll < rolls; roll += 1) {
        const picked = pickExclusiveItem(sectionRows, rng);
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

    if (!fixedMode) {
      const found = collected.get(targetItemSlug)?.quantity || 0;
      if (found >= targetCount) {
        break;
      }
    }
  }

  const totals = Array.from(collected.values()).sort((a, b) => {
    if (b.total_ge_value !== a.total_ge_value) {
      return b.total_ge_value - a.total_ge_value;
    }
    if (b.quantity !== a.quantity) {
      return b.quantity - a.quantity;
    }
    return a.item_name.localeCompare(b.item_name);
  });

  return {
    mode: fixedMode ? "fixed" : "target",
    kills_requested: kills,
    kills_completed: killsCompleted,
    target_item_slug: targetItemSlug,
    target_count: fixedMode ? null : targetCount,
    target_reached: fixedMode ? null : (collected.get(targetItemSlug)?.quantity || 0) >= targetCount,
    seed,
    total_ge_value: totalGeValue,
    distinct_items: totals.length,
    totals: totals.slice(0, 150),
    top_items: totals.slice(0, 12),
    notable_drops: notableDrops,
    note: simulation.note,
  };
}
