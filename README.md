# RAMIVLAD INSTAL — local modernization

Romanian business website, prepared locally for owner review. **Not deployed.** The repository was initially empty; the public site was inspected independently and uses HTML/CSS/JavaScript. This implementation keeps that lightweight stack, adds a Node build tool, and has no production npm dependencies.

For current status, completed batches, fresh test results and exact interruption recovery steps, read [DEVELOPMENT_HANDOFF.md](DEVELOPMENT_HANDOFF.md). Business confirmations and deployment blockers are in [reports/HANDOFF.md](reports/HANDOFF.md).

The original GitHub history and `img/` assets are preserved. Its standalone HTML pages are archived under `reports/legacy-github/`; the current website is generated from `scripts/build.mjs` into `dist/`. Do not use the archived HTML as the production entry point.

## Preview

Node 20+ is required. From this directory:

```sh
npm run build
npm run dev
```

Open http://127.0.0.1:4173. Stop the server with Ctrl+C. The server binds only to loopback. Generated production files are in `dist/`.

## Editing

- `scripts/build.mjs`: Romanian content, business facts, page templates and structured data.
- `styles.css`: shared design tokens, layout and responsive behavior.
- `script.js`: mobile menu, validation and email draft preparation.
- `assets/`: authentic logo, project photos, document images and optimized WebP variants.
- `docs/prezentare_ramivlad.pdf`: preserved company presentation.
- `reports/`: audit, source snapshots and measured QA evidence.

All existing public HTML page names and homepage anchors are retained. The four new service pages provide distinct content rather than location duplicates. Optimized image variants are committed source assets, so image tooling is not required for an ordinary build.

## Checks

```sh
npm test
npm ci
node scripts/browser-qa.mjs
node scripts/lighthouse.mjs
```

Build before testing. Browser checks require installed Google Chrome and the preview server. `npm ci` installs only development tools; it is not needed to build or serve this dependency-free static site. QA tests never click the email launch link or submit a real inquiry. Lighthouse may vary with machine load.

## Contact delivery

There is no automatic form delivery in this version. The existing public script prevented submission and displayed false success. The replacement validates the request, generates a local draft and offers explicit email-app and copy actions. It does not save data or contact a backend. A successful draft is clearly distinguished from a sent message. Phone/email links work independently of JavaScript.

If direct delivery is required, implement an owner-approved backend with server validation, rate limiting, spam protection, provider credentials, delivery error handling and retention settings. Adjust privacy text and `form-action`/`connect-src` deliberately. Do not reconnect an unverified `/send.php` or use `mail()` blindly.

## Deployment — owner approval required

1. Resolve the owner confirmations in `reports/HANDOFF.md`, especially contact facts, document validity, privacy details and delivery choice.
2. Obtain hosting access and back up the complete current site, configuration, existing PHP and any hidden files. Hosting/provider and backend source were not supplied.
3. Run `npm run build` and `npm test`; test the production artifact on staging. Upload **the contents of `dist/` only** to the configured web root. Never upload source snapshots, `node_modules`, `.git`, QA reports or credentials.
4. Use HTTPS. For Apache, the generated `.htaccess` provides headers and the 404 document; verify the host permits these directives. For a static provider supporting `_headers`, the generated file provides equivalent policy. Nginx/other hosts require translating those settings. Ensure unknown paths return HTTP 404. Configure HTTP→HTTPS and preferred domain redirects in the host after owner approval; no DNS changes are required by this implementation.
5. Cache image assets for one day; revalidate HTML/CSS/JS or purge cache when uploading changes. Enable Brotli/gzip at the host. Do not assign immutable caching to unversioned files.
6. Test all retained URLs, phone/email actions, mobile navigation, security headers and certificate/PDF downloads on staging. Confirm CSP permits JSON-LD parsing and blocks unwanted third-party scripts.
7. Only with explicit approval, publish. Verify production canonical URLs, sitemap and robots. Submit the sitemap through owner-managed Search Console and review the Google Business Profile for consistent confirmed contact details.
8. Rerun Lighthouse on production. Monitor real-user LCP/INP/CLS via Search Console; local Lighthouse does not establish field performance. Restore the host backup if checks fail.

Do not deploy the Node preview server as the public production server. No analytics, third-party accounts, DNS or production databases were modified.
