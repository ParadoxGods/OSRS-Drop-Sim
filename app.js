import { simulateActivity } from "./simulator.js";

const TOB_COMMON_ROWS = [
  { item_name: "Vial of blood", item_slug: "vial-of-blood", item_asset_path: null, quantity_text: "50-60", rarity_fraction: "2/30", section: "Common rewards" },
  { item_name: "Death rune", item_slug: "death-rune", item_asset_path: "assets/items/death-rune.png", quantity_text: "500-600", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Blood rune", item_slug: "blood-rune", item_asset_path: "assets/items/blood-rune.png", quantity_text: "500-600", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Swamp tar", item_slug: "swamp-tar", item_asset_path: "assets/items/swamp-tar.png", quantity_text: "500-600", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Coal", item_slug: "coal", item_asset_path: "assets/items/coal.png", quantity_text: "500-600", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Gold ore", item_slug: "gold-ore", item_asset_path: "assets/items/gold-ore.png", quantity_text: "300-360", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Molten glass", item_slug: "molten-glass", item_asset_path: "assets/items/molten-glass.png", quantity_text: "200-240", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Adamantite ore", item_slug: "adamantite-ore", item_asset_path: "assets/items/adamantite-ore.png", quantity_text: "130-156", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Runite ore", item_slug: "runite-ore", item_asset_path: "assets/items/runite-ore.png", quantity_text: "60-72", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Wine of zamorak", item_slug: "wine-of-zamorak", item_asset_path: "assets/items/wine-of-zamorak.png", quantity_text: "50-60", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Potato cactus", item_slug: "potato-cactus", item_asset_path: "assets/items/potato-cactus.png", quantity_text: "50-60", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Grimy cadantine", item_slug: "grimy-cadantine", item_asset_path: "assets/items/grimy-cadantine.png", quantity_text: "50-60", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Grimy avantoe", item_slug: "grimy-avantoe", item_asset_path: "assets/items/grimy-avantoe.png", quantity_text: "40-48", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Grimy toadflax", item_slug: "grimy-toadflax", item_asset_path: "assets/items/grimy-toadflax.png", quantity_text: "37-44", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Grimy kwuarm", item_slug: "grimy-kwuarm", item_asset_path: "assets/items/grimy-kwuarm.png", quantity_text: "36-43", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Grimy irit leaf", item_slug: "grimy-irit-leaf", item_asset_path: "assets/items/grimy-irit-leaf.png", quantity_text: "34-40", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Grimy ranarr weed", item_slug: "grimy-ranarr-weed", item_asset_path: "assets/items/grimy-ranarr-weed.png", quantity_text: "30-36", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Grimy snapdragon", item_slug: "grimy-snapdragon", item_asset_path: "assets/items/grimy-snapdragon.png", quantity_text: "27-32", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Grimy lantadyme", item_slug: "grimy-lantadyme", item_asset_path: "assets/items/grimy-lantadyme.png", quantity_text: "26-31", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Grimy dwarf weed", item_slug: "grimy-dwarf-weed", item_asset_path: "assets/items/grimy-dwarf-weed.png", quantity_text: "24-28", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Grimy torstol", item_slug: "grimy-torstol", item_asset_path: "assets/items/grimy-torstol.png", quantity_text: "20-24", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Battlestaff", item_slug: "battlestaff", item_asset_path: "assets/items/battlestaff.png", quantity_text: "15-18", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Mahogany seed", item_slug: "mahogany-seed", item_asset_path: "assets/items/mahogany-seed.png", quantity_text: "10-12", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Rune battleaxe", item_slug: "rune-battleaxe", item_asset_path: "assets/items/rune-battleaxe.png", quantity_text: "4", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Rune platebody", item_slug: "rune-platebody", item_asset_path: "assets/items/rune-platebody.png", quantity_text: "4", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Rune chainbody", item_slug: "rune-chainbody", item_asset_path: "assets/items/rune-chainbody.png", quantity_text: "4", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Palm tree seed", item_slug: "palm-tree-seed", item_asset_path: "assets/items/palm-tree-seed.png", quantity_text: "3", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Yew seed", item_slug: "yew-seed", item_asset_path: "assets/items/yew-seed.png", quantity_text: "3", rarity_fraction: "1/30", section: "Common rewards" },
  { item_name: "Magic seed", item_slug: "magic-seed", item_asset_path: "assets/items/magic-seed.png", quantity_text: "3", rarity_fraction: "1/30", section: "Common rewards" },
];

