import { simulateActivity } from "./simulator.js";

const state = {
  status: null,
  activities: [],
  filteredActivities: [],
  selectedSlug: null,
  selectedActivity: null,
  selectedVariantId: null,
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
  wikiLink: document.getElementById("wikiLink"),
  hiscoresLink: document.getElementById("hiscoresLink"),
  activityImage: document.getElementById("activityImage"),
  leaderboard: document.getElementById("leaderboard"),
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
  raidControls: document.getElementById("raidControls"),
  coxControls: document.getElementById("coxControls"),
  toaControls: document.getElementById("toaControls"),
  tobControls: document.getElementById("tobControls"),
  coxPersonalPoints: document.getElementById("coxPersonalPoints"),
  coxGroupPoints: document.getElementById("coxGroupPoints"),
  toaRaidLevel: document.getElementById("toaRaidLevel"),
  toaPersonalPoints: document.getElementById("toaPersonalPoints"),
  toaTeamPoints: document.getElementById("toaTeamPoints"),
  tobDeaths: document.getElementById("tobDeaths"),
  tobSkippedRooms: document.getElementById("tobSkippedRooms"),
  tobMvpBonus: document.getElementById("tobMvpBonus"),
};

const RAID_TYPES = {
  cox: new Set(["chambers-of-xeric", "chambers-of-xeric-challenge-mode"]),
  toa: new Set(["tombs-of-amascut", "tombs-of-amascut-expert-mode"]),
  tob: new Set(["theatre-of-blood", "theatre-of-blood-hard-mode"]),
};

const TOB_COMMON_ROWS = [
  { item_name: "Vial of blood", item_slug: "vial-of-blood", item_asset_path: null, quantity_text: "45–60 (noted)", rarity_fraction: "2/30" },
  { item_name: "Death rune", item_slug: "death-rune", item_asset_path: "assets/items/death-rune.png", quantity_text: "500–600", rarity_fraction: "1/30" },
  { item_name: "Blood rune", item_slug: "blood-rune", item_asset_path: "assets/items/blood-rune.png", quantity_text: "500–600", rarity_fraction: "1/30" },
  { item_name: "Swamp tar", item_slug: "swamp-tar", item_asset_path: "assets/items/swamp-tar.png", quantity_text: "500–600", rarity_fraction: "1/30" },
  { item_name: "Coal", item_slug: "coal", item_asset_path: "assets/items/coal.png", quantity_text: "500–600 (noted)", rarity_fraction: "1/30" },
  { item_name: "Gold ore", item_slug: "gold-ore", item_asset_path: "assets/items/gold-ore.png", quantity_text: "300–360 (noted)", rarity_fraction: "1/30" },
  { item_name: "Molten glass", item_slug: "molten-glass", item_asset_path: "assets/items/molten-glass.png", quantity_text: "200–240 (noted)", rarity_fraction: "1/30" },
  { item_name: "Adamantite ore", item_slug: "adamantite-ore", item_asset_path: "assets/items/adamantite-ore.png", quantity_text: "130–156 (noted)", rarity_fraction: "1/30" },
  { item_name: "Runite ore", item_slug: "runite-ore", item_asset_path: "assets/items/runite-ore.png", quantity_text: "60–72 (noted)", rarity_fraction: "1/30" },
  { item_name: "Wine of zamorak", item_slug: "wine-of-zamorak", item_asset_path: "assets/items/wine-of-zamorak.png", quantity_text: "50–60", rarity_fraction: "1/30" },
  { item_name: "Potato cactus", item_slug: "potato-cactus", item_asset_path: "assets/items/potato-cactus.png", quantity_text: "50–60", rarity_fraction: "1/30" },
  { item_name: "Grimy cadantine", item_slug: "grimy-cadantine", item_asset_path: "assets/items/grimy-cadantine.png", quantity_text: "50–60", rarity_fraction: "1/30" },
  { item_name: "Grimy avantoe", item_slug: "grimy-avantoe", item_asset_path: "assets/items/grimy-avantoe.png", quantity_text: "40–48", rarity_fraction: "1/30" },
  { item_name: "Grimy toadflax", item_slug: "grimy-toadflax", item_asset_path: "assets/items/grimy-toadflax.png", quantity_text: "37–44", rarity_fraction: "1/30" },
  { item_name: "Grimy kwuarm", item_slug: "grimy-kwuarm", item_asset_path: "assets/items/grimy-kwuarm.png", quantity_text: "36–43", rarity_fraction: "1/30" },
  { item_name: "Grimy irit leaf", item_slug: "grimy-irit-leaf", item_asset_path: "assets/items/grimy-irit-leaf.png", quantity_text: "34–40", rarity_fraction: "1/30" },
  { item_name: "Grimy ranarr weed", item_slug: "grimy-ranarr-weed", item_asset_path: "assets/items/grimy-ranarr-weed.png", quantity_text: "30–36", rarity_fraction: "1/30" },
  { item_name: "Grimy snapdragon", item_slug: "grimy-snapdragon", item_asset_path: "assets/items/grimy-snapdragon.png", quantity_text: "27–32", rarity_fraction: "1/30" },
  { item_name: "Grimy lantadyme", item_slug: "grimy-lantadyme", item_asset_path: "assets/items/grimy-lantadyme.png", quantity_text: "26–31", rarity_fraction: "1/30" },
  { item_name: "Grimy dwarf weed", item_slug: "grimy-dwarf-weed", item_asset_path: "assets/items/grimy-dwarf-weed.png", quantity_text: "24–28", rarity_fraction: "1/30" },
  { item_name: "Grimy torstol", item_slug: "grimy-torstol", item_asset_path: "assets/items/grimy-torstol.png", quantity_text: "20–24", rarity_fraction: "1/30" },
  { item_name: "Battlestaff", item_slug: "battlestaff", item_asset_path: "assets/items/battlestaff.png", quantity_text: "15–18", rarity_fraction: "1/30" },
  { item_name: "Rune battleaxe", item_slug: "rune-battleaxe", item_asset_path: "assets/items/rune-battleaxe.png", quantity_text: "1", rarity_fraction: "1/30" },
  { item_name: "Rune platebody", item_slug: "rune-platebody", item_asset_path: "assets/items/rune-platebody.png", quantity_text: "1", rarity_fraction: "1/30" },
  { item_name: "Rune chainbody", item_slug: "rune-chainbody", item_asset_path: "assets/items/rune-chainbody.png", quantity_text: "1", rarity_fraction: "1/30" },
  { item_name: "Palm tree seed", item_slug: "palm-tree-seed", item_asset_path: "assets/items/palm-tree-seed.png", quantity_text: "1", rarity_fraction: "1/30" },
  { item_name: "Yew seed", item_slug: "yew-seed", item_asset_path: "assets/items/yew-seed.png", quantity_text: "1", rarity_fraction: "1/30" },
  { item_name: "Magic seed", item_slug: "magic-seed", item_asset_path: "assets/items/magic-seed.png", quantity_text: "1", rarity_fraction: "1/30" },
  { item_name: "Mahogany seed", item_slug: "mahogany-seed", item_asset_path: "assets/items/mahogany-seed.png", quantity_text: "1", rarity_fraction: "1/30" },
];

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

