# M Calendar v0.2.5 — Code review & release checks

## Scope
Reviewed the v0.2.4 static PWA files: `src.js`, `reminders.js`, `sw.js`, `index.html`, `styles.css`, `themes.css`, `manifest.webmanifest`, and tests.

## Changes
1. Moved theme controls into a compact, keyboard-accessible native `details` Settings panel; language and calendar settings stay in the same panel. Maintained the existing theme values and persistence key.
2. Reminder notification titles now use **M Calendar · [category emoji] [exact task title]**, with the scheduled date and time in the body. Emoji mapping: general 📌, health 💊, work 💼, personal 🌿. Localized Persian and English text.
3. Updated the notification path to register/await an activated Service Worker before using `showNotification`, instead of relying on `new Notification` on iOS. Added iOS Home Screen instructions and an actionable test notification.
4. Updated cache revision to `v0.2.5` so the UI script/styles are refreshed after deployment. Kept the existing `ritmo-data-v1` storage key for backward compatibility.

## Findings and remaining limitations
- **High priority:** This release still uses an **in-page polling scheduler** (`setInterval`). It cannot guarantee delivery at a specific time while iOS suspends the page or when the PWA is closed. Background Web Push requires a push service/server and subscription management; it is not part of this static GitHub Pages release.
- **Medium priority:** The app stores activities in local browser storage. Clearing site data or changing devices loses data unless a user exports a JSON backup. Backup import replaces current tasks.
- **Medium priority:** Notification content may be visible on the lock screen. A task title may contain sensitive health or personal details. Users should avoid sensitive task names or adjust OS notification preview settings.
- **Medium priority:** Runtime notifications, iOS Home Screen installation, and cross-browser/mobile UI still require physical-device verification. The environment blocks local browser navigation (ERR_BLOCKED_BY_ADMINISTRATOR).
- **Future architecture:** A proper background push service must include authentication/authorization, push subscription storage, cancellation handling, timezone/DST policies, retries, and opt-out, as well as deduplication across devices.

## Validation
- `node --check src.js`, `node --check sw.js`: pass.
- `tests/end-dates.test.cjs`: pass.
- `tests/mobile-ui-regression.test.cjs`: pass.
- `tests/notifications-ui.test.cjs`: pass.
- `tests/reminders.test.cjs`: pass.
- `tests/status-regression.test.cjs`: pass.
- `tests/theme-ui.test.cjs`: pass.
- Manifest referenced icon assets and local font: present.
- Interactive Chromium check: blocked by environment; **not marked as passed**.

## Real-device acceptance checklist
1. In iPhone Safari, add M Calendar to Home Screen, open it from the installed icon, request notification permission with a tap, then tap Test notification.
2. Confirm title includes `M Calendar`, emoji, and exact task title; confirm body includes the scheduled time. Inspect lock-screen privacy.
3. Repeat permission and test notification in Chrome Android, Firefox Android, Chrome desktop and Firefox desktop when supported.
4. Select all five themes, change language FA/EN, change Jalali/Gregorian, reload the app, and verify state persists.
5. Create a task, mark an occurrence completed, reload, then export a JSON backup. Confirm no data loss.
