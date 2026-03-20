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
const TARGET_COMPARISON_SAMPLE_COUNT = 3;
const GP_COMPARISON_SAMPLE_COUNT_HIGH_VALUE = 2;
const GP_COMPARISON_SAMPLE_COUNT_ULTRA_VALUE = 1;
const GP_COMPARISON_HIGH_VALUE_THRESHOLD = 250000000;
const GP_COMPARISON_ULTRA_VALUE_THRESHOLD = 1000000000;
const THEME_STORAGE_KEY = "osrs-drop-sim-theme-v1";
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
let targetItemCatalogPromise = null;

const DEFAULT_THEME = {
  bg: "#0d1217",
  shell: "#11181f",
  panel: "#131a21",
  panelSoft: "#18212a",
  panelSoftest: "#0f151c",
  text: "#edf2f7",
  muted: "#9eacbb",
  accent: "#d8bc72",
  accentStrong: "#f0ddb0",
};

const THEME_CSS_VAR_MAP = {
  bg: "--bg",
  shell: "--shell",
  panel: "--panel",
  panelSoft: "--panel-soft",
  panelSoftest: "--panel-softest",
  text: "--text",
  muted: "--muted",
  accent: "--accent",
  accentStrong: "--accent-strong",
};

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
  targetItems: [],
  filteredTargetItems: [],
  selectedSlug: null,
  selectedActivity: null,
  selectedTargetItemSlug: null,
  selectedTargetItem: null,
  selectedVariantId: null,
  activeResultsTab: "overview",
  activeGpRankingSlug: null,
  simulationMode: null,
  paneView: "setup",
  lastResult: null,
  pickerMode: "activity",
  savedTheme: { ...DEFAULT_THEME },
  themeDraft: { ...DEFAULT_THEME },
};

const elements = {
  openThemeButton: document.getElementById("openThemeButton"),
  activityPickerTrigger: document.getElementById("activityPickerTrigger"),
  activityModal: document.getElementById("activityModal"),
  activityModalTitle: document.getElementById("activityModalTitle"),
  closeActivityPicker: document.getElementById("closeActivityPicker"),
  activityGrid: document.getElementById("activityGrid"),
  modalSearch: document.getElementById("modalSearch"),
  modalSupportedOnly: document.getElementById("modalSupportedOnly"),
  modalCountLabel: document.getElementById("modalCountLabel"),
  modalHintLabel: document.getElementById("modalHintLabel"),
  comparisonLootModal: document.getElementById("comparisonLootModal"),
  comparisonLootModalTitle: document.getElementById("comparisonLootModalTitle"),
  comparisonLootModalBody: document.getElementById("comparisonLootModalBody"),
  closeComparisonLootModal: document.getElementById("closeComparisonLootModal"),
  themeModal: document.getElementById("themeModal"),
  closeThemeModal: document.getElementById("closeThemeModal"),
  saveThemeButton: document.getElementById("saveThemeButton"),
  resetThemeButton: document.getElementById("resetThemeButton"),
  activitySelectionBlock: document.getElementById("activitySelectionBlock"),
  activityDetailsBlock: document.getElementById("activityDetailsBlock"),
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
  advancedModifiers: document.getElementById("advancedModifiers"),
  advancedModifiersSummary: document.querySelector("#advancedModifiers summary"),
  clueControls: document.getElementById("clueControls"),
  clueMimicEnabledField: document.getElementById("clueMimicEnabledField"),
  clueMimicEnabled: document.getElementById("clueMimicEnabled"),
  clueMimicAttemptsField: document.getElementById("clueMimicAttemptsField"),
  clueMimicAttempts: document.getElementById("clueMimicAttempts"),
  raidControls: document.getElementById("raidControls"),
  yamaAdvancedControls: document.getElementById("yamaAdvancedControls"),
  coxAdvancedControls: document.getElementById("coxAdvancedControls"),
  toaAdvancedControls: document.getElementById("toaAdvancedControls"),
  yamaEliteCa: document.getElementById("yamaEliteCa"),
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
  toaOwnedEye: document.getElementById("toaOwnedEye"),
  toaOwnedSun: document.getElementById("toaOwnedSun"),
  toaOwnedScarab: document.getElementById("toaOwnedScarab"),
  toaOwnedAmascut: document.getElementById("toaOwnedAmascut"),
  tobTeamSize: document.getElementById("tobTeamSize"),
  tobDeaths: document.getElementById("tobDeaths"),
  tobTeamDeaths: document.getElementById("tobTeamDeaths"),
  tobSkippedRooms: document.getElementById("tobSkippedRooms"),
  tobTeamSkippedRooms: document.getElementById("tobTeamSkippedRooms"),
  tobMvpBonus: document.getElementById("tobMvpBonus"),
  tobTimedHmField: document.getElementById("tobTimedHmField"),
  tobTimedHm: document.getElementById("tobTimedHm"),
  themeInputs: Array.from(document.querySelectorAll("[data-theme-key]")),
  themeValueLabels: Array.from(document.querySelectorAll("[data-theme-value]")),
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

function isValidHexColor(value) {
  return /^#[0-9a-f]{6}$/i.test(String(value || "").trim());
}

function hexToRgb(hex) {
  const normalized = String(hex || "").replace("#", "");
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function toRgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function normalizeTheme(theme) {
  const nextTheme = { ...DEFAULT_THEME };
  Object.keys(DEFAULT_THEME).forEach((key) => {
    if (isValidHexColor(theme?.[key])) {
      nextTheme[key] = String(theme[key]).toLowerCase();
    }
  });
  return nextTheme;
}

function applyTheme(theme) {
  const normalizedTheme = normalizeTheme(theme);
  const root = document.documentElement;
  Object.entries(THEME_CSS_VAR_MAP).forEach(([key, cssVar]) => {
    root.style.setProperty(cssVar, normalizedTheme[key]);
  });
  root.style.setProperty("--panel-border", toRgba(normalizedTheme.text, 0.08));
  root.style.setProperty("--panel-border-strong", toRgba(normalizedTheme.accent, 0.34));
  root.style.setProperty("--shadow", `0 14px 28px rgba(0, 0, 0, 0.22)`);
}

function saveTheme(theme) {
  const normalizedTheme = normalizeTheme(theme);
  window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(normalizedTheme));
  state.savedTheme = { ...normalizedTheme };
}

function loadSavedTheme() {
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_THEME };
    }
    return normalizeTheme(JSON.parse(raw));
  } catch (error) {
    console.error(error);
    return { ...DEFAULT_THEME };
  }
}

function updateThemeValueLabels(theme) {
  elements.themeValueLabels.forEach((label) => {
    const key = label.dataset.themeValue;
    label.textContent = String(theme?.[key] || DEFAULT_THEME[key] || "").toUpperCase();
  });
}

function populateThemeInputs(theme) {
  const normalizedTheme = normalizeTheme(theme);
  elements.themeInputs.forEach((input) => {
    const key = input.dataset.themeKey;
    input.value = normalizedTheme[key];
  });
  updateThemeValueLabels(normalizedTheme);
}

function readThemeInputs() {
  const theme = {};
  elements.themeInputs.forEach((input) => {
    theme[input.dataset.themeKey] = input.value;
  });
  return normalizeTheme(theme);
}

function clampRuns(value) {
  const numeric = Math.floor(Number(value) || 0);
  return Math.min(MAX_SIM_CAP, Math.max(1, numeric));
}

function clampGpTarget(value) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return null;
  }
  const numeric = Math.floor(Number(value));
  if (!Number.isFinite(numeric)) {
    return null;
  }
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

