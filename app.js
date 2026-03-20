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

const MAX_SIM_CAP = 25000000;
const GP_COMPARISON_SAMPLE_COUNT = 3;
const GP_COMPARISON_SAMPLE_COUNT_HIGH_VALUE = 2;
const GP_COMPARISON_SAMPLE_COUNT_ULTRA_VALUE = 1;
const GP_COMPARISON_HIGH_VALUE_THRESHOLD = 250000000;
const GP_COMPARISON_ULTRA_VALUE_THRESHOLD = 1000000000;
const GP_MODE_EXCLUDED_SLUGS = new Set([
  "barrows-chests",
  "lunar-chests",
  "the-gauntlet",
  "the-corrupted-gauntlet",
  "tempoross",
  "wintertodt",
  "zalcano",
  "tztok-jad",
  "tzkal-zuk",
]);
const activityCache = new Map();

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
  simulationMode: "fixed",
  paneView: "setup",
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
  sourceLink: document.getElementById("sourceLink"),
  activityImage: document.getElementById("activityImage"),
  simulationForm: document.getElementById("simulationForm"),
  setupStage: document.getElementById("setupStage"),
  resultsStage: document.getElementById("resultsStage"),
  runSummary: document.getElementById("runSummary"),
  simulateButton: document.getElementById("simulateButton"),
  simulateButtonLabel: document.getElementById("simulateButtonLabel"),
  simulationHelp: document.getElementById("simulationHelp"),
  simulationResults: document.getElementById("simulationResults"),
  resultsContext: document.getElementById("resultsContext"),
  resultsCapture: document.getElementById("resultsCapture"),
  resultActions: document.getElementById("resultActions"),
  runAgainButton: document.getElementById("runAgainButton"),
  goBackButton: document.getElementById("goBackButton"),
  screenshotButton: document.getElementById("screenshotButton"),
  modeFixedButton: document.getElementById("modeFixedButton"),
  modeTargetButton: document.getElementById("modeTargetButton"),
  modeGpButton: document.getElementById("modeGpButton"),
  variantField: document.getElementById("variantField"),
  variantSelect: document.getElementById("variantSelect"),
  killsField: document.getElementById("killsField"),
  killsInput: document.getElementById("killsInput"),
  targetItemField: document.getElementById("targetItemField"),
  targetItem: document.getElementById("targetItem"),
  targetCountField: document.getElementById("targetCountField"),
  targetCount: document.getElementById("targetCount"),
  targetGpField: document.getElementById("targetGpField"),
  targetGpValue: document.getElementById("targetGpValue"),
  encounterSettings: document.getElementById("encounterSettings"),
  encounterSettingsSummary: document.querySelector("#encounterSettings summary"),
  clueControls: document.getElementById("clueControls"),
  clueMimicEnabledField: document.getElementById("clueMimicEnabledField"),
  clueMimicEnabled: document.getElementById("clueMimicEnabled"),
  clueMimicAttemptsField: document.getElementById("clueMimicAttemptsField"),
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

