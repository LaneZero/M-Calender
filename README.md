# M Calendar | ام کالندر

**Version:** v0.1.2

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
git commit -m "chore: release M Calendar v0.1.2"
git remote add origin https://github.com/YOUR-USERNAME/m-calendar.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. Authenticate with Git Credential Manager / browser or a personal access token, not an account password.

3. In **GitHub → repository → Settings → Pages**, select **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
4. After GitHub Pages has deployed, open `https://YOUR-USERNAME.github.io/m-calendar/`.

### Create a GitHub Release for this version (optional)

After installing/authenticating GitHub CLI (`gh auth login`), run:

```bash
git tag -a v0.1.2 -m "M Calendar v0.1.2"
git push origin v0.1.2
gh release create v0.1.2 --title "M Calendar v0.1.2" --notes "Initial bilingual PWA release; Persian and Gregorian calendars."
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

## Tech and data

- Plain HTML, CSS and JavaScript; no framework, build step or backend.
- Offline shell via service worker; task data lives in browser `localStorage`.
- Existing local data from Ritmo is preserved using the original storage key `ritmo-data-v1` when the user accesses the **same origin**. Changing from the old GitHub Pages repository URL to a new repository URL changes the origin; **export from the old app and import into the new one** before switching.
- Export/import JSON backups; never commit personal backups or credentials.
- Monthly recurrence uses the calendar selected when the task was created. For short months, it uses the month's last valid date.
- Google Calendar direct sync and push notifications are **not** included in v0.1.2.
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
