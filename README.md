## Release v0.2.1 — Mobile hotfix

- Fixed a mobile activity-list refresh issue by resetting the filter to **All** after saving and repainting after the modal closes.
- Replaced the native reminder-offset dropdown with five visible, accessible radio choices for mobile Safari and Chrome.
- Kept existing local storage, schedule data, reminder offsets, and backup format unchanged.
- Updated Service Worker cache version to avoid stale UI assets.
- Reminders still run only while the PWA is open. **This version does not add background Push.**

### Publish this patch

```powershell
git add .
git commit -m "fix: mobile task refresh and reminder options v0.2.1"
git push origin main
git tag -a v0.2.1 -m "M Calendar v0.2.1"
git push origin v0.2.1
gh release create v0.2.1 --title "M Calendar v0.2.1" --generate-notes
```

# M Calendar | ام کالندر

**Version:** v0.2.0

Offline-first recurring-task PWA with Persian/English UI and Solar Hijri/Gregorian calendars. The language and calendar can be changed independently.

> **Project name:** M Calendar. The repository slug is `m-calendar`.

## Run locally

```bash
python -m http.server 8080
```

Open `http://localhost:8080`. Service workers require HTTPS or localhost; opening `index.html` as a local file is insufficient.

## First publication to GitHub

1. Create an **empty** repository on GitHub called **`m-calendar`** (do not initialize with a README, license, or .gitignore, since this project includes them).
2. Open a terminal in the extracted **m-calendar** directory and run:

```bash
git init
git branch -M main
git add .
git commit -m "chore: release M Calendar v0.2.0"
git remote add origin https://github.com/YOUR-USERNAME/m-calendar.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. Authenticate with Git Credential Manager / browser or a personal access token, not an account password.

3. In **GitHub → repository → Settings → Pages**, select **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
4. After GitHub Pages has deployed, open `https://YOUR-USERNAME.github.io/m-calendar/`.

### Create a GitHub Release for this version (optional)

After installing/authenticating GitHub CLI (`gh auth login`), run:

```bash
git tag -a v0.2.0 -m "M Calendar v0.2.0"
git push origin v0.2.0
gh release create v0.2.0 --title "M Calendar v0.2.0" --notes "Add app version, bilingual help, and donate tabs."
```

## Commands for **every next version**

First edit files, test locally, and change the version in the README and the service-worker cache key in `sw.js`. Then run (example version `v0.2.0`):

```bash
git status
git add .
git commit -m "feat: release M Calendar v0.2.0"
git push origin main
git tag -a v0.2.0 -m "M Calendar v0.2.0"
git push origin v0.2.0
```

Optional GitHub Release:

```bash
gh release create v0.2.0 --generate-notes --title "M Calendar v0.2.0"
```

**Important:** Do not reuse an existing tag or change a released tag. Always use a **new** version number. Pushing to `main` redeploys GitHub Pages; a tag/release preserves a version snapshot but does not itself redeploy Pages.

## Release v0.2.0 — Timed reminders (foreground only)

- New per-activity reminder toggle and offset (on time / 5 / 15 / 30 / 60 minutes early).
- Explicit **Enable browser notifications** control; permission requested only after a user click.
- Browser reminders checked every 30 seconds and when the tab gains focus.
- Notifications are deduplicated per activity, occurrence date, time and offset; completed occurrences are skipped.
- At most 10 minutes late after waking from suspension; older notifications are silently skipped.
- Local timezone is used; Persian/Gregorian calendar recurrence still maps to canonical dates.
- Reminder choices survive JSON backup/import. Old saved activities remain compatible and disabled by default.
- **Limitations:** requires this PWA to be open/running, a supported browser and notification permission. No backend Push, no notifications guaranteed with the app closed, no alarm-level delivery promise. Clock/timezone changes may alter delivery. For medication, do not rely on this as the only reminder.

### Tests

```bash
node --test tests/*.cjs
```

### Publish v0.2.0