const EXCLUDED_REFERENCE_SLUGS = new Set([
  "dark-journal",
  "cursed-phalanx",
  "masori-crafting-kit",
  "menaphite-ornament-kit",
  "remnant-of-akkha",
  "remnant-of-ba-ba",
  "remnant-of-kephri",
  "remnant-of-zebak",
  "ancient-remnant",
  "minor-elite-scroll-case",
  "major-elite-scroll-case",
  "heavy-casket",
  "scroll-sack",
  "minor-master-scroll-case",
  "major-master-scroll-case",
  "mimic-scroll-case",
  "message-theatre-of-blood",
  "cabbage",
]);

const DYNAMIC_VISIBLE_SLUGS = new Set([
  "fossilised-dung",
  "thread-of-elidinis",
  "eye-of-the-corruptor",
  "jewel-of-the-sun",
  "breach-of-the-scarab",
  "jewel-of-amascut",
  "clue-scroll-elite",
  "tumeken-s-guardian",
  "olmlet",
  "twisted-ancestral-colour-kit",
  "metamorphic-dust",
]);

const state = {
  status: null,
  activities: [],
  filteredActivities: [],
  selectedSlug: null,
  selectedActivity: null,
  selectedVariantId: null,
  activeResultsTab: "overview",
};

const elements = {
  activityPickerTrigger: document.getElementById("activityPickerTrigger"),
  activityModal: document.getElementById("activityModal"),
  closeActivityPicker: document.getElementById("closeActivityPicker"),
  activityGrid: document.getElementById("activityGrid"),
  modalSearch: document.getElementById("modalSearch"),
  modalSupportedOnly: document.getElementById("modalSupportedOnly"),
  modalCountLabel: document.getElementById("modalCountLabel"),
  activityMeta: document.getElementById("activityMeta"),
  activityNote: document.getElementById("activityNote"),
  activityImage: document.getElementById("activityImage"),
  dropTableToggle: document.getElementById("dropTableToggle"),
  dropTableSummary: document.getElementById("dropTableSummary"),
  dropSections: document.getElementById("dropSections"),
  simulationForm: document.getElementById("simulationForm"),
  simulateButton: document.getElementById("simulateButton"),
  simulationHelp: document.getElementById("simulationHelp"),
  simulationResults: document.getElementById("simulationResults"),
  variantField: document.getElementById("variantField"),
  variantSelect: document.getElementById("variantSelect"),
  killsInput: document.getElementById("killsInput"),
  targetItem: document.getElementById("targetItem"),
  targetCount: document.getElementById("targetCount"),
  clueControls: document.getElementById("clueControls"),
  clueMimicEnabledField: document.getElementById("clueMimicEnabledField"),
  clueMimicEnabled: document.getElementById("clueMimicEnabled"),
  clueMimicAttempts: document.getElementById("clueMimicAttempts"),
  raidControls: document.getElementById("raidControls"),
  coxControls: document.getElementById("coxControls"),
  toaControls: document.getElementById("toaControls"),
  tobControls: document.getElementById("tobControls"),
  coxPersonalPoints: document.getElementById("coxPersonalPoints"),
  coxGroupPoints: document.getElementById("coxGroupPoints"),
  coxTimedCmField: document.getElementById("coxTimedCmField"),
  coxTimedCm: document.getElementById("coxTimedCm"),
  coxEliteCa: document.getElementById("coxEliteCa"),
  toaRaidLevel: document.getElementById("toaRaidLevel"),
  toaPersonalPoints: document.getElementById("toaPersonalPoints"),
  toaTeamPoints: document.getElementById("toaTeamPoints"),
  toaCompletions: document.getElementById("toaCompletions"),
  toaThreadObtained: document.getElementById("toaThreadObtained"),
  tobTeamSize: document.getElementById("tobTeamSize"),
  tobDeaths: document.getElementById("tobDeaths"),
  tobTeamDeaths: document.getElementById("tobTeamDeaths"),
  tobSkippedRooms: document.getElementById("tobSkippedRooms"),
  tobTeamSkippedRooms: document.getElementById("tobTeamSkippedRooms"),
  tobMvpBonus: document.getElementById("tobMvpBonus"),
  tobTimedHmField: document.getElementById("tobTimedHmField"),
  tobTimedHm: document.getElementById("tobTimedHm"),
};

const RAID_TYPES = {
  cox: new Set(["chambers-of-xeric", "chambers-of-xeric-challenge-mode"]),
  toa: new Set(["tombs-of-amascut", "tombs-of-amascut-expert-mode"]),
  tob: new Set(["theatre-of-blood", "theatre-of-blood-hard-mode"]),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "N/A";
  }
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercent(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "N/A";
  }
  return `${(Number(value) * 100).toFixed(digits)}%`;
}

function formatShortValue(value) {
  if (!value) {
    return "0";
  }
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(2)}b`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}m`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return formatNumber(value);
}

