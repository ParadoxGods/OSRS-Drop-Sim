# OSRS Drop Simulator

A static, GitHub Pages-ready Old School RuneScape drop simulator focused on one job: let a player choose an activity, run a realistic loot simulation, and review the outcome in a clean browser UI without needing a backend.

This repository is the browser-only build of the simulator. It runs entirely on static files and is designed to ship directly on GitHub Pages.

## What This Project Is

This app is a cached OSRS loot simulator built from wiki-derived drop data and custom encounter logic.

It is designed for players who want to answer questions like:

- "What does 100 Vorkath kills usually look like?"
- "How long would this boss grind take at a typical pace?"
- "Which boss is the fastest route to a target item?"
- "Which standard boss is best for hitting a GP goal?"
- "How do my account-specific settings change certain raid or group-boss outcomes?"

The goal is not just to list drop rates. The goal is to make those rates usable.

## At A Glance

- Static site with no build step and no backend requirement for GitHub Pages
- Client-side simulation engine in plain JavaScript
- Cached OSRS Wiki data stored locally in the repository
- Checked-in asset pack with local item sprites and activity art
- Single-pane simulator workflow built for desktop and mobile use
- Detailed loot review with per-line explanation modals
- Screenshot export for result sharing
- Persistent theme editor stored in `localStorage`

## Current Cache Snapshot

The checked-in data snapshot in this repository was generated at:

- `2026-03-19T04:45:22.381665+00:00`

Current repository totals:

- `75` cached activities
- `74` supported activities
- `74` simulation-enabled activities
- `1,569` cached item sprite files
- `76` activity image files

The one cached activity that is still not simulation-enabled is:

- `Sol Heredit`

## What Makes This Different

Most RuneScape loot tools stop at one of these two extremes:

- a raw drop-table reference
- a very simple "roll N times" calculator that ignores context

This project goes further by combining:

- locally cached drop data
- encounter-specific reward models
- mode-specific comparison views
- group and raid modifiers
- session time estimates
- detailed per-line loot explanations

That means the app tries to model the actual scenario a player cares about, not just the isolated nominal drop rate.

## Core Simulation Modes

The UI exposes three primary modes.

### 1. Simulate Attempts

Use this when you already know the boss or activity and want to simulate a fixed number of completions.

Example use cases:

- `100` Zulrah kills
- `500` Cerberus kills
- `20` ToA completions
- `300` elite clue caskets

This mode shows:

- total value
- estimated session duration
- value per run
- top loot
- full loot table
- per-line loot details

### 2. Simulate Drop

This is item-first comparison mode.

Instead of picking a boss first, the user picks an item. The app then finds the eligible bosses that can drop that item and compares them by median simulated KC.

Example use cases:

- compare bosses that can drop `dragon pickaxe`
- compare routes to a specific wilderness unique
- see which source is usually fastest for a target item

This mode shows:

- ranked boss comparison
- median chase KC
- representative loot preview for each ranked boss
- estimated time to complete the chase

### 3. GP Target

This mode ignores the selected activity and instead compares all eligible standard kill-based bosses to see how many kills it would usually take to reach a chosen GP target.

Example use cases:

- "Which boss gets me to `10m gp` fastest?"
- "How long is a `50m gp` grind likely to take?"

This mode intentionally excludes activities that are not a clean "kill one boss -> receive one loot event" loop, such as:

- clue caskets
- raids in the comparison pool
- long-form reward activities
- chest/reward-loop content that is not a standard boss kill

It shows:

- ranked boss list
- median simulated KC
- estimated session duration
- average GP per kill
- centered modal loot preview on boss click

## Supported Content Types

The simulator is not limited to ordinary single-roll bosses.

### Standard Bosses

These use the cached drop rows plus activity-specific handling where needed.

Examples:

- Zulrah
- Vorkath
- Cerberus
- Araxxor
- Duke Sucellus
- Vardorvis
- The Whisperer
- The Leviathan
- Alchemical Hydra
- many others

### Clue Caskets

Supported:

- Beginner
- Easy
- Medium
- Hard
- Elite
- Master

These are modeled as casket-style reward events rather than standard monster kills.

The simulator handles:

- reward-slot roll ranges by clue tier
- independent tertiary clue outcomes where relevant
- optional Mimic branching for elite and master clues

### Mimic

Mimic is treated as its own reward model rather than a generic clue row dump.

The simulator accounts for:

