# Security Policy

## Supported version

Security fixes are applied to the current `main` branch.

## Reporting a vulnerability

Do not include private household information, credentials, secrets, account identifiers, real incident artifacts, or exploit data that could endanger another person in a public issue.

For a suspected vulnerability in this repository, open a GitHub issue containing only the minimum synthetic reproduction details needed to understand the problem. If public disclosure would create immediate material risk, contact the repository owner through a verified private channel listed on [johncalvintyler.com](https://johncalvintyler.com/).

Useful reports include:

- affected file and browser;
- precise reproduction steps using synthetic data;
- expected and observed behavior;
- security impact and realistic threat scenario;
- a proposed fix, if available.

## Security properties

- static HTML, CSS, and JavaScript with no package dependencies;
- no backend, accounts, telemetry, analytics, or runtime API calls;
- strict Content Security Policy, including `connect-src 'none'`;
- no inline event handlers or inline script; local styling supports app-generated progress geometry;
- user-entered labels rendered with text nodes rather than interpreted as markup;
- allow-listed and length-limited imported fields;
- 2 MiB encrypted-import limit;
- AES-256-GCM encrypted backup using PBKDF2-HMAC-SHA-256;
- external links require user action and use `noopener noreferrer`;
- no service worker, background task, or privileged browser permission.

## Out of scope

- compromise of the browser, device, operating system, extension ecosystem, GitHub account, or GitHub Pages infrastructure;
- confidentiality of data deliberately entered on a shared or managed device;
- provider behavior after the user follows an external link;
- guarantees about security products, financial institutions, carriers, insurers, or third-party services;
- accuracy of user-supplied assessment answers;
- social, physical, or legal risks outside the application's control.

## Safe testing

Use only synthetic aliases and fictional scenarios. Do not test with real credentials, account numbers, incident messages, legal names, private addresses, private keys, recovery material, or confidential vendor data.