function matchesActivityFilter(activity, query) {
  if (!query) {
    return true;
  }
  const haystack = [
    activity.name,
    activity.slug,
    activity.wiki_page,
    activity.note,
    activity.table_id,
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
    const rowCount = activity.row_count || 0;
    const variantCount = activity.variants?.length || 0;
    const image = activity.activity_image_path
      ? `<img src="${assetUrl(activity.activity_image_path)}" alt="${activity.name} sprite">`
      : '<div class="activity-tile-fallback">No art</div>';
    button.innerHTML = `
      ${image}
      <strong>${activity.name}</strong>
      <small>${formatNumber(rowCount)} rows${variantCount ? ` · ${variantCount} variants` : ""}</small>
    `;
    button.addEventListener("click", () => selectActivity(activity.slug));
    elements.activityGrid.appendChild(button);
  });
}

function filterActivities() {
  state.filteredActivities = state.activities.slice().sort((a, b) => {
    if (a.slug === state.selectedSlug) return -1;
    if (b.slug === state.selectedSlug) return 1;
    return a.name.localeCompare(b.name);
  });
  renderActivityGrid();
}

function renderModalPicker() {
  const search = elements.modalSearch.value.trim().toLowerCase();
  const supportedOnly = elements.modalSupportedOnly.checked;
  state.filteredActivities = state.activities.filter((activity) => {
    if (supportedOnly && !activity.supported) {
      return false;
    }
    return matchesActivityFilter(activity, search);
  }).sort((a, b) => {
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
      .map((variant) => `<option value="${variant.id}">${variant.label}</option>`)
      .join("");
    state.selectedVariantId = variants.some((variant) => variant.id === state.selectedVariantId)
      ? state.selectedVariantId
      : variants[0].id;
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
  elements.activityMeta.innerHTML = "";
  [
    (view?.wiki_page || activity.wiki_page) ? `Wiki: ${view?.wiki_page || activity.wiki_page}` : null,
    activity.table_id ? `Hiscores table ${activity.table_id}` : null,
    activity.variants?.length ? `${activity.variants.length} variants` : null,
    view?.simulation?.reward_roll_range
      ? `${view.simulation.reward_roll_range.min}-${view.simulation.reward_roll_range.max} rolls per casket`
      : null,
    view?.supported ? `${view.drop_rows.length} cached rows` : "No cached rows",
  ]
    .filter(Boolean)
    .forEach((text) => {
      const span = document.createElement("span");
      span.className = "meta-chip";
      span.textContent = text;
      elements.activityMeta.appendChild(span);
    });

  const noteParts = [];
  if (activity.note) {
    noteParts.push(activity.note);
  }
  if (view?.note && view.note !== activity.note) {
    noteParts.push(view.note);
  }
  if (view?.simulation?.note && view.simulation.note !== activity.simulation?.note) {
    noteParts.push(view.simulation.note);
  }
  if (!noteParts.length && activity.simulation?.note) {
    noteParts.push(activity.simulation.note);
  }
  elements.activityNote.textContent = noteParts.join(" ");
  elements.activityNote.hidden = !elements.activityNote.textContent;

  elements.wikiLink.href = view?.wiki_url || activity.wiki_url || "#";
  elements.hiscoresLink.href = activity.hiscores_url || "#";
  elements.wikiLink.style.pointerEvents = view?.wiki_url || activity.wiki_url ? "auto" : "none";
  elements.hiscoresLink.style.pointerEvents = activity.hiscores_url ? "auto" : "none";

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
        <strong>${message}</strong>
        <span class="muted">Preparing rolls and aggregating the result.</span>
      </div>
      <div class="loading-bars" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
}

function renderLeaderboard(activity) {
  const entries = activity.leaderboard_preview || [];
  if (!entries.length) {
    elements.leaderboard.innerHTML = '<div class="leaderboard-empty">No leaderboard data cached.</div>';
    return;
  }

  elements.leaderboard.innerHTML = `
    <div class="table-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          ${entries
            .map(
              (entry) => `
                <tr>
                  <td>${formatNumber(entry.rank)}</td>
                  <td>${entry.name}</td>
                  <td>${formatNumber(entry.score)}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderDropSections(activity) {
  const rows = activity.drop_rows || [];
  const raidType = getRaidType(activity.slug);
  const syntheticRows = raidType === "tob" && !rows.some((row) => row.section === "Common rewards") ? TOB_COMMON_ROWS : [];
  const allRows = rows.concat(syntheticRows);
  const sectionNames = Array.from(new Set(allRows.map((row) => row.section)));
  elements.dropTableSummary.textContent = allRows.length
    ? `Open cached drop table (${formatNumber(allRows.length)} rows across ${formatNumber(sectionNames.length)} sections)`
    : "No cached drop table available";
  if (!allRows.length) {
    elements.dropSections.innerHTML = '<div class="results-empty">No cached drop rows for this activity yet.</div>';
    return;
  }

  const bySection = new Map();
  allRows.forEach((row) => {
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
      <h4>${section}</h4>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Rarity</th>
              <th>GE</th>
            </tr>
          </thead>
          <tbody>
            ${sectionRows
              .map((row) => {
                const image = row.item_asset_path
                  ? `<img src="${assetUrl(row.item_asset_path)}" alt="">`
                  : "";
                return `
                  <tr>
                    <td>
                      <div class="table-item">
                        ${image}
                        <div>
                          <strong>${row.item_name}</strong>
                          <div class="table-cell subtle">${row.item_slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>${row.quantity_text}</td>
                    <td>${row.rarity_fraction || row.rarity_percent || "N/A"}</td>
                    <td>${row.ge_value ? formatNumber(row.ge_value) : "N/A"}</td>
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
  const items = new Map();
  (activity.drop_rows || []).forEach((row) => {
    if (!items.has(row.item_slug)) {
      items.set(row.item_slug, row.item_name);
    }
  });
  if (getRaidType(activity.slug) === "tob") {
    TOB_COMMON_ROWS.forEach((row) => {
      if (!items.has(row.item_slug)) {
        items.set(row.item_slug, row.item_name);
      }
    });
  }
  const options = ['<option value="">Fixed-kill sim</option>'];
  Array.from(items.entries())
    .sort((a, b) => a[1].localeCompare(b[1]))
    .forEach(([slug, name]) => {
      options.push(`<option value="${slug}">${name}</option>`);
    });
  elements.targetItem.innerHTML = options.join("");
}

function renderSimulationState(activity) {
  const disabled = !activity.supported || activity.simulation_disabled;
  elements.simulateButton.disabled = disabled;
  elements.targetItem.disabled = disabled;
  elements.targetCount.disabled = disabled;
  elements.killsInput.disabled = disabled;
  const raidType = getRaidType(activity.slug);
  elements.raidControls.hidden = !raidType;
  elements.coxControls.hidden = raidType !== "cox";
  elements.toaControls.hidden = raidType !== "toa";
  elements.tobControls.hidden = raidType !== "tob";

  const rollRange = activity.simulation?.reward_roll_range;
  let extraText = "";
  if (raidType === "cox") {
    extraText = " Use the raid settings below to control the purple roll and your share of the loot.";
  } else if (raidType === "toa") {
    extraText = " Use the raid settings below to set raid level and reward points for the chest roll.";
  } else if (raidType === "tob") {
    extraText = " Use the raid settings below to model deaths, skips, and the purple chance.";
  } else if (rollRange) {
    extraText = ` This activity rolls ${rollRange.min}-${rollRange.max} reward slots per casket.`;
  }
  elements.simulationHelp.textContent = disabled
    ? activity.note || "Simulation is not available for this activity."
    : `Fixed-kill mode runs the entered number of kills. Select a target item to chase it instead.${extraText}`;
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
    elements.simulationResults.innerHTML = '<div class="results-empty">Run a simulation to see the final loot summary.</div>';
  }
}

function renderSimulationResults(result) {
  elements.simulationResults.classList.remove("is-loading");
  const topItems = (result.top_items || [])
    .map((item) => {
      const image = item.item_asset_path ? `<img src="${assetUrl(item.item_asset_path)}" alt="">` : "";
      return `
        <article class="loot-highlight">
          <div class="table-item">
            ${image}
            <div>
              <strong>${item.item_name}</strong>
              <div class="table-cell subtle">${formatNumber(item.quantity)} total</div>
            </div>
          </div>
          <div class="loot-highlight-value">${item.total_ge_value ? formatNumber(item.total_ge_value) : "N/A"} gp</div>
        </article>
      `;
    })
    .join("");

  const allLoot = (result.totals || [])
    .map(
      (item) => `
        <tr>
          <td>
            <div class="table-item">
              ${item.item_asset_path ? `<img src="${assetUrl(item.item_asset_path)}" alt="">` : ""}
              <div>
                <strong>${item.item_name}</strong>
                <div class="table-cell subtle">${item.section || "Drop table"}</div>
              </div>
            </div>
          </td>
          <td>${formatNumber(item.quantity)}</td>
          <td>${item.ge_value_each ? formatNumber(item.ge_value_each) : "N/A"}</td>
          <td>${item.total_ge_value ? formatNumber(item.total_ge_value) : "N/A"}</td>
        </tr>
      `,
    )
    .join("");

  elements.simulationResults.innerHTML = `
    <div class="results-grid">
      <div class="result-metrics">
        <div class="metric-card">
          <span class="field-label">Kills</span>
          <strong>${formatNumber(result.kills_completed)}</strong>
        </div>
        <div class="metric-card">
          <span class="field-label">Distinct items</span>
          <strong>${formatNumber(result.distinct_items)}</strong>
        </div>
        <div class="metric-card">
          <span class="field-label">GE value</span>
          <strong>${formatNumber(result.total_ge_value)}</strong>
        </div>
        <div class="metric-card">
          <span class="field-label">Mode</span>
          <strong>${result.mode === "target" ? "Target" : "Fixed"}</strong>
        </div>
      </div>

      ${
        result.raid_model
          ? `<div class="badge-row">
              <span class="badge">Raid model: ${result.raid_model.toUpperCase()}</span>
              ${
                result.raid_context?.unique_chance !== undefined
                  ? `<span class="badge">Unique chance: ${formatPercent(result.raid_context.unique_chance, 2)}</span>`
                  : ""
              }
            </div>`
          : ""
      }

      ${
        result.mode === "target"
          ? `<div class="meta-chip">Target reached: ${result.target_reached ? "yes" : "no"}</div>`
          : ""
      }

      <div class="drop-section">
        <h4>End result</h4>
        <p class="panel-note">
          Aggregated loot after ${formatNumber(result.kills_completed)} kills.
          ${result.mode === "target" ? " The run ended when the target condition was met or the cap was reached." : ""}
        </p>
        <div class="loot-highlights">
          ${topItems || '<div class="results-empty">No loot recorded.</div>'}
        </div>
      </div>

      <div class="drop-section">
        <h4>Full loot summary</h4>
        <p class="panel-note">Ordered by total GE value, not kill-by-kill drops.</p>
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>GE each</th>
                <th>Total GE</th>
              </tr>
            </thead>
            <tbody>${allLoot || '<tr><td colspan="4">No loot recorded.</td></tr>'}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

async function selectActivity(slug) {
  state.selectedSlug = slug;
  renderActivityGrid();
  elements.dropTableToggle.open = false;
  if (window.scrollY > 120) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  setSimulationLoading("Loading encounter data...");
  try {
    const activity = await getJson(`./data/activities/${slug}.json`);
    state.selectedActivity = activity;
    renderVariantSelector(activity);
    refreshSelectedActivityView(false);
    renderLeaderboard(activity);
    elements.simulationResults.classList.remove("is-loading");
    elements.simulationResults.innerHTML = '<div class="results-empty">Run a simulation to see the final loot summary.</div>';
    closeActivityModal();
  } catch (error) {
    elements.simulationResults.classList.remove("is-loading");
    elements.simulationResults.innerHTML = `<div class="results-empty">${error.message || "Failed to load activity data."}</div>`;
  }
}

async function loadApp() {
  state.status = await getJson("./data/index.json");
  state.activities = state.status.activities || [];
  state.filteredActivities = state.activities.slice();
  filterActivities();

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

elements.simulationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.selectedActivity) {
    return;
  }

  const activityView = getActiveActivityView(state.selectedActivity);
  const payload = {
    ...activityView,
    slug: state.selectedActivity.slug,
    kills: Number(elements.killsInput.value || 0),
  };
  if (state.selectedVariantId) {
    payload.variant_id = state.selectedVariantId;
  }

  if (elements.targetItem.value) {
    payload.target_item_slug = elements.targetItem.value;
    payload.target_count = Number(elements.targetCount.value || 1);
  }

  const raidType = getRaidType(state.selectedActivity.slug);
  if (raidType === "cox") {
    payload.cox_personal_points = Number(elements.coxPersonalPoints.value || 0);
    payload.cox_group_points = Number(elements.coxGroupPoints.value || 0);
  } else if (raidType === "toa") {
    payload.toa_raid_level = Number(elements.toaRaidLevel.value || 0);
    payload.toa_personal_points = Number(elements.toaPersonalPoints.value || 0);
    payload.toa_team_points = Number(elements.toaTeamPoints.value || 0);
  } else if (raidType === "tob") {
    payload.tob_deaths = Number(elements.tobDeaths.value || 0);
    payload.tob_skipped_rooms = Number(elements.tobSkippedRooms.value || 0);
    payload.tob_mvp_bonus = Number(elements.tobMvpBonus.value || 0);
  }

  setSimulationLoading("Rolling loot...");
  await new Promise((resolve) => window.setTimeout(resolve, 220));
  try {
    const result = simulateActivity(payload, {
      kills: payload.kills,
      seed: payload.seed,
      target_item_slug: payload.target_item_slug,
      target_count: payload.target_count,
      cox_personal_points: payload.cox_personal_points,
      cox_group_points: payload.cox_group_points,
      toa_raid_level: payload.toa_raid_level,
      toa_personal_points: payload.toa_personal_points,
      toa_team_points: payload.toa_team_points,
      tob_deaths: payload.tob_deaths,
      tob_skipped_rooms: payload.tob_skipped_rooms,
      tob_mvp_bonus: payload.tob_mvp_bonus,
    });
    renderSimulationResults(result);
  } catch (error) {
    elements.simulationResults.classList.remove("is-loading");
    elements.simulationResults.innerHTML = `<div class="results-empty">${error.message || "Simulation failed."}</div>`;
  }
});

loadApp().catch((error) => {
  console.error(error);
  elements.activityGrid.innerHTML = '<div class="results-empty">The app could not load the cached data files.</div>';
});