- attempt count
- elite vs master-style Mimic logic
- dedicated Mimic reward bundle handling

### Raids

Supported with custom logic:

- Chambers of Xeric
- Chambers of Xeric: Challenge Mode
- Tombs of Amascut
- Tombs of Amascut: Expert Mode
- Theatre of Blood
- Theatre of Blood: Hard Mode

These are not simulated as normal drop tables. Each raid uses a dedicated reward model.

### Group / Contribution Bosses

These use dedicated personal-share logic rather than the default single-player kill-owner model.

Currently handled with custom logic:

- Nex
- The Nightmare
- The Hueycoatl
- Royal Titans
- Yama

## Encounter Modeling

This is where most of the work in the repository lives.

## Standard Drop-Table Model

For ordinary bosses, the simulator uses:

- guaranteed drops
- independent tertiary rolls
- exclusive pool sections
- quantity parsing from the cached wiki rows
- GE value estimates stored with each row

The end result is an aggregated loot summary, not noisy per-kill spam.

## Clue Casket Model

Clue caskets are modeled by reward-slot ranges instead of one ordinary table roll.

Current clue reward-slot configuration:

- Beginner: `1-3`
- Easy: `2-4`
- Medium: `3-5`
- Hard: `4-6`
- Elite: `4-6`
- Master: `5-7`

Additional modeled logic includes:

- easy master clue tertiary
- medium master clue tertiary
- hard master clue tertiary
- elite master clue tertiary
- master Bloodhound tertiary
- optional Mimic branch for elite and master clues

## Mimic Model

The Mimic is treated separately from ordinary clue caskets.

The simulator accounts for:

- tier-specific reward behavior
- attempt count scaling
- distinct bonus reward bundle behavior
- dedicated elite/master Mimic chance handling

## Chambers of Xeric Model

CoX is not simulated as a normal boss drop table.

The app models:

- personal points
- team points
- purple share logic
- normal chest vs purple chest flow
- clue chance behavior
- timed CM tertiary toggles
- elite CA clue modifier

Important note:

- this is a dedicated raid reward model, not a straight roll against the cached drop rows

## Tombs of Amascut Model

ToA is modeled with raid-specific variables, including:

- raid level
- personal reward points
- team reward points
- completion count
- thread ownership
- owned jewel tracking

The app accounts for:

- raid-level-weighted unique chance
- share-based unique receipt chance
- common reward behavior
- thread handling
- jewel handling
- clue tertiary logic
- reward differences between normal and expert-style settings

## Theatre of Blood Model

ToB is modeled from a score-based framework rather than a standard loot table.

Inputs include:

- team size
- your deaths
- team deaths
- your skipped rooms
- team skipped rooms
- MVP bonus
- timed HM state where applicable

The app uses that to estimate:

- personal purple chance
- team purple chance
- common reward handling
- hard-mode context

## Group Boss Models

### Nex

The simulator accounts for:

- team size
- personal contribution percentage
- MVP state
- team vs duo pacing in the time model
- personal unique share logic

### The Nightmare

The simulator accounts for:

- team size
- personal contribution percentage
- MVP state
- elite Combat Achievement clue modifier
- group-specific reward behavior

### The Hueycoatl

The simulator accounts for:

- team size
- personal contribution percentage
- MVP quantity bonus
- body-damage requirement toggle
- hard Combat Achievement clue modifier

### Royal Titans

The simulator accounts for:

- contribution percentage
- Branda vs Eldric
- reward choice mode
- hard and elite clue modifiers

Supported reward choices:

- Loot
- Take pages
- Sacrifice

### Yama

The simulator accounts for:

- team size
- personal contribution percentage
- elite CA clue modifier
- contribution-driven reward behavior
- junk-table edge cases

## Advanced Modifiers

The UI exposes advanced account-state modifiers only when they are relevant.

Current advanced modifiers include:

- Yama elite CA clue boost
- Chambers of Xeric elite CA clue boost
- The Nightmare elite CA clue boost
- Hueycoatl hard CA clue boost
- Royal Titans hard clue and elite clue CA boosts
- ToA thread already owned
- ToA owned jewel tracking

The purpose of these controls is to move the sim closer to "my account, my state" instead of only "fresh wiki drop rate".

## Session Time Estimates

The app now estimates how long a simulated session would take.

This is shown as:

- average duration
- low-end duration
- high-end duration
- average duration per kill or completion

The timing band is:

