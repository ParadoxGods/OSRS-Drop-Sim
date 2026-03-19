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

export function simulateActivity(activityData, options = {}) {
  const {
    kills = 0,
    seed = null,
    target_item_slug: targetItemSlug = null,
    target_count: targetCount = 1,
    max_chase_kills: maxChaseKills = 250000,
  } = options;

  if (activityData?.simulation_disabled) {
    throw new Error(activityData.note || "Simulation is disabled for this activity.");
  }
  if (!activityData?.supported) {
    throw new Error("This activity does not have cached drop data yet.");
  }

  const rng = createRng(seed);
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
