# Premium redesign — local review

Branch: `codex/premium-redesign`. No push or deployment. The previous local refinement is preserved in `.local-backups/editorial-before-premium.zip`; original photographs are unchanged.

## What the rendered audit showed

The previous pages had too little contrast between display and supporting text, contextless pipe crops, large empty portfolio offsets, text-heavy service pages and a weak contact ending. Mobile mostly stacked those compositions. Before captures cover all 12 public pages at 1440×1000, 768×1024 and 390×844; source snapshots alone were not used as visual verification.

## Implemented direction

Architectural editorial composition with a more forceful engineering identity: Archivo display type, Manrope body text, white/graphite surfaces and the original deep blue. A twelve-column proportion system, 60/75/100px section spacing, square image edges and purposeful overview/detail pairs replace the prior sparse folio. The dark contact ending and hero project note provide deliberate contrast; navigation and phone actions remain clear.

- New homepage composition: a complete heating installation opens the page; photographic heating/service spreads lead into sanitary work and diagnosis; project entries pair room/equipment overviews with real installation details. The former proof strip and generic process sequence are absent.
- Supporting pages: photographic service leads, one practical contact brief, project overview/scope sections, complete galleries with varied desktop widths and natural mobile image proportions, and clearer certificate labels identified from the actual documents.
- Copy: specific Romanian service descriptions and technical scope; no invented project dates, clients, ratings, performance specifications or certifications. Consumer-facing labels no longer describe themselves as source-audit evidence; factual uncertainties remain in the handoff.
- Photography: 25 gallery photographs were reviewed along with the additional legacy ventilation photo, logo and certificate assets. The extra legacy image and partner logos are retained without expanding the published gallery or making new affiliation claims. There are no stock or generated project images.
- Functionality: all important URLs, metadata, schema, Pages path handling, validation and explicit email-draft behavior are preserved. The form does not claim automatic delivery.

## Iteration, not compilation-only approval

The first complete pass was captured across all 12 public pages at all three widths. Root and an ECC-guided reviewer inspected homepage and supporting-page captures. Corrections included mobile line-break spacing, more contextual paired service photographs, exact intrinsic dimensions for every project image, deduplicated/correct responsive-width descriptors and smaller font files. The refined pass was captured again, followed by a final Romanian copy polish and refreshed captures.

Archivo was obtained from the official Google Fonts service and instanced locally at weight 600 / width 90 using FontTools. Its two WOFF2 subsets now total 27,524 bytes instead of 176,344 bytes. With the existing Manrope subsets, the font total is 67,480 bytes. Both OFL licenses are retained under `assets/fonts/`. An ordinary build needs neither FontTools nor a font download.

## Review files and checks

`screenshots/comparison-desktop.png`, `comparison-tablet.png`, `comparison-mobile.png` compare actual before/after captures. `before-*`, `pass1-*` and `after-*` contain full-page evidence for all public routes. Section and form-state captures are included. Screenshots are local/ignored; `verification.json` records inspection, QA and limitations. `node scripts/premium-capture.mjs after` reproduces the final captures with a running preview.

Production builds and static checks pass at both `/` and `/Ramivlad2`: 13 pages, 386 local references, valid responsive variants, accurate photograph dimensions and all 25 gallery originals accessible exactly once on their respective project pages. Browser/Lighthouse results are recorded in the verification file and current performance report. Automated checks do not prove full WCAG compliance or conversion uplift.

Three real Codex subagents ran with ECC guidance: `premium_critique` (architect/design critique), `premium_page_templates` (implemented the service/project content module), and `premium_render_review` (rendered/accessibility/source review). Dedicated ECC executables were not claimed. Root implemented the remaining code, inspected screenshots, corrected findings and ran tests.

## Authentic asset requests

The current photographs are genuine but mostly phone portraits, with some construction clutter and existing watermarks. For the next photographic improvement, request:

- Wide, level photographs of completed technical rooms and the full installed system.
- Finished sanitary installations: bathrooms, visible pipework/racords and fixtures.
- Real installers at work, with permission to publish identifiable people.
- Owner-approved project captions with confirmed location/date/scope, where publishable.
- Confirmation of phone/address roles and the current applicability of company documents.

No missing material was replaced with stock photography or invented facts.

## Preview

Run `npm run build`, then `npm run dev`, and open `http://127.0.0.1:4173/`. The owned QA server is stopped after verification. Publishing requires separate owner approval.