- `+- 15%`

Why the time estimate exists:

- raw KC alone does not communicate real grind size
- two bosses with similar KC can have very different session lengths
- GP and target-item comparison are much more useful when time is visible

### How Time Is Calculated

Each activity has a time profile.

That profile contains:

- average seconds per kill or completion
- a timing variance fraction
- a reference label
- a reference note

When possible, the profile is anchored to OSRS Wiki money-making guide assumptions, usually via the guide's stated kills-per-hour or completions-per-hour pace.

When a direct wiki timing reference was not cleanly available, the repository uses a curated estimate based on a standard loop for that activity.

Examples:

- Zulrah uses the wiki assumption of `20 kills per hour`
- Vorkath uses the wiki Dragon hunter crossbow assumption of `30 kills per hour`
- Vardorvis uses the wiki assumption of `32 kills per hour`
- Phosani's Nightmare uses the wiki assumption of `8 kills per hour`
- Nex adjusts by selected team size, using a slower duo baseline than standard team kills

Important limitations:

- the time estimate is a planning aid, not a personal DPS calculator
- it does not inspect your exact gear, supplies, or route execution
- it represents a typical loop, not a speedrun or worst-case trip

## Loot Review

The app intentionally emphasizes end-state review over per-kill clutter.

The main results surface is built around:

- total value
- estimated duration
- top loot
- section breakdown
- full loot table

## Details Modal

Every loot line exposes a `Details` button.

That modal explains, as precisely as the current model allows:

- which section generated the line
- the chance text used for that source
- the quantity rule
- hit count
- average quantity per hit
- average quantity per run
- special scenario modifiers that affected the calculation

This is especially important for:

- clue casket bundles
- Mimic branches
- raid reward logic
- group boss share-based loot

## Screenshot Export

The app includes a screenshot/export action for results.

It generates a shareable result card that is suitable for:

- Discord
- Reddit
- progress logs
- comparison screenshots

## Theme Editor

The UI includes a `Change theme` control.

Players can change:

- page background
- panel colors
- text colors
- accent colors

Theme choices are saved in:

- `localStorage`

That means the selected theme persists across reloads in the same browser.

## Data Sources

The repository is built around cached local data rather than live API calls during normal use.

Primary sources:

- OSRS Wiki drop and reward pages
- OSRS Wiki money-making guides for pacing references
- cached hiscore data snapshots gathered during sync

The live UI intentionally does not expose a hiscore view anymore, but some cached leaderboard files still exist in the repository as sync artifacts.

## Repository Structure

Key files and directories:

- `index.html`
  - Main GitHub Pages entry point
- `styles.css`
  - Entire front-end stylesheet
- `app.js`
  - UI state, rendering, event handling, comparison flows, screenshot export, and theme persistence
- `simulator.js`
  - Core simulation engine and encounter-specific reward logic
- `activity-time-profiles.js`
  - Session duration reference data and time estimation helpers
- `data/`
  - Cached activity payloads and index files
- `data/activities/`
  - Per-activity drop and reward JSON
- `data/leaderboards/`
  - Cached leaderboard snapshots retained from sync
- `assets/items/`
  - Item sprites
- `assets/activities/`
  - Activity artwork
- `sync_data.py`
  - Data-sync pipeline used to rebuild cached local data
- `app.py`
  - Optional local Python server for previewing the Pages build from this repo
- `simulator.py`
  - Python-side simulator logic kept for local/server-side compatibility work
- `.nojekyll`
  - Ensures GitHub Pages serves the site as a plain static project without Jekyll processing

## Local Development

This project does not require a JavaScript build system.

It is plain:

- HTML
- CSS
- browser-side JavaScript modules

### Option 1: Static File Preview

If you just want to preview the Pages build exactly as a static site:

```bash
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000`

### Option 2: Local Python Server

This repository also includes a lightweight Python server that serves the same root Pages app:

```bash
python3 app.py
```

By default it binds to:

- `HOST=0.0.0.0`
- `PORT=8765`

You can override that with environment variables or command-line arguments.

Examples:

```bash
python3 app.py --host 127.0.0.1 --port 8000
```

```bash
HOST=127.0.0.1 PORT=8000 python3 app.py
```

## GitHub Pages Deployment

This repository is already structured for GitHub Pages.

There is:

- no frontend build step
- no bundler
- no framework compilation step
- no backend dependency for the deployed site

### Deploying From The Repository Root