function assetUrl(path) {
  if (!path) {
    return "";
  }
  return `./${path.replace(/^\/+/, "")}`;
}

function getRaidType(slug) {
  if (RAID_TYPES.cox.has(slug)) return "cox";
  if (RAID_TYPES.toa.has(slug)) return "toa";
  if (RAID_TYPES.tob.has(slug)) return "tob";
  return null;
}

function getClueTier(slug) {
  if (slug === "clue-scrolls-elite" || slug === "mimic") return "elite";
  if (slug === "clue-scrolls-master") return "master";
  return null;
}

function getEffectiveClueTier(rootSlug, view = null) {
  if (rootSlug === "mimic") {
    return view?.id || state.selectedVariantId || "elite";
  }
  return getClueTier(rootSlug);
}

function getActivityTypeLabel(activity) {
  const raidType = getRaidType(activity.slug);
  if (raidType === "cox") return "Raid";
  if (raidType === "toa") return "Raid";
  if (raidType === "tob") return "Raid";
  if (activity.slug === "mimic") return "Mimic";
  if (activity.slug.startsWith("clue-scrolls-")) return "Clue casket";
  return "Boss";
}

function getActivityTileMeta(activity) {
  const rollRange = activity.simulation?.reward_roll_range;
  if (rollRange) {
    return `${rollRange.min}-${rollRange.max} rolls`;
  }
  if (activity.variants?.length) {
    return `${activity.variants.length} variants`;
  }
  const raidType = getRaidType(activity.slug);
  if (raidType) {
    return `${raidType.toUpperCase()} model`;
  }
  return activity.supported ? "Sim-ready" : "Reference only";
}

