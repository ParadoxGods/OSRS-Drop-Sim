# OSRS Drop Table Sim - GitHub Pages Build

Static browser-only version of the OSRS drop table simulator.

## What is included

- Cached OSRS Wiki drop and reward data under `data/`
- Cached official OSRS Hiscores leaderboard snapshots under `data/leaderboards/`
- Cached activity art and item sprites under `assets/`
- Browser UI served entirely from static files
- Client-side simulation logic in `simulator.js`

## Hosting

This folder is ready for GitHub Pages once its contents are the published site root.

GitHub Pages only serves static files, so there is no Python server in this build. If you want to keep this folder nested inside a larger repo, use a GitHub Actions workflow to publish it, or move its contents to the repo root before enabling Pages.

## Notes

- Clue scrolls and mimic variants are simulated locally in the browser.
- The cached data was built from the OSRS Wiki and official Hiscores snapshot data.
- `Sol Heredit` remains a cached view entry with no local simulation table.

## Local preview

If you want to preview it locally, any static file server works. For example:

```bash
python3 -m http.server 8000
```

Then open the folder in your browser.
