# Changelog

## v0.2.5
- Move theme selection into a compact, accessible Settings panel with language and calendar preferences.
- Use branded, localized notification content with activity name and category emojis.
- Await an active service worker before displaying a notification and improve iPhone setup guidance.
- Refresh the offline cache without changing stored tasks.
- Perform regression tests; real-device notification delivery remains unverified.

## v0.2.4
- Replace the app icon with the new official M Calendar artwork across the app shell, manifest, notifications and install assets.
- Add Vazirmatn as the Persian UI font and load it locally for better Persian readability.
- Improve the public README with right-to-left formatting for Persian sections and more polished user-facing documentation.
- Refresh the service worker cache so updated branding assets and fonts are fetched correctly after deployment.

## v0.2.3
- Replace “Offline-first PWA” footer phrase with localized, user-centered copy.
- Add five gentle theme choices and persist the selected preference.
- Improve mobile controls, minimum touch target sizes, responsive activity cards and calendar layout.
- Respect existing task data and support importing legacy JSON backups.
- Version service worker cache to refresh styles after deployment.

## v0.2.2
- Fix task list refresh, completion feedback, due status and improve mobile notification display.
