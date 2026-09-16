# Privacy

## Summary

Private Wealth Cybersecurity Command Center is a static, local-first browser application. It has no account system, application backend, analytics service, advertising code, telemetry, cookies, remote database, or runtime application API calls.

## Data stored

The application stores the following in the current browser origin's `localStorage`:

- assessment answers;
- Fortress Five and travel checklist progress;
- aliases and high-level status fields in the people, crown-jewel, and trusted-party registers;
- incident checklist progress;
- the last local update timestamp.

The application does not include a field intended for passwords, account numbers, private keys, balances, addresses, government identifiers, or other secrets.

## Data not transmitted by the application

The application does not use `fetch`, XMLHttpRequest, WebSocket, WebRTC, beacons, service workers, third-party fonts, CDN scripts, embedded media, or analytics SDKs. Its Content Security Policy sets `connect-src 'none'`.

The Resources page contains ordinary links to external websites. Following one of those links is an explicit navigation away from the application and is governed by the destination's privacy practices.

GitHub Pages and the browser or network used to reach it may independently process ordinary web-request metadata. That infrastructure is outside this application's code and storage model.

## Encrypted export

An encrypted workspace export is created locally with the Web Crypto API. The password is used in memory to derive an encryption key and is not stored by the application.

The exported file contains the local workspace state. It may therefore contain aliases and status labels entered by the user. Handle the file as private even though it is encrypted. The separate share-safe action-plan export intentionally excludes people, asset, vendor, incident, and travel register data.

## Deletion

Use **Privacy & data → Erase all local data** to remove the application key from local storage. Browser settings can also clear site data. Deleting repository files or closing a tab does not necessarily erase browser storage.

## Important limits

Local storage is not an encrypted vault. Browser extensions, malware, device administrators, physical access, browser-profile synchronization, local backups, and forensic tools may be able to access it. Use aliases, avoid secrets, and do not use the application on a shared or untrusted device.

