# GitHub Pages publishing-source repair — 27 October 2026

## Verified root cause

Pages was configured as build_type=legacy, source main, path /. A later dynamic Jekyll run 40484481037 published the README after the correct Node/dist workflow run 40483813203. The live H1 was Ramivlad2 and its stylesheet was assets/css/style.css, while the local H1 was the Romanian website headline. build-info.json returned 404. The standalone website CSS and JavaScript still matched local source, but the served README did not reference them. This was a publishing-source regression, not a design or missing-prefix defect.

## Correction

Restored Pages build_type=workflow via the GitHub API; no domain or DNS changes. Added a workflow preflight that fails clearly when Pages is switched back to branch publishing. The existing artifact remains dist. Added repository-prefix support and isolated ports/root directories to the local preview server, plus scripts/deployment-parity.mjs for reproducible builds and screenshot/asset parity checks. No design, typography, content, CSS or application JavaScript changes.

## Verification

Root and exact /Ramivlad2 production builds passed static validation (13 pages, 386 local links/assets). Root and prefixed local full-page PNG screenshots are byte-identical at 1440x1000 and 390x1000 viewports after all photographs and fonts load. The parity script checks network errors, loaded-resource bytes, content types, overflow, the actual headline and deployed SHA; pass the live URL and expected SHA after deployment. Screenshots and detailed results are kept under ignored reports/screenshots/deployment-parity; original broken-live screenshots are under ignored .local-backups/parity.

Resume: confirm Settings > Pages > Source is GitHub Actions, inspect Actions, then run node scripts/deployment-parity.mjs https://alinpetz.github.io/Ramivlad2/ EXPECTED_SHA and node scripts/pages-qa.mjs https://alinpetz.github.io/Ramivlad2/ EXPECTED_SHA. Do not select main/(root) or docs as a publishing source.

## Completed live verification

The repaired workflow succeeded for 36e9ae6. Live all-page QA passed 16 page/viewport cases. Exact root, repository-prefix and live full-page screenshots match byte-for-byte at 1440 and 390 when Chrome uses software rendering and a fixed sRGB profile. Default GPU rendering produced nondeterministic photograph resampling despite identical image bytes and layout; the reusable comparison now fixes this capture environment, waits for responsive image requests, and prepares all viewport tiles. Every loaded image, font, CSS and JavaScript resource hash matches the local artifact; no console/network errors. The final follow-up commit only finalizes this deterministic QA harness and report, with no website presentation changes.