```powershell
git status
git add .
git commit -m "feat: add foreground reminders v0.2.0"
git push origin main
git tag -a v0.2.0 -m "M Calendar v0.2.0"
git push origin v0.2.0
gh release create v0.2.0 --title "M Calendar v0.2.0" --generate-notes
```

**Test reminder delivery:** open the app on HTTPS or localhost, click the browser notification permission button, create a reminder 2 minutes in the future and leave the page running. The app checks due reminders every 30 seconds. Denying permission prevents notification delivery. In a closed tab, notifications are not scheduled.

## Release v0.2.0 — Cryptocurrency donation addresses

- Four donation cards with distinctive icons for Bitcoin, USDT on TRON/TRC20, EVM (Ethereum, BNB Smart Chain, Polygon), and Solana.
- Copy-address buttons, bilingual network descriptions, mobile-friendly layout and explicit verification warnings.
- Addresses are public and static; no wallet connection, payment processing, transfers, transaction monitoring or financial data collection.
- Addresses are taken directly from project owner instructions. Verify ownership and destination before publishing or transferring.
- Local activity data and recurrence engine are unchanged.

### Publish v0.2.0

```powershell
git status
git add .
git commit -m "feat: add cryptocurrency donations v0.2.0"
git push origin main
git tag -a v0.2.0 -m "M Calendar v0.2.0"
git push origin v0.2.0
gh release create v0.2.0 --title "M Calendar v0.2.0" --generate-notes
```

## Release v0.2.0 — Version, help and donate tabs

- Displays the current app version in the footer.
- New bilingual Activities, Help and Donate navigation.
- Help explains task creation, recurrence, end dates, language/calendar settings, backups, and limitations.
- Donate page has no payment link until the project owner supplies a verified destination. No placeholder account or payment collection.
- Existing tasks and local storage remain unchanged.

## Release v0.1.3 — End dates

Run recurrence/end-date tests with `node tests/end-dates.test.cjs` (Node.js required).

- Optional inclusive end date per task; leave blank for indefinite recurrence.
- Quick presets **No end date**, **Until month end**, **Until year end**, plus a manual date picker.
- Presets calculate the end of the chosen **start-date month/year**, in the calendar used by that task (Solar Hijri or Gregorian), rather than the device's current month/year.
- Task recurrence and day markers do not extend past the end date. Existing v0.1.2 tasks without an end date continue indefinitely.
- For an existing task, its original calendar controls recurrence and end-date presets, even if the display calendar was later changed.
- Testing checklist: leap Persian Esfand, Gregorian leap February, December/Esfand year ends, end date equal to start date, editing an older task, backup/restore, and offline update.

## Tech and data

- Plain HTML, CSS and JavaScript; no framework, build step or backend.
- Offline shell via service worker; task data lives in browser `localStorage`.
- Existing local data from Ritmo is preserved using the original storage key `ritmo-data-v1` when the user accesses the **same origin**. Changing from the old GitHub Pages repository URL to a new repository URL changes the origin; **export from the old app and import into the new one** before switching.
- Export/import JSON backups; never commit personal backups or credentials.
- Monthly recurrence uses the calendar selected when the task was created. For short months, it uses the month's last valid date.
- Google Calendar direct sync and push notifications are **not** included in v0.2.0.
- This is a personal organizer, not a clinical medication-management tool.

## Future development

- Automated tests for recurrence, leap years and offline support.
- Task-specific calendar settings, reminder options, improved accessibility and mobile UX.
- Optional Google Calendar integration with OAuth and conflict handling.

MIT License; see `LICENSE`.

## Rename an existing GitHub repository

If the old repository already exists, rename it in GitHub **Settings → General → Repository name** to `m-calendar`, then update your local remote:

```bash
git remote set-url origin https://github.com/YOUR-USERNAME/m-calendar.git
git remote -v
```

A new repo URL may affect GitHub Pages and locally stored app data. Export a backup before switching URLs.
