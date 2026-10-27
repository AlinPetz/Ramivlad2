# Editorial refinement — RAMIVLAD INSTAL

Local branch: `codex/editorial-refinement`. Baseline: `8bba6a9`. No push or deployment is authorized for this refinement.

## Evidence and visual audit

Fresh before screenshots were captured from the actual published `https://alinpetz.github.io/Ramivlad2/` at 1440×1000, 768×1024 and 390×844. Root inspected the desktop/mobile viewport captures, and a delegated ECC-guided architect/design reviewer inspected the saved full-page live desktop/mobile captures. The observations below are visual judgments corroborated by source, not measured conversion research.

1. Hero slogan could describe any home-service company; the actual work is secondary.
2. Equally weighted text/photo columns create a familiar template composition.
3. The second headline line uses blue as decoration rather than semantic information.
4. Heavy headings and similarly tight two-line wraps repeat through the page.
5. Alternating white/pale-blue sections and similar padding create predictable rhythm.
6. Four equal rounded service cards flatten different kinds of work into identical features.
7. Abstract service glyphs add decoration without explaining the services.
8. The same underfloor photograph and similar crop appear in hero and portfolio.
9. Similar fixed-height project plates crop equipment, construction and exterior images alike.
10. Portfolio category captions add little information about the visible work.
11. The proof strip repeats services/location and declares “Proiecte reale” instead of showing scope.
12. The company section repeats an abstract conversation/solution slogan.
13. Utility strip, tagline, navigation and boxed phone action over-layer the header.
14. Mobile stacks the desktop components: four short headline lines, two buttons, then the image.
15. The fixed mobile contact strip visually crosses the hero photograph and spends space on another conversational prompt.

No claim is made that these observations establish conversion uplift or that human usability studies were run.

## Three directions

| Dimension | A — Dosar de lucrări (selected) | B — Jurnal de șantier | C — Index tehnic |
|---|---|---|---|
| Identity | Architecture-inspired company/project folio | Documentary account of installation work | A precise, utilitarian service catalogue |
| Typography | Manrope variable, medium display and regular body; no decorative type mixing | Source Serif 4 headlines with IBM Plex Sans body | Barlow Semi Condensed headings with restrained IBM Plex Mono labels |
| Palette | Chalk/off-white `#f8f8f5`, graphite `#252c29`, original deep blue `#075c9d` for contact/focus | Neutral white, ink and gray; original blue for links only | Cool white, charcoal, steel gray and existing blue |
| Layout | Open twelve-column proportions, unequal spans, few structural rules | Alternating full scenes and short documentary passages | Compact aligned service rows with consistent information columns |
| Hero | Literal service heading, separate factual note, dominant photograph and smaller equipment detail | A concise introduction paired with two documentary scenes | Compact work/location heading above a wide technical photograph |
| Photography | Straight rectangular plates, varied scales and considered crops; original color retained | Fuller scenes, fewer crops, close-ups supporting the narrative | Clear equipment/detail views with aligned caption baselines |
| Portfolio | One larger plate, offset secondary work and a third landscape detail; scope captions | Short project stories without invented dates, clients or locations | Contact-sheet presentation organized by verified technical scope |
| Mobile | Service heading, principal image, concise contact action; open rows and deliberately varied project widths | One scene per short story, uninterrupted reading | Straight service index, then full-width technical images |

**Selected: A, Dosar de lucrări.** The geometry of the authentic installations supplies a recognizable visual character. It makes the work visible without requiring invented metadata, decorative graphics or new photography. Compared with B, it needs fewer unverified project stories; compared with C, it gives the existing photographs more space.

## Design contract and implementation

- Audience/job: homeowners and small commercial clients identifying the appropriate installation service and contacting the company.
- First-screen hierarchy: service names → location/real installation → scope and phone contact. Mobile intentionally puts the principal photograph before the supporting note and CTA.
- Primary action: verified telephone; secondary action: portfolio. Email drafting remains explicit and never claims delivery.
- Target layouts: 390×844 mobile, 768×1024 tablet, 1440×1000 desktop; regression widths also include 360 and 1024.
- Typography: one self-hosted variable family, 400–700 weights. Latin and Latin-ext cover Romanian diacritics. Fonts total approximately 40 KB; no runtime Google Fonts requests. License is retained under `assets/fonts/`.
- Photography: hero uses existing `project-1-6`, secondary equipment detail uses `project-2-4`; portfolio uses `project-1-1`, `project-2-4`, `project-3-8`. Originals remain untouched. No stock or generated images, unverified project dates, municipalities, client names, floor areas or performance claims.
- Services: semantic open rows with linked headings and specific descriptions; abstract glyphs and repeated card panels removed.
- Portfolio: unequal image sizes and technical captions taken from the verified existing descriptions. Gallery routes and all original photos remain available.
- Navigation/contact: simpler header, visible phone action, working menu and skip link. Fixed mobile bar removed so it cannot obscure photography. Existing form IDs, validation, draft/copy behavior and privacy explanation retained.
- Motion: only short feedback transitions on links/buttons; reduced-motion preferences respected. No scroll reveal, parallax, blobs, gradients or decorative entry animation.
- Architecture: homepage and contact templates extracted to `scripts/content/home.mjs` and `contact.mjs`; shared route/metadata/schema and Pages path handling remain in `scripts/build.mjs`.

## Verification and screenshots

Before screenshots: `screenshots/before-{desktop,tablet,mobile}.png` and matching `-viewport.png` files. After screenshots and sections are reproducible with `node scripts/editorial-capture.mjs` while local preview is running. Actual inspection, QA measurements and remaining limitations are recorded in `verification.json` and the development handoff after final checks.

## Real material still missing

There are no verified customer names, project dates/locations/areas, testimonials or new certification details to add. Useful future photography would include finished sanitary installations, installers at work and completed technical rooms, with owner/client publication permission. Existing phone/address-role conflicts and certificate identity/validity still need owner confirmation as documented in `reports/HANDOFF.md`. These gaps were not filled with invented content.

## Agents actually run

- `editorial_audit`: Codex subagent using ECC frontend-design-direction and architect guidance; inspected before screenshots, supplied 15 issues and three directions.
- `copy_architecture`: Codex subagent using ECC marketing-agent/code-architect guidance; source-based Romanian copy and bounded template recommendations.
- `editorial_review`: Codex subagent using ECC a11y-architect/code-reviewer guidance; inspected after screenshots and source for concrete defects.

The roles were supporting instruction files; dedicated ECC executables with those names were not claimed. Root implemented the changes, captured and inspected screenshots, and ran the checks.