const CLUE_UI_DETAILS = {
  "clue-scrolls-beginner": {
    rewardRolls: "1-3 rewards",
    helpText: "Beginner caskets roll 1-3 reward slots and do not have master clue or Mimic bonus rolls.",
  },
  "clue-scrolls-easy": {
    rewardRolls: "2-4 rewards",
    tertiary: "Master clue 1/50",
    helpText: "Easy caskets roll 2-4 reward slots and add an independent 1/50 master clue roll outside the base reward slots.",
  },
  "clue-scrolls-medium": {
    rewardRolls: "3-5 rewards",
    tertiary: "Master clue 1/30",
    helpText: "Medium caskets roll 3-5 reward slots and add an independent 1/30 master clue roll outside the base reward slots.",
  },
  "clue-scrolls-hard": {
    rewardRolls: "4-6 rewards",
    tertiary: "Master clue 1/15",
    helpText: "Hard caskets roll 4-6 reward slots and add an independent 1/15 master clue roll outside the base reward slots.",
  },
  "clue-scrolls-elite": {
    rewardRolls: "4-6 rewards",
    tertiary: "Master clue 1/5",
    mimic: "Mimic casket 1/35",
    helpText: "Elite caskets roll 4-6 reward slots, add an independent 1/5 master clue roll, and can optionally add a bonus 1/35 Mimic casket.",
  },
  "clue-scrolls-master": {
    rewardRolls: "5-7 rewards",
    tertiary: "Bloodhound 1/1,000",
    mimic: "Mimic casket 1/15",
    helpText: "Master caskets roll 5-7 reward slots, add an independent 1/1,000 Bloodhound roll, and can optionally add a bonus 1/15 Mimic casket.",
  },
  mimic: {
    helpText: "A Mimic kill adds one bonus reward bundle on top of the original elite or master clue reward rolls. The attempt count controls the quantity reduction.",
  },
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

function clampRuns(value) {
  const numeric = Math.floor(Number(value) || 0);
  return Math.min(MAX_SIM_CAP, Math.max(1, numeric));
}

function clampGpTarget(value) {
  const numeric = Math.floor(Number(value) || 0);
  return Math.max(1, numeric);
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

function getClueUiDetails(slug) {
  return CLUE_UI_DETAILS[slug] || null;
}

function getGpComparisonSampleCount(targetGpValue) {
  const value = Math.max(0, Number(targetGpValue) || 0);
  if (value >= GP_COMPARISON_ULTRA_VALUE_THRESHOLD) {
    return GP_COMPARISON_SAMPLE_COUNT_ULTRA_VALUE;
  }
  if (value >= GP_COMPARISON_HIGH_VALUE_THRESHOLD) {
    return GP_COMPARISON_SAMPLE_COUNT_HIGH_VALUE;
  }
  return GP_COMPARISON_SAMPLE_COUNT;
}

function isGpComparisonEligible(activity) {
  if (!activity?.supported || activity?.simulation_disabled) {
    return false;
  }
  if (activity.slug?.startsWith("clue-scrolls-") || activity.slug === "mimic") {
    return false;
  }
  if (getRaidType(activity.slug)) {
    return false;
  }
  return !GP_MODE_EXCLUDED_SLUGS.has(activity.slug);
}

function getGpEligibleActivities() {
  return state.activities.filter(isGpComparisonEligible);
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

async function loadActivityData(slug) {
  if (activityCache.has(slug)) {
    return activityCache.get(slug);
  }
  const activity = await getJson(`./data/activities/${slug}.json`);
  activityCache.set(slug, activity);
  return activity;
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
  elements.activityPickerTrigger.textContent = "Select item";
  elements.activityPickerTrigger.title = `Current activity: ${label}. Click to change the activity.`;
  elements.activityPickerTrigger.setAttribute("aria-label", `Current activity: ${label}. Click to change the activity.`);

  const chips = state.simulationMode === "gp"
    ? [
        "GP comparison",
        `${formatNumber(getGpEligibleActivities().length)} eligible bosses`,
        "Kill-based only",
      ]
    : [
        getActivityTypeLabel(activity),
        activity.supported && !activity.simulation_disabled ? "Simulation ready" : "Reference only",
      ];

  if (state.simulationMode !== "gp") {
    if (activity.variants?.length) {
      chips.push(`${activity.variants.length} variants`);
    }
    if (view?.simulation?.reward_roll_range) {
      chips.push(`${view.simulation.reward_roll_range.min}-${view.simulation.reward_roll_range.max} reward rolls`);
    }
    if (getRaidType(activity.slug)) {
      chips.push("Raid-specific reward model");
    }
    const clueUiDetails = getClueUiDetails(activity.slug);
    if (clueUiDetails?.tertiary) {
      chips.push(clueUiDetails.tertiary);
    }
    if (clueUiDetails?.mimic) {
      chips.push(`Optional ${clueUiDetails.mimic}`);
    }
  }

  elements.activityMeta.innerHTML = chips
    .filter(Boolean)
    .map((text) => `<span class="meta-chip">${escapeHtml(text)}</span>`)
    .join("");

  const noteParts = [];
  if (state.simulationMode !== "gp") {
    if (activity.note) noteParts.push(activity.note);
    if (view?.note && view.note !== activity.note) noteParts.push(view.note);
    if (view?.simulation?.note && view.simulation.note !== activity.simulation?.note) noteParts.push(view.simulation.note);
    if (!noteParts.length && activity.simulation?.note) noteParts.push(activity.simulation.note);
  }
  elements.activityNote.textContent = noteParts.join(" ");
  elements.activityNote.hidden = !elements.activityNote.textContent;

  const sourceHref = view?.wiki_url || activity.wiki_url || "#";
  elements.sourceLink.href = sourceHref;
  elements.sourceLink.hidden = state.simulationMode === "gp" || !sourceHref || sourceHref === "#";

  if (activity.activity_image_path) {
    elements.activityImage.src = assetUrl(activity.activity_image_path);
    elements.activityImage.alt = `${activity.name} artwork`;
    elements.activityImage.hidden = false;
  } else {
    elements.activityImage.hidden = true;
  }
}

function showSetupStage() {
  state.paneView = "setup";
  elements.setupStage.hidden = false;
  elements.resultsStage.hidden = true;
}

function showResultsStage(showActions = true) {
  state.paneView = "results";
  elements.setupStage.hidden = true;
  elements.resultsStage.hidden = false;
  elements.resultActions.hidden = !showActions;
}

function buildResultsContext(result = null) {
  const activity = state.selectedActivity;
  const isGpMode = result?.mode === "gp" || state.simulationMode === "gp";

  if (isGpMode) {
    const chips = [
      result?.target_gp_value ? `${formatShortValue(result.target_gp_value)} gp target` : null,
      result?.boss_count ? `${formatNumber(result.boss_count)} bosses ranked` : null,
      result?.sample_count ? `${formatNumber(result.sample_count)} samples / boss` : null,
    ]
      .filter(Boolean)
      .map((text) => `<span class="meta-chip">${escapeHtml(text)}</span>`)
      .join("");

    return `
      <article class="results-context-card">
        <span class="eyebrow">Result Scope</span>
        <h4>GP target comparison</h4>
        <div class="meta-row">${chips}</div>
      </article>
    `;
  }

  const image = activity?.activity_image_path
    ? `<img src="${assetUrl(activity.activity_image_path)}" alt="${escapeHtml(activity.name)} artwork">`
    : '<div class="results-context-fallback">?</div>';
  const chips = [
    state.simulationMode === "target" ? "Target chase" : "Attempts",
    state.selectedVariantId ? (getActiveActivityView(activity)?.label || state.selectedVariantId) : null,
  ]
    .filter(Boolean)
    .map((text) => `<span class="meta-chip">${escapeHtml(text)}</span>`)
    .join("");

  return `
    <article class="results-context-card results-context-activity">
      <div class="results-context-art">${image}</div>
      <div class="results-context-copy">
        <span class="eyebrow">Activity</span>
        <h4>${escapeHtml(activity?.name || "Selected activity")}</h4>
        <div class="meta-row">${chips}</div>
      </div>
    </article>
  `;
}

async function downloadResultsScreenshot() {
  if (!elements.resultsCapture) {
    return;
  }

  if (typeof window.html2canvas !== "function") {
    window.print();
    return;
  }

  const canvas = await window.html2canvas(elements.resultsCapture, {
    backgroundColor: "#0d1217",
    scale: Math.max(2, Math.min(3, window.devicePixelRatio || 1)),
    useCORS: true,
  });
  const link = document.createElement("a");
  const baseName = state.simulationMode === "gp" ? "osrs-gp-comparison" : (state.selectedActivity?.slug || "osrs-drop-sim");
  link.download = `${baseName}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function setSimulationLoading(message, detail = "Rolling rewards and assembling the final loot review.") {
  showResultsStage(false);
  elements.resultsContext.innerHTML = buildResultsContext();
  setRunButtonState(true);
  elements.simulationResults.classList.add("is-loading");
  elements.simulationResults.innerHTML = `
    <div class="simulation-loading">
      <div class="spinner" aria-hidden="true"></div>
      <div class="loading-copy">
        <strong>${escapeHtml(message)}</strong>
        <span class="subtle">${escapeHtml(detail)}</span>
      </div>
      <div class="loading-bars" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
}

function renderTargetOptions(activity) {
  const options = ['<option value="">Select a target item</option>'];
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

function setSimulationMode(mode) {
  state.simulationMode = ["fixed", "target", "gp"].includes(mode) ? mode : "fixed";
  const isFixedMode = state.simulationMode === "fixed";
  const isTargetMode = state.simulationMode === "target";
  const isGpMode = state.simulationMode === "gp";
  elements.modeFixedButton.classList.toggle("is-active", isFixedMode);
  elements.modeTargetButton.classList.toggle("is-active", isTargetMode);
  elements.modeGpButton.classList.toggle("is-active", isGpMode);
  elements.modeFixedButton.setAttribute("aria-selected", String(isFixedMode));
  elements.modeTargetButton.setAttribute("aria-selected", String(isTargetMode));
  elements.modeGpButton.setAttribute("aria-selected", String(isGpMode));
  elements.killsField.hidden = !isFixedMode;
  elements.targetItemField.hidden = !isTargetMode;
  elements.targetCountField.hidden = !isTargetMode;
  elements.targetGpField.hidden = !isGpMode;
  showSetupStage();

  if (state.selectedActivity) {
    refreshSelectedActivityView(false);
  }
}

function renderSimulationState(activity) {
  const rootSlug = state.selectedActivity.slug;
  const raidType = getRaidType(rootSlug);
  const clueTier = getEffectiveClueTier(rootSlug, activity);
  const clueUiDetails = getClueUiDetails(rootSlug);
  const rollRange = activity.simulation?.reward_roll_range;
  const isFixedMode = state.simulationMode === "fixed";
  const isTargetMode = state.simulationMode === "target";
  const isGpMode = state.simulationMode === "gp";
  const disabled = isGpMode ? getGpEligibleActivities().length === 0 : (!activity.supported || activity.simulation_disabled);
  const hasEncounterSettings = !isGpMode && Boolean(clueTier || raidType);
  const hasVariantOptions = (state.selectedActivity?.variants || []).length > 1;

  elements.simulateButton.disabled = disabled;
  elements.variantField.hidden = isGpMode || !hasVariantOptions;
  elements.killsField.hidden = !isFixedMode;
  elements.targetItemField.hidden = !isTargetMode;
  elements.targetCountField.hidden = !isTargetMode;
  elements.targetGpField.hidden = !isGpMode;
  elements.targetItem.disabled = disabled || !isTargetMode;
  elements.targetCount.disabled = disabled || !isTargetMode;
  elements.targetGpValue.disabled = disabled || !isGpMode;
  elements.killsInput.disabled = disabled || !isFixedMode;
  elements.killsInput.max = String(MAX_SIM_CAP);
  elements.killsInput.value = String(clampRuns(elements.killsInput.value || 1));
  elements.targetCount.value = String(Math.max(1, Math.floor(Number(elements.targetCount.value || 1))));
  elements.targetGpValue.value = String(clampGpTarget(elements.targetGpValue.value || 1));

  elements.encounterSettings.hidden = !hasEncounterSettings;
  if (!hasEncounterSettings) {
    elements.encounterSettings.open = false;
  }
  if (hasEncounterSettings) {
    let summary = "Encounter settings";
    if (raidType === "cox") {
      summary = "Encounter settings: points and challenge modifiers";
    } else if (raidType === "toa") {
      summary = "Encounter settings: raid level and loot points";
    } else if (raidType === "tob") {
      summary = "Encounter settings: team score and hard mode modifiers";
    } else if (rootSlug === "mimic") {
      summary = "Encounter settings: Mimic attempt";
    } else if (clueTier) {
      summary = "Encounter settings: optional Mimic casket";
    }
    elements.encounterSettingsSummary.textContent = summary;
  }

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
  elements.clueMimicAttemptsField.hidden = !clueTier || (rootSlug !== "mimic" && !elements.clueMimicEnabled.checked);

  elements.raidControls.hidden = !raidType;
  elements.coxControls.hidden = raidType !== "cox";
  elements.toaControls.hidden = raidType !== "toa";
  elements.tobControls.hidden = raidType !== "tob";
  elements.coxTimedCmField.hidden = rootSlug !== "chambers-of-xeric-challenge-mode";
  elements.tobTimedHmField.hidden = rootSlug !== "theatre-of-blood-hard-mode";

  let helpText = "Attempts mode rolls the selected number of completions and shows the final end-state loot.";
  if (isTargetMode) {
    helpText = `Target mode keeps rolling until the selected item count is reached or the cap of ${formatNumber(MAX_SIM_CAP)} attempts is hit.`;
  } else if (isGpMode) {
    helpText = `GP target mode compares ${formatNumber(getGpEligibleActivities().length)} kill-based bosses and ranks the median simulated KC needed to reach ${formatNumber(clampGpTarget(elements.targetGpValue.value || 1))} gp. Raids, clues, chest runs, wave encounters, and other non-standard kill loops are excluded.`;
  }
  if (!isGpMode && raidType === "cox") {
    helpText = `${helpText} Open encounter settings to tune point share, CM timing, and clue rate.`;
  } else if (!isGpMode && raidType === "toa") {
    helpText = `${helpText} Open encounter settings to set raid level and loot points.`;
  } else if (!isGpMode && raidType === "tob") {
    helpText = `${helpText} Open encounter settings to set team size, deaths, and hard mode timing.`;
  } else if (!isGpMode && clueUiDetails && rootSlug !== "mimic") {
    helpText = `${helpText} ${clueUiDetails.helpText}`;
  } else if (!isGpMode && rootSlug === "mimic") {
    helpText = `${helpText} ${CLUE_UI_DETAILS.mimic.helpText} Open encounter settings to adjust the Mimic attempts used.`;
  } else if (!isGpMode && rollRange) {
    helpText = `${helpText} This activity rolls ${rollRange.min}-${rollRange.max} reward slots per completion.`;
  }

  elements.simulationHelp.textContent = disabled
    ? (isGpMode ? "No eligible kill-based bosses are available for GP comparison." : activity.note || "Simulation is not available for this activity.")
    : helpText;
}

function buildSummaryCard(label, value) {
  return `
    <article class="summary-card">
      <span class="field-label">${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `;
}

function setRunButtonState(running) {
  elements.simulateButton.classList.toggle("is-running", running);
  elements.simulateButton.setAttribute("aria-busy", String(running));
  elements.simulateButtonLabel.textContent = running ? "Rolling loot..." : "Run simulation";
  if (running) {
    elements.simulateButton.disabled = true;
    return;
  }
  if (!state.selectedActivity) {
    elements.simulateButton.disabled = true;
    return;
  }
  renderSimulationState(getActiveActivityView(state.selectedActivity));
}

function collectSimulationPayloadAndOptions() {
  if (!state.selectedActivity) {
    return null;
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
    kills: state.simulationMode === "fixed" ? clampRuns(elements.killsInput.value || 1) : 1,
    target_item_slug: state.simulationMode === "target" ? elements.targetItem.value || null : null,
    target_count: state.simulationMode === "target" ? Math.max(1, Math.floor(Number(elements.targetCount.value || 1))) : 1,
    target_gp_value: state.simulationMode === "gp" ? clampGpTarget(elements.targetGpValue.value || 1) : null,
    max_chase_kills: MAX_SIM_CAP,
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

  return { activityView, rootSlug, payload, options };
}

function renderRunSummary() {
  const data = collectSimulationPayloadAndOptions();
  if (!data) {
    elements.runSummary.innerHTML = "";
    return;
  }

  const { activityView, rootSlug, options } = data;
  const isGpMode = state.simulationMode === "gp";
  const cards = [
    buildSummaryCard(isGpMode ? "Scope" : "Activity", isGpMode ? "All eligible bosses" : state.selectedActivity.name),
    state.selectedVariantId && !isGpMode ? buildSummaryCard("Variant", activityView.label || state.selectedVariantId) : "",
    buildSummaryCard("Mode", state.simulationMode === "target" ? "Target chase" : (isGpMode ? "GP target" : "Attempts")),
  ];

  if (state.simulationMode === "target") {
    cards.push(buildSummaryCard("Target", elements.targetItem.selectedOptions[0]?.textContent || "Choose an item"));
    cards.push(buildSummaryCard("Target count", formatNumber(options.target_count)));
    cards.push(buildSummaryCard("Chase cap", formatNumber(MAX_SIM_CAP)));
  } else if (isGpMode) {
    cards.push(buildSummaryCard("Target value", `${formatShortValue(options.target_gp_value || 0)} gp`));
    cards.push(buildSummaryCard("Boss pool", formatNumber(getGpEligibleActivities().length)));
    cards.push(buildSummaryCard("Kill cap", formatNumber(MAX_SIM_CAP)));
  } else {
    cards.push(buildSummaryCard("Attempts", formatNumber(options.kills)));
  }

  if (!isGpMode) {
    const clueUiDetails = getClueUiDetails(rootSlug);
    if (clueUiDetails?.rewardRolls) {
      cards.push(buildSummaryCard("Reward rolls", clueUiDetails.rewardRolls));
    }
    if (clueUiDetails?.tertiary) {
      cards.push(buildSummaryCard("Extra roll", clueUiDetails.tertiary));
    }

    if (rootSlug === "mimic" || rootSlug === "clue-scrolls-elite" || rootSlug === "clue-scrolls-master") {
      cards.push(buildSummaryCard("Mimic attempt", formatNumber(options.clue_mimic_attempts || 1)));
      if (rootSlug !== "mimic") {
        cards.push(buildSummaryCard("Mimic branch", options.clue_mimic_enabled ? "Enabled" : "Disabled"));
        if (options.clue_mimic_enabled && clueUiDetails?.mimic) {
          cards.push(buildSummaryCard("Mimic chance", clueUiDetails.mimic));
        }
      }
    }

    const raidType = getRaidType(rootSlug);
    if (raidType === "cox") {
      cards.push(buildSummaryCard("Your points", formatNumber(options.cox_personal_points)));
      cards.push(buildSummaryCard("Team points", formatNumber(options.cox_group_points)));
    } else if (raidType === "toa") {
      cards.push(buildSummaryCard("Raid level", formatNumber(options.toa_raid_level)));
      cards.push(buildSummaryCard("Your loot points", formatNumber(options.toa_personal_points)));
      cards.push(buildSummaryCard("Team loot points", formatNumber(options.toa_team_points)));
    } else if (raidType === "tob") {
      cards.push(buildSummaryCard("Team size", formatNumber(options.tob_team_size)));
      cards.push(buildSummaryCard("Your deaths", formatNumber(options.tob_deaths)));
      cards.push(buildSummaryCard("Team deaths", formatNumber(options.tob_team_deaths)));
    }
  }

  elements.runSummary.innerHTML = cards.filter(Boolean).join("");
}

function renderPlaceholderResults(message = "Run a simulation to see the loot review.") {
  elements.simulationResults.classList.remove("is-loading");
  elements.resultsContext.innerHTML = "";
  elements.simulationResults.innerHTML = `<div class="results-empty">${escapeHtml(message)}</div>`;
}

function refreshSelectedActivityView(resetResults = false) {
  if (!state.selectedActivity) {
    return;
  }
  const view = getActiveActivityView(state.selectedActivity);
  renderActivityHeader(state.selectedActivity, view);
  renderTargetOptions(view);
  renderSimulationState(view);
  renderRunSummary();
  if (resetResults) {
    showSetupStage();
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

function buildGpRankRow(entry, index, maxKillsForScale) {
  const image = entry.activity_image_path ? `<img src="${assetUrl(entry.activity_image_path)}" alt="">` : '<div class="gp-rank-sprite-fallback">?</div>';
  const fillPercent = entry.capped
    ? 100
    : Math.max(8, Math.min(100, ((entry.median_kills || 0) / Math.max(1, maxKillsForScale || 1)) * 100));
  const killsLabel = entry.capped ? `${formatNumber(MAX_SIM_CAP)}+ kc` : `${formatNumber(entry.median_kills)} kc`;
  const rangeLabel = entry.min_kills === entry.max_kills
    ? `Sample ${formatNumber(entry.min_kills)}`
    : `Range ${formatNumber(entry.min_kills)}-${formatNumber(entry.max_kills)}`;

  return `
    <article class="gp-rank-row${entry.capped ? " is-capped" : ""}">
      <div class="gp-rank-heading">
        <span class="gp-rank-position">${formatNumber(index + 1)}</span>
        <div class="gp-rank-sprite">${image}</div>
        <div class="gp-rank-copy">
          <strong>${escapeHtml(entry.name)}</strong>
          <span>${escapeHtml(rangeLabel)} · ${formatShortValue(entry.avg_gp_per_kill || 0)} gp / kill</span>
        </div>
        <div class="gp-rank-kc">${escapeHtml(killsLabel)}</div>
      </div>
      <div class="gp-rank-bar">
        <span class="gp-rank-fill" style="width: ${fillPercent.toFixed(2)}%"></span>
      </div>
    </article>
  `;
}

function renderGpComparisonResults(result) {
  showResultsStage(true);
  elements.simulationResults.classList.remove("is-loading");
  elements.resultsContext.innerHTML = buildResultsContext(result);
  const rankings = result.rankings || [];
  const best = rankings[0] || null;
  const uncapped = rankings.filter((entry) => !entry.capped);
  const scaleMax = (uncapped.length ? uncapped[uncapped.length - 1].median_kills : (rankings.length ? rankings[rankings.length - 1].median_kills : 1)) || 1;
  const chartRows = rankings
    .map((entry, index) => buildGpRankRow(entry, index, scaleMax))
    .join("");

  elements.simulationResults.innerHTML = `
    <div class="results-shell gp-results-shell">
      <div class="metric-grid">
        ${buildMetricCard("Target value", `${formatShortValue(result.target_gp_value || 0)} gp`, true)}
        ${buildMetricCard("Bosses ranked", formatNumber(result.boss_count || rankings.length))}
        ${buildMetricCard("Samples / boss", formatNumber(result.sample_count || 0))}
        ${buildMetricCard("Fastest median", best ? `${formatNumber(best.median_kills)} kc` : "N/A")}
      </div>

      <div class="review-note">
        <strong>GP comparison mode</strong>
        <span>Ranked by median simulated KC to the target GP value. Only standard kill-based bosses are included.</span>
      </div>

      <div class="review-card gp-chart-card">
        <div class="review-card-header">
          <h3>Boss KC ranking</h3>
          <span class="subtle">Lowest simulated KC first, highest last</span>
        </div>
        <div class="gp-rank-list">
          ${chartRows || '<div class="results-empty">No eligible bosses were available for GP comparison.</div>'}
        </div>
      </div>
    </div>
  `;
}

function renderSimulationResults(result) {
  showResultsStage(true);
  elements.simulationResults.classList.remove("is-loading");
  elements.resultsContext.innerHTML = buildResultsContext(result);
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

async function runGpComparison(targetGpValue) {
  const eligibleActivities = getGpEligibleActivities().sort((a, b) => a.name.localeCompare(b.name));
  const sampleCount = getGpComparisonSampleCount(targetGpValue);
  const rankings = [];

  for (let index = 0; index < eligibleActivities.length; index += 1) {
    const summary = eligibleActivities[index];
    setSimulationLoading(
      `Comparing bosses ${formatNumber(index + 1)} / ${formatNumber(eligibleActivities.length)}...`,
      `Running ${formatNumber(sampleCount)} simulated GP chase${sampleCount === 1 ? "" : "s"} per boss and ranking the median KC.`,
    );

    const activity = await loadActivityData(summary.slug);
    const samples = [];
    let totalKills = 0;
    let totalValue = 0;

    for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
      const result = simulateActivity(activity, {
        kills: 1,
        target_gp_value: targetGpValue,
        max_chase_kills: MAX_SIM_CAP,
        seed: `gp:${summary.slug}:${targetGpValue}:${sampleIndex}`,
      });
      samples.push(result.kills_completed || 0);
      totalKills += result.kills_completed || 0;
      totalValue += result.total_ge_value || 0;
    }

    samples.sort((a, b) => a - b);
    const medianKills = samples[Math.floor(samples.length / 2)] || MAX_SIM_CAP;
    rankings.push({
      slug: summary.slug,
      name: summary.name,
      activity_image_path: summary.activity_image_path || activity.activity_image_path || null,
      median_kills: medianKills,
      min_kills: samples[0] || medianKills,
      max_kills: samples[samples.length - 1] || medianKills,
      avg_gp_per_kill: totalKills > 0 ? Math.round(totalValue / totalKills) : 0,
      capped: medianKills >= MAX_SIM_CAP,
    });

    if ((index + 1) % 4 === 0) {
      await new Promise((resolve) => window.setTimeout(resolve, 0));
    }
  }

  rankings.sort((a, b) => {
    if (a.capped !== b.capped) {
      return a.capped ? 1 : -1;
    }
    if (a.median_kills !== b.median_kills) {
      return a.median_kills - b.median_kills;
    }
    return a.name.localeCompare(b.name);
  });

  return {
    mode: "gp",
    target_gp_value: targetGpValue,
    boss_count: rankings.length,
    sample_count: sampleCount,
    rankings,
  };
}

async function selectActivity(slug) {
  state.selectedSlug = slug;
  renderActivityGrid();
  showSetupStage();
  renderPlaceholderResults("Run simulation to see the loot review.");

  try {
    const activity = await loadActivityData(slug);
    state.selectedActivity = activity;
    elements.encounterSettings.open = false;
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
  showSetupStage();
  refreshSelectedActivityView(true);
});

elements.modeFixedButton.addEventListener("click", () => {
  setSimulationMode("fixed");
});

elements.modeTargetButton.addEventListener("click", () => {
  setSimulationMode("target");
});

elements.modeGpButton.addEventListener("click", () => {
  setSimulationMode("gp");
});

["input", "change"].forEach((eventName) => {
  elements.simulationForm.addEventListener(eventName, (event) => {
    if (event.target === elements.simulateButton) {
      return;
    }
    if (event.target === elements.killsInput) {
      const cleaned = clampRuns(elements.killsInput.value || 1);
      if (String(cleaned) !== elements.killsInput.value && eventName === "change") {
        elements.killsInput.value = String(cleaned);
      }
    }
    if (event.target === elements.targetCount) {
      const cleaned = Math.max(1, Math.floor(Number(elements.targetCount.value || 1)));
      if (String(cleaned) !== elements.targetCount.value && eventName === "change") {
        elements.targetCount.value = String(cleaned);
      }
    }
    if (event.target === elements.targetGpValue) {
      const cleaned = clampGpTarget(elements.targetGpValue.value || 1);
      if (String(cleaned) !== elements.targetGpValue.value && eventName === "change") {
        elements.targetGpValue.value = String(cleaned);
      }
    }
    if (state.selectedActivity) {
      showSetupStage();
      renderSimulationState(getActiveActivityView(state.selectedActivity));
    }
    renderRunSummary();
  });
});

elements.simulationResults.addEventListener("click", (event) => {
  const button = event.target.closest("[data-results-tab]");
  if (!button) {
    return;
  }
  setResultsTab(button.dataset.resultsTab);
});

elements.runAgainButton.addEventListener("click", () => {
  elements.simulationForm.requestSubmit();
});

elements.goBackButton.addEventListener("click", () => {
  showSetupStage();
});

elements.screenshotButton.addEventListener("click", async () => {
  try {
    await downloadResultsScreenshot();
  } catch (error) {
    console.error(error);
  }
});

elements.simulationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.selectedActivity) {
    return;
  }

  const data = collectSimulationPayloadAndOptions();
  if (!data) {
    return;
  }
  if (state.simulationMode === "target" && !data.options.target_item_slug) {
    elements.simulationHelp.textContent = "Choose a target item before running a target chase.";
    elements.targetItem.focus();
    return;
  }
  if (state.simulationMode === "gp" && !(data.options.target_gp_value > 0)) {
    elements.simulationHelp.textContent = "Enter a GP target before running the boss comparison.";
    elements.targetGpValue.focus();
    return;
  }
  const { payload, options } = data;

  if (state.simulationMode === "gp") {
    setSimulationLoading("Preparing boss comparison...", "Loading eligible boss data and setting up the GP chase ranking.");
  } else {
    setSimulationLoading("Rolling loot...");
  }
  await new Promise((resolve) => window.setTimeout(resolve, 220));

  try {
    if (state.simulationMode === "gp") {
      const result = await runGpComparison(options.target_gp_value);
      renderGpComparisonResults(result);
    } else {
      const result = simulateActivity(payload, options);
      renderSimulationResults(result);
    }
  } catch (error) {
    showSetupStage();
    elements.simulationHelp.textContent = error.message || "Simulation failed.";
    renderPlaceholderResults(error.message || "Simulation failed.");
  } finally {
    setRunButtonState(false);
  }
});

setSimulationMode(state.simulationMode);
setRunButtonState(false);
showSetupStage();

loadApp().catch((error) => {
  console.error(error);
  elements.activityGrid.innerHTML = '<div class="results-empty">The app could not load the cached data files.</div>';
  renderPlaceholderResults("The app could not load the cached data files.");
});
