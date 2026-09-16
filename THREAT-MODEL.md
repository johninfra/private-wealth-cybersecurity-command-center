# Threat Model

## Purpose

This document explains what the application is designed to protect, what it assumes, and what it cannot protect. It is not a complete threat model for any particular person, family, office, or estate.

## Assets

- assessment and checklist progress;
- optional aliases and high-level household, system, and vendor status labels;
- availability and integrity of the static application;
- confidentiality and integrity of encrypted backup files;
- correctness of displayed playbooks and official resource links.

## Trust boundaries

1. **Static repository and hosting:** GitHub repository content and GitHub Pages distribution.
2. **Browser runtime:** the browser executes local application code and enforces Content Security Policy.
3. **Local storage:** unencrypted application state associated with the browser origin.
4. **Encrypted export:** a user-controlled file protected by a user-supplied password.
5. **External navigation:** official resources opened only after an explicit user click.

## In-scope threats and controls

| Threat | Principal control |
|---|---|
| Accidental data transmission | No runtime network APIs; `connect-src 'none'` |
| Third-party script compromise | No third-party scripts or package dependencies |
| Stored markup injection | User fields rendered as text; imported strings normalized and limited |
| Malformed or oversized import | Strict format checks, allow-listed state schema, 2 MiB file limit |
| Backup disclosure | AES-256-GCM encrypted export with random salt and IV |
| Reverse tabnabbing | External links use `noopener noreferrer` |
| Unintended form submission | CSP `form-action 'none'`; forms handled locally |
| Framed active content | CSP blocks frames, objects, and media |
| Misleading readiness result | Coverage shown separately; fixed scoring explained; no probability claim |
| Sensitive data entered by mistake | Persistent in-product warnings and fields designed for aliases/status only |

## Residual risks

- `localStorage` is not encrypted and is readable by code executing in the same origin.
- A compromised browser, operating system, extension, device administrator, or GitHub account can defeat application-level controls.
- Weak backup passwords can be guessed despite key derivation.
- Screen capture, shoulder surfing, printing, device backups, and browser synchronization can expose information.
- External guidance, reporting URLs, provider controls, and laws can change.
- A self-assessment can be incomplete, inaccurate, or overconfident.
- The application cannot verify whether a control is implemented effectively.

## Explicitly excluded data

Do not enter or import passwords, passkeys, MFA codes, recovery codes, seed phrases, private keys, full legal identities, private addresses, government identifiers, account numbers, balances, alarm codes, wire instructions, evidence from a live incident, or travel details.

## Review triggers

Review this threat model after changes to storage, cryptography, content rendering, external resources, hosting, browser permissions, dependencies, or import/export behavior.

