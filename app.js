(() => {
  'use strict';

  const STORAGE_KEY = 'pwcc-state-v1';
  const STATE_VERSION = 1;
  const MAX_IMPORT_BYTES = 2 * 1024 * 1024;

  const PILLARS = [
    { id: 'identity', label: 'Identity & access' },
    { id: 'money', label: 'Money movement' },
    { id: 'devices', label: 'Devices & data' },
    { id: 'communications', label: 'Communications' },
    { id: 'home', label: 'Home & travel' },
    { id: 'people', label: 'People & vendors' },
    { id: 'response', label: 'Response & recovery' }
  ];

  const QUESTIONS = [
    {
      id: 'id-primary-email', pillar: 'identity', weight: 5, critical: true, timing: 'now', effort: '30–60 min',
      title: 'Primary email uses phishing-resistant authentication.',
      detail: 'The email account that can reset other accounts uses passkeys or hardware security keys, with a tested backup authenticator.',
      action: 'Add at least two phishing-resistant authenticators to primary email, remove weak recovery paths where practical, and test recovery.'
    },
    {
      id: 'id-password-manager', pillar: 'identity', weight: 5, critical: true, timing: 'now', effort: '1–2 hours',
      title: 'Every important account has a unique password in a password manager.',
      detail: 'No password is reused across email, financial, cloud, mobile carrier, social, or household-management accounts.',
      action: 'Adopt a reputable password manager, secure it with strong MFA, and replace reused passwords starting with primary email and finance.'
    },
    {
      id: 'id-financial-mfa', pillar: 'identity', weight: 5, critical: true, timing: 'now', effort: '45 min',
      title: 'Sensitive financial accounts use the strongest MFA each provider offers.',
      detail: 'Security keys, passkeys, or authenticator apps are preferred over SMS whenever the provider supports them.',
      action: 'Review authentication settings for banking, brokerage, retirement, tax, payroll, and digital-asset accounts; upgrade weak MFA.'
    },
    {
      id: 'id-recovery', pillar: 'identity', weight: 4, critical: true, timing: '30', effort: '45 min',
      title: 'Recovery methods are current, independent, and tested.',
      detail: 'Backup codes and recovery instructions are stored offline; recovery does not depend on one phone, one email, or one person.',
      action: 'Inventory recovery paths, remove obsolete phone numbers and emails, and store sealed recovery material in a physically secure location.'
    },
    {
      id: 'id-admin-separation', pillar: 'identity', weight: 3, critical: false, timing: '90', effort: '1–2 hours',
      title: 'Administrative access is separated from daily activity.',
      detail: 'High-impact administration uses a separate profile or account with limited routine exposure.',
      action: 'Separate administrative identities or profiles from everyday email, browsing, and messaging; use least privilege.'
    },

    {
      id: 'money-callback', pillar: 'money', weight: 5, critical: true, timing: 'now', effort: '30 min',
      title: 'Money and account-change requests require out-of-band verification.',
      detail: 'Unexpected instructions are verified through a previously known number or official app—not a reply, forwarded number, or link in the request.',
      action: 'Write and share a rule: end the incoming contact, call back using a verified channel, and never disclose a verification code.'
    },
    {
      id: 'money-dual-approval', pillar: 'money', weight: 5, critical: true, timing: '30', effort: 'Advisor call',
      title: 'High-impact transfers require a second approver or deliberate hold.',
      detail: 'The household and its institutions have a defined threshold for dual approval, callback, or cooling-off review.',
      action: 'Ask financial institutions and advisers which dual-control, callback, hold, and transaction-limit options are available.'
    },
    {
      id: 'money-alerts', pillar: 'money', weight: 4, critical: true, timing: '30', effort: '45 min',
      title: 'Real-time alerts cover transfers, profile changes, new payees, and logins.',
      detail: 'Alerts reach more than one secure channel where appropriate and are reviewed rather than muted.',
      action: 'Enable high-signal alerts across financial accounts and test that the designated recipient receives them.'
    },
    {
      id: 'money-verbal-secret', pillar: 'money', weight: 4, critical: false, timing: '30', effort: '30 min',
      title: 'The family has an offline impersonation-verification protocol.',
      detail: 'Family members know how to verify urgent requests that could use voice cloning, account compromise, or impersonation.',
      action: 'Agree offline on a callback sequence and private challenge. Do not text, email, or store the secret in this app.'
    },
    {
      id: 'money-credit-freeze', pillar: 'money', weight: 4, critical: false, timing: '30', effort: '1 hour',
      title: 'Credit files are frozen when new credit is not actively needed.',
      detail: 'The household understands how to temporarily lift freezes and protects bureau credentials and PINs.',
      action: 'Review FTC guidance and place free freezes with all three nationwide credit bureaus where appropriate.'
    },

    {
      id: 'device-updates', pillar: 'devices', weight: 4, critical: true, timing: 'now', effort: '30 min',
      title: 'Phones, computers, browsers, and security tools update automatically.',
      detail: 'Unsupported devices and software are retired or isolated from sensitive work.',
      action: 'Enable automatic security updates, inventory unsupported devices, and set a monthly verification reminder.'
    },
    {
      id: 'device-encryption', pillar: 'devices', weight: 4, critical: true, timing: '30', effort: '45 min',
      title: 'Portable devices use full-disk encryption and strong screen locks.',
      detail: 'Devices auto-lock promptly, recovery keys are protected, and lock-screen notifications do not expose sensitive content.',
      action: 'Verify encryption and lock settings on every phone, tablet, and computer used for financial or private activity.'
    },
    {
      id: 'device-backups', pillar: 'devices', weight: 5, critical: true, timing: '30', effort: '2–3 hours',
      title: 'Important data has tested, versioned backups with an offline or isolated copy.',
      detail: 'Restoration is tested; backups do not rely solely on synchronization that could replicate deletion or ransomware.',
      action: 'Implement a 3-2-1-style backup approach appropriate to the household and perform a test restoration.'
    },
    {
      id: 'device-inventory', pillar: 'devices', weight: 3, critical: false, timing: '90', effort: '1 hour',
      title: 'The household maintains a current device inventory.',
      detail: 'Ownership, support status, encryption, backup, and remote-wipe readiness are known.',
      action: 'Create a minimal device register using aliases and security status—not serial numbers in this app.'
    },
    {
      id: 'device-remote-wipe', pillar: 'devices', weight: 3, critical: false, timing: '90', effort: '30 min',
      title: 'Lost-device location, lock, and wipe controls are enabled and tested.',
      detail: 'The family knows where to initiate lost mode without needing the missing device.',
      action: 'Verify device-location and recovery portals from a second trusted device, and confirm backup status before any wipe.'
    },

    {
      id: 'comms-carrier', pillar: 'communications', weight: 5, critical: true, timing: 'now', effort: 'Carrier call',
      title: 'Mobile accounts have a unique PIN and the strongest port-out protection available.',
      detail: 'The carrier account password is unique, authorized users are limited, and number-transfer controls have been confirmed.',
      action: 'Contact the carrier through its official channel and enable account PIN, port lock, and change notifications where available.'
    },
    {
      id: 'comms-sms-dependency', pillar: 'communications', weight: 4, critical: true, timing: '30', effort: '1–2 hours',
      title: 'Critical accounts do not depend on SMS when stronger authentication exists.',
      detail: 'Primary email and sensitive financial accounts use passkeys, security keys, or authenticator apps where supported.',
      action: 'Replace SMS authentication on the highest-impact accounts first and retain safe recovery options.'
    },
    {
      id: 'comms-exposure', pillar: 'communications', weight: 3, critical: false, timing: '90', effort: '1–2 hours',
      title: 'Publicly available family information is reviewed and minimized.',
      detail: 'Addresses, phone numbers, relatives, routines, travel, schools, properties, and staff relationships are not needlessly exposed.',
      action: 'Conduct a quarterly exposure review and request removal from data brokers where appropriate.'
    },
    {
      id: 'comms-domain', pillar: 'communications', weight: 3, critical: false, timing: '90', effort: 'Technical review',
      title: 'Personal or family domains are protected against takeover and spoofing.',
      detail: 'Registrar lock, strong MFA, recovery controls, renewal, and email-authentication records are reviewed.',
      action: 'Harden registrar access and have a qualified administrator review SPF, DKIM, and DMARC for custom email domains.'
    },

    {
      id: 'home-router', pillar: 'home', weight: 4, critical: true, timing: '30', effort: '1 hour',
      title: 'Home routers use supported firmware, unique admin credentials, and secure settings.',
      detail: 'Remote administration and risky convenience features are disabled unless deliberately required.',
      action: 'Update router firmware, change default administration credentials, disable unnecessary remote access, and document recovery.'
    },
    {
      id: 'home-segmentation', pillar: 'home', weight: 3, critical: false, timing: '90', effort: '1–3 hours',
      title: 'Guest and smart-home devices are separated from sensitive devices.',
      detail: 'IoT, cameras, guests, staff, and work devices use appropriate network separation and access boundaries.',
      action: 'Use guest or segmented networks to reduce the ability of one compromised device to reach sensitive systems.'
    },
    {
      id: 'home-iot', pillar: 'home', weight: 3, critical: false, timing: '90', effort: '1 hour',
      title: 'Cameras, alarms, smart locks, and other connected devices are inventoried.',
      detail: 'Default credentials are removed, unused cloud access is disabled, and ownership transfer is planned.',
      action: 'Inventory home systems, update firmware, remove dormant accounts, and verify who receives alerts or remote access.'
    },
    {
      id: 'home-travel', pillar: 'home', weight: 3, critical: false, timing: '90', effort: '45 min',
      title: 'A travel-security routine reduces the data and devices carried.',
      detail: 'Travelers patch in advance, minimize stored data, avoid public devices, and know how to recover without the primary phone.',
      action: 'Complete this app’s travel checklist before the next trip and prepare a verified offline contact path.'
    },

    {
      id: 'people-briefing', pillar: 'people', weight: 4, critical: true, timing: '30', effort: '30 min',
      title: 'Family members and key staff receive short, recurring security briefings.',
      detail: 'They can recognize urgent payment scams, verification-code theft, account recovery abuse, and impersonation.',
      action: 'Run a 20-minute household briefing and practice the response to an urgent money or account-reset request.'
    },
    {
      id: 'people-access', pillar: 'people', weight: 4, critical: true, timing: '30', effort: '1 hour',
      title: 'Staff, assistants, and advisers receive only the access they need.',
      detail: 'Shared credentials are avoided and access is removed promptly when roles change.',
      action: 'Review delegated access, replace shared logins, and create a written joiner/mover/leaver checklist.'
    },
    {
      id: 'people-vendors', pillar: 'people', weight: 3, critical: false, timing: '90', effort: '1–2 hours',
      title: 'Trusted vendors are reviewed for authentication, data handling, and incident contact.',
      detail: 'The household knows which providers can access finances, identity data, homes, devices, or communications.',
      action: 'Build a vendor register and review high-impact providers annually or when personnel and access change.'
    },
    {
      id: 'people-offboarding', pillar: 'people', weight: 4, critical: false, timing: '30', effort: 'Checklist',
      title: 'Role changes trigger immediate access and device offboarding.',
      detail: 'Keys, codes, delegated mailboxes, cloud shares, alarm access, devices, and vendor accounts are covered.',
      action: 'Create an offboarding checklist with one accountable owner and complete it the same day access is no longer required.'
    },

    {
      id: 'response-directory', pillar: 'response', weight: 4, critical: true, timing: 'now', effort: '45 min',
      title: 'A verified offline incident directory is available without the primary phone.',
      detail: 'It identifies official fraud, carrier, insurance, adviser, legal, IT/security, and emergency contact sources.',
      action: 'Build and print a minimal contact directory from official statements and apps. Do not copy numbers from an active suspicious message.'
    },
    {
      id: 'response-playbooks', pillar: 'response', weight: 5, critical: true, timing: '30', effort: '1 hour',
      title: 'The household has rehearsed account-takeover, SIM-swap, and payment-fraud playbooks.',
      detail: 'At least two people know who leads, what to protect first, and how to preserve evidence.',
      action: 'Walk through the incident desk with a second household member and assign roles before a real event.'
    },
    {
      id: 'response-insurance', pillar: 'response', weight: 3, critical: false, timing: '90', effort: 'Policy review',
      title: 'Cyber, identity, fraud, and property policy coverage is understood.',
      detail: 'Notification requirements, exclusions, approved responders, deductibles, and reimbursement limits are documented offline.',
      action: 'Review applicable policies with a qualified broker or counsel and record the claim-notification sequence.'
    },
    {
      id: 'response-evidence', pillar: 'response', weight: 3, critical: false, timing: '90', effort: '30 min',
      title: 'The household knows how to preserve evidence without spreading it.',
      detail: 'Messages, headers, transaction records, timestamps, caller details, and screenshots can be retained safely.',
      action: 'Define a secure evidence folder and teach the household not to edit, forward widely, or delete suspicious material during response.'
    },
    {
      id: 'response-review', pillar: 'response', weight: 2, critical: false, timing: '90', effort: 'Calendar',
      title: 'The security baseline is reviewed at least twice a year and after major changes.',
      detail: 'Moves, travel, new advisers, staff changes, devices, inherited assets, and major transactions trigger review.',
      action: 'Schedule a six-month review and repeat the assessment after any high-impact household or financial change.'
    }
  ];

  const FORTRESS = [
    {
      id: 'email', title: 'Secure the reset key',
      tasks: [
        'Use passkeys or two hardware security keys on primary email.',
        'Remove obsolete recovery phones and email addresses.',
        'Review forwarding rules, connected apps, and active sessions.',
        'Store recovery material offline and test it.'
      ]
    },
    {
      id: 'credentials', title: 'End credential reuse',
      tasks: [
        'Protect a reputable password manager with strong MFA.',
        'Replace reused passwords on financial and cloud accounts.',
        'Use generated, unique passwords where passkeys are unavailable.',
        'Prepare independent recovery for the password manager.'
      ]
    },
    {
      id: 'money', title: 'Harden money movement',
      tasks: [
        'Require verified callbacks for new or changed instructions.',
        'Enable transfer, payee, login, and profile-change alerts.',
        'Ask providers about holds, limits, and dual approval.',
        'Practice refusing urgent requests and verification-code demands.'
      ]
    },
    {
      id: 'mobile', title: 'Protect the phone number',
      tasks: [
        'Set a unique carrier PIN and password.',
        'Enable port-out lock or number-transfer protection.',
        'Remove unnecessary authorized users from the carrier account.',
        'Replace SMS MFA on high-impact accounts where possible.'
      ]
    },
    {
      id: 'recovery', title: 'Make recovery real',
      tasks: [
        'Print a verified incident contact directory.',
        'Test a backup restoration and a lost-phone recovery path.',
        'Run one account-takeover or payment-fraud tabletop drill.',
        'Confirm insurance and professional-response contacts.'
      ]
    }
  ];

  const INCIDENTS = [
    {
      id: 'wire-fraud', icon: '$', title: 'Payment or wire fraud', description: 'A transfer was sent, changed, or requested under suspicious circumstances.',
      warning: 'Speed matters. Contact the sending institution through a known official channel immediately and ask about a hold, recall, or fraud escalation. Do not wait for email confirmation.',
      steps: [
        ['Stop the interaction', 'Do not send more funds, disclose codes, or continue using contact details supplied in the suspicious request.'],
        ['Call the financial institution now', 'Use the number in the official app, on a statement, or in your prebuilt directory. Ask for the fraud department and a transfer hold or recall.'],
        ['Escalate through trusted professionals', 'Notify the designated adviser, controller, counsel, insurer, or security lead through a separately verified channel.'],
        ['Preserve transaction evidence', 'Save confirmations, payment instructions, messages, full email headers, phone numbers, timestamps, and names without editing originals.'],
        ['Secure the initiating accounts', 'From a trusted device, protect primary email and financial access; revoke suspicious sessions, rules, and delegated access.'],
        ['Report cyber-enabled crime', 'File with the FBI Internet Crime Complaint Center and follow the institution’s law-enforcement guidance.']
      ],
      links: [
        ['FBI IC3', 'https://www.ic3.gov/'],
        ['FTC fraud reporting', 'https://reportfraud.ftc.gov/']
      ]
    },
    {
      id: 'account-takeover', icon: '@', title: 'Account takeover', description: 'Email, cloud, financial, social, or identity access appears compromised.',
      warning: 'Secure primary email first when it controls recovery for other accounts. Work from a clean, trusted device and use only the provider’s official app or typed address.',
      steps: [
        ['Move to a trusted device and network', 'Do not recover accounts from a device that may be compromised.'],
        ['Recover and harden primary email', 'Change the password or add a passkey, revoke sessions, and confirm recovery methods.'],
        ['Remove persistence', 'Review forwarding, inbox rules, delegated mailboxes, connected apps, OAuth grants, API tokens, and trusted devices.'],
        ['Protect downstream accounts', 'Prioritize financial, carrier, password-manager, cloud, tax, and identity accounts that the compromised account could reset.'],
        ['Notify affected parties', 'Warn the household and relevant institutions that messages or payment requests may be fraudulent.'],
        ['Preserve and report', 'Save provider alerts, login history, messages, IP/device details, and a timeline before they disappear.']
      ],
      links: [
        ['CISA account security', 'https://www.cisa.gov/secure-our-world'],
        ['FBI IC3', 'https://www.ic3.gov/']
      ]
    },
    {
      id: 'sim-swap', icon: 'SIM', title: 'SIM swap or port-out', description: 'A phone suddenly loses service or the carrier reports an unauthorized change.',
      warning: 'Assume SMS codes and calls may be reaching someone else. Contact the carrier’s fraud team from another phone and secure primary email and financial accounts immediately.',
      steps: [
        ['Contact the carrier fraud team', 'Use an official number from the carrier website, app, bill, or offline directory. Ask to reverse the swap or port.'],
        ['Re-establish carrier controls', 'Set a new unique PIN and password, enable port protection, and review authorized users and recent changes.'],
        ['Secure email and finance', 'Use a trusted device to revoke sessions, change credentials, and replace SMS authentication where possible.'],
        ['Review financial activity', 'Check transfers, new payees, card changes, password resets, and alerts that may have been intercepted.'],
        ['Document the timeline', 'Record when service stopped, carrier case numbers, affected accounts, messages, and unauthorized activity.'],
        ['Report identity or financial fraud', 'Use IdentityTheft.gov, IC3, and institution-specific reporting when applicable.']
      ],
      links: [
        ['FTC SIM-swap guidance', 'https://consumer.ftc.gov/consumer-alerts/2019/10/sim-swap-scams-how-protect-yourself'],
        ['IdentityTheft.gov', 'https://www.identitytheft.gov/']
      ]
    },
    {
      id: 'lost-device', icon: '□', title: 'Lost or stolen device', description: 'A phone, tablet, laptop, security key, or storage device is missing.',
      warning: 'Do not confront a suspected thief. Prioritize personal safety, remote lock, session revocation, and accurate reporting.',
      steps: [
        ['Activate lost mode or remote lock', 'Use the vendor’s official recovery service from a second trusted device.'],
        ['Revoke high-risk sessions', 'Prioritize email, password manager, financial, cloud, work, messaging, and carrier sessions.'],
        ['Protect the phone number and wallet', 'Notify the carrier and relevant payment providers if the device held a SIM, cards, or payment credentials.'],
        ['Assess encryption and lock strength', 'Use the device inventory to determine likely data exposure and notification needs.'],
        ['Report and preserve details', 'Record serial information from offline records, location history, case numbers, and the last known time and place.'],
        ['Wipe only when appropriate', 'Remote wipe if recovery is unlikely and important data is backed up; follow employer or insurer instructions where relevant.']
      ],
      links: [
        ['FTC phone protection', 'https://consumer.ftc.gov/articles/how-protect-your-phone-hackers'],
        ['IdentityTheft.gov', 'https://www.identitytheft.gov/']
      ]
    },
    {
      id: 'identity-theft', icon: 'ID', title: 'Identity theft or doxxing', description: 'Personal data is exposed, accounts appear in your name, or private information is being weaponized.',
      warning: 'If exposure creates an immediate physical threat, contact local emergency services and qualified security professionals before attempting public engagement.',
      steps: [
        ['Document what is exposed', 'Capture URLs, screenshots, account activity, notices, dates, and who has received the information.'],
        ['Freeze credit where appropriate', 'Contact all three nationwide credit bureaus through verified official channels.'],
        ['Build an FTC recovery plan', 'Use IdentityTheft.gov for tailored reporting and recovery steps.'],
        ['Secure identity anchors', 'Protect primary email, carrier, financial, tax, benefits, medical, and cloud accounts.'],
        ['Reduce public exposure', 'Review social profiles, data brokers, property records, domain records, family links, and real-time location sharing.'],
        ['Coordinate notifications', 'Consult counsel, insurers, institutions, employers, schools, and protective services as the facts require.']
      ],
      links: [
        ['IdentityTheft.gov', 'https://www.identitytheft.gov/'],
        ['FTC identity-theft guidance', 'https://consumer.ftc.gov/articles/what-know-about-identity-theft']
      ]
    },
    {
      id: 'impersonation', icon: 'AI', title: 'Impersonation or deepfake', description: 'A familiar voice, video, email, or account makes an urgent request that may be synthetic or compromised.',
      warning: 'Treat urgency and realism as untrusted. Do not move money or reveal codes until the person is verified through the family’s pre-agreed offline process.',
      steps: [
        ['Pause and end the incoming contact', 'Do not debate or reveal which verification clue failed.'],
        ['Call back on a known channel', 'Use a number or app verified before the request—not a number supplied during it.'],
        ['Apply the offline family protocol', 'Use the private challenge and second-approver process. Never send the secret by text or email.'],
        ['Alert the household', 'Warn other family members, assistants, and advisers that impersonation may be underway.'],
        ['Protect the impersonated account', 'If a real account may be compromised, revoke sessions and change authentication from a trusted device.'],
        ['Preserve and report', 'Save recordings, usernames, numbers, messages, payment destinations, and timestamps; report relevant fraud.']
      ],
      links: [
        ['FTC verification-code advice', 'https://consumer.ftc.gov/consumer-alerts/2024/03/whats-verification-code-why-would-someone-ask-me-it'],
        ['FBI IC3', 'https://www.ic3.gov/']
      ]
    },
    {
      id: 'home-network', icon: '⌂', title: 'Home or IoT compromise', description: 'A router, camera, alarm, smart lock, or connected device behaves unexpectedly.',
      warning: 'Do not disrupt safety-critical systems without a safe alternative. For alarms, locks, or physical threats, coordinate with the provider and appropriate professionals.',
      steps: [
        ['Isolate the suspected system', 'Disconnect the affected device or segment from sensitive networks if this can be done safely.'],
        ['Use a clean administration device', 'Access the official router or provider console directly, not through a link in an alert.'],
        ['Change administrative access', 'Rotate unique admin credentials, enable strong MFA, and revoke unknown sessions or users.'],
        ['Update and review configuration', 'Install supported firmware, disable unnecessary remote access, and inventory connected devices.'],
        ['Rotate network credentials deliberately', 'Update Wi-Fi credentials and reconnect trusted devices in a controlled order if compromise is credible.'],
        ['Preserve logs and escalate', 'Save alerts, device lists, timestamps, and provider case numbers; involve qualified IT/security support.']
      ],
      links: [
        ['CISA Secure Our World', 'https://www.cisa.gov/secure-our-world'],
        ['FBI IC3', 'https://www.ic3.gov/']
      ]
    },
    {
      id: 'extortion', icon: '!', title: 'Extortion or coercion', description: 'Someone threatens harm, exposure, disruption, or data release to force action or payment.',
      warning: 'If anyone is in immediate danger, contact local emergency services. Do not pay, negotiate, or publicly engage before obtaining qualified legal, security, and law-enforcement guidance.',
      steps: [
        ['Prioritize personal safety', 'Move to a safe environment and contact emergency or protective services when a threat could be physical.'],
        ['Stop direct engagement', 'Do not click links, install tools, send more information, or make a rushed payment.'],
        ['Preserve original evidence', 'Retain messages, headers, voicemails, handles, payment demands, files, and timestamps without altering them.'],
        ['Assemble the response team', 'Contact counsel, insurer, qualified incident response, physical security, and law enforcement through verified channels.'],
        ['Contain related compromise', 'Secure email, cloud, devices, and financial accounts from a trusted environment.'],
        ['Control communications', 'Designate one decision-maker and avoid public statements that could endanger people or an investigation.']
      ],
      links: [
        ['FBI IC3', 'https://www.ic3.gov/'],
        ['FBI tips', 'https://tips.fbi.gov/']
      ]
    }
  ];

  const TRAVEL_GROUPS = [
    {
      id: 'before', title: 'Before departure',
      tasks: [
        'Update operating systems, browsers, password manager, and security tools.',
        'Back up important data and verify a recovery path that does not require the travel phone.',
        'Carry the minimum data and devices needed; remove unnecessary sensitive files and accounts.',
        'Review device encryption, strong screen locks, remote location, lock, and wipe.',
        'Share itinerary privately and confirm the family callback and emergency contact protocol.'
      ]
    },
    {
      id: 'transit', title: 'In transit',
      tasks: [
        'Keep devices, security keys, and sensitive papers under direct control.',
        'Disable automatic Wi-Fi and Bluetooth joining; use personal power equipment.',
        'Avoid public computers and do not enter sensitive credentials on shared devices.',
        'Shield screens and conversations; conceal lock-screen message previews.',
        'Use a trusted cellular connection or approved VPN for sensitive work.'
      ]
    },
    {
      id: 'onsite', title: 'At destination',
      tasks: [
        'Store unused devices and documents securely; do not leave them exposed in rooms or vehicles.',
        'Use a personal hotspot where practical and verify unexpected login or MFA prompts.',
        'Do not announce real-time location, routines, vacant properties, or household staffing publicly.',
        'Treat urgent money, credential, or rescue requests as unverified until callback succeeds.',
        'Report lost devices or unexplained service loss immediately; start the relevant playbook.'
      ]
    },
    {
      id: 'return', title: 'On return',
      tasks: [
        'Install pending updates and review security, carrier, email, and financial alerts.',
        'Review recent account sessions and revoke anything unfamiliar.',
        'Return borrowed or temporary access and remove travel-only sharing permissions.',
        'Scan or rebuild higher-risk travel devices according to professional guidance when warranted.',
        'Record lessons learned and update the next travel checklist.'
      ]
    }
  ];

  const RESOURCES = [
    { org: 'NIST', title: 'Cybersecurity Framework 2.0', description: 'A risk-management framework organized around Govern, Identify, Protect, Detect, Respond, and Recover.', url: 'https://www.nist.gov/cyberframework' },
    { org: 'NIST', title: 'Digital Identity Guidelines', description: 'Current technical guidance on authentication assurance, recovery, and phishing-resistant authenticators.', url: 'https://pages.nist.gov/800-63-4/sp800-63b.html' },
    { org: 'CISA', title: 'Secure Our World', description: 'Practical guidance on strong passwords, multifactor authentication, phishing, and software updates.', url: 'https://www.cisa.gov/secure-our-world' },
    { org: 'FBI', title: 'Internet Crime Complaint Center', description: 'The central U.S. reporting hub for cyber-enabled fraud and crime, including payment and account fraud.', url: 'https://www.ic3.gov/' },
    { org: 'FTC', title: 'IdentityTheft.gov', description: 'Create a tailored identity-theft report and recovery plan with official next steps.', url: 'https://www.identitytheft.gov/' },
    { org: 'FTC', title: 'SIM-swap protection', description: 'How mobile-number takeover works, preventive controls, and what to do after a SIM swap.', url: 'https://consumer.ftc.gov/consumer-alerts/2019/10/sim-swap-scams-how-protect-yourself' },
    { org: 'FTC', title: 'Credit freezes and identity theft', description: 'Official guidance on credit freezes, fraud alerts, monitoring, recovery, and reporting.', url: 'https://consumer.ftc.gov/articles/what-know-about-identity-theft' },
    { org: 'FTC', title: 'ReportFraud', description: 'Report scams, fraud, and bad business practices to the Federal Trade Commission.', url: 'https://reportfraud.ftc.gov/' },
    { org: 'ANNUAL CREDIT REPORT', title: 'Official credit-report access', description: 'The federally authorized source for free credit reports from the nationwide bureaus.', url: 'https://www.annualcreditreport.com/' }
  ];

  const GLOSSARY = [
    ['Phishing-resistant MFA', 'Authentication designed to resist credential capture by fake sites, commonly using passkeys or FIDO security keys. It is stronger than SMS or shared one-time codes.'],
    ['Out-of-band verification', 'Confirming a request through a separate, previously trusted channel—for example, ending an incoming call and dialing a known number.'],
    ['Crown jewel', 'An identity, account, device, dataset, or system whose compromise could cause disproportionate financial, privacy, safety, or operational harm.'],
    ['Passkey', 'A public-key credential bound to a device or secure credential provider. Passkeys can reduce password reuse and resist common phishing.'],
    ['SIM swap / port-out', 'A fraudulent transfer of a phone number to an attacker-controlled SIM or carrier account, allowing interception of calls and SMS codes.'],
    ['Least privilege', 'Giving each person, account, application, and vendor only the access needed for its current role—and removing it when the need ends.'],
    ['Recovery dependency', 'A person, device, email, phone number, or service that must remain available to restore access. Hidden single points of failure increase lockout risk.'],
    ['Tabletop exercise', 'A discussion-based rehearsal of an incident scenario used to reveal unclear roles, missing contacts, and fragile recovery steps before a real event.']
  ];

  const DEFAULT_STATE = Object.freeze({
    version: STATE_VERSION,
    assessment: {},
    fortress: {},
    people: [],
    assets: [],
    vendors: [],
    incidentProgress: {},
    travel: { active: false, tasks: {} },
    lastUpdated: null
  });

  const $ = (id) => document.getElementById(id);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  let state = loadState();
  let assessmentFilter = 'all';
  let activeIncident = null;
  let pendingConfirm = null;

  function freshState() {
    return {
      version: STATE_VERSION,
      assessment: {},
      fortress: {},
      people: [],
      assets: [],
      vendors: [],
      incidentProgress: {},
      travel: { active: false, tasks: {} },
      lastUpdated: null
    };
  }

  function cleanText(value, max = 80) {
    return typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max) : '';
  }

  function cleanChoice(value, allowed, fallback) {
    return allowed.includes(value) ? value : fallback;
  }

  function sanitizeState(input) {
    const safe = freshState();
    if (!input || typeof input !== 'object') return safe;

    if (input.assessment && typeof input.assessment === 'object') {
      QUESTIONS.forEach((question) => {
        if (['yes', 'partial', 'no', 'na'].includes(input.assessment[question.id])) {
          safe.assessment[question.id] = input.assessment[question.id];
        }
      });
    }

    if (input.fortress && typeof input.fortress === 'object') {
      FORTRESS.forEach((control) => control.tasks.forEach((_, index) => {
        const key = `${control.id}-${index}`;
        safe.fortress[key] = input.fortress[key] === true;
      }));
    }

    const people = Array.isArray(input.people) ? input.people.slice(0, 50) : [];
    safe.people = people.map((item) => ({
      id: cleanText(item?.id, 80) || makeId(),
      alias: cleanText(item?.alias, 40),
      role: cleanChoice(item?.role, ['Principal', 'Partner', 'Adult family', 'Minor', 'Elder', 'Assistant', 'Other'], 'Other'),
      exposure: cleanChoice(item?.exposure, ['High', 'Medium', 'Low'], 'Medium'),
      auth: cleanChoice(item?.auth, ['Strong', 'Partial', 'Weak', 'Unknown'], 'Unknown'),
      training: cleanChoice(item?.training, ['Current', 'Due', 'Not applicable'], 'Due')
    })).filter((item) => item.alias);

    const assets = Array.isArray(input.assets) ? input.assets.slice(0, 75) : [];
    safe.assets = assets.map((item) => ({
      id: cleanText(item?.id, 80) || makeId(),
      label: cleanText(item?.label, 50),
      category: cleanChoice(item?.category, ['Primary email', 'Financial', 'Identity', 'Cloud storage', 'Mobile carrier', 'Digital asset', 'Home system', 'Other'], 'Other'),
      owner: cleanText(item?.owner, 40),
      protection: cleanChoice(item?.protection, ['Strong', 'Partial', 'Weak', 'Unknown'], 'Unknown'),
      recovery: cleanChoice(item?.recovery, ['Verified', 'Review due', 'Unknown', 'Not applicable'], 'Unknown')
    })).filter((item) => item.label);

    const vendors = Array.isArray(input.vendors) ? input.vendors.slice(0, 75) : [];
    safe.vendors = vendors.map((item) => ({
      id: cleanText(item?.id, 80) || makeId(),
      label: cleanText(item?.label, 50),
      category: cleanChoice(item?.category, ['Financial adviser', 'Legal', 'Tax', 'Household staff', 'IT / security', 'Property management', 'Insurance', 'Other'], 'Other'),
      access: cleanChoice(item?.access, ['Financial approval', 'Sensitive data', 'Home systems', 'Limited', 'None'], 'Limited'),
      mfa: cleanChoice(item?.mfa, ['Yes', 'Unknown', 'No', 'Not applicable'], 'Unknown'),
      reviewed: /^\d{4}-\d{2}-\d{2}$/.test(item?.reviewed || '') ? item.reviewed : ''
    })).filter((item) => item.label);

    if (input.incidentProgress && typeof input.incidentProgress === 'object') {
      INCIDENTS.forEach((incident) => {
        const incoming = input.incidentProgress[incident.id];
        safe.incidentProgress[incident.id] = incident.steps.map((_, index) => Array.isArray(incoming) && incoming[index] === true);
      });
    }

    safe.travel.active = input.travel?.active === true;
    TRAVEL_GROUPS.forEach((group) => group.tasks.forEach((_, index) => {
      const key = `${group.id}-${index}`;
      safe.travel.tasks[key] = input.travel?.tasks?.[key] === true;
    }));
    safe.lastUpdated = typeof input.lastUpdated === 'string' && !Number.isNaN(Date.parse(input.lastUpdated)) ? input.lastUpdated : null;
    return safe;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? sanitizeState(JSON.parse(raw)) : freshState();
    } catch {
      return freshState();
    }
  }

  function saveState(message = 'Saved locally') {
    state.lastUpdated = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      const saveStatus = $('save-status');
      if (saveStatus) {
        saveStatus.textContent = message;
        window.clearTimeout(saveState.timer);
        saveState.timer = window.setTimeout(() => { saveStatus.textContent = 'Ready · stored in this browser'; }, 1700);
      }
    } catch {
      toast('This browser could not save the workspace. Export a backup or free storage space.', true);
    }
  }

  function makeId() {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return `pwcc-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function setText(id, value) {
    const element = $(id);
    if (element) element.textContent = String(value);
  }

  function toast(message, isError = false) {
    const item = node('div', `toast${isError ? ' error' : ''}`, message);
    $('toast-region').append(item);
    window.setTimeout(() => item.remove(), 4300);
  }

  function confirmAction(title, message, acceptLabel, callback) {
    const dialog = $('confirm-dialog');
    if (!dialog?.showModal) {
      if (window.confirm(`${title}\n\n${message}`)) callback();
      return;
    }
    setText('confirm-title', title);
    setText('confirm-message', message);
    setText('confirm-accept', acceptLabel);
    pendingConfirm = callback;
    dialog.returnValue = 'cancel';
    dialog.showModal();
  }

  function scoreStats() {
    let answered = 0;
    let denominator = 0;
    let earned = 0;
    const byPillar = {};
    PILLARS.forEach((pillar) => { byPillar[pillar.id] = { denominator: 0, earned: 0, answered: 0, total: 0 }; });

    QUESTIONS.forEach((question) => {
      const answer = state.assessment[question.id];
      const pillar = byPillar[question.pillar];
      pillar.total += 1;
      if (answer) {
        answered += 1;
        pillar.answered += 1;
      }
      if (answer === 'na') return;
      denominator += question.weight;
      pillar.denominator += question.weight;
      if (answer === 'yes') {
        earned += question.weight;
        pillar.earned += question.weight;
      } else if (answer === 'partial') {
        earned += question.weight * 0.5;
        pillar.earned += question.weight * 0.5;
      }
    });

    const score = denominator ? Math.round((earned / denominator) * 100) : null;
    const coverage = Math.round((answered / QUESTIONS.length) * 100);
    const pillarScores = {};
    PILLARS.forEach((pillar) => {
      const data = byPillar[pillar.id];
      pillarScores[pillar.id] = data.denominator ? Math.round((data.earned / data.denominator) * 100) : 0;
    });
    const criticalGaps = QUESTIONS.filter((question) => question.critical && ['no', 'partial'].includes(state.assessment[question.id])).length;
    const criticalOpen = QUESTIONS.filter((question) => question.critical && state.assessment[question.id] !== 'yes' && state.assessment[question.id] !== 'na').length;
    return { score, coverage, answered, pillarScores, criticalGaps, criticalOpen };
  }

  function postureLabel(score, answered) {
    if (!answered || score === null) return 'Baseline not established';
    if (score >= 85) return 'High-assurance habits';
    if (score >= 65) return 'Strengthening';
    if (score >= 40) return 'Developing';
    return 'Exposed foundations';
  }

  function postureMessage(score, coverage) {
    if (!coverage) return 'Complete the assessment to establish a defensible baseline.';
    if (coverage < 70) return 'This score is provisional. Rate more controls before using it for planning.';
    if (score >= 85) return 'Strong habits are visible. Keep testing recovery and closing residual gaps.';
    if (score >= 65) return 'The foundation is taking shape. Prioritize the remaining high-impact gaps.';
    if (score >= 40) return 'Several important controls exist, but avoidable single points of failure remain.';
    return 'Start with identity, money-movement, carrier, and recovery controls that reduce loss quickly.';
  }

  function fortressStats() {
    const total = FORTRESS.reduce((sum, item) => sum + item.tasks.length, 0);
    const complete = FORTRESS.reduce((sum, item) => sum + item.tasks.filter((_, index) => state.fortress[`${item.id}-${index}`]).length, 0);
    return { total, complete, percent: Math.round((complete / total) * 100) };
  }

  function derivedRoadmap() {
    const stats = scoreStats();
    const groups = { now: [], '30': [], '90': [], maintain: [] };
    if (!stats.answered) return groups;

    QUESTIONS.forEach((question) => {
      const answer = state.assessment[question.id];
      if (answer === 'na') return;
      if (answer === 'yes') {
        groups.maintain.push({ ...question, answer });
        return;
      }
      let bucket = question.timing;
      if (answer === 'partial' && bucket === 'now' && !question.critical) bucket = '30';
      if (!answer && !question.critical && bucket === 'now') bucket = '30';
      groups[bucket].push({ ...question, answer: answer || 'unanswered' });
    });
    Object.values(groups).forEach((items) => items.sort((a, b) => Number(b.critical) - Number(a.critical) || b.weight - a.weight || a.title.localeCompare(b.title)));
    return groups;
  }

  function showView(name, focus = true) {
    const panel = document.querySelector(`[data-view-panel="${name}"]`);
    if (!panel) return;
    $$('.view').forEach((view) => view.classList.toggle('is-active', view === panel));
    $$('.nav-button').forEach((button) => {
      const active = button.dataset.view === name;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    document.body.classList.remove('nav-open');
    $('mobile-menu').setAttribute('aria-expanded', 'false');
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (focus) panel.focus?.({ preventScroll: true });
  }

  function renderAssessmentFilters() {
    const container = $('assessment-filters');
    container.replaceChildren();
    [{ id: 'all', label: 'All pillars' }, ...PILLARS].forEach((pillar) => {
      const button = node('button', `filter-button${assessmentFilter === pillar.id ? ' is-active' : ''}`, pillar.label);
      button.type = 'button';
      button.dataset.filter = pillar.id;
      button.setAttribute('aria-pressed', String(assessmentFilter === pillar.id));
      container.append(button);
    });
  }

  function renderAssessmentList() {
    const list = $('assessment-list');
    list.replaceChildren();
    const visible = assessmentFilter === 'all' ? QUESTIONS : QUESTIONS.filter((question) => question.pillar === assessmentFilter);
    visible.forEach((question) => {
      const answer = state.assessment[question.id] || '';
      const card = node('article', 'assessment-card');
      card.dataset.answer = answer;
      card.dataset.question = question.id;

      const copy = node('div', 'assessment-question');
      const meta = node('div', 'assessment-meta');
      meta.append(node('span', '', PILLARS.find((pillar) => pillar.id === question.pillar)?.label || question.pillar));
      meta.append(node('span', question.critical ? 'critical-tag' : '', question.critical ? 'High impact' : 'Supporting control'));
      meta.append(node('span', '', `Weight ${question.weight}`));
      copy.append(meta, node('h3', '', question.title), node('p', '', question.detail));

      const answers = node('div', 'answer-group');
      answers.setAttribute('role', 'radiogroup');
      answers.setAttribute('aria-label', question.title);
      [
        ['yes', 'Implemented'],
        ['partial', 'Partial'],
        ['no', 'Gap'],
        ['na', 'N/A']
      ].forEach(([value, label]) => {
        const wrapper = node('label', `answer-option answer-${value}`);
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `answer-${question.id}`;
        input.value = value;
        input.checked = answer === value;
        input.dataset.question = question.id;
        wrapper.append(input, node('span', '', label));
        answers.append(wrapper);
      });
      card.append(copy, answers);
      list.append(card);
    });
  }

  function updateAssessmentProgress() {
    const stats = scoreStats();
    setText('assessment-progress-value', `${stats.coverage}%`);
  }

  function renderDashboard() {
    const stats = scoreStats();
    const fortress = fortressStats();
    const label = postureLabel(stats.score, stats.answered);
    setText('posture-label', label);
    setText('coverage-pill', `${stats.coverage}% assessed`);
    setText('score-value', stats.answered ? stats.score : '—');
    setText('score-message', postureMessage(stats.score, stats.coverage));
    setText('priority-gap-count', stats.answered ? stats.criticalOpen : '—');
    setText('control-count', `${fortress.complete} / ${fortress.total}`);
    setText('plan-coverage', `${fortress.percent}%`);
    setText('household-count', state.people.length);
    setText('crown-jewel-count', state.assets.length);
    setText('vendor-count', state.vendors.length);

    const ring = $('score-ring');
    ring.style.setProperty('--score', stats.answered ? stats.score : 0);
    ring.setAttribute('aria-label', stats.answered ? `Readiness score ${stats.score} out of 100; ${label}` : 'Readiness score not yet established');

    const bars = $('pillar-bars');
    bars.replaceChildren();
    PILLARS.forEach((pillar) => {
      const row = node('div', 'pillar-row');
      const head = node('div', 'pillar-head');
      head.append(node('span', '', pillar.label), node('strong', '', `${stats.pillarScores[pillar.id]}%`));
      const track = node('div', 'progress-track');
      const fill = node('i');
      fill.style.width = `${stats.pillarScores[pillar.id]}%`;
      track.append(fill);
      row.append(head, track);
      bars.append(row);
    });

    const priorityContainer = $('command-priorities');
    priorityContainer.replaceChildren();
    if (!stats.answered) {
      [
        ['01', 'Establish the baseline', 'Rate the household’s current controls to expose the most important single points of failure.', 'Assessment', '10–15 min'],
        ['02', 'Map the crown jewels', 'Use aliases to identify the accounts, devices, people, and providers that recovery depends on.', 'Household', '15 min'],
        ['03', 'Prepare for urgency', 'Review payment fraud, account takeover, and SIM-swap playbooks before an incident creates pressure.', 'Incident desk', '20 min']
      ].forEach(([index, title, description, category, effort]) => {
        const card = node('article', 'priority-card');
        card.append(node('span', 'priority-index', index), node('h3', '', title), node('p', '', description));
        const meta = node('div', 'priority-meta');
        meta.append(node('span', '', category), node('span', '', effort));
        card.append(meta);
        priorityContainer.append(card);
      });
      return;
    }

    const roadmap = derivedRoadmap();
    const priorities = [...roadmap.now, ...roadmap['30'], ...roadmap['90']].slice(0, 3);
    if (!priorities.length) {
      const empty = node('div', 'empty-priority');
      empty.append(node('strong', '', 'No open assessment gaps'), node('p', '', 'Keep validating recovery, monitoring alerts, and reviewing access after major changes.'));
      priorityContainer.append(empty);
      return;
    }
    priorities.forEach((item, index) => {
      const card = node('article', 'priority-card');
      card.append(node('span', 'priority-index', String(index + 1).padStart(2, '0')), node('h3', '', item.title), node('p', '', item.action));
      const meta = node('div', 'priority-meta');
      meta.append(node('span', '', PILLARS.find((pillar) => pillar.id === item.pillar)?.label || ''), node('span', '', item.effort));
      card.append(meta);
      priorityContainer.append(card);
    });
  }

  function renderPlan() {
    const stats = scoreStats();
    const label = postureLabel(stats.score, stats.answered);
    setText('plan-score', stats.answered ? stats.score : '—');
    setText('plan-score-label', label);
    setText('plan-assessed', `${stats.coverage}%`);
    setText('plan-assessed-detail', `${stats.answered} of ${QUESTIONS.length} controls rated`);
    setText('plan-gap-count', stats.answered ? stats.criticalOpen : '—');

    const roadmap = derivedRoadmap();
    const definitions = [
      ['now', 'Critical now', 'Stop high-impact failure paths first'],
      ['30', 'Next 30 days', 'Build reliable preventive controls'],
      ['90', 'Next 90 days', 'Reduce residual exposure and dependencies'],
      ['maintain', 'Maintain & verify', 'Retest implemented controls']
    ];
    const container = $('roadmap');
    container.replaceChildren();
    definitions.forEach(([id, title, subtitle]) => {
      const column = node('section', 'roadmap-column');
      const head = node('header', 'roadmap-head');
      head.append(node('strong', '', title), node('span', '', `${roadmap[id].length} controls · ${subtitle}`));
      const items = node('div', 'roadmap-items');
      if (!stats.answered) {
        items.append(node('div', 'roadmap-empty', 'Complete the assessment to generate this stage.'));
      } else if (!roadmap[id].length) {
        items.append(node('div', 'roadmap-empty', id === 'maintain' ? 'No controls marked implemented yet.' : 'No actions currently assigned to this stage.'));
      } else {
        roadmap[id].forEach((item) => {
          const card = node('article', 'roadmap-item');
          card.append(node('strong', '', item.title), node('p', '', id === 'maintain' ? item.detail : item.action));
          const footer = document.createElement('footer');
          footer.append(node('span', '', PILLARS.find((pillar) => pillar.id === item.pillar)?.label || ''), node('span', '', item.effort));
          card.append(footer);
          items.append(card);
        });
      }
      column.append(head, items);
      container.append(column);
    });

    const fortressContainer = $('fortress-five');
    fortressContainer.replaceChildren();
    FORTRESS.forEach((control, controlIndex) => {
      const card = node('article', 'fortress-card');
      const title = node('div', 'fortress-title');
      title.append(node('span', 'fortress-number', `0${controlIndex + 1}`), node('h3', '', control.title));
      const tasks = node('div', 'fortress-tasks');
      control.tasks.forEach((task, taskIndex) => {
        const key = `${control.id}-${taskIndex}`;
        const labelEl = node('label', 'task-check');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = state.fortress[key] === true;
        input.dataset.fortress = key;
        labelEl.append(input, node('span', '', task));
        tasks.append(labelEl);
      });
      card.append(title, tasks);
      fortressContainer.append(card);
    });
    const fortress = fortressStats();
    setText('fortress-progress', `${fortress.complete} of ${fortress.total} complete`);
  }

  function statusClass(value) {
    if (['Strong', 'Current', 'Verified', 'Yes'].includes(value)) return 'good';
    if (['Partial', 'Due', 'Review due', 'Unknown'].includes(value)) return 'warn';
    if (['Weak', 'No', 'High'].includes(value)) return 'bad';
    return '';
  }

  function status(value) {
    return node('span', `status-chip ${statusClass(value)}`.trim(), value || '—');
  }

  function renderTable({ items, tableId, emptyId, totalId, totalLabel, fields, type }) {
    const table = $(tableId);
    const tbody = table.querySelector('tbody');
    const empty = $(emptyId);
    setText(totalId, `${items.length} ${totalLabel}`);
    tbody.replaceChildren();
    table.hidden = items.length === 0;
    empty.hidden = items.length > 0;

    items.forEach((item) => {
      const row = document.createElement('tr');
      fields.forEach((field) => {
        const cell = document.createElement('td');
        const value = item[field.key] || '—';
        if (field.status) cell.append(status(value));
        else cell.textContent = value;
        row.append(cell);
      });
      const actionCell = document.createElement('td');
      const button = node('button', 'row-delete', '×');
      button.type = 'button';
      button.dataset.deleteType = type;
      button.dataset.deleteId = item.id;
      button.setAttribute('aria-label', `Remove ${item.label || item.alias}`);
      actionCell.append(button);
      row.append(actionCell);
      tbody.append(row);
    });
  }

  function renderHousehold() {
    renderTable({
      items: state.people, tableId: 'people-table', emptyId: 'people-empty', totalId: 'people-total', totalLabel: 'mapped', type: 'people',
      fields: [{ key: 'alias' }, { key: 'role' }, { key: 'exposure', status: true }, { key: 'auth', status: true }, { key: 'training', status: true }]
    });
    renderTable({
      items: state.assets, tableId: 'assets-table', emptyId: 'assets-empty', totalId: 'assets-total', totalLabel: 'cataloged', type: 'assets',
      fields: [{ key: 'label' }, { key: 'category' }, { key: 'owner' }, { key: 'protection', status: true }, { key: 'recovery', status: true }]
    });
    renderTable({
      items: state.vendors, tableId: 'vendors-table', emptyId: 'vendors-empty', totalId: 'vendors-total', totalLabel: 'reviewed', type: 'vendors',
      fields: [{ key: 'label' }, { key: 'category' }, { key: 'access' }, { key: 'mfa', status: true }, { key: 'reviewed' }]
    });
  }

  function incidentProgress(incident) {
    const values = state.incidentProgress[incident.id] || [];
    const complete = incident.steps.filter((_, index) => values[index]).length;
    return { complete, percent: Math.round((complete / incident.steps.length) * 100) };
  }

  function renderIncidents() {
    const grid = $('incident-grid');
    grid.replaceChildren();
    INCIDENTS.forEach((incident) => {
      const progress = incidentProgress(incident);
      const card = node('button', 'incident-card');
      card.type = 'button';
      card.dataset.incident = incident.id;
      const top = node('div');
      top.append(node('div', 'incident-icon', incident.icon), node('h3', '', incident.title), node('p', '', incident.description));
      const open = node('div', 'incident-open', progress.complete ? `${progress.percent}% complete · Continue →` : 'Open playbook →');
      card.append(top, open);
      grid.append(card);
    });
    if (activeIncident) renderIncidentWorkspace(activeIncident, false);
  }

  function renderIncidentWorkspace(id, shouldScroll = true) {
    const incident = INCIDENTS.find((item) => item.id === id);
    if (!incident) return;
    activeIncident = id;
    const workspace = $('incident-workspace');
    workspace.hidden = false;
    workspace.replaceChildren();

    const head = node('div', 'incident-workspace-head');
    const heading = node('div');
    heading.append(node('span', 'micro-label', 'ACTIVE PLAYBOOK'), node('h2', '', incident.title), node('p', '', incident.description));
    const reset = node('button', 'button button-danger button-small', 'Reset checklist');
    reset.type = 'button';
    reset.dataset.resetIncident = incident.id;
    head.append(heading, reset);
    workspace.append(head, node('div', 'incident-warning', incident.warning));

    const list = node('div', 'response-list');
    const progress = state.incidentProgress[id] || incident.steps.map(() => false);
    incident.steps.forEach(([title, detail], index) => {
      const labelEl = node('label', 'response-step');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = progress[index] === true;
      checkbox.dataset.incidentCheck = id;
      checkbox.dataset.step = String(index);
      const copy = node('span');
      copy.append(node('strong', '', title), node('p', '', detail));
      labelEl.append(checkbox, copy);
      list.append(labelEl);
    });
    workspace.append(list);

    const links = node('div', 'incident-links');
    incident.links.forEach(([label, url]) => {
      const anchor = node('a', 'button button-secondary button-small', `${label} ↗`);
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      links.append(anchor);
    });
    workspace.append(links);
    if (shouldScroll) window.setTimeout(() => workspace.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
  }

  function travelStats() {
    const total = TRAVEL_GROUPS.reduce((sum, group) => sum + group.tasks.length, 0);
    const complete = TRAVEL_GROUPS.reduce((sum, group) => sum + group.tasks.filter((_, index) => state.travel.tasks[`${group.id}-${index}`]).length, 0);
    return { total, complete, remaining: total - complete, percent: Math.round((complete / total) * 100) };
  }

  function renderTravel() {
    const stats = travelStats();
    $('travel-toggle').setAttribute('aria-checked', String(state.travel.active));
    setText('travel-mode-label', state.travel.active ? 'Travel mode active' : 'Travel mode inactive');
    setText('travel-progress', `${stats.percent}%`);
    setText('travel-remaining', stats.remaining);
    setText('travel-status', state.travel.active ? 'Heightened' : 'Standard');
    const container = $('travel-checklists');
    container.replaceChildren();
    TRAVEL_GROUPS.forEach((group) => {
      const section = node('section', 'travel-group');
      const complete = group.tasks.filter((_, index) => state.travel.tasks[`${group.id}-${index}`]).length;
      const head = node('header', 'travel-group-head');
      head.append(node('strong', '', group.title), node('span', '', `${complete} / ${group.tasks.length} complete`));
      const tasks = node('div', 'travel-tasks');
      group.tasks.forEach((task, index) => {
        const key = `${group.id}-${index}`;
        const labelEl = node('label', 'travel-task');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = state.travel.tasks[key] === true;
        input.dataset.travelTask = key;
        labelEl.append(input, node('span', '', task));
        tasks.append(labelEl);
      });
      section.append(head, tasks);
      container.append(section);
    });
  }

  function renderResources() {
    const grid = $('resource-grid');
    grid.replaceChildren();
    RESOURCES.forEach((resource) => {
      const card = node('a', 'resource-card');
      card.href = resource.url;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      const top = node('div');
      top.append(node('span', 'resource-org', resource.org), node('h3', '', resource.title), node('p', '', resource.description));
      card.append(top, node('span', 'resource-link', 'Open official resource ↗'));
      grid.append(card);
    });
    const glossary = $('glossary');
    glossary.replaceChildren();
    GLOSSARY.forEach(([term, definition]) => {
      const details = document.createElement('details');
      details.append(node('summary', '', term), node('p', '', definition));
      glossary.append(details);
    });
  }

  function renderAll() {
    renderAssessmentFilters();
    renderAssessmentList();
    updateAssessmentProgress();
    renderDashboard();
    renderPlan();
    renderHousehold();
    renderIncidents();
    renderTravel();
  }

  function updateDerivedViews() {
    updateAssessmentProgress();
    renderDashboard();
    renderPlan();
  }

  function addFromForm(form, type) {
    const data = new FormData(form);
    if (type === 'people') {
      const alias = cleanText(data.get('alias'), 40);
      if (!alias) return;
      state.people.push({
        id: makeId(), alias,
        role: cleanChoice(data.get('role'), ['Principal', 'Partner', 'Adult family', 'Minor', 'Elder', 'Assistant', 'Other'], 'Other'),
        exposure: cleanChoice(data.get('exposure'), ['High', 'Medium', 'Low'], 'Medium'),
        auth: cleanChoice(data.get('auth'), ['Strong', 'Partial', 'Weak', 'Unknown'], 'Unknown'),
        training: cleanChoice(data.get('training'), ['Current', 'Due', 'Not applicable'], 'Due')
      });
    } else if (type === 'assets') {
      const label = cleanText(data.get('label'), 50);
      if (!label) return;
      state.assets.push({
        id: makeId(), label,
        category: cleanChoice(data.get('category'), ['Primary email', 'Financial', 'Identity', 'Cloud storage', 'Mobile carrier', 'Digital asset', 'Home system', 'Other'], 'Other'),
        owner: cleanText(data.get('owner'), 40),
        protection: cleanChoice(data.get('protection'), ['Strong', 'Partial', 'Weak', 'Unknown'], 'Unknown'),
        recovery: cleanChoice(data.get('recovery'), ['Verified', 'Review due', 'Unknown', 'Not applicable'], 'Unknown')
      });
    } else if (type === 'vendors') {
      const label = cleanText(data.get('label'), 50);
      if (!label) return;
      const reviewed = String(data.get('reviewed') || '');
      state.vendors.push({
        id: makeId(), label,
        category: cleanChoice(data.get('category'), ['Financial adviser', 'Legal', 'Tax', 'Household staff', 'IT / security', 'Property management', 'Insurance', 'Other'], 'Other'),
        access: cleanChoice(data.get('access'), ['Financial approval', 'Sensitive data', 'Home systems', 'Limited', 'None'], 'Limited'),
        mfa: cleanChoice(data.get('mfa'), ['Yes', 'Unknown', 'No', 'Not applicable'], 'Unknown'),
        reviewed: /^\d{4}-\d{2}-\d{2}$/.test(reviewed) ? reviewed : ''
      });
    }
    form.reset();
    saveState('Register updated locally');
    renderHousehold();
    renderDashboard();
    toast('Added to the local workspace.');
  }

  function removeRegisterItem(type, id) {
    const list = state[type];
    if (!Array.isArray(list)) return;
    const item = list.find((entry) => entry.id === id);
    if (!item) return;
    confirmAction('Remove this entry?', `Remove “${item.label || item.alias}” from the local ${type} register?`, 'Remove', () => {
      state[type] = list.filter((entry) => entry.id !== id);
      saveState('Entry removed locally');
      renderHousehold();
      renderDashboard();
      toast('Entry removed.');
    });
  }

  function download(filename, content, type = 'application/json') {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function exportActionPlan() {
    const stats = scoreStats();
    const roadmap = derivedRoadmap();
    const safe = {
      format: 'Private Wealth Cybersecurity Command Center — share-safe action plan',
      generatedAt: new Date().toISOString(),
      readiness: {
        score: stats.answered ? stats.score : null,
        label: postureLabel(stats.score, stats.answered),
        assessmentCoveragePercent: stats.coverage,
        controlsRated: stats.answered,
        controlsTotal: QUESTIONS.length,
        pillarScores: Object.fromEntries(PILLARS.map((pillar) => [pillar.label, stats.pillarScores[pillar.id]]))
      },
      roadmap: Object.fromEntries(Object.entries(roadmap).map(([stage, items]) => [stage, items.map((item) => ({
        control: item.title,
        action: stage === 'maintain' ? item.detail : item.action,
        pillar: PILLARS.find((pillar) => pillar.id === item.pillar)?.label,
        effort: item.effort,
        status: item.answer
      }))])),
      fortressFive: FORTRESS.map((control) => ({
        control: control.title,
        tasks: control.tasks.map((task, index) => ({ task, complete: state.fortress[`${control.id}-${index}`] === true }))
      })),
      privacyNote: 'This export intentionally excludes household, asset, vendor, incident, and travel register entries.',
      disclaimer: 'A planning aid, not a security certification or substitute for professional advice.'
    };
    download('private-wealth-cybersecurity-action-plan.json', JSON.stringify(safe, null, 2));
    toast('Share-safe action plan exported.');
  }

  function printPlan() {
    showView('plan', false);
    document.body.classList.add('print-plan');
    window.print();
    window.setTimeout(() => document.body.classList.remove('print-plan'), 700);
  }

  function printProtocol() {
    document.body.classList.add('print-protocol-mode');
    window.print();
    window.setTimeout(() => document.body.classList.remove('print-protocol-mode'), 700);
  }

  function bytesToBase64(bytes) {
    let binary = '';
    const array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    for (let index = 0; index < array.length; index += 0x8000) {
      binary += String.fromCharCode(...array.subarray(index, index + 0x8000));
    }
    return btoa(binary);
  }

  function base64ToBytes(value) {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes;
  }

  async function deriveBackupKey(password, salt, iterations, usage) {
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
      material,
      { name: 'AES-GCM', length: 256 },
      false,
      [usage]
    );
  }

  async function exportEncryptedBackup() {
    const password = $('backup-password').value;
    if (!crypto?.subtle) {
      setText('backup-status', 'Encrypted backup requires a modern browser on HTTPS or localhost.');
      return;
    }
    if (password.length < 12) {
      setText('backup-status', 'Use a backup password of at least 12 characters.');
      $('backup-password').focus();
      return;
    }
    try {
      setText('backup-status', 'Encrypting backup…');
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const iterations = 310000;
      const key = await deriveBackupKey(password, salt, iterations, 'encrypt');
      const plaintext = new TextEncoder().encode(JSON.stringify(state));
      const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
      const payload = {
        format: 'pwcc-encrypted-backup',
        version: 1,
        createdAt: new Date().toISOString(),
        cipher: 'AES-256-GCM',
        kdf: 'PBKDF2-SHA-256',
        iterations,
        salt: bytesToBase64(salt),
        iv: bytesToBase64(iv),
        data: bytesToBase64(ciphertext)
      };
      download(`private-wealth-command-center-${new Date().toISOString().slice(0, 10)}.pwcc`, JSON.stringify(payload), 'application/json');
      $('backup-password').value = '';
      setText('backup-status', 'Encrypted backup downloaded. Store the password separately.');
      toast('Encrypted backup created.');
    } catch {
      setText('backup-status', 'Backup encryption failed in this browser.');
    }
  }

  async function importEncryptedBackup(file) {
    const password = $('backup-password').value;
    if (!file) return;
    if (!crypto?.subtle) {
      setText('backup-status', 'Encrypted import requires a modern browser on HTTPS or localhost.');
      return;
    }
    if (file.size > MAX_IMPORT_BYTES) {
      setText('backup-status', 'Backup exceeds the 2 MiB safety limit.');
      return;
    }
    if (password.length < 12) {
      setText('backup-status', 'Enter the backup password before choosing the file.');
      $('backup-password').focus();
      return;
    }
    try {
      setText('backup-status', 'Decrypting backup…');
      const payload = JSON.parse(await file.text());
      if (payload?.format !== 'pwcc-encrypted-backup' || payload.version !== 1 || payload.cipher !== 'AES-256-GCM' || payload.kdf !== 'PBKDF2-SHA-256') {
        throw new Error('Unsupported backup');
      }
      if (!Number.isInteger(payload.iterations) || payload.iterations < 100000 || payload.iterations > 1000000) throw new Error('Invalid KDF');
      const salt = base64ToBytes(payload.salt);
      const iv = base64ToBytes(payload.iv);
      const ciphertext = base64ToBytes(payload.data);
      if (salt.length !== 16 || iv.length !== 12 || ciphertext.length > MAX_IMPORT_BYTES) throw new Error('Invalid payload');
      const key = await deriveBackupKey(password, salt, payload.iterations, 'decrypt');
      const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
      const parsed = JSON.parse(new TextDecoder().decode(plaintext));
      const imported = sanitizeState(parsed);
      confirmAction('Replace this workspace?', 'The decrypted backup will replace all data currently stored in this browser.', 'Replace workspace', () => {
        state = imported;
        saveState('Encrypted backup imported');
        renderAll();
        $('backup-password').value = '';
        setText('backup-status', 'Encrypted backup imported successfully.');
        toast('Workspace restored from encrypted backup.');
      });
    } catch {
      setText('backup-status', 'Could not decrypt this backup. Check the file and password.');
    } finally {
      $('import-backup').value = '';
    }
  }

  function demonstrationState() {
    const demo = freshState();
    const values = ['yes', 'partial', 'no', 'yes', 'partial'];
    QUESTIONS.forEach((question, index) => { demo.assessment[question.id] = values[index % values.length]; });
    [
      'email-0', 'email-1', 'credentials-0', 'credentials-1', 'money-0', 'money-1', 'mobile-0', 'recovery-0'
    ].forEach((key) => { demo.fortress[key] = true; });
    demo.people = [
      { id: makeId(), alias: 'Principal A', role: 'Principal', exposure: 'High', auth: 'Strong', training: 'Current' },
      { id: makeId(), alias: 'Partner B', role: 'Partner', exposure: 'High', auth: 'Partial', training: 'Current' },
      { id: makeId(), alias: 'Assistant C', role: 'Assistant', exposure: 'Medium', auth: 'Partial', training: 'Due' }
    ];
    demo.assets = [
      { id: makeId(), label: 'Primary email', category: 'Primary email', owner: 'Principal A', protection: 'Strong', recovery: 'Verified' },
      { id: makeId(), label: 'Core banking', category: 'Financial', owner: 'Principal A', protection: 'Partial', recovery: 'Review due' },
      { id: makeId(), label: 'Family cloud', category: 'Cloud storage', owner: 'Partner B', protection: 'Partial', recovery: 'Unknown' },
      { id: makeId(), label: 'Mobile carrier', category: 'Mobile carrier', owner: 'Principal A', protection: 'Weak', recovery: 'Review due' }
    ];
    demo.vendors = [
      { id: makeId(), label: 'Wealth adviser', category: 'Financial adviser', access: 'Financial approval', mfa: 'Yes', reviewed: '2026-07-15' },
      { id: makeId(), label: 'Tax team', category: 'Tax', access: 'Sensitive data', mfa: 'Unknown', reviewed: '2026-04-10' },
      { id: makeId(), label: 'Property support', category: 'Property management', access: 'Home systems', mfa: 'No', reviewed: '' }
    ];
    ['before-0', 'before-1', 'before-3', 'transit-0'].forEach((key) => { demo.travel.tasks[key] = true; });
    demo.lastUpdated = new Date().toISOString();
    return demo;
  }

  function bindEvents() {
    $('confirm-dialog').addEventListener('close', () => {
      const callback = pendingConfirm;
      pendingConfirm = null;
      if ($('confirm-dialog').returnValue === 'confirm' && callback) callback();
    });

    $('mobile-menu').addEventListener('click', () => {
      const open = !document.body.classList.contains('nav-open');
      document.body.classList.toggle('nav-open', open);
      $('mobile-menu').setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', (event) => {
      const navButton = event.target.closest('[data-view]');
      if (navButton) showView(navButton.dataset.view);

      const targetButton = event.target.closest('[data-view-target]');
      if (targetButton) showView(targetButton.dataset.viewTarget);

      const filter = event.target.closest('[data-filter]');
      if (filter) {
        assessmentFilter = filter.dataset.filter;
        renderAssessmentFilters();
        renderAssessmentList();
      }

      const incident = event.target.closest('[data-incident]');
      if (incident) renderIncidentWorkspace(incident.dataset.incident);

      const launch = event.target.closest('[data-incident-launch]');
      if (launch) {
        showView('incidents');
        renderIncidentWorkspace(launch.dataset.incidentLaunch);
      }

      const resetIncident = event.target.closest('[data-reset-incident]');
      if (resetIncident) {
        const id = resetIncident.dataset.resetIncident;
        confirmAction('Reset this playbook?', 'All checked response steps for this incident will be cleared.', 'Reset checklist', () => {
          state.incidentProgress[id] = [];
          saveState('Incident checklist reset');
          renderIncidents();
          renderIncidentWorkspace(id, false);
        });
      }

      const deleteButton = event.target.closest('[data-delete-type]');
      if (deleteButton) removeRegisterItem(deleteButton.dataset.deleteType, deleteButton.dataset.deleteId);

      const tab = event.target.closest('[data-household-tab]');
      if (tab) {
        const name = tab.dataset.householdTab;
        $$('.subtab').forEach((item) => {
          const active = item === tab;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-selected', String(active));
        });
        $$('[data-household-panel]').forEach((panel) => {
          const active = panel.dataset.householdPanel === name;
          panel.classList.toggle('is-active', active);
          panel.hidden = !active;
        });
      }

      if (document.body.classList.contains('nav-open') && !event.target.closest('.sidebar') && !event.target.closest('#mobile-menu')) {
        document.body.classList.remove('nav-open');
        $('mobile-menu').setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('change', (event) => {
      const assessment = event.target.closest('[data-question]');
      if (assessment) {
        state.assessment[assessment.dataset.question] = assessment.value;
        const card = assessment.closest('.assessment-card');
        if (card) card.dataset.answer = assessment.value;
        saveState('Assessment saved locally');
        updateDerivedViews();
      }

      const fortress = event.target.closest('[data-fortress]');
      if (fortress) {
        state.fortress[fortress.dataset.fortress] = fortress.checked;
        saveState('Action plan saved locally');
        renderDashboard();
        const progress = fortressStats();
        setText('fortress-progress', `${progress.complete} of ${progress.total} complete`);
      }

      const incidentCheck = event.target.closest('[data-incident-check]');
      if (incidentCheck) {
        const id = incidentCheck.dataset.incidentCheck;
        const incident = INCIDENTS.find((item) => item.id === id);
        const progress = state.incidentProgress[id] || incident.steps.map(() => false);
        progress[Number(incidentCheck.dataset.step)] = incidentCheck.checked;
        state.incidentProgress[id] = progress;
        saveState('Incident checklist saved locally');
        renderIncidents();
        renderIncidentWorkspace(id, false);
      }

      const travelTask = event.target.closest('[data-travel-task]');
      if (travelTask) {
        state.travel.tasks[travelTask.dataset.travelTask] = travelTask.checked;
        saveState('Travel checklist saved locally');
        renderTravel();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        $('mobile-menu').setAttribute('aria-expanded', 'false');
      }
    });

    $('assessment-clear').addEventListener('click', () => {
      confirmAction('Clear assessment answers?', 'This removes every assessment response but keeps checklists and registers.', 'Clear answers', () => {
        state.assessment = {};
        saveState('Assessment answers cleared');
        renderAll();
        toast('Assessment answers cleared.');
      });
    });

    $('person-form').addEventListener('submit', (event) => { event.preventDefault(); addFromForm(event.currentTarget, 'people'); });
    $('asset-form').addEventListener('submit', (event) => { event.preventDefault(); addFromForm(event.currentTarget, 'assets'); });
    $('vendor-form').addEventListener('submit', (event) => { event.preventDefault(); addFromForm(event.currentTarget, 'vendors'); });

    $('travel-toggle').addEventListener('click', () => {
      state.travel.active = !state.travel.active;
      saveState(state.travel.active ? 'Travel mode activated' : 'Travel mode deactivated');
      renderTravel();
      toast(state.travel.active ? 'Travel mode activated.' : 'Travel mode returned to standard.');
    });

    $('export-plan').addEventListener('click', exportActionPlan);
    $('print-plan').addEventListener('click', printPlan);
    $('quick-print').addEventListener('click', printPlan);
    $('print-verification-card').addEventListener('click', printProtocol);
    window.addEventListener('afterprint', () => document.body.classList.remove('print-plan', 'print-protocol-mode'));

    $('export-backup').addEventListener('click', exportEncryptedBackup);
    $('import-backup').addEventListener('change', (event) => importEncryptedBackup(event.target.files?.[0]));

    $('load-demo').addEventListener('click', () => {
      confirmAction('Load the demonstration profile?', 'This fictional profile will replace the current local workspace. Export a backup first if you need the current data.', 'Load demo', () => {
        state = demonstrationState();
        saveState('Demonstration profile loaded');
        renderAll();
        showView('command');
        toast('Synthetic demonstration profile loaded.');
      });
    });

    $('erase-data').addEventListener('click', () => {
      confirmAction('Erase all local data?', 'This permanently removes assessment answers, checklists, aliases, registers, incident progress, and travel progress from this browser.', 'Erase everything', () => {
        localStorage.removeItem(STORAGE_KEY);
        state = freshState();
        activeIncident = null;
        $('incident-workspace').hidden = true;
        renderAll();
        showView('command');
        toast('Local workspace erased.');
      });
    });
  }

  function initialize() {
    $$('.view').forEach((view) => { view.tabIndex = -1; });
    bindEvents();
    renderResources();
    renderAll();
    if (!crypto?.subtle) {
      $('export-backup').disabled = true;
      setText('backup-status', 'Encrypted backup requires HTTPS or localhost in a modern browser.');
    }
  }

  initialize();
})();