function matchesActivityFilter(activity, query) {
  if (!query) {
    return true;
  }
  const haystack = [
    activity.name,
    activity.slug,
    activity.wiki_page,
    activity.note,
    ...(activity.variants || []).flatMap((variant) => [variant.label, variant.id, variant.note]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function getRenderableRows(activity) {
  const rows = (activity.drop_rows || []).filter((row) => {
    if (!row.item_slug) {
      return false;
    }
    if (EXCLUDED_REFERENCE_SLUGS.has(row.item_slug)) {
      return false;
    }
    if (row.section === "Challenge rewards") {
      return false;
    }
    if (row.probability || row.rarity_fraction || row.rarity_percent) {
      return true;
    }
    return DYNAMIC_VISIBLE_SLUGS.has(row.item_slug) || row.rarity_fraction === "Always";
  });

  if (getRaidType(state.selectedActivity?.slug || activity.slug) === "tob") {
    return rows.concat(TOB_COMMON_ROWS);
  }
  return rows;
}

function getTargetableRows(activity) {
  const seen = new Set();
  return getRenderableRows(activity).filter((row) => {
    if (seen.has(row.item_slug)) {
      return false;
    }
    seen.add(row.item_slug);
    return true;
  });
}

function renderActivityGrid() {
  const list = state.filteredActivities;
  elements.modalCountLabel.textContent = `${formatNumber(list.length)} shown`;
  if (!list.length) {
    elements.activityGrid.innerHTML = '<div class="results-empty">No activities match the current filter.</div>';
    return;
  }

  elements.activityGrid.innerHTML = "";
  list.forEach((activity) => {
    const button = document.createElement("button");
    button.className = `activity-tile${activity.slug === state.selectedSlug ? " is-active" : ""}`;
    button.type = "button";
    const image = activity.activity_image_path
      ? `<img src="${assetUrl(activity.activity_image_path)}" alt="${escapeHtml(activity.name)} sprite">`
      : '<div class="activity-tile-fallback">No art</div>';
    button.innerHTML = `
      ${image}
      <strong>${escapeHtml(activity.name)}</strong>
      <small>${escapeHtml(getActivityTypeLabel(activity))} · ${escapeHtml(getActivityTileMeta(activity))}</small>
    `;
    button.addEventListener("click", () => selectActivity(activity.slug));
    elements.activityGrid.appendChild(button);
  });
}

function renderModalPicker() {
  const search = elements.modalSearch.value.trim().toLowerCase();
  const supportedOnly = elements.modalSupportedOnly.checked;
  state.filteredActivities = state.activities
    .filter((activity) => (!supportedOnly || (activity.supported && !activity.simulation_disabled)) && matchesActivityFilter(activity, search))
    .sort((a, b) => {
      if (a.slug === state.selectedSlug) return -1;
      if (b.slug === state.selectedSlug) return 1;
      return a.name.localeCompare(b.name);
    });
  renderActivityGrid();
}

function openActivityModal() {
  elements.activityModal.hidden = false;
  document.body.classList.add("modal-open");
  elements.modalSearch.value = "";
  elements.modalSupportedOnly.checked = false;
  renderModalPicker();
  window.requestAnimationFrame(() => {
    elements.modalSearch.focus();
  });
}

function closeActivityModal() {
  elements.activityModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function renderVariantSelector(activity) {
  const variants = activity?.variants || [];
  if (variants.length > 1) {
    elements.variantField.hidden = false;
    elements.variantSelect.innerHTML = variants
      .map((variant) => `<option value="${escapeHtml(variant.id)}">${escapeHtml(variant.label)}</option>`)
      .join("");
    state.selectedVariantId = variants.some((variant) => variant.id === state.selectedVariantId) ? state.selectedVariantId : variants[0].id;
    elements.variantSelect.value = state.selectedVariantId;
    return;
  }

  state.selectedVariantId = null;
  elements.variantField.hidden = true;
  elements.variantSelect.innerHTML = '<option value="">Default</option>';
}

function getActiveActivityView(activity = state.selectedActivity) {
  if (!activity) {
    return null;
  }
  const variants = activity.variants || [];
  if (!variants.length) {
    return activity;
  }
  return variants.find((variant) => variant.id === elements.variantSelect.value) || variants[0];
}

function renderActivityHeader(activity, view = getActiveActivityView(activity)) {
  const label = activity.name || "Select an activity";
  elements.activityPickerTrigger.textContent = label;
  elements.activityPickerTrigger.title = `Click ${label} to change the activity`;
  elements.activityPickerTrigger.setAttribute("aria-label", `Click ${label} to change the activity`);

  const chips = [
    getActivityTypeLabel(activity),
    activity.supported && !activity.simulation_disabled ? "Simulation ready" : "Reference only",
  ];

  if (activity.variants?.length) {
    chips.push(`${activity.variants.length} variants`);
  }
  if (view?.simulation?.reward_roll_range) {
    chips.push(`${view.simulation.reward_roll_range.min}-${view.simulation.reward_roll_range.max} reward rolls`);
  }
  if (getRaidType(activity.slug)) {
    chips.push("Raid-specific reward model");
  }
  if (activity.slug === "clue-scrolls-elite" || activity.slug === "clue-scrolls-master") {
    chips.push("Optional Mimic branch");
  }

  elements.activityMeta.innerHTML = chips
    .filter(Boolean)
    .map((text) => `<span class="meta-chip">${escapeHtml(text)}</span>`)
    .join("");

  const noteParts = [];
  if (activity.note) noteParts.push(activity.note);
  if (view?.note && view.note !== activity.note) noteParts.push(view.note);
  if (view?.simulation?.note && view.simulation.note !== activity.simulation?.note) noteParts.push(view.simulation.note);
  if (!noteParts.length && activity.simulation?.note) noteParts.push(activity.simulation.note);
  elements.activityNote.textContent = noteParts.join(" ");
  elements.activityNote.hidden = !elements.activityNote.textContent;

  if (activity.activity_image_path) {
    elements.activityImage.src = assetUrl(activity.activity_image_path);
    elements.activityImage.alt = `${activity.name} artwork`;
    elements.activityImage.hidden = false;
  } else {
    elements.activityImage.hidden = true;
  }
}

function setSimulationLoading(message) {
  elements.simulationResults.classList.add("is-loading");
  elements.simulationResults.innerHTML = `
    <div class="simulation-loading">
      <div class="spinner" aria-hidden="true"></div>
      <div class="loading-copy">
        <strong>${escapeHtml(message)}</strong>
        <span class="subtle">Rolling rewards and assembling the final loot review.</span>
      </div>
      <div class="loading-bars" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
}

function renderDropSections(activity) {
  const rows = getRenderableRows(activity);
  const sections = Array.from(new Set(rows.map((row) => row.section)));
  elements.dropTableSummary.textContent = rows.length
    ? `Open reference drop table (${formatNumber(sections.length)} sections)`
    : "No reference drop table available";

  if (!rows.length) {
    elements.dropSections.innerHTML = '<div class="results-empty">No reference drop rows available for this activity.</div>';
    return;
  }

  const bySection = new Map();
  rows.forEach((row) => {
    if (!bySection.has(row.section)) {
      bySection.set(row.section, []);
    }
    bySection.get(row.section).push(row);
  });

  elements.dropSections.innerHTML = "";
  for (const [section, sectionRows] of bySection.entries()) {
    const wrapper = document.createElement("section");
    wrapper.className = "drop-section";
    wrapper.innerHTML = `
      <h3>${escapeHtml(section)}</h3>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Rarity</th>
            </tr>
          </thead>
          <tbody>
            ${sectionRows
              .map((row) => {
                const image = row.item_asset_path ? `<img src="${assetUrl(row.item_asset_path)}" alt="">` : "";
                const rarity = row.rarity_fraction || row.rarity_percent || (DYNAMIC_VISIBLE_SLUGS.has(row.item_slug) ? "Dynamic" : "N/A");
                return `
                  <tr>
                    <td>
                      <div class="table-item">
                        ${image}
                        <div>
                          <strong>${escapeHtml(row.item_name)}</strong>
                          <div class="table-cell subtle">${escapeHtml(row.item_slug)}</div>
                        </div>
                      </div>
                    </td>
                    <td>${escapeHtml(row.quantity_text || "1")}</td>
                    <td>${escapeHtml(rarity)}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    `;
    elements.dropSections.appendChild(wrapper);
  }
}

function renderTargetOptions(activity) {
  const options = ['<option value="">Fixed-run simulation</option>'];
  const selectedValue = elements.targetItem.value;

  getTargetableRows(activity)
    .sort((a, b) => a.item_name.localeCompare(b.item_name))
    .forEach((row) => {
      options.push(`<option value="${escapeHtml(row.item_slug)}">${escapeHtml(row.item_name)}</option>`);
    });

  elements.targetItem.innerHTML = options.join("");
  if (selectedValue && Array.from(elements.targetItem.options).some((option) => option.value === selectedValue)) {
    elements.targetItem.value = selectedValue;
  }
}

function renderSimulationState(activity) {
  const rootSlug = state.selectedActivity.slug;
  const disabled = !activity.supported || activity.simulation_disabled;
  const raidType = getRaidType(rootSlug);
  const clueTier = getEffectiveClueTier(rootSlug, activity);
  const rollRange = activity.simulation?.reward_roll_range;

  elements.simulateButton.disabled = disabled;
  elements.targetItem.disabled = disabled;
  elements.targetCount.disabled = disabled;
  elements.killsInput.disabled = disabled;

  elements.clueControls.hidden = !clueTier;
  elements.clueMimicEnabledField.hidden = rootSlug === "mimic";
  if (clueTier) {
    elements.clueMimicAttempts.max = clueTier === "elite" ? "5" : "6";
    const maxAttempts = Number(elements.clueMimicAttempts.max);
    if (Number(elements.clueMimicAttempts.value || 1) > maxAttempts) {
      elements.clueMimicAttempts.value = "1";
    }
    if (rootSlug === "mimic") {
      elements.clueMimicEnabled.checked = true;
    }
  }

  elements.raidControls.hidden = !raidType;
  elements.coxControls.hidden = raidType !== "cox";
  elements.toaControls.hidden = raidType !== "toa";
  elements.tobControls.hidden = raidType !== "tob";
  elements.coxTimedCmField.hidden = rootSlug !== "chambers-of-xeric-challenge-mode";
  elements.tobTimedHmField.hidden = rootSlug !== "theatre-of-blood-hard-mode";

  let helpText = "Fixed-run mode rolls the selected number of completions. Choose a target item if you want the simulator to chase that drop instead.";
  if (raidType === "cox") {
    helpText = "Purple chance is driven by total raid points, then assigned by personal point share. Common chests roll two distinct items when you miss a personal purple.";
  } else if (raidType === "toa") {
    helpText = "Purple rate uses raid level and total loot points. Missing a purple gives three common chest rolls unless your personal points fall below the dung threshold.";
  } else if (raidType === "tob") {
    helpText = "ToB uses the OSRS Wiki score calculator model for personal purple chance and scaled common loot quantities.";
  } else if (rootSlug === "mimic") {
    helpText = "Each run simulates one Mimic kill with the selected attempt count controlling the quantity reduction.";
  } else if (rollRange) {
    helpText = `This activity rolls ${rollRange.min}-${rollRange.max} reward slots per completion, then layers in any tertiary rewards or Mimic bonus logic.`;
  }

  elements.simulationHelp.textContent = disabled ? activity.note || "Simulation is not available for this activity." : helpText;
}

function renderPlaceholderResults(message = "Run a simulation to see the loot review.") {
  elements.simulationResults.classList.remove("is-loading");
  elements.simulationResults.innerHTML = `<div class="results-empty">${escapeHtml(message)}</div>`;
}

function refreshSelectedActivityView(resetResults = false) {
  if (!state.selectedActivity) {
    return;
  }
  const view = getActiveActivityView(state.selectedActivity);
  renderActivityHeader(state.selectedActivity, view);
  renderDropSections(view);
  renderTargetOptions(view);
  renderSimulationState(view);
  if (resetResults) {
    renderPlaceholderResults();
  }
}

function buildMetricCard(label, value, accent = false) {
  return `
    <article class="metric-card${accent ? " metric-card-accent" : ""}">
      <span class="field-label">${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `;
}

function buildResultMeta(result) {
  const chips = [];
  if (result.mode === "target") {
    chips.push(`Target ${result.target_reached ? "completed" : "not reached"}`);
  }
  if (result.raid_model === "cox") {
    chips.push(`Unique share ${formatPercent(result.raid_context?.unique_share_chance, 2)}`);
    chips.push(`Elite clue ${formatPercent(result.raid_context?.elite_clue_chance, 2)}`);
    if (result.raid_context?.timed_cm_clear) {
      chips.push("Timed CM tertiary enabled");
    }
  } else if (result.raid_model === "toa") {
    chips.push(`Purple ${formatPercent(result.raid_context?.unique_chance, 2)}`);
    chips.push(`Your share ${formatPercent(result.raid_context?.receive_chance, 2)}`);
    chips.push(`Thread ${formatPercent(result.raid_context?.thread_chance, 1)}`);
    chips.push(`Elite clue ${formatPercent(result.raid_context?.elite_clue_chance, 1)}`);
  } else if (result.raid_model === "tob") {
    chips.push(`Your purple ${formatPercent(result.raid_context?.player_unique_chance, 2)}`);
    chips.push(`Team purple ${formatPercent(result.raid_context?.team_unique_chance, 2)}`);
    chips.push(`Score ${formatPercent(result.raid_context?.score_ratio, 1)}`);
    if (result.raid_context?.timed_hard_mode) {
      chips.push("Timed hard mode");
    }
  }
  if (result.clue_context?.mimic_enabled) {
    chips.push(`Mimic ${formatPercent(result.clue_context.mimic_chance, 2)}`);
    chips.push(`Attempt ${formatNumber(result.clue_context.mimic_attempts)}`);
  } else if (result.clue_context?.mimic_tier) {
    chips.push(`${result.clue_context.mimic_tier} mimic`);
    chips.push(`Attempt ${formatNumber(result.clue_context.mimic_attempts)}`);
  }

  if (!chips.length) {
    return "";
  }

  return `<div class="badge-row">${chips.map((chip) => `<span class="meta-chip">${escapeHtml(chip)}</span>`).join("")}</div>`;
}

function buildSectionRows(result) {
  const sections = new Map();
  (result.totals || []).forEach((item) => {
    const key = item.section || "Loot";
    const entry = sections.get(key) || { section: key, items: 0, total_ge_value: 0, quantity: 0 };
    entry.items += 1;
    entry.total_ge_value += item.total_ge_value || 0;
    entry.quantity += item.quantity || 0;
    sections.set(key, entry);
  });
  return Array.from(sections.values()).sort((a, b) => b.total_ge_value - a.total_ge_value || a.section.localeCompare(b.section));
}

function renderSimulationResults(result) {
  elements.simulationResults.classList.remove("is-loading");
  state.activeResultsTab = "overview";

  const averageValue = result.kills_completed ? Math.round((result.total_ge_value || 0) / result.kills_completed) : 0;
  const sectionRows = buildSectionRows(result);
  const topItems = (result.top_items || [])
    .map((item) => {
      const image = item.item_asset_path ? `<img src="${assetUrl(item.item_asset_path)}" alt="">` : "";
      const share = result.total_ge_value ? `${((item.total_ge_value || 0) / result.total_ge_value * 100).toFixed(1)}%` : "0.0%";
      return `
        <article class="loot-card">
          <div class="table-item">
            ${image}
            <div>
              <strong>${escapeHtml(item.item_name)}</strong>
              <div class="table-cell subtle">${escapeHtml(item.section || "Loot")}</div>
            </div>
          </div>
          <div class="loot-card-stats">
            <span>${formatNumber(item.quantity)}x</span>
            <strong>${formatShortValue(item.total_ge_value || 0)} gp</strong>
            <span>${share}</span>
          </div>
        </article>
      `;
    })
    .join("");

  const sectionCards = sectionRows
    .slice(0, 8)
    .map((section) => {
      const share = result.total_ge_value ? `${((section.total_ge_value || 0) / result.total_ge_value * 100).toFixed(1)}%` : "0.0%";
      return `
        <article class="section-card">
          <span class="field-label">${escapeHtml(section.section)}</span>
          <strong>${formatShortValue(section.total_ge_value || 0)} gp</strong>
          <div class="section-card-meta">
            <span>${formatNumber(section.items)} items</span>
            <span>${share}</span>
          </div>
        </article>
      `;
    })
    .join("");

  const lootRows = (result.totals || [])
    .map((item) => {
      const image = item.item_asset_path ? `<img src="${assetUrl(item.item_asset_path)}" alt="">` : "";
      const share = result.total_ge_value ? `${((item.total_ge_value || 0) / result.total_ge_value * 100).toFixed(1)}%` : "0.0%";
      return `
        <tr>
          <td>
            <div class="table-item">
              ${image}
              <div>
                <strong>${escapeHtml(item.item_name)}</strong>
                <div class="table-cell subtle">${escapeHtml(item.section || "Loot")}</div>
              </div>
            </div>
          </td>
          <td>${formatNumber(item.quantity)}</td>
          <td>${escapeHtml(share)}</td>
          <td>${item.total_ge_value ? formatNumber(item.total_ge_value) : "N/A"}</td>
        </tr>
      `;
    })
    .join("");

  const notableRows = (result.notable_drops || [])
    .map((drop) => `
      <article class="notable-item">
        <div>
          <strong>${escapeHtml(drop.item_name)}</strong>
          <div class="subtle">${escapeHtml(drop.section || "Loot")}</div>
        </div>
        <div class="notable-meta">
          <span>Run ${formatNumber(drop.kill)}</span>
          <span>${formatNumber(drop.quantity)}x</span>
          <span>${escapeHtml(drop.rarity_fraction || "Notable")}</span>
        </div>
      </article>
    `)
    .join("");

  elements.simulationResults.innerHTML = `
    <div class="results-shell">
      <div class="metric-grid">
        ${buildMetricCard("Runs", formatNumber(result.kills_completed))}
        ${buildMetricCard("Total value", `${formatShortValue(result.total_ge_value || 0)} gp`, true)}
        ${buildMetricCard("Value / run", `${formatShortValue(averageValue)} gp`)}
        ${buildMetricCard("Distinct items", formatNumber(result.distinct_items))}
      </div>

      ${buildResultMeta(result)}

      <div class="results-tabs" role="tablist" aria-label="Loot review tabs">
        <button class="results-tab is-active" type="button" data-results-tab="overview">Overview</button>
        <button class="results-tab" type="button" data-results-tab="loot">Loot table</button>
        <button class="results-tab" type="button" data-results-tab="highlights">Highlights</button>
      </div>

      <section class="results-tab-panel is-active" data-tab-panel="overview">
        <div class="overview-grid">
          <div class="review-card">
            <div class="review-card-header">
              <h3>Top loot</h3>
              <span class="subtle">End-state value, not per-run spam</span>
            </div>
            <div class="loot-card-grid">
              ${topItems || '<div class="results-empty">No loot recorded.</div>'}
            </div>
          </div>

          <div class="review-card">
            <div class="review-card-header">
              <h3>Section breakdown</h3>
              <span class="subtle">Where the value came from</span>
            </div>
            <div class="section-card-grid">
              ${sectionCards || '<div class="results-empty">No section data recorded.</div>'}
            </div>
          </div>
        </div>

        ${
          result.mode === "target"
            ? `
              <div class="review-note">
                <strong>Target chase</strong>
                <span>The run stopped after ${formatNumber(result.kills_completed)} completions because the target ${result.target_reached ? "was reached" : "was not reached before the cap"}.</span>
              </div>
            `
            : ""
        }

        ${
          result.note
            ? `
              <div class="review-note">
                <strong>Model note</strong>
                <span>${escapeHtml(result.note)}</span>
              </div>
            `
            : ""
        }
      </section>

      <section class="results-tab-panel" data-tab-panel="loot" hidden>
        <div class="review-card">
          <div class="review-card-header">
            <h3>Full loot table</h3>
            <span class="subtle">Sorted by total value across the completed simulation</span>
          </div>
          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Share</th>
                  <th>Total GP</th>
                </tr>
              </thead>
              <tbody>${lootRows || '<tr><td colspan="4">No loot recorded.</td></tr>'}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="results-tab-panel" data-tab-panel="highlights" hidden>
        <div class="review-card">
          <div class="review-card-header">
            <h3>Notable drops</h3>
            <span class="subtle">Rare rolls, uniques, pets, and high-value hits</span>
          </div>
          <div class="notable-list">
            ${notableRows || '<div class="results-empty">No notable drops recorded in this run.</div>'}
          </div>
        </div>
      </section>
    </div>
  `;
}

function setResultsTab(tabId) {
  state.activeResultsTab = tabId;
  elements.simulationResults.querySelectorAll("[data-results-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.resultsTab === tabId);
  });
  elements.simulationResults.querySelectorAll("[data-tab-panel]").forEach((panel) => {
    const active = panel.dataset.tabPanel === tabId;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
}

async function selectActivity(slug) {
  state.selectedSlug = slug;
  renderActivityGrid();
  elements.dropTableToggle.open = false;
  if (window.scrollY > 120) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  setSimulationLoading("Loading activity data...");

  try {
    const activity = await getJson(`./data/activities/${slug}.json`);
    state.selectedActivity = activity;
    renderVariantSelector(activity);
    refreshSelectedActivityView(false);
    renderPlaceholderResults();
    closeActivityModal();
  } catch (error) {
    renderPlaceholderResults(error.message || "Failed to load activity data.");
  }
}

async function loadApp() {
  state.status = await getJson("./data/index.json");
  state.activities = state.status.activities || [];
  state.filteredActivities = state.activities.slice();
  renderModalPicker();

  const preferred =
    state.activities.find((activity) => activity.supported && !activity.simulation_disabled) ||
    state.activities.find((activity) => activity.supported) ||
    state.activities[0];

  if (preferred) {
    await selectActivity(preferred.slug);
  }
}

elements.activityPickerTrigger.addEventListener("click", openActivityModal);
elements.closeActivityPicker.addEventListener("click", closeActivityModal);
elements.activityModal.addEventListener("click", (event) => {
  if (event.target.matches("[data-modal-close]")) {
    closeActivityModal();
  }
});

elements.modalSearch.addEventListener("input", renderModalPicker);
elements.modalSupportedOnly.addEventListener("change", renderModalPicker);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !elements.activityModal.hidden) {
    closeActivityModal();
  }
});

elements.variantSelect.addEventListener("change", () => {
  state.selectedVariantId = elements.variantSelect.value || null;
  refreshSelectedActivityView(true);
});

elements.simulationResults.addEventListener("click", (event) => {
  const button = event.target.closest("[data-results-tab]");
  if (!button) {
    return;
  }
  setResultsTab(button.dataset.resultsTab);
});

elements.simulationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.selectedActivity) {
    return;
  }

  const activityView = getActiveActivityView(state.selectedActivity);
  const rootSlug = state.selectedActivity.slug;
  const payload = {
    ...activityView,
    slug: rootSlug,
    supported: activityView.supported ?? state.selectedActivity.supported,
    simulation_disabled: activityView.simulation_disabled ?? state.selectedActivity.simulation_disabled,
  };

  if (state.selectedVariantId) {
    payload.variant_id = state.selectedVariantId;
  }

  const options = {
    kills: Number(elements.killsInput.value || 0),
    target_item_slug: elements.targetItem.value || null,
    target_count: Number(elements.targetCount.value || 1),
  };

  const clueTier = getEffectiveClueTier(rootSlug, activityView);
  if (clueTier) {
    options.clue_mimic_attempts = Number(elements.clueMimicAttempts.value || 1);
    if (rootSlug !== "mimic") {
      options.clue_mimic_enabled = elements.clueMimicEnabled.checked;
    }
  }

  const raidType = getRaidType(rootSlug);
  if (raidType === "cox") {
    options.cox_personal_points = Number(elements.coxPersonalPoints.value || 0);
    options.cox_group_points = Number(elements.coxGroupPoints.value || 0);
    options.cox_timed_cm = elements.coxTimedCm.checked;
    options.cox_elite_ca = elements.coxEliteCa.checked;
  } else if (raidType === "toa") {
    options.toa_raid_level = Number(elements.toaRaidLevel.value || 0);
    options.toa_personal_points = Number(elements.toaPersonalPoints.value || 0);
    options.toa_team_points = Number(elements.toaTeamPoints.value || 0);
    options.toa_completions = Number(elements.toaCompletions.value || 0);
    options.toa_thread_obtained = elements.toaThreadObtained.checked;
  } else if (raidType === "tob") {
    options.tob_team_size = Number(elements.tobTeamSize.value || 0);
    options.tob_deaths = Number(elements.tobDeaths.value || 0);
    options.tob_team_deaths = Number(elements.tobTeamDeaths.value || 0);
    options.tob_skipped_rooms = Number(elements.tobSkippedRooms.value || 0);
    options.tob_team_skipped_rooms = Number(elements.tobTeamSkippedRooms.value || 0);
    options.tob_mvp_bonus = Number(elements.tobMvpBonus.value || 0);
    options.tob_timed_hm = elements.tobTimedHm.checked;
  }

  setSimulationLoading("Rolling loot...");
  await new Promise((resolve) => window.setTimeout(resolve, 220));

  try {
    const result = simulateActivity(payload, options);
    renderSimulationResults(result);
  } catch (error) {
    renderPlaceholderResults(error.message || "Simulation failed.");
  }
});

loadApp().catch((error) => {
  console.error(error);
  elements.activityGrid.innerHTML = '<div class="results-empty">The app could not load the cached data files.</div>';
  renderPlaceholderResults("The app could not load the cached data files.");
});
