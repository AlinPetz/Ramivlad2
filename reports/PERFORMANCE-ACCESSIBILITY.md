# Measured performance and accessibility

Measured locally on 26 October 2026 against `http://127.0.0.1:4173`. Lighthouse 13.5.0, headless Chrome, simulated mobile throttling, 390 × 844 screen emulation. Raw JSON/HTML and the exact QA scripts are retained. Scores are laboratory results, not guarantees of production performance.

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Homepage `/` | 99 | 100 | 100 | 100 | 1.9 s | 100 ms | 0 |
| Heating `/instalatii-termice.html` | 100 | 100 | 100 | 100 | 1.9 s | 0 ms | 0 |

These are the final local premium-redesign measurements on `codex/premium-redesign`, not a new production deployment. FCP and Speed Index were 1.2 s on the homepage and 0.9 s on the heating page. Both meet the requested score targets and local LCP/CLS goals. Four self-hosted font subsets total 67,480 bytes, with the display fonts instanced to avoid downloading unused variable axes. All project photographs now have exact intrinsic size hints and responsive-width descriptors, particularly for natural-height mobile galleries. Lighthouse still identifies diagnostic opportunities in image delivery, render blocking, dependency chains and caching. Production delivery must be measured after an approved deployment. A high score does not mean every diagnostic is perfect.

No field INP data is available before production traffic. TBT is a lab responsiveness metric and is not reported as INP. No CrUX/Search Console field measurements or real device cellular tests were available.

Original source problems addressed: false form success, unguarded modal/carousel scripts, heavy original images, missing responsive image variants, generic image alternatives, metadata gaps and unnecessarily long form. New images use committed 400/640/1200 WebP variants with JPEG originals available, lazy loading away from the hero, explicit dimensions and fetch priority on the main image. No webfont requests or production npm scripts are required in visitors' browsers.

Manual rendered checks and browser automation cover mobile/desktop viewport sizes, menus, keyboard Escape, skip link, no horizontal overflow, real image loads, local links, contact validation, safe draft generation and HTTP behavior. `browser-qa.json` is the authoritative result of the completed browser suite. Screenshots are saved under `reports/screenshots/`. Automated axe checks target WCAG 2 A/AA, WCAG 2.1 AA and WCAG 2.2 AA rules.

Automated accessibility checks and Lighthouse cannot certify full WCAG compliance. Screen reader testing with human users, content in the original certificate images and PDF accessibility were not fully audited. Certificate images have descriptive links and can be opened at their original resolution; no unsupported credentials were transcribed.

During QA, a malformed select option, menu-induced layout shift, accessible-name mismatch, low-contrast field boundaries and Escape focus behavior were corrected. Requests with invalid contact data or whitespace-only descriptions are blocked. The form test verifies no network POST and never opens the email app or sends a live message.