If this repository itself is the Pages repo:

1. Push the repository to GitHub.
2. Open repository `Settings`.
3. Open `Pages`.
4. Set source to `Deploy from a branch`.
5. Choose branch `main`.
6. Choose folder `/ (root)`.
7. Save.

GitHub Pages will then publish:

- `index.html`
- `app.js`
- `styles.css`
- `simulator.js`
- `activity-time-profiles.js`
- `data/`
- `assets/`

### Why `.nojekyll` Is Included

GitHub Pages runs Jekyll by default unless told otherwise.

This repository includes:

- `.nojekyll`

That prevents Jekyll from interfering with static asset paths and ensures the repo is served as-is.

## Refreshing The Cached Data

The checked-in data is static.

If the OSRS Wiki changes and you want the repository to reflect the new data, use:

```bash
python3 sync_data.py
```

Important notes:

- this requires live network access to the source pages
- the data refresh process can take time
- sprite and activity assets may also be re-fetched during sync
- after a sync, the changed JSON and assets should be committed if you want the Pages deployment to include them

## Design Philosophy

The current UI is intentionally centered around a compact simulator flow.

The design priorities are:

- one clear primary task
- minimal navigation overhead
- end-state loot review instead of spam
- compact comparison views
- no dependency on a framework runtime

It is meant to feel like a focused OSRS utility rather than a wiki mirror.

## Accuracy Philosophy

This project tries to be accurate in the following order:

1. correct reward structure
2. correct special-case logic
3. correct account-state modifiers where supported
4. practical usability of the output

That means the simulator prefers:

- dedicated encounter models when a boss or raid genuinely needs one
- explicit notes when logic is approximate
- account-state inputs where they materially change outcomes

It does not pretend every activity is just "roll against one table N times".

## Known Limitations

This is a high-effort simulator, but it is not an official Jagex tool and it is not perfect.

Important limitations:

- some activities still use curated timing references instead of direct wiki timing assumptions
- session time estimates are reference-grade, not personalized speed calculations
- market values are only as current as the cached GE estimates bundled with the data
- future OSRS updates can invalidate reward logic until the repo is refreshed
- `Sol Heredit` is still cached but not simulation-enabled

## What The UI Intentionally Does Not Do

The current product direction intentionally avoids:

- live hiscore dashboards
- a separate wiki-browser experience inside the app
- per-kill loot spam as the primary output
- framework-heavy deployment requirements

The project is centered on simulation quality and result review.

## Troubleshooting

### The page loads but no data appears

Make sure the following directories are present at the site root:

- `data/`
- `assets/`

### GitHub Pages deploys but assets are missing

Make sure:

- the repo root contains the site files
- `.nojekyll` is present
- GitHub Pages is publishing from the correct branch and root folder

### A local server still shows an older UI

Use the root Pages app, not the legacy `static/` copy.

The included `app.py` has already been updated to serve the root app files.

### A result feels too fast or too slow

That likely means one of two things:

- the activity is using a curated session-time estimate
- your personal gear/route is materially faster or slower than the reference loop

The loot model and the timing model are related, but they are not the same thing.

## Development Notes

This project currently mixes static-site and Python helper pieces because it grew from a local Python-based simulator into a static GitHub Pages deployment.

The public-facing Pages build is the important part.

In practice:

- the static files are the real shipped app
- the Python files exist to support local serving, syncing, and compatibility work

## Maintainer Checklist

When making substantial simulator changes, the usual workflow is:

1. update the relevant encounter logic in `simulator.js`
2. update UI controls in `index.html` and `app.js`
3. update styling in `styles.css` if the output shape changed
4. refresh cached data if the source tables changed
5. run syntax checks
6. commit and push to `main`

Useful checks:

```bash
node --check app.js
node --check simulator.js
node --check activity-time-profiles.js
python3 -m py_compile app.py
```

## Project Status

This repository is already usable as a published OSRS simulator.

It currently supports:

- fixed-run loot simulation
- item-first boss comparison
- GP-target boss comparison
- clue caskets
- Mimic
- raids with custom models
- several group/contribution reward systems
- session duration estimation
- detailed loot explanation
- screenshot export
- theme persistence

The project is best thought of as:

- a static simulator product
- a cached OSRS data bundle
- a specialized encounter-logic codebase

If you are looking for a GitHub Pages-ready OSRS loot simulator with local data and no backend requirement, this repository is built for exactly that.
