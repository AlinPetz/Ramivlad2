# Audit and owner handoff

Review date: 26 October 2026. Local changes only. Branch: `codex/website-modernization`.

## Starting state and evidence

The supplied repository contained only `.git`, with no commits, source files, configured remote, tests, dependencies or deployment configuration. No unrelated work was overwritten. There was no meaningful existing commit to checkpoint. Public source snapshots are retained here for comparison, separately from production output.

The official live site uses plain HTML, shared CSS/JS and a form declaring `/send.php`. This does not establish that a working PHP backend exists: the public JS explicitly prevents submission, shows a thank-you alert and resets fields. That false success behavior is removed.

Confirmed original problems:

- Homepage has no description, canonical, Open Graph or JSON-LD metadata.
- All three project pages share a project-1 title.
- `robots.txt` and `sitemap.xml` returned 404 during the audit.
- Homepage phone differs from projects/certificates/privacy. Contact address differs from footer/privacy; privacy labels Unirii as registered office.
- Shared JS accesses absent modals and carousel items without guards; needless timed carousel work.
- Generic/empty image alternatives, no useful responsive image variants, long inquiry form with property questions before establishing the service needed.
- Public source does not reveal hosting settings, analytics accounts, server environment, PHP implementation or production dependencies. These were not assumed absent or audited beyond accessible evidence.

