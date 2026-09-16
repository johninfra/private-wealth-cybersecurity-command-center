# Private Wealth Cybersecurity Command Center

**Protect the people, identities, devices, and decisions around your wealth.**

A privacy-first preparedness workspace for high-net-worth individuals, families, executive households, and trusted advisers. The application turns a guided control assessment into a prioritized roadmap, household access map, incident playbooks, travel checklist, and encrypted local backup—without an account, backend, analytics service, or application network request.

Created by **John Tyler / [johninfra](https://github.com/johninfra)**.

> This project is a planning aid, not a security certification, risk probability, or substitute for personalized legal, financial, insurance, physical-security, or incident-response advice. If anyone is in immediate danger, contact local emergency services.

## Launch the site

When GitHub Pages is enabled for `main` at the repository root, the public site is available at:

**https://johninfra.github.io/private-wealth-cybersecurity-command-center/**

To run a downloaded copy offline, open `index.html` with `styles.css` and `app.js` in the same folder. On Windows, the included launcher can open it:

```powershell
.\Launch-Private-Wealth-Command-Center.ps1
```

The launcher does not download code, change execution policy, request administrator rights, or start a background service.

## What makes this useful

### Executive posture and transparent scoring

- 32-control assessment across seven household-security pillars
- deterministic weighted readiness score with coverage shown separately
- explicit statement that the score is not a probability or certification
- pillar-level readiness and high-impact gap counts
- generated `Critical now`, `Next 30 days`, `Next 90 days`, and `Maintain & verify` roadmap
- share-safe JSON export that intentionally omits household and vendor entries
- print-optimized plan for saving as PDF

### The Fortress Five

Twenty concrete implementation tasks across five priorities:

1. secure the primary email account that resets everything else;
2. eliminate credential reuse;
3. harden money-movement verification and alerts;
4. protect the mobile number against SIM swap and port-out fraud;
5. make recovery contacts, backups, and rehearsals real.

### Household and trusted-party mapping

- people and access register using aliases
- crown-jewel register using safe system labels
- vendor and adviser access review
- authentication, recovery, briefing, and review status
- no field for passwords, account numbers, balances, addresses, government IDs, recovery phrases, or secrets

### Incident response desk

Step-by-step local checklists for:

- payment or wire fraud;
- account takeover;
- SIM swap or unauthorized number port;
- lost or stolen devices;
- identity theft or doxxing;
- impersonation or AI-enabled deepfakes;
- home network or IoT compromise;
- extortion or coercion.

The playbooks emphasize pausing the interaction, verifying through a known channel, containing from a trusted device, preserving evidence, and contacting institutions through official sources.

### Travel mode

- before-departure, in-transit, at-destination, and return checklists
- progress and remaining-task indicators
- heightened travel-mode state
- printable family verification protocol that never stores the private challenge

### Private data controls

- browser `localStorage` only
- no cookies, account, analytics, ads, backend, or telemetry
- no `fetch`, WebSocket, third-party fonts, CDN assets, or runtime API calls
- AES-256-GCM encrypted export with PBKDF2-SHA-256 key derivation
- strict import size, format, algorithm, and iteration validation
- manual full-data erase
- fictional demonstration profile

## Scoring model

Each assessment control has a documented weight from 2 to 5.

| Answer | Credit |
|---|---:|
| Implemented | 100% of the control weight |
| Partial | 50% of the control weight |
| Gap | 0% |
| Unanswered | 0% until rated |
| Not applicable | Excluded from the score denominator |

Assessment coverage is displayed separately to discourage interpreting a lightly completed assessment as comprehensive. The result represents only the supplied answers and fixed weights; it does not estimate breach likelihood, financial loss, adversary capability, or control effectiveness.

## Privacy boundary

The application stores progress in the browser origin's `localStorage`. Data on the GitHub Pages site and data in a directly opened local file can be separate because browsers treat them as different origins.

Use aliases and high-level status labels. Do **not** enter:

- passwords, passkeys, PINs, MFA codes, recovery codes, private keys, or seed phrases;
- account or card numbers, balances, wire instructions, tax identifiers, or government IDs;
- legal names, private addresses, travel itineraries, alarm codes, or safe combinations;
- confidential investigation notes or evidence.

Avoid this tool on shared, managed, public, or otherwise untrusted devices. Browser extensions, local malware, physical access, browser-profile synchronization, backups, and device administrators may affect the confidentiality of browser storage. See [PRIVACY.md](PRIVACY.md) and [THREAT-MODEL.md](THREAT-MODEL.md).

## Encrypted backup

Encrypted exports use:

- AES-GCM with a 256-bit key;
- a random 96-bit initialization vector;
- PBKDF2-HMAC-SHA-256 with 310,000 iterations;
- a random 128-bit salt.

The password is not stored. Losing it makes the backup unrecoverable. Encryption protects the exported file, not the live `localStorage` copy. Web Crypto normally requires a secure context such as GitHub Pages over HTTPS or `localhost`.

## Security design

- local first and dependency free;
- no HTML generated from user-supplied markup;
- imported data is allow-listed, length-limited, and normalized;
- encrypted-import payloads are capped at 2 MiB;
- Content Security Policy blocks connections, frames, objects, media, and inline scripts; local styles support app-generated progress geometry;
- external resources open only after an explicit click and use `noopener noreferrer`;
- no service worker or persistent background process;
- reduced-motion and keyboard/focus support;
- responsive, print-optimized interface.

## Evidence base

The guidance is written as an original synthesis and links directly to authoritative public resources:

- [NIST Cybersecurity Framework 2.0](https://www.nist.gov/cyberframework)
- [NIST SP 800-63B Digital Identity Guidelines](https://pages.nist.gov/800-63-4/sp800-63b.html)
- [CISA Secure Our World](https://www.cisa.gov/secure-our-world)
- [FBI Internet Crime Complaint Center](https://www.ic3.gov/)
- [FTC identity-theft guidance](https://consumer.ftc.gov/articles/what-know-about-identity-theft)
- [FTC SIM-swap guidance](https://consumer.ftc.gov/consumer-alerts/2019/10/sim-swap-scams-how-protect-yourself)

Official guidance and provider capabilities change. Verify current requirements and contacts before acting.

## Project structure

```text
private-wealth-cybersecurity-command-center/
├── index.html
├── styles.css
├── app.js
├── Launch-Private-Wealth-Command-Center.ps1
├── README.md
├── PRIVACY.md
├── SECURITY.md
├── THREAT-MODEL.md
├── CONTRIBUTING.md
├── LICENSE
└── .nojekyll
```

## GitHub Pages

This repository is ready for branch-based GitHub Pages:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Select `main` and `/ (root)`.
4. Save and wait for GitHub to publish the site.

No build step is required.

## Contributing

Use synthetic data in tests, issues, and screenshots. Do not post real incident artifacts, personal information, credentials, private addresses, account identifiers, or confidential provider details. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT License. See [LICENSE](LICENSE).
