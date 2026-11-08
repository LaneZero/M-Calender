# M Calendar v0.2.2 — Audit & QA

## Root causes and changes

1. **Task creation / apparent missing card**: the old filter and modal close/repaint behavior could make the new task seem absent. Always switch to Activities → All, render immediately, show a saved confirmation, and bring the card into view.
2. **Mark done no visible change**: the old handler marked the *earliest* historical pending recurrence. With multiple missed occurrences the card continued to show overdue. It now records the latest actionable occurrence and shows immediate feedback; Undo is retained.
3. **Incorrect overdue status**: the previous `dueUntil()` treated any past uncompleted occurrence as permanently overdue and labeled even today's due date as overdue. A task status distinguishes Today, Overdue, Done, Upcoming, Ended; fixed schedule maintains recurring anchor.
4. **Mobile notification failure**: `new Notification()` throws on most mobile browsers. New delivery first uses an active Service Worker registration's `showNotification` and falls back to the desktop constructor. Added Test notification, clearer permission states, explicit errors and click-to-focus notification handling. Notification permission still needs HTTPS and user interaction.
5. **Regression protection**: 8 automated checks, JS syntax checks, preserved legacy `ritmo-data-v1` key, versioned SW cache. Tested Persian and Gregorian date presets, reminder offsets, and status boundaries.

## Known limits

- Automated Chromium navigation was blocked by the test environment (`ERR_BLOCKED_BY_ADMINISTRATOR`). No claim of completed manual Chrome/Firefox/Android/iOS testing.
- No backend push: scheduled reminders only run while the web app is running; device sleeping/browser throttling can delay alerts.
- Existing history schema stores scheduled ISO days, not actual completion timestamps. Future versions should migrate it for detailed audit trails.
- No multi-device sync or Google Calendar integration yet.

## Manual acceptance tests

- Open GitHub Pages in Chrome + Firefox on desktop and Android; test mobile viewport and touch.
- Export backup; add new task while filter=Due, verify it appears in All instantly.
- Start an activity today at 10:00; verify Today badge (not Overdue) until date changes.
- Mark a previously missed occurrence done; verify status and next due change, then Undo.
- Enable browser notifications from user click; click Test notification and check OS delivery; test timed reminder while tab stays active.
- Test blocked permission / insecure context / disconnected network after PWA has cached.
- Reopen after update and verify existing local tasks, Persian/Gregorian calendar, both languages, donation addresses.

## Publish commands

```powershell
git add .
git commit -m "fix: task refresh, status and notifications v0.2.2"
git push origin main
git tag -a v0.2.2 -m "M Calendar v0.2.2"
git push origin v0.2.2
gh release create v0.2.2 --title "M Calendar v0.2.2" --generate-notes
```
