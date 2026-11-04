# Project notes for Claude

A public site about the landlords behind Normandy House sober living in Des Plaines, IL, with downloadable public-record filings from *Sherrick v. Normandy House, Inc.* (Cook County Case No. 20262005977). Static HTML + Sass, bundled with Parcel, deployed to GitHub Pages. Built from the Newbie FEM Starter Pack (`~/Claude/renters-in-recovery/newbie-fem-starter`).

**This repo is public.** Everything committed here, including this file, can be read by the defendants. Keep case strategy, personal details and anything unfiled out of it.

## Theme

The site's message follows the 2026-10-31 press release: Normandy House's own Form 990s report $2,463,339 in resident payments as "contributions" for 2021–2025, and residents must sign a form calling them "guests" with no renters' rights. Lead with the money; the threatened lockout after the City complaints is the story that shows what the label is for. The release and notes on adapting it are private, in `Lawsuit/Media/`.

## The `Lawsuit/` folder

- `Lawsuit/` is gitignored and must stay that way. It holds the private case file: drafts, evidence, correspondence, and its own `Lawsuit/CLAUDE.md` with case facts, law and drafting rules. Read that file before working on anything that touches the case.
- Nothing in `Lawsuit/` goes public by default. A document moves to `src/docs/` only when Jason asks for that specific document.
- Before every commit, run `git status` and confirm no file from `Lawsuit/` (or a copy of one) is staged.

## Publishing filings

- Only clerk-accepted filings from `Lawsuit/Court Filings/Accepted/` can be published. Never drafts, unfiled motions, evidence, notes, or emails.
- Before adding a PDF, check it for third parties' names, addresses and phone numbers, and for anything covered by Ill. S. Ct. R. 138 (SSNs, birth dates, account numbers). Redact by removing the text, not by drawing a box over it, then confirm with `pdftotext` that the redacted text is gone.
- Never publish anything from the separate Gore case. Its exhibits include an ID card.
- Roommates and other residents are never named or described in a way that identifies them.
- No medical information about anyone.

## Content rules

- Anything said about a named organization or person must be attributed to a filing or public record ("the complaint alleges...", "Normandy's 2025 Form 990 reports..."). Never state an allegation as fact.
- Link the source document next to every claim drawn from it.
- Tone: plain, factual, dry. No editorializing about the defendants.

## Scripts

- `npm start`: Parcel dev server on port 4321. Writes to `dist-dev/`, never `dist/`.
- `npm run check`: `html-validate` over `src/` (standard, a11y and document rules; config in `.htmlvalidate.json`), then `scripts/check-links.mjs`, which fails on any `#anchor` without a matching id or relative link to a missing file. Runs at the start of every build, so a broken page can't deploy.
- `npm run build`: runs `check`, then a clean production build in `dist/` with relative paths (`--public-url ./`), then copies `src/static/` into `dist/` unprocessed. Files that need a fixed absolute URL, like the link-preview image `og-image.png`, go in `src/static/`.
- `npm run push-gh`: builds, then publishes `dist/` to the `gh-pages` branch with a `CNAME` for www.normandyhouselandlords.org (gh-pages replaces the branch each deploy, so the CNAME must come from the script). Requires the `origin` remote to use SSH (it does).
- `package-lock.json` is committed; install with `npm ci`. Check new install scripts before approving them with `npm approve-scripts <pkg>`.
- `gh` isn't installed. Use `git` or the GitHub web UI for repo settings.

## Sass

- 7-1 pattern with `@use`/`@forward`, never `@import`. `abstracts/` outputs no CSS; partials pull it in with `@use "../abstracts" as *;`.
- `breakpoints()` mixin: `sm` 16rem, `md` 48rem, `lg` 62rem, `xl` 75rem. Mobile-first.
- `url()` paths in any partial are relative to `src/scss/style.scss`. Don't put `url()` inside custom properties.
- `$palette` becomes `--color-*` in `themes/_default.scss`, mapped to semantic `--theme-*` tokens. Components use only `--theme-*`.
- BEM: one partial per block in `components/`.
