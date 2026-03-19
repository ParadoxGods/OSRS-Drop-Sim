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
  search: document.getElementById("search"),
  supportedOnly: document.getElementById("supportedOnly"),
  statActivities: document.getElementById("statActivities"),
  statSupported: document.getElementById("statSupported"),
  statSimulation: document.getElementById("statSimulation"),
  modalSearch: document.getElementById("modalSearch"),
  modalSupportedOnly: document.getElementById("modalSupportedOnly"),
  modalCountLabel: document.getElementById("modalCountLabel"),
  statusText: document.getElementById("statusText"),
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
  seedInput: document.getElementById("seedInput"),
  targetItem: document.getElementById("targetItem"),
  targetCount: document.getElementById("targetCount"),
};

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "N/A";
  }
  return new Intl.NumberFormat("en-US").format(value);
}

function assetUrl(path) {
  if (!path) {
    return "";
  }
  return `./${path.replace(/^\/+/, "")}`;
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

function renderStatus() {
  if (!state.status) {
    return;
  }
  elements.statActivities.textContent = formatNumber(state.status.activity_count || 0);
  elements.statSupported.textContent = formatNumber(state.status.supported_count || 0);
  elements.statSimulation.textContent = formatNumber(state.status.simulation_enabled_count || 0);
  const generated = state.status.generated_at ? new Date(state.status.generated_at).toLocaleString() : "not synced";
  elements.statusText.textContent = `Cache generated ${generated}`;
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
  const search = elements.search.value.trim().toLowerCase();
  const supportedOnly = elements.supportedOnly.checked;
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
  elements.modalSearch.value = elements.search.value;
  elements.modalSupportedOnly.checked = elements.supportedOnly.checked;
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
  const sectionNames = Array.from(new Set(rows.map((row) => row.section)));
  elements.dropTableSummary.textContent = rows.length
    ? `Open cached drop table (${formatNumber(rows.length)} rows across ${formatNumber(sectionNames.length)} sections)`
    : "No cached drop table available";
  if (!rows.length) {
    elements.dropSections.innerHTML = '<div class="results-empty">No cached drop rows for this activity yet.</div>';
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
  elements.seedInput.disabled = disabled;
  const rollRange = activity.simulation?.reward_roll_range;
  const rollText = rollRange ? ` This activity rolls ${rollRange.min}-${rollRange.max} reward slots per casket.` : "";
  elements.simulationHelp.textContent = disabled
    ? activity.note || "Simulation is not available for this activity."
    : `Fixed-kill mode runs the entered number of kills. Select a target item to chase it instead.${rollText}`;
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
  renderStatus();
  filterActivities();

  const preferred =
    state.activities.find((activity) => activity.supported && !activity.simulation_disabled) ||
    state.activities.find((activity) => activity.supported) ||
    state.activities[0];
  if (preferred) {
    await selectActivity(preferred.slug);
  }
}

elements.search.addEventListener("input", filterActivities);
elements.supportedOnly.addEventListener("change", filterActivities);
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

  if (elements.seedInput.value.trim()) {
    payload.seed = Number(elements.seedInput.value);
  }
  if (elements.targetItem.value) {
    payload.target_item_slug = elements.targetItem.value;
    payload.target_count = Number(elements.targetCount.value || 1);
  }

  setSimulationLoading("Rolling loot...");
  await new Promise((resolve) => window.setTimeout(resolve, 220));
  try {
    const result = simulateActivity(payload, {
      kills: payload.kills,
      seed: payload.seed,
      target_item_slug: payload.target_item_slug,
      target_count: payload.target_count,
    });
    renderSimulationResults(result);
  } catch (error) {
    elements.simulationResults.classList.remove("is-loading");
    elements.simulationResults.innerHTML = `<div class="results-empty">${error.message || "Simulation failed."}</div>`;
  }
});

loadApp().catch((error) => {
  console.error(error);
  elements.statusText.textContent = "Failed to load local cache.";
  elements.activityGrid.innerHTML = '<div class="results-empty">The app could not load the cached data files.</div>';
});