Official sources: [homepage](https://ramivladinstal.ro/), [projects](https://ramivladinstal.ro/projects.html), [certificates](https://ramivladinstal.ro/certificate.html), [privacy](https://ramivladinstal.ro/politica-confidentialitate.html), and `project-1.html`, `project-2.html`, `project-3.html` on the same domain.

## Owner confirmation before publication

| Information | Published evidence / decision |
|---|---|
| Identity | RAMIVLAD INSTAL SRL, CUI RO16359044, self-published. Confirm legal spelling and VAT status. |
| Primary phone | Homepage: +40 744 577 842, used consistently for primary calls. Other pages: +40 758 067 005; preserved in privacy as an alternative requiring confirmation. |
| Email | ramivladinstal@yahoo.ro, consistent on homepage. Confirm it is monitored. |
| Addresses | Europa 75 is published as contact address; Unirii 12A is published as registered office in privacy. Both retained with that source distinction; confirm actual roles and visitor access. Exact address excluded from business schema pending confirmation. |
| Hours | Homepage says Monday–Friday 08:00–17:00. Retained visibly, excluded from schema pending confirmation. No 24/7 claim. |
| Area | Baia Mare and surroundings. Other Maramureș locations require a phone confirmation; no county-wide service promise. |
| Services | Six homepage categories, plus underfloor heating, air–water heat pump and ventilation evidenced by project pages. Confirm current scope and regulated operations before contracting. |
| Credentials | Three original document images retained. Third original caption/alt mismatch (Trust Euro Therm versus Nibe). No inferred ISCIR/ANRE authorization, accreditation, current validity or blanket certification claim. |
| Founding year | Homepage says 2004; not independently verified and not promoted in new copy. |
| Projects/reviews | Authentic company-hosted photos preserved. No customer names, locations, ratings or testimonials invented. Confirm continued publication rights and client privacy. |
| Inquiries | Draft/email flow works locally. Owner must choose whether it is sufficient or supply an approved backend/provider for automatic delivery. |
| Privacy | Validate actual hosting logs, processing grounds, recipients, retention, contact details and final policy. Current policy explains the draft-only application accurately and identifies unconfirmed hosting details. |

## Implemented batches / change log

1. Foundation: source audit, safety branch, build-only Node tooling, shared light theme with original logo/blue accent, system typography, reusable page templates. Static links/schema checks passed.
2. Homepage: clear Romanian/local positioning, services, authentic project portfolio, inquiry process, service-area explanation, FAQs and contact. Responsive browser review performed.
3. Navigation/content: four substantive service pages, services overview, three complete galleries (25 original photographs), certificates and company PDF. Original public page URLs and anchors retained.
4. Contact: short labeled fields, trimmed validation, phone-or-email validation, honeypot, safe text-only draft, explicit email/copy actions, fallback contact without JS. No live messages sent.
5. SEO: unique titles/descriptions, canonical URLs, Romanian language, Open Graph, breadcrumbs, Plumber/Service/BreadcrumbList schema, sitemap and robots. No fabricated reviews or business properties.
6. Quality: WebP sizes, lazy gallery images, eager priority hero, reserved dimensions, reduced-motion handling, keyboard menu/skip link, high-contrast fields/focus, CSP/header configurations and 404 behavior.
7. QA: source assertions, browser journeys, automated accessibility and mobile Lighthouse. Evidence is in the JSON reports; measurements and limitations are summarized below.

## Technical SEO

There are 12 indexable pages plus a noindex 404. `/index.html` canonicalizes to `/`. Existing projects, certificates, privacy and detail names remain valid, so no route migration or permanent redirects are needed. All services are linked from home; projects link to related services. New local keyword themes are inferred from actual service descriptions, not paid search-volume/ranking research.

Schema deliberately excludes exact address, opening hours, ratings, reviews, certifications, unverified regional coverage and pricing. Confirm business details before expanding it. Google may choose not to show enhanced results; schema does not guarantee rankings. A production schema validator and Search Console inspection remain deployment checks.

Owner actions: reconcile business facts, update Google Business Profile consistently, verify service categories and photos, review genuine customer reviews through permitted channels, verify Search Console ownership and submit `/sitemap.xml`. No profiles or analytics accounts were changed.

## Competitor/conversion research

[ETIC INSTAL](https://www.eticinstal.ro/) presents integrated mechanical services and named projects. [Group KMN](https://groupkmn.ro/servicii/) uses clear service families, phone contact and a form; published hours were inconsistent. [CLIMA THERM NORD's company profile](https://www.daibau.ro/executant/clima_therm_nord_s_r_l) uses specific domestic service categories and offer requests; this is a company-authored marketplace profile, not an independent company website audit.

The resulting opportunity is plain Romanian descriptions tied to customer problems, authentic project evidence, easy calling and a short inquiry. No competitor text/images/design were copied. Competitor search rankings, mobile rendering and real delivery were not measured.

## Security review

No production npm dependencies. Development dependencies are pinned in the lockfile; `reports/dependency-audit.json` records the actual audit result. No credentials, environment variables, third-party trackers, remote scripts, unsafe HTML insertion, browser persistence or backend submission were introduced. User text is assigned to textarea.value and encoded in a mailto link. The preview rejects non-GET/HEAD requests and prevents traversal beyond `dist/`. Security headers are provided for preview, Apache and compatible static hosts; their production delivery must be checked on the actual host.

Source snapshots are excluded from build assets. Static hosting has no form receiver, so rate limiting and server-side spam controls are not applicable to the current draft-only flow. A honeypot is not represented as backend spam protection. A future receiver requires separate server validation, limits, delivery reliability and privacy review. npm audit is a point-in-time advisory check, not proof of security.

## Agents that actually ran

The ECC installation includes Markdown specialist roles and three Codex TOML role definitions (`explorer`, `reviewer`, `docs_researcher`). Those files are not proof that their named roles can be invoked in this session. The available collaboration tool executes generic Codex subagents; three were actually spawned:

- `business_research`: official-source/SEO audit using ECC `seo-specialist` role and `seo` skill; later reviewed generated content/schema.
- `conversion_research`: competitor/conversion research using ECC `marketing-agent` role.
- `quality_review`: accessibility/security/code review using ECC `security-reviewer` and `a11y-architect` roles. Found focus, validation, output filtering and control contrast defects; corrected.

No claim is made that a dedicated ECC executable named `seo-specialist`, `e2e-runner` or other suggested role ran. Root coordinated implementation and ran the actual browser/Lighthouse checks. Taste and Sites local-only guidance supported design and preview.

## Remaining release issues

Owner confirmations and privacy validation above; hosting access/configuration; automatic delivery if required; production staging checks and owner deployment approval. No real test submissions were sent. No DNS, database, live analytics or production website changes were made.