function getToaOwnedJewelsFromInputs() {
  return [
    elements.toaOwnedEye.checked ? "eye-of-the-corruptor" : null,
    elements.toaOwnedSun.checked ? "jewel-of-the-sun" : null,
    elements.toaOwnedScarab.checked ? "breach-of-the-scarab" : null,
    elements.toaOwnedAmascut.checked ? "jewel-of-amascut" : null,
  ].filter(Boolean);
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

function requiresActivitySelection(mode = state.simulationMode) {
  return mode === "fixed";
}

function requiresItemSelection(mode = state.simulationMode) {
  return mode === "target";
}

function renderSetupProgress() {
  const hasMode = Boolean(state.simulationMode);
  const needsActivity = requiresActivitySelection();
  const needsItem = requiresItemSelection();
  const hasSelection = needsActivity
    ? Boolean(state.selectedActivity)
    : (needsItem ? Boolean(state.selectedTargetItem) : true);
  elements.activitySelectionBlock.hidden = !hasMode || (!needsActivity && !needsItem);
  elements.activityDetailsBlock.hidden = !hasMode || !hasSelection;
  if (state.simulationMode === "gp") {
    elements.activityDetailsBlock.hidden = !hasMode;
  }
}

function matchesTargetItemFilter(entry, query) {
  if (!query) {
    return true;
  }
  const haystack = [
    entry.item_name,
    entry.item_slug,
    ...entry.activities.map((activity) => activity.name),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

async function ensureTargetItemCatalogLoaded() {
  if (state.targetItems.length) {
    return state.targetItems;
  }
  if (targetItemCatalogPromise) {
    return targetItemCatalogPromise;
  }

  targetItemCatalogPromise = (async () => {
    const itemMap = new Map();
    const eligibleActivities = getGpEligibleActivities().sort((a, b) => a.name.localeCompare(b.name));

    for (const summary of eligibleActivities) {
      const activity = await loadActivityData(summary.slug);
      getTargetableRows(activity).forEach((row) => {
        const existing = itemMap.get(row.item_slug) || {
          item_slug: row.item_slug,
          item_name: row.item_name,
          item_asset_path: row.item_asset_path || null,
          activities: [],
        };
        if (!existing.activities.some((entry) => entry.slug === summary.slug)) {
          existing.activities.push({
            slug: summary.slug,
            name: summary.name,
            activity_image_path: summary.activity_image_path || activity.activity_image_path || null,
          });
        }
        if (!existing.item_asset_path && row.item_asset_path) {
          existing.item_asset_path = row.item_asset_path;
        }
        itemMap.set(row.item_slug, existing);
      });
    }

    state.targetItems = Array.from(itemMap.values())
      .map((entry) => ({
        ...entry,
        activity_count: entry.activities.length,
        activities: entry.activities.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.item_name.localeCompare(b.item_name));
    state.filteredTargetItems = state.targetItems.slice();

    if (state.selectedTargetItemSlug) {
      state.selectedTargetItem = state.targetItems.find((entry) => entry.item_slug === state.selectedTargetItemSlug) || null;
    }

    return state.targetItems;
  })();

  try {
    return await targetItemCatalogPromise;
  } finally {
    targetItemCatalogPromise = null;
  }
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
    if (row.section === "Contract") {
      return false;
    }
    if (activity.slug === "yama" && row.section === "Junk") {
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

function renderTargetItemGrid() {
  const list = state.filteredTargetItems;
  elements.modalCountLabel.textContent = `${formatNumber(list.length)} shown`;
  if (!list.length) {
    elements.activityGrid.innerHTML = '<div class="results-empty">No items match the current filter.</div>';
    return;
  }

  elements.activityGrid.innerHTML = "";
  list.forEach((entry) => {
    const button = document.createElement("button");
    button.className = `activity-tile${entry.item_slug === state.selectedTargetItemSlug ? " is-active" : ""}`;
    button.type = "button";
    const image = entry.item_asset_path
      ? `<img src="${assetUrl(entry.item_asset_path)}" alt="${escapeHtml(entry.item_name)} sprite">`
      : '<div class="activity-tile-fallback">No art</div>';
    const activityNames = entry.activities.slice(0, 2).map((activity) => activity.name);
    const overflowCount = Math.max(0, entry.activity_count - activityNames.length);
    const sourceText = `${formatNumber(entry.activity_count)} ${entry.activity_count === 1 ? "boss" : "bosses"}${activityNames.length ? ` · ${activityNames.join(", ")}${overflowCount ? ` +${overflowCount}` : ""}` : ""}`;
    button.innerHTML = `
      ${image}
      <strong>${escapeHtml(entry.item_name)}</strong>
      <small>${escapeHtml(sourceText)}</small>
    `;
    button.addEventListener("click", () => selectTargetItem(entry.item_slug));
    elements.activityGrid.appendChild(button);
  });
}

function configureModalForCurrentMode() {
  const supportedToggle = elements.modalSupportedOnly.closest("label");
  if (state.pickerMode === "item") {
    elements.activityModalTitle.textContent = "Select an item";
    elements.modalSearch.placeholder = "Search items, uniques, pets, or supplies";
    elements.modalHintLabel.textContent = "Choose a sprite to compare only the bosses that can drop it";
    if (supportedToggle) {
      supportedToggle.hidden = true;
    }
    elements.modalSupportedOnly.checked = false;
    return;
  }

  elements.activityModalTitle.textContent = "Select an activity";
  elements.modalSearch.placeholder = "Search bosses, raids, clues, or Mimic";
  elements.modalHintLabel.textContent = "Choose a sprite to load the simulator";
  if (supportedToggle) {
    supportedToggle.hidden = false;
  }
}

function renderModalLoading(message) {
  elements.modalCountLabel.textContent = "Loading...";
  elements.activityGrid.innerHTML = `<div class="results-empty">${escapeHtml(message)}</div>`;
}

async function renderModalPicker() {
  configureModalForCurrentMode();
  const search = elements.modalSearch.value.trim().toLowerCase();
  if (state.pickerMode === "item") {
    await ensureTargetItemCatalogLoaded();
    state.filteredTargetItems = state.targetItems
      .filter((entry) => matchesTargetItemFilter(entry, search))
      .sort((a, b) => {
        if (a.item_slug === state.selectedTargetItemSlug) return -1;
        if (b.item_slug === state.selectedTargetItemSlug) return 1;
        return a.item_name.localeCompare(b.item_name);
      });
    renderTargetItemGrid();
    return;
  }

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

async function openActivityModal() {
  state.pickerMode = state.simulationMode === "target" ? "item" : "activity";
  elements.activityModal.hidden = false;
  syncModalState();
  elements.modalSearch.value = "";
  elements.modalSupportedOnly.checked = false;
  configureModalForCurrentMode();
  if (state.pickerMode === "item" && !state.targetItems.length) {
    renderModalLoading("Loading the global item catalog for eligible bosses...");
  }
  await renderModalPicker();
  window.requestAnimationFrame(() => {
    elements.modalSearch.focus();
  });
}

function closeActivityModal() {
  elements.activityModal.hidden = true;
  syncModalState();
}

function syncModalState() {
  const anyModalOpen = !elements.activityModal.hidden || !elements.comparisonLootModal.hidden || !elements.themeModal.hidden;
  document.body.classList.toggle("modal-open", anyModalOpen);
}

function closeComparisonLootModal() {
  elements.comparisonLootModal.hidden = true;
  syncModalState();
}

function openThemeModal() {
  state.themeDraft = { ...state.savedTheme };
  populateThemeInputs(state.themeDraft);
  elements.themeModal.hidden = false;
  syncModalState();
  window.requestAnimationFrame(() => {
    elements.themeInputs[0]?.focus();
  });
}

function closeThemeModal(options = {}) {
  const { revert = true } = options;
  if (revert) {
    applyTheme(state.savedTheme);
    populateThemeInputs(state.savedTheme);
    state.themeDraft = { ...state.savedTheme };
  }
  elements.themeModal.hidden = true;
  syncModalState();
}

function saveThemeDraft() {
  state.themeDraft = readThemeInputs();
  applyTheme(state.themeDraft);
  saveTheme(state.themeDraft);
  closeThemeModal({ revert: false });
}

function resetThemeDraft() {
  state.themeDraft = { ...DEFAULT_THEME };
  populateThemeInputs(state.themeDraft);
  applyTheme(state.themeDraft);
}

function getComparisonDetailMeta(entry, result) {
  const preview = entry?.preview_result || null;
  const averageValue = preview?.kills_completed ? Math.round((preview.total_ge_value || 0) / preview.kills_completed) : 0;
  const isGpMode = result?.mode === "gp";
  const title = isGpMode ? `${entry?.name || "Boss"} loot preview` : `${entry?.name || "Boss"} chase preview`;
  const subtitle = isGpMode
    ? "Representative sample from the median GP chase run for this boss"
    : `Representative sample from the median ${formatNumber(result?.target_count || 1)}x ${result?.target_item_name || "item"} chase for this boss`;
  const primaryMetricLabel = isGpMode ? "KC to target" : "Median chase KC";
  return { preview, averageValue, title, subtitle, primaryMetricLabel };
}

function openComparisonLootModal(slug) {
  const result = state.lastResult;
  if (!result || (result.mode !== "gp" && result.mode !== "target_compare")) {
    return;
  }
  const entry = (result.rankings || []).find((row) => row.slug === slug);
  if (!entry) {
    return;
  }

  const detail = getComparisonDetailMeta(entry, result);
  elements.comparisonLootModalTitle.textContent = detail.title;
  elements.comparisonLootModalBody.innerHTML = buildComparisonLootDetail(entry, result, { includeTitle: false });
  elements.comparisonLootModal.hidden = false;
  syncModalState();
  window.requestAnimationFrame(() => {
    elements.closeComparisonLootModal.focus();
  });
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
  const isGpMode = state.simulationMode === "gp";
  const isTargetMode = state.simulationMode === "target";
  const targetItem = state.selectedTargetItem;
  const buttonLabel = isTargetMode ? "Select item" : "Select boss";
  const currentLabel = isTargetMode
    ? (targetItem?.item_name || "Select an item")
    : (activity?.name || "Select a boss");

  elements.activityPickerTrigger.textContent = buttonLabel;
  elements.activityPickerTrigger.title = `${currentLabel}. Click to change it.`;
  elements.activityPickerTrigger.setAttribute("aria-label", `${currentLabel}. Click to change it.`);

  if (isGpMode) {
    const chips = [
      "GP comparison",
      `${formatNumber(getGpEligibleActivities().length)} eligible bosses`,
      "Kill-based only",
    ];
    elements.activityMeta.innerHTML = chips.map((text) => `<span class="meta-chip">${escapeHtml(text)}</span>`).join("");
    elements.activityNote.textContent = "Enter a GP target and rank the eligible kill-based bosses by median simulated KC.";
    elements.activityNote.hidden = false;
    elements.sourceLink.href = "#";
    elements.sourceLink.hidden = true;
    elements.activityImage.removeAttribute("src");
    elements.activityImage.alt = "";
    elements.activityImage.hidden = true;
    return;
  }

  if (isTargetMode) {
    const chips = targetItem
      ? [
          "Drop comparison",
          `${formatNumber(targetItem.activity_count)} ${targetItem.activity_count === 1 ? "boss" : "bosses"} can drop this item`,
          `Cap ${formatNumber(MAX_SIM_CAP)} kc`,
        ]
      : ["Drop comparison", "Choose an item to begin"];
    elements.activityMeta.innerHTML = chips
      .filter(Boolean)
      .map((text) => `<span class="meta-chip">${escapeHtml(text)}</span>`)
      .join("");
    elements.activityNote.textContent = targetItem
      ? "This mode compares only the kill-based bosses that can drop the selected item and ranks them by median simulated KC."
      : "Pick an item to compare only the bosses that can drop it.";
    elements.activityNote.hidden = false;
    elements.sourceLink.href = "#";
    elements.sourceLink.hidden = true;
    if (targetItem?.item_asset_path) {
      elements.activityImage.src = assetUrl(targetItem.item_asset_path);
      elements.activityImage.alt = `${targetItem.item_name} sprite`;
      elements.activityImage.hidden = false;
    } else {
      elements.activityImage.removeAttribute("src");
      elements.activityImage.alt = "";
      elements.activityImage.hidden = true;
    }
    return;
  }

  if (!activity) {
    elements.activityMeta.innerHTML = "";
    elements.activityNote.textContent = "";
    elements.activityNote.hidden = true;
    elements.sourceLink.href = "#";
    elements.sourceLink.hidden = true;
    elements.activityImage.removeAttribute("src");
    elements.activityImage.alt = "";
    elements.activityImage.hidden = true;
    return;
  }

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
  const clueUiDetails = getClueUiDetails(activity.slug);
  if (clueUiDetails?.tertiary) {
    chips.push(clueUiDetails.tertiary);
  }
  if (clueUiDetails?.mimic) {
    chips.push(`Optional ${clueUiDetails.mimic}`);
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

  const sourceHref = view?.wiki_url || activity.wiki_url || "#";
  elements.sourceLink.href = sourceHref;
  elements.sourceLink.hidden = !sourceHref || sourceHref === "#";

  if (activity.activity_image_path) {
    elements.activityImage.src = assetUrl(activity.activity_image_path);
    elements.activityImage.alt = `${activity.name} artwork`;
    elements.activityImage.hidden = false;
  } else {
    elements.activityImage.removeAttribute("src");
    elements.activityImage.alt = "";
    elements.activityImage.hidden = true;
  }
}

function showSetupStage() {
  state.paneView = "setup";
  elements.setupStage.hidden = false;
  elements.resultsStage.hidden = true;
  closeComparisonLootModal();
  renderSetupProgress();
}

function showResultsStage(showActions = true) {
  state.paneView = "results";
  elements.setupStage.hidden = true;
  elements.resultsStage.hidden = false;
  elements.resultActions.hidden = !showActions;
}

function buildResultsContext(result = null) {
  const activity = state.selectedActivity;
  const targetItem = result?.mode === "target_compare"
    ? {
        item_name: result.target_item_name,
        item_asset_path: result.target_item_asset_path,
      }
    : state.selectedTargetItem;
  const isGpMode = result?.mode === "gp" || state.simulationMode === "gp";
  const isTargetComparison = result?.mode === "target_compare" || state.simulationMode === "target";

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

  if (isTargetComparison) {
    const image = targetItem?.item_asset_path
      ? `<img src="${assetUrl(targetItem.item_asset_path)}" alt="${escapeHtml(targetItem.item_name)} sprite">`
      : '<div class="results-context-fallback">?</div>';
    const chips = [
      "Drop comparison",
      result?.boss_count ? `${formatNumber(result.boss_count)} bosses ranked` : (targetItem?.activity_count ? `${formatNumber(targetItem.activity_count)} bosses can drop this` : null),
      result?.target_count ? `${formatNumber(result.target_count)}x target` : null,
    ]
      .filter(Boolean)
      .map((text) => `<span class="meta-chip">${escapeHtml(text)}</span>`)
      .join("");

    return `
      <article class="results-context-card results-context-activity">
        <div class="results-context-art">${image}</div>
        <div class="results-context-copy">
          <span class="eyebrow">Target Item</span>
          <h4>${escapeHtml(targetItem?.item_name || "Selected item")}</h4>
          <div class="meta-row">${chips}</div>
        </div>
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

function escapeSvgText(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildScreenshotCardSvg() {
  const result = state.lastResult;
  if (!result) {
    return null;
  }

  const width = 1200;
  const height = 760;
  const lineHeight = 34;
  const cardWidth = 268;
  const title = "OSRS Drop Simulator";
  const subtitle = result.mode === "gp"
    ? `GP target comparison · ${formatShortValue(result.target_gp_value || 0)} gp`
    : result.mode === "target_compare"
      ? `${result.target_item_name || "Selected item"} · drop comparison`
      : `${state.selectedActivity?.name || "Selected activity"} · ${result.mode === "target" ? "Target chase" : "Attempts"}`;

  const metricCards = result.mode === "gp"
    ? [
        ["Target value", `${formatShortValue(result.target_gp_value || 0)} gp`],
        ["Bosses ranked", formatNumber(result.boss_count || 0)],
        ["Samples / boss", formatNumber(result.sample_count || 0)],
        ["Fastest median", result.rankings?.[0] ? `${formatNumber(result.rankings[0].median_kills)} kc` : "N/A"],
      ]
    : result.mode === "target_compare"
      ? [
          ["Target item", result.target_item_name || "N/A"],
          ["Target count", `${formatNumber(result.target_count || 0)}x`],
          ["Bosses ranked", formatNumber(result.boss_count || 0)],
          ["Fastest median", result.rankings?.[0] ? `${formatNumber(result.rankings[0].median_kills)} kc` : "N/A"],
        ]
    : [
        ["Runs", formatNumber(result.kills_completed || 0)],
        ["Total value", `${formatShortValue(result.total_ge_value || 0)} gp`],
        ["Value / run", `${formatShortValue(result.kills_completed ? Math.round((result.total_ge_value || 0) / result.kills_completed) : 0)} gp`],
        ["Distinct items", formatNumber(result.distinct_items || 0)],
      ];

  const metricSvg = metricCards.map(([label, value], index) => {
    const x = 44 + (index * (cardWidth + 16));
    return `
      <g transform="translate(${x} 124)">
        <rect width="${cardWidth}" height="96" fill="#111923" stroke="rgba(255,255,255,0.10)" />
        <text x="18" y="32" fill="#d8bc72" font-size="14" font-weight="600">${escapeSvgText(label)}</text>
        <text x="18" y="66" fill="#edf2f7" font-size="26" font-weight="700">${escapeSvgText(value)}</text>
      </g>
    `;
  }).join("");

  const rows = result.mode === "gp" || result.mode === "target_compare"
    ? (result.rankings || []).slice(0, 10).map((entry, index) => ({
        left: `${index + 1}. ${entry.name}`,
        right: entry.capped ? `${formatNumber(25000000)}+ kc` : `${formatNumber(entry.median_kills)} kc`,
        sub: result.mode === "gp"
          ? `${formatShortValue(entry.avg_gp_per_kill || 0)} gp / kill`
          : `${formatNumber(result.target_count || 1)}x ${result.target_item_name || "target"} chase`,
      }))
    : (result.top_items || []).slice(0, 10).map((item) => ({
        left: item.item_name,
        right: `${formatNumber(item.quantity)}x`,
        sub: `${formatShortValue(item.total_ge_value || 0)} gp`,
      }));

  const rowsSvg = rows.map((row, index) => {
    const y = 312 + (index * lineHeight);
    return `
      <g transform="translate(44 ${y})">
        <line x1="0" y1="22" x2="1112" y2="22" stroke="rgba(255,255,255,0.08)" />
        <text x="0" y="18" fill="#edf2f7" font-size="18" font-weight="600">${escapeSvgText(row.left)}</text>
        <text x="1112" y="18" text-anchor="end" fill="#edf2f7" font-size="18" font-weight="700">${escapeSvgText(row.right)}</text>
        <text x="0" y="38" fill="#9eacbb" font-size="14">${escapeSvgText(row.sub)}</text>
      </g>
    `;
  }).join("");

  const footer = result.mode === "gp"
    ? "Ranked by median simulated KC across eligible standard bosses."
    : result.mode === "target_compare"
      ? `Ranked by median simulated KC across bosses that can drop ${result.target_item_name || "the selected item"}.`
    : (result.mode === "target"
      ? `Target ${result.target_reached ? "reached" : "not reached before the cap"}.`
      : "End-state loot summary.");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="#0d1217" />
      <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="#131a21" stroke="rgba(255,255,255,0.10)" />
      <text x="44" y="68" fill="#f0ddb0" font-size="30" font-weight="700">${escapeSvgText(title)}</text>
      <text x="44" y="98" fill="#9eacbb" font-size="18">${escapeSvgText(subtitle)}</text>
      ${metricSvg}
      <text x="44" y="276" fill="#d8bc72" font-size="16" font-weight="600">${escapeSvgText(result.mode === "gp" || result.mode === "target_compare" ? "KC ranking" : "Top loot")}</text>
      ${rowsSvg}
      <text x="44" y="${height - 54}" fill="#9eacbb" font-size="14">${escapeSvgText(footer)}</text>
    </svg>
  `;

  return {
    svg,
    width,
    height,
    filename: result.mode === "gp"
      ? "osrs-gp-comparison"
      : result.mode === "target_compare"
        ? `osrs-item-comparison-${result.target_item_slug || "target"}`
        : (state.selectedActivity?.slug || "osrs-drop-sim"),
  };
}

async function renderSvgToPngDataUrl(svgMarkup, width, height) {
  const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    const loaded = new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });
    image.src = url;
    await loaded;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Screenshot rendering is unavailable in this browser.");
    }
    context.fillStyle = "#0d1217";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function downloadResultsScreenshot() {
  const screenshotCard = buildScreenshotCardSvg();
  if (!screenshotCard) {
    return;
  }

  const previewWindow = window.open("", "_blank");
  const dataUrl = await renderSvgToPngDataUrl(screenshotCard.svg, screenshotCard.width, screenshotCard.height);
  const link = document.createElement("a");
  link.download = `${screenshotCard.filename}.png`;
  link.href = dataUrl;
  link.click();

  if (previewWindow) {
    previewWindow.document.title = `${screenshotCard.filename}.png`;
    previewWindow.document.body.style.margin = "0";
    previewWindow.document.body.style.background = "#0d1217";
    previewWindow.document.body.innerHTML = `<img src="${dataUrl}" alt="Simulation screenshot" style="display:block;max-width:100%;height:auto;margin:0 auto;">`;
  }
}

function setSimulationLoading(message, detail = "Rolling rewards and assembling the final loot review.") {
  showResultsStage(false);
  closeComparisonLootModal();
  state.lastResult = null;
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

function getSetupActivityView() {
  return state.simulationMode === "fixed" ? getActiveActivityView(state.selectedActivity) : null;
}

function setSimulationMode(mode) {
  state.simulationMode = ["fixed", "target", "gp"].includes(mode) ? mode : null;
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
  elements.targetItemField.hidden = true;
  elements.targetCountField.hidden = !isTargetMode;
  elements.targetGpField.hidden = !isGpMode;
  if (isTargetMode) {
    void ensureTargetItemCatalogLoaded();
  }
  showSetupStage();
  refreshSelectedActivityView(false);
}

function renderSimulationState(activity) {
  const isFixedMode = state.simulationMode === "fixed";
  const isTargetMode = state.simulationMode === "target";
  const isGpMode = state.simulationMode === "gp";
  const modeChosen = Boolean(state.simulationMode);
  const selectedTargetItem = state.selectedTargetItem;

  elements.killsInput.max = String(MAX_SIM_CAP);

  if (!modeChosen) {
    elements.simulateButton.disabled = true;
    elements.variantField.hidden = true;
    elements.killsField.hidden = true;
    elements.targetItemField.hidden = true;
    elements.targetCountField.hidden = true;
    elements.targetGpField.hidden = true;
    elements.encounterSettings.hidden = true;
    elements.encounterSettings.open = false;
    elements.advancedModifiers.hidden = true;
    elements.advancedModifiers.open = false;
    elements.clueControls.hidden = true;
    elements.raidControls.hidden = true;
    elements.yamaAdvancedControls.hidden = true;
    elements.coxAdvancedControls.hidden = true;
    elements.toaAdvancedControls.hidden = true;
    elements.targetItem.disabled = true;
    elements.targetCount.disabled = true;
    elements.targetGpValue.disabled = true;
    elements.killsInput.disabled = true;
    elements.simulationHelp.textContent = "Choose a mode to begin.";
    return;
  }

  if (isGpMode && !activity) {
    const disabled = getGpEligibleActivities().length === 0;
    elements.simulateButton.disabled = disabled;
    elements.variantField.hidden = true;
    elements.killsField.hidden = true;
    elements.targetItemField.hidden = true;
    elements.targetCountField.hidden = true;
    elements.targetGpField.hidden = false;
    elements.encounterSettings.hidden = true;
    elements.encounterSettings.open = false;
    elements.advancedModifiers.hidden = true;
    elements.advancedModifiers.open = false;
    elements.clueControls.hidden = true;
    elements.raidControls.hidden = true;
    elements.yamaAdvancedControls.hidden = true;
    elements.coxAdvancedControls.hidden = true;
    elements.toaAdvancedControls.hidden = true;
    elements.targetItem.disabled = true;
    elements.targetCount.disabled = true;
    elements.targetGpValue.disabled = disabled;
    elements.killsInput.disabled = true;
    elements.simulationHelp.textContent = disabled
      ? "No eligible kill-based bosses are available for GP comparison."
      : `Put in a GP target, hit simulate, and the results view will rank ${formatNumber(getGpEligibleActivities().length)} eligible kill-based bosses by median KC in a horizontal chart. Raids, clues, chest runs, wave encounters, and other non-standard reward loops are excluded.`;
    return;
  }

  if (isTargetMode && !selectedTargetItem) {
    elements.simulateButton.disabled = true;
    elements.variantField.hidden = true;
    elements.killsField.hidden = true;
    elements.targetItemField.hidden = true;
    elements.targetCountField.hidden = true;
    elements.targetGpField.hidden = true;
    elements.encounterSettings.hidden = true;
    elements.encounterSettings.open = false;
    elements.advancedModifiers.hidden = true;
    elements.advancedModifiers.open = false;
    elements.clueControls.hidden = true;
    elements.raidControls.hidden = true;
    elements.yamaAdvancedControls.hidden = true;
    elements.coxAdvancedControls.hidden = true;
    elements.toaAdvancedControls.hidden = true;
    elements.targetItem.disabled = true;
    elements.targetCount.disabled = true;
    elements.targetGpValue.disabled = true;
    elements.killsInput.disabled = true;
    elements.simulationHelp.textContent = "Choose an item to compare only the bosses that can drop it.";
    return;
  }

  if (!activity && !isTargetMode) {
    elements.simulateButton.disabled = true;
    elements.variantField.hidden = true;
    elements.killsField.hidden = !isFixedMode;
    elements.targetItemField.hidden = true;
    elements.targetCountField.hidden = true;
    elements.targetGpField.hidden = true;
    elements.encounterSettings.hidden = true;
    elements.encounterSettings.open = false;
    elements.advancedModifiers.hidden = true;
    elements.advancedModifiers.open = false;
    elements.clueControls.hidden = true;
    elements.raidControls.hidden = true;
    elements.yamaAdvancedControls.hidden = true;
    elements.coxAdvancedControls.hidden = true;
    elements.toaAdvancedControls.hidden = true;
    elements.targetItem.disabled = true;
    elements.targetCount.disabled = true;
    elements.targetGpValue.disabled = true;
    elements.killsInput.disabled = true;
    elements.simulationHelp.textContent = "Choose a boss or activity to load the simulator.";
    return;
  }

  if (isTargetMode && selectedTargetItem) {
    const bossCount = selectedTargetItem.activity_count || 0;
    const disabled = bossCount === 0;
    elements.simulateButton.disabled = disabled;
    elements.variantField.hidden = true;
    elements.killsField.hidden = true;
    elements.targetItemField.hidden = true;
    elements.targetCountField.hidden = false;
    elements.targetGpField.hidden = true;
    elements.targetItem.disabled = true;
    elements.targetCount.disabled = disabled;
    elements.targetGpValue.disabled = true;
    elements.killsInput.disabled = true;
    elements.encounterSettings.hidden = true;
    elements.encounterSettings.open = false;
    elements.advancedModifiers.hidden = true;
    elements.advancedModifiers.open = false;
    elements.clueControls.hidden = true;
    elements.raidControls.hidden = true;
    elements.yamaAdvancedControls.hidden = true;
    elements.coxAdvancedControls.hidden = true;
    elements.toaAdvancedControls.hidden = true;
    elements.simulationHelp.textContent = disabled
      ? "No eligible bosses were found for this item."
      : `Choose the quantity to chase, then simulate. The results view will rank ${formatNumber(bossCount)} ${bossCount === 1 ? "boss" : "bosses"} that can drop this item by median simulated KC.`;
    return;
  }

  const rootSlug = state.selectedActivity.slug;
  const raidType = getRaidType(rootSlug);
  const clueTier = getEffectiveClueTier(rootSlug, activity);
  const clueUiDetails = getClueUiDetails(rootSlug);
  const rollRange = activity.simulation?.reward_roll_range;
  const disabled = !activity.supported || activity.simulation_disabled;
  const hasEncounterSettings = Boolean(clueTier || raidType);
  const hasAdvancedModifiers = rootSlug === "yama" || raidType === "cox" || raidType === "toa";
  const hasVariantOptions = (state.selectedActivity?.variants || []).length > 1;

  elements.simulateButton.disabled = disabled;
  elements.variantField.hidden = isGpMode || !hasVariantOptions;
  elements.killsField.hidden = !isFixedMode;
  elements.targetItemField.hidden = true;
  elements.targetCountField.hidden = true;
  elements.targetGpField.hidden = !isGpMode;
  elements.targetItem.disabled = disabled || !isTargetMode;
  elements.targetCount.disabled = disabled || !isTargetMode;
  elements.targetGpValue.disabled = disabled || !isGpMode;
  elements.killsInput.disabled = disabled || !isFixedMode;

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

  elements.advancedModifiers.hidden = !hasAdvancedModifiers;
  if (!hasAdvancedModifiers) {
    elements.advancedModifiers.open = false;
  } else {
    let summary = "Advanced modifiers";
    if (rootSlug === "yama") {
      summary = "Advanced modifiers: Yama account perks";
    } else if (raidType === "cox") {
      summary = "Advanced modifiers: Chambers account perks";
    } else if (raidType === "toa") {
      summary = "Advanced modifiers: Tombs owned rewards";
    }
    elements.advancedModifiersSummary.textContent = summary;
  }
  elements.yamaAdvancedControls.hidden = rootSlug !== "yama";
  elements.coxAdvancedControls.hidden = raidType !== "cox";
  elements.toaAdvancedControls.hidden = raidType !== "toa";

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
    helpText = `Put in a GP target, hit simulate, and the results view will rank ${formatNumber(getGpEligibleActivities().length)} eligible kill-based bosses by median KC in a horizontal chart. Raids, clues, chest runs, wave encounters, and other non-standard reward loops are excluded.`;
  }
  if (!isGpMode && raidType === "cox") {
    helpText = `${helpText} Open encounter settings to tune point share and CM timing, then use advanced modifiers for account clue perks.`;
  } else if (!isGpMode && raidType === "toa") {
    helpText = `${helpText} Open encounter settings to set raid level and loot points, then use advanced modifiers for owned thread and jewels.`;
  } else if (!isGpMode && raidType === "tob") {
    helpText = `${helpText} Open encounter settings to set team size, deaths, and hard mode timing.`;
  } else if (!isGpMode && rootSlug === "yama") {
    helpText = `${helpText} Open advanced modifiers if your account has the elite CA clue boost unlocked.`;
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
  renderSimulationState(getSetupActivityView());
}

function collectSimulationPayloadAndOptions() {
  if (!state.simulationMode) {
    return null;
  }

  const isGpMode = state.simulationMode === "gp";
  const isTargetMode = state.simulationMode === "target";
  const isFixedMode = state.simulationMode === "fixed";
  if (isFixedMode && !state.selectedActivity) {
    return null;
  }
  if (isTargetMode && !state.selectedTargetItem) {
    return null;
  }

  const activityView = isFixedMode ? getActiveActivityView(state.selectedActivity) : null;
  const rootSlug = isFixedMode ? (state.selectedActivity?.slug || null) : null;
  const payload = isGpMode
    ? null
    : isTargetMode
      ? null
      : {
        ...activityView,
        slug: rootSlug,
        supported: activityView.supported ?? state.selectedActivity.supported,
        simulation_disabled: activityView.simulation_disabled ?? state.selectedActivity.simulation_disabled,
      };

  if (payload && state.selectedVariantId) {
    payload.variant_id = state.selectedVariantId;
  }

  const options = {
    kills: isFixedMode ? clampRuns(elements.killsInput.value || 1) : 1,
    target_item_slug: isTargetMode ? state.selectedTargetItem.item_slug : null,
    target_count: isTargetMode ? Math.max(1, Math.floor(Number(elements.targetCount.value || 1))) : 1,
    target_gp_value: isGpMode ? clampGpTarget(elements.targetGpValue.value) : null,
    max_chase_kills: MAX_SIM_CAP,
  };

  const clueTier = rootSlug ? getEffectiveClueTier(rootSlug, activityView) : null;
  if (clueTier) {
    options.clue_mimic_attempts = Number(elements.clueMimicAttempts.value || 1);
    if (rootSlug !== "mimic") {
      options.clue_mimic_enabled = elements.clueMimicEnabled.checked;
    }
  }

  if (rootSlug === "yama") {
    options.yama_elite_ca = elements.yamaEliteCa.checked;
  }

  const raidType = rootSlug ? getRaidType(rootSlug) : null;
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
    options.toa_owned_jewels = getToaOwnedJewelsFromInputs();
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
  if (!state.simulationMode) {
    elements.runSummary.innerHTML = "";
    return;
  }

  const data = collectSimulationPayloadAndOptions();
  if (!data) {
    if (state.simulationMode === "gp") {
      const rawGpTarget = clampGpTarget(elements.targetGpValue.value);
      const cards = [
        buildSummaryCard("Scope", "All eligible bosses"),
        buildSummaryCard("Mode", "GP target"),
        buildSummaryCard("Target value", rawGpTarget ? `${formatShortValue(rawGpTarget)} gp` : "Enter GP"),
        buildSummaryCard("Boss pool", formatNumber(getGpEligibleActivities().length)),
      ];
      elements.runSummary.innerHTML = cards.join("");
      return;
    }
    if (state.simulationMode === "target" && state.selectedTargetItem) {
      const targetCount = Math.max(1, Math.floor(Number(elements.targetCount.value || 1)));
      const cards = [
        buildSummaryCard("Mode", "Drop comparison"),
        buildSummaryCard("Item", state.selectedTargetItem.item_name),
        buildSummaryCard("Boss pool", formatNumber(state.selectedTargetItem.activity_count || 0)),
        buildSummaryCard("Target count", formatNumber(targetCount)),
        buildSummaryCard("Chase cap", formatNumber(MAX_SIM_CAP)),
      ];
      elements.runSummary.innerHTML = cards.join("");
      return;
    }
    elements.runSummary.innerHTML = "";
    return;
  }

  const { activityView, rootSlug, options } = data;
  const isGpMode = state.simulationMode === "gp";
  const isTargetMode = state.simulationMode === "target";
  if (isTargetMode) {
    const cards = [
      buildSummaryCard("Mode", "Drop comparison"),
      buildSummaryCard("Item", state.selectedTargetItem?.item_name || "Selected item"),
      buildSummaryCard("Boss pool", formatNumber(state.selectedTargetItem?.activity_count || 0)),
      buildSummaryCard("Target count", formatNumber(options.target_count)),
      buildSummaryCard("Chase cap", formatNumber(MAX_SIM_CAP)),
    ];
    elements.runSummary.innerHTML = cards.join("");
    return;
  }

  const cards = [
    buildSummaryCard(isGpMode ? "Scope" : "Activity", isGpMode ? "All eligible bosses" : state.selectedActivity.name),
    state.selectedVariantId && !isGpMode ? buildSummaryCard("Variant", activityView.label || state.selectedVariantId) : "",
    buildSummaryCard("Mode", isGpMode ? "GP target" : "Attempts"),
  ];

  if (isGpMode) {
    cards.push(buildSummaryCard("Target value", options.target_gp_value ? `${formatShortValue(options.target_gp_value)} gp` : "Enter GP"));
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
    if (rootSlug === "yama" && options.yama_elite_ca) {
      cards.push(buildSummaryCard("Elite CA clue", "1/28 enabled"));
    }
    if (raidType === "cox") {
      cards.push(buildSummaryCard("Your points", formatNumber(options.cox_personal_points)));
      cards.push(buildSummaryCard("Team points", formatNumber(options.cox_group_points)));
      if (options.cox_elite_ca) {
        cards.push(buildSummaryCard("Elite CA clue", "Enabled"));
      }
    } else if (raidType === "toa") {
      cards.push(buildSummaryCard("Raid level", formatNumber(options.toa_raid_level)));
      cards.push(buildSummaryCard("Your loot points", formatNumber(options.toa_personal_points)));
      cards.push(buildSummaryCard("Team loot points", formatNumber(options.toa_team_points)));
      if (options.toa_thread_obtained) {
        cards.push(buildSummaryCard("Thread status", "Already owned"));
      }
      const ownedJewels = options.toa_owned_jewels || [];
      if (ownedJewels.length) {
        cards.push(buildSummaryCard("Owned jewels", `${ownedJewels.length} / 4`));
      }
    } else if (raidType === "tob") {
      cards.push(buildSummaryCard("Team size", formatNumber(options.tob_team_size)));
      cards.push(buildSummaryCard("Your deaths", formatNumber(options.tob_deaths)));
      cards.push(buildSummaryCard("Team deaths", formatNumber(options.tob_team_deaths)));
    }
  }

  elements.runSummary.innerHTML = cards.filter(Boolean).join("");
}

function renderPlaceholderResults(message = "Run a simulation to see the loot review.") {
  state.lastResult = null;
  state.activeGpRankingSlug = null;
  elements.simulationResults.classList.remove("is-loading");
  elements.resultsContext.innerHTML = "";
  elements.simulationResults.innerHTML = `<div class="results-empty">${escapeHtml(message)}</div>`;
}

function refreshSelectedActivityView(resetResults = false) {
  renderSetupProgress();
  const view = getSetupActivityView();
  const headerActivity = state.simulationMode === "fixed" ? state.selectedActivity : null;
  renderActivityHeader(headerActivity, view);
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
    if (result.raid_context?.owned_jewel_count) {
      chips.push(`${formatNumber(result.raid_context.owned_jewel_count)} jewels owned`);
    }
    chips.push(`Elite clue ${formatPercent(result.raid_context?.elite_clue_chance, 1)}`);
  } else if (result.yama_context) {
    chips.push(`Elite clue ${formatPercent(result.yama_context?.elite_clue_chance, 2)}`);
    if (result.yama_context?.elite_ca_clue_boost) {
      chips.push("Elite CA clue perk");
    }
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

function buildGpPreviewTable(result) {
  const rows = (result?.totals || [])
    .map((item) => {
      const image = item.item_asset_path ? `<img src="${assetUrl(item.item_asset_path)}" alt="">` : "";
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
          <td>${item.total_ge_value ? formatNumber(item.total_ge_value) : "N/A"}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div class="table-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Total GP</th>
          </tr>
        </thead>
        <tbody>${rows || '<tr><td colspan="3">No loot recorded.</td></tr>'}</tbody>
      </table>
    </div>
  `;
}

function buildComparisonLootDetail(entry, result, options = {}) {
  const { includeTitle = true } = options;
  const detail = getComparisonDetailMeta(entry, result);
  if (!detail.preview) {
    return `
      <div class="review-card">
        <div class="review-card-header">
          ${includeTitle ? "<h3>Boss loot preview</h3>" : ""}
          <span class="subtle">No representative loot sample is available for this boss.</span>
        </div>
      </div>
    `;
  }

  const preview = detail.preview;
  const headerMarkup = includeTitle
    ? `
      <div class="review-card-header">
        <h3>${escapeHtml(detail.title)}</h3>
        <span class="subtle">${escapeHtml(detail.subtitle)}</span>
      </div>
    `
    : `
      <div class="review-card-header comparison-loot-subtitle">
        <span class="subtle">${escapeHtml(detail.subtitle)}</span>
      </div>
    `;

  return `
    <div class="review-card gp-detail-card comparison-loot-detail-card">
      ${headerMarkup}
      <div class="metric-grid gp-detail-metrics">
        ${buildMetricCard(detail.primaryMetricLabel, entry.capped ? `${formatNumber(MAX_SIM_CAP)}+` : formatNumber(entry.median_kills), true)}
        ${buildMetricCard("Total value", `${formatShortValue(preview.total_ge_value || 0)} gp`)}
        ${buildMetricCard("Value / kill", `${formatShortValue(detail.averageValue)} gp`)}
        ${buildMetricCard("Distinct items", formatNumber(preview.distinct_items || 0))}
      </div>
      ${buildGpPreviewTable(preview)}
    </div>
  `;
}

function buildComparisonRankRow(entry, index, maxKillsForScale, selectedSlug, resultMode, targetItemName) {
  const image = entry.activity_image_path ? `<img src="${assetUrl(entry.activity_image_path)}" alt="">` : '<div class="gp-rank-sprite-fallback">?</div>';
  const fillPercent = entry.capped
    ? 100
    : Math.max(8, Math.min(100, ((entry.median_kills || 0) / Math.max(1, maxKillsForScale || 1)) * 100));
  const killsLabel = entry.capped ? `${formatNumber(MAX_SIM_CAP)}+ kc` : `${formatNumber(entry.median_kills)} kc`;
  const rangeLabel = entry.min_kills === entry.max_kills
    ? `Sample ${formatNumber(entry.min_kills)}`
    : `Range ${formatNumber(entry.min_kills)}-${formatNumber(entry.max_kills)}`;
  const isSelected = entry.slug === selectedSlug;
  const secondaryLabel = resultMode === "gp"
    ? `${rangeLabel} · ${formatShortValue(entry.avg_gp_per_kill || 0)} gp / kill`
    : `${rangeLabel} · ${targetItemName || "Target"} chase`;

  return `
    <button class="gp-rank-row${entry.capped ? " is-capped" : ""}${isSelected ? " is-selected" : ""}" type="button" data-gp-slug="${escapeHtml(entry.slug)}">
      <div class="gp-rank-heading">
        <span class="gp-rank-position">${formatNumber(index + 1)}</span>
        <div class="gp-rank-sprite">${image}</div>
        <div class="gp-rank-copy">
          <strong>${escapeHtml(entry.name)}</strong>
          <span>${escapeHtml(secondaryLabel)}</span>
        </div>
        <div class="gp-rank-kc">${escapeHtml(killsLabel)}</div>
      </div>
      <div class="gp-rank-bar">
        <span class="gp-rank-fill" style="width: ${fillPercent.toFixed(2)}%"></span>
      </div>
    </button>
  `;
}

function renderComparisonResults(result) {
  showResultsStage(true);
  closeComparisonLootModal();
  state.lastResult = result;
  elements.simulationResults.classList.remove("is-loading");
  elements.resultsContext.innerHTML = buildResultsContext(result);
  const rankings = result.rankings || [];
  if (!rankings.some((entry) => entry.slug === state.activeGpRankingSlug)) {
    state.activeGpRankingSlug = null;
  }
  const best = rankings[0] || null;
  const uncapped = rankings.filter((entry) => !entry.capped);
  const scaleMax = (uncapped.length ? uncapped[uncapped.length - 1].median_kills : (rankings.length ? rankings[rankings.length - 1].median_kills : 1)) || 1;
  const chartRows = rankings
    .map((entry, index) => buildComparisonRankRow(entry, index, scaleMax, state.activeGpRankingSlug, result.mode, result.target_item_name))
    .join("");
  const isGpMode = result.mode === "gp";
  const comparisonLabel = isGpMode ? "GP comparison mode" : "Drop comparison mode";
  const comparisonCopy = isGpMode
    ? "Ranked by median simulated KC to the target GP value. Only standard kill-based bosses are included."
    : `Ranked by median simulated KC to reach ${formatNumber(result.target_count || 1)}x ${escapeHtml(result.target_item_name || "the selected item")}. Only bosses that can drop this item are included.`;
  const chartTitle = isGpMode ? "Boss KC ranking" : `${escapeHtml(result.target_item_name || "Item")} KC ranking`;
  const chartSubtle = isGpMode
    ? "Lowest simulated KC first, highest last"
    : "Only bosses that can drop this item are ranked";

  elements.simulationResults.innerHTML = `
    <div class="results-shell gp-results-shell">
      <div class="metric-grid">
        ${isGpMode ? buildMetricCard("Target value", `${formatShortValue(result.target_gp_value || 0)} gp`, true) : buildMetricCard("Target item", result.target_item_name || "Selected item", true)}
        ${buildMetricCard("Bosses ranked", formatNumber(result.boss_count || rankings.length))}
        ${isGpMode ? buildMetricCard("Samples / boss", formatNumber(result.sample_count || 0)) : buildMetricCard("Target count", `${formatNumber(result.target_count || 1)}x`)}
        ${buildMetricCard("Fastest median", best ? `${formatNumber(best.median_kills)} kc` : "N/A")}
      </div>

      <div class="review-note">
        <strong>${comparisonLabel}</strong>
        <span>${comparisonCopy}</span>
      </div>

      <div class="review-note comparison-modal-hint">
        <strong>Click a boss row</strong>
        <span>Open a centered loot preview modal to inspect the representative drop sample for that boss.</span>
      </div>

      <div class="review-card gp-chart-card">
        <div class="review-card-header">
          <h3>${chartTitle}</h3>
          <span class="subtle">${chartSubtle}</span>
        </div>
        <div class="gp-rank-list">
          ${chartRows || `<div class="results-empty">${isGpMode ? "No eligible bosses were available for GP comparison." : "No eligible bosses can drop the selected item."}</div>`}
        </div>
      </div>
    </div>
  `;
}

function renderSimulationResults(result) {
  showResultsStage(true);
  closeComparisonLootModal();
  state.lastResult = result;
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
  const runSalt = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
        seed: `gp:${runSalt}:${summary.slug}:${targetGpValue}:${sampleIndex}`,
      });
      samples.push({
        kills: result.kills_completed || 0,
        total_ge_value: result.total_ge_value || 0,
        result,
      });
      totalKills += result.kills_completed || 0;
      totalValue += result.total_ge_value || 0;
    }

    samples.sort((a, b) => a.kills - b.kills || a.total_ge_value - b.total_ge_value);
    const medianSample = samples[Math.floor(samples.length / 2)] || { kills: MAX_SIM_CAP, result: null };
    const medianKills = medianSample.kills || MAX_SIM_CAP;
    rankings.push({
      slug: summary.slug,
      name: summary.name,
      activity_image_path: summary.activity_image_path || activity.activity_image_path || null,
      median_kills: medianKills,
      min_kills: samples[0]?.kills || medianKills,
      max_kills: samples[samples.length - 1]?.kills || medianKills,
      avg_gp_per_kill: totalKills > 0 ? Math.round(totalValue / totalKills) : 0,
      capped: medianKills >= MAX_SIM_CAP,
      preview_result: medianSample.result,
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

async function runTargetComparison(targetItem, targetCount) {
  const sampleCount = TARGET_COMPARISON_SAMPLE_COUNT;
  const runSalt = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const rankings = [];
  const eligibleActivities = (targetItem?.activities || []).slice().sort((a, b) => a.name.localeCompare(b.name));

  for (let index = 0; index < eligibleActivities.length; index += 1) {
    const summary = eligibleActivities[index];
    setSimulationLoading(
      `Comparing item drops ${formatNumber(index + 1)} / ${formatNumber(eligibleActivities.length)}...`,
      `Running ${formatNumber(sampleCount)} simulated chase${sampleCount === 1 ? "" : "s"} per boss and ranking the median KC.`,
    );

    const activity = await loadActivityData(summary.slug);
    const samples = [];
    let totalKills = 0;
    let totalValue = 0;

    for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
      const result = simulateActivity(activity, {
        kills: 1,
        target_item_slug: targetItem.item_slug,
        target_count: targetCount,
        max_chase_kills: MAX_SIM_CAP,
        seed: `target:${runSalt}:${summary.slug}:${targetItem.item_slug}:${targetCount}:${sampleIndex}`,
      });
      samples.push({
        kills: result.kills_completed || 0,
        total_ge_value: result.total_ge_value || 0,
        result,
      });
      totalKills += result.kills_completed || 0;
      totalValue += result.total_ge_value || 0;
    }

    samples.sort((a, b) => a.kills - b.kills || a.total_ge_value - b.total_ge_value);
    const medianSample = samples[Math.floor(samples.length / 2)] || { kills: MAX_SIM_CAP, result: null };
    const medianKills = medianSample.kills || MAX_SIM_CAP;
    rankings.push({
      slug: summary.slug,
      name: summary.name,
      activity_image_path: summary.activity_image_path || activity.activity_image_path || null,
      median_kills: medianKills,
      min_kills: samples[0]?.kills || medianKills,
      max_kills: samples[samples.length - 1]?.kills || medianKills,
      avg_gp_per_kill: totalKills > 0 ? Math.round(totalValue / totalKills) : 0,
      capped: !medianSample.result?.target_reached,
      preview_result: medianSample.result,
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
    mode: "target_compare",
    target_item_slug: targetItem.item_slug,
    target_item_name: targetItem.item_name,
    target_item_asset_path: targetItem.item_asset_path || null,
    target_count: targetCount,
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

function selectTargetItem(itemSlug) {
  const targetItem = state.targetItems.find((entry) => entry.item_slug === itemSlug) || null;
  state.selectedTargetItemSlug = targetItem?.item_slug || null;
  state.selectedTargetItem = targetItem;
  state.activeGpRankingSlug = null;
  showSetupStage();
  renderPlaceholderResults("Run simulation to see the loot review.");
  refreshSelectedActivityView(false);
  renderPlaceholderResults();
  closeActivityModal();
}

async function loadApp() {
  state.status = await getJson("./data/index.json");
  state.activities = state.status.activities || [];
  state.filteredActivities = state.activities.slice();
  await renderModalPicker();
  refreshSelectedActivityView(false);
  renderPlaceholderResults();
}

elements.openThemeButton.addEventListener("click", openThemeModal);
elements.activityPickerTrigger.addEventListener("click", () => {
  void openActivityModal();
});
elements.closeActivityPicker.addEventListener("click", closeActivityModal);
elements.activityModal.addEventListener("click", (event) => {
  if (event.target.matches("[data-modal-close]")) {
    closeActivityModal();
  }
});
elements.closeComparisonLootModal.addEventListener("click", closeComparisonLootModal);
elements.comparisonLootModal.addEventListener("click", (event) => {
  if (event.target.matches("[data-comparison-modal-close]")) {
    closeComparisonLootModal();
  }
});
elements.closeThemeModal.addEventListener("click", () => closeThemeModal());
elements.themeModal.addEventListener("click", (event) => {
  if (event.target.matches("[data-theme-modal-close]")) {
    closeThemeModal();
  }
});
elements.saveThemeButton.addEventListener("click", saveThemeDraft);
elements.resetThemeButton.addEventListener("click", resetThemeDraft);
elements.themeInputs.forEach((input) => {
  input.addEventListener("input", () => {
    state.themeDraft = readThemeInputs();
    updateThemeValueLabels(state.themeDraft);
    applyTheme(state.themeDraft);
  });
});

elements.modalSearch.addEventListener("input", () => {
  void renderModalPicker();
});
elements.modalSupportedOnly.addEventListener("change", () => {
  void renderModalPicker();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!elements.themeModal.hidden) {
      closeThemeModal();
      return;
    }
    if (!elements.comparisonLootModal.hidden) {
      closeComparisonLootModal();
      return;
    }
    if (!elements.activityModal.hidden) {
      closeActivityModal();
    }
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
      const cleaned = clampGpTarget(elements.targetGpValue.value);
      if (cleaned !== null && String(cleaned) !== elements.targetGpValue.value && eventName === "change") {
        elements.targetGpValue.value = String(cleaned);
      }
    }
    if (state.simulationMode) {
      showSetupStage();
      renderSimulationState(getSetupActivityView());
    }
    renderRunSummary();
  });
});

elements.simulationResults.addEventListener("click", (event) => {
  const gpButton = event.target.closest("[data-gp-slug]");
  if (gpButton && (state.lastResult?.mode === "gp" || state.lastResult?.mode === "target_compare")) {
    state.activeGpRankingSlug = gpButton.dataset.gpSlug;
    renderComparisonResults(state.lastResult);
    openComparisonLootModal(state.activeGpRankingSlug);
    return;
  }
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
  if (!state.simulationMode) {
    elements.simulationHelp.textContent = "Choose a mode before running the simulator.";
    elements.modeFixedButton.focus();
    return;
  }
  if (requiresActivitySelection() && !state.selectedActivity) {
    elements.simulationHelp.textContent = "Choose a boss or activity before running the simulator.";
    elements.activityPickerTrigger.focus();
    return;
  }
  if (requiresItemSelection() && !state.selectedTargetItem) {
    elements.simulationHelp.textContent = "Choose an item before running the comparison.";
    elements.activityPickerTrigger.focus();
    return;
  }

  const data = collectSimulationPayloadAndOptions();
  if (!data) {
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
      renderComparisonResults(result);
    } else if (state.simulationMode === "target") {
      const result = await runTargetComparison(state.selectedTargetItem, options.target_count);
      renderComparisonResults(result);
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

state.savedTheme = loadSavedTheme();
state.themeDraft = { ...state.savedTheme };
applyTheme(state.savedTheme);
populateThemeInputs(state.savedTheme);
setSimulationMode(state.simulationMode);
setRunButtonState(false);
showSetupStage();

loadApp().catch((error) => {
  console.error(error);
  elements.activityGrid.innerHTML = '<div class="results-empty">The app could not load the cached data files.</div>';
  renderPlaceholderResults("The app could not load the cached data files.");
});
