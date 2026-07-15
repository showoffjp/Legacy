# Legacy ✝

**A Christian companion for life's final farewell.**

Families plan weddings for a year. A funeral gives them days — the hardest days of their lives.
Legacy carries every detail of a faithful farewell the way a wedding planner carries a wedding:
one gentle step at a time, nothing forgotten, nothing hidden, everything shaped around the person
being honored. It captures who they were, coordinates the people who will serve the family, turns
every choice into beautiful keepsakes, and stays beside the family long after the last guest goes
home.

> *"Blessed are they that mourn: for they shall be comforted."* — Matthew 5:4

---

## Current features

### 🕊️ The planning companion — `/plan`

A nine-step wizard that never shows a blank page or a hard sell:

1. **Your loved one** — name, dates, Christian tradition, their story in the family's words, a
   portrait photograph (downscaled in the browser).
2. **The service** — traditional burial, cremation with service, memorial, or graveside;
   date/time/venue; visitation, livestream, and committal choices; the service location that
   drives every match below.
3. **Funeral home** — vetted partners, nearest first, chosen with one click.
4. **Pastor or priest** — matched to the loved one's denomination (nine traditions), nearest
   first, with "travels for services" noted.
5. **Casket or urn** — from humble pine to solid bronze, every price shown plainly (the FTC
   Funeral Rule honored throughout).
6. **Flowers** — casket sprays, standing crosses, Gates Ajar, living planters.
7. **Music & scripture** — beloved public-domain hymns and KJV comfort passages, ordered as
   selected; a favorite verse for the program cover.
8. **People & program** — eulogists, pallbearers, special notes, the family's acknowledgment.
9. **Review** — everything gathered, priced, and ready to place in trusted hands.

The plan autosaves to the device on every keystroke (with a flush on tab close), and syncs to the
family's account when signed in — newer copy wins, and the device copy always works offline.

### 📜 Pre-planning — "My Wishes" — `/plan/wishes`

The wizard's second mode, chosen at the first step: *planning ahead* for yourself or a loved one
still living. The language softens everywhere, and every choice gathers into a printable,
**signable Letter of Wishes** — signature, witness, and entrusted-to lines — to keep with
important documents. Placing it with Legacy is safekeeping only: nothing is set in motion, and
nothing is owed, until the family calls.

### 🖨️ Generated printouts

Every keepsake is generated live from the plan and printed with one click:

- **Order-of-service program** (`/plan/program`) — cover with portrait and favorite verse, the
  order of worship built from the family's hymns and readings, the obituary, full reading texts,
  pallbearers, and acknowledgments; print-ready for double-sided folding.
- **Obituary** (`/plan/obituary`) — a composed obituary with age and homegoing date, plus a
  copy-ready plain-text version formatted for newspaper submission.
- **Acknowledgment cards** (`/plan/cards`) — four matching thank-you cards per sheet with cut
  guides.
- **Letter of Wishes** (`/plan/wishes`) — the pre-planning document above.

### 🎞️ Tribute video studio — `/tribute`

Creates a **real video file entirely in the browser** — nothing is uploaded anywhere. Photographs
move with gentle Ken Burns motion and crossfades between reverent title cards; music is a
synthesized instrumental hymn (Amazing Grace, It Is Well, How Great Thou Art, and more) *or the
family's own uploaded song*; the finished WebM downloads ready to play at the visitation or
service. Built on `canvas.captureStream()` + `MediaRecorder` + WebAudio.

### 🌹 Published memorials — `/memorials`

One click on the review step publishes a living page of remembrance: portrait, their story, their
verse, the hymns they loved, and who survives them. Each memorial carries:

- **Service details** with a downloadable **calendar file (.ics)** and a livestream note.
- **RSVP** with party size — so the family knows how many to expect.
- **The Repast Table** — church family promise dishes for the meal after the service, see what is
  already coming, and the family never thinks about food.
- **A server-backed guestbook** of condolences from everyone who loved them.
- **Share links**, and sample memorials that show families what is possible.

The family's dashboard tallies condolences, expected guests, and dishes promised.

### ⛪ Trusted directory — `/directory`

Funeral homes, pastors and priests of nine Christian traditions, florists, casket and monument
providers, repast caterers, and livestream teams — searchable by state, city, and ZIP, with
one-click "add to our plan." (Entries are illustrative sample data for the vetted partner
network; onboarding below is real.)

### 🤝 Coordination, accounts, and operations

- **Real coordination requests** — sending the plan records a request with a reference number
  (e.g. `LGCY-N5EAHX`) and queues messages to the funeral home, the minister, and the family
  through a pluggable notifier (email + SMS; outbox transport in this build, SMTP/Twilio slot in).
- **Family accounts** (`/account`) — optional sign-in with scrypt-hashed passwords and signed
  httpOnly cookies; the dashboard gathers the plan, memorials, coordination requests, and orders.
- **Partner onboarding** (`/partners`) — providers apply to join the vetted network and receive a
  queued confirmation.
- **Coordinator console** (`/admin`) — every request with the full plan, partner applications,
  orders, the message outbox, and published-memorial moderation (unpublish hides a page without
  deleting its records), all with inline status updates.
- **Checkout** (`/pricing` → `/checkout`) — three transparent packages and à la carte services
  behind a pluggable `PaymentProvider` (the included demo provider completes without charging;
  Stripe implements the same interface).

### 🤍 Care beyond the arrangements

- **Bereavement checklist** (`/checklist`) — the first hours through the first months, with
  progress saved locally.
- **Grief resources** (`/resources`) — scriptures of comfort, prayers, pastoral guidance for
  walking with grief and supporting a grieving family, and Christ-centered support groups
  (GriefShare), including gentle signposting to the 988 Lifeline when grief needs more help.

---

## Architecture

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4, custom parchment/ink/gold design tokens, Cormorant Garamond + Inter |
| Data | SQLite via Node's built-in `node:sqlite` — zero native dependencies — in `./data` (gitignored) |
| Auth | scrypt password hashing, HMAC-signed httpOnly session cookies |
| Messaging | `Transport` interface (`lib/server/notify.ts`) — outbox now, SMTP/Twilio later |
| Payments | `PaymentProvider` interface (`lib/server/payments.ts`) — demo now, Stripe later |
| Client state | The family's plan lives in `localStorage` and syncs to the account when signed in |
| Tests | Playwright E2E suite in `e2e/` (five specs), run by GitHub Actions CI on every push/PR |

The interfaces are the architecture: swapping SQLite for Postgres, the outbox for Resend/Twilio,
or the demo provider for Stripe touches only `lib/server/` — no page changes.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # strict TypeScript
npm run e2e        # full Playwright suite (starts the server itself)
```

### Demo accounts & configuration

| Variable | Purpose |
|---|---|
| `LEGACY_SECRET` | Session-signing secret (auto-generated into `data/.session-secret` if unset — set it explicitly in any real deployment) |
| `LEGACY_ADMIN_PASSWORD` | Password for the seeded coordinator (default `walk-beside-families`, account `coordinator@legacy.example`, seeded on first sign-in attempt) |
| `LEGACY_DATA_DIR` | Override the SQLite/data location |
| `COOKIE_SECURE=1` | Set behind HTTPS in production |

## Deploying

### Docker / any VM (recommended — full persistence)

```bash
docker build -t legacy .
docker run -p 3000:3000 -v legacy-data:/app/data \
  -e LEGACY_SECRET=<long-random-string> -e COOKIE_SECURE=1 legacy
```

Works on Fly.io, Railway, Render, or any VPS — anywhere with a persistent disk for `/app/data`.

### Vercel (great for previews)

The app deploys to Vercel out of the box — connect the GitHub repository to a Vercel project and
it builds automatically:

1. In the Vercel project: **Settings → Git → Connect** `showoffjp/Legacy`.
2. Either merge the platform PR into `main`, or set the **Production Branch** to the feature
   branch — Vercel also creates preview deployments for every PR automatically.
3. Add environment variables: `LEGACY_SECRET` (any long random string) and `COOKIE_SECURE=1`.

**Preview caveat:** Vercel's filesystem is ephemeral, so Legacy automatically falls back to
`/tmp` for its database there. Everything on-device works perfectly (the whole planning wizard,
printouts, tribute studio, checklist); server-side records — accounts, published memorials,
coordination requests, orders — work within a session but reset between serverless cold starts.
For a persistent deployment use the Dockerfile above, or point `lib/server/` at a hosted
database (first item on the roadmap).

---

## Roadmap — where Legacy goes next

### Going live (near term)

- **Hosted database** — swap SQLite for Postgres (Neon/Supabase/RDS) behind the existing
  `lib/server/` helpers; migrations and backups.
- **Real payments** — Stripe Checkout + webhooks behind `PaymentProvider`; payment plans;
  life-insurance assignment intake (a standard way families fund services).
- **Real messaging** — SMTP (Resend/Postmark) and Twilio SMS transports behind `Transport`, with
  delivery status tracked in the outbox the console already shows.
- **Real partner network** — verification workflow (licensing, references), partner sign-ins, and
  a partner portal where funeral homes and clergy receive, confirm, and update coordination
  requests themselves.
- **File storage** — portraits, memorial photo galleries, and tribute assets in S3/R2 instead of
  data URLs.
- **Family collaboration** — multiple plans per account, inviting co-planners (siblings sharing
  the load), roles and gentle change history.
- **Memorial management** — editing after publishing, custom slugs, privacy levels
  (public / link-only), and ownership claims.

### Deepening the ministry (mid term)

- **Memorial gifts** — "in lieu of flowers" donations to a ministry or charity, receipted, with
  totals shared gently with the family.
- **Livestream, embedded** — the stream player and its recording living on the memorial page
  afterward.
- **Higher-fidelity tribute films** — optional server-side rendering to MP4/1080p with more
  motion styles, licensed hymn recordings, and voice-over recording.
- **Writing help, gently offered** — optional AI-assisted drafting of the obituary and eulogy
  from interview prompts ("Tell me about her kitchen…"), always in the family's voice and always
  theirs to edit.
- **The grief year** — opt-in scheduled comfort: a verse before the first Christmas, a note on
  the anniversary, prompts for the family to gather; integration with GriefShare group finders.
- **Church partnership portal** — congregations connect their sanctuary calendar, choir and AV
  teams, and repast hall so booking a church service is one coordinated step.
- **Veteran honors** — DD-214 intake, flag and honor-guard scheduling, VA benefit guidance.
- **Monuments** — a headstone designer with engraving preview and cemetery-regulation checks.
- **The estate path** — executor task expansion of the checklist, a document vault, and generated
  account-closure letters for banks and agencies.
- **Español primero** — full Spanish localization (bilingual services are already in the data
  model), then other languages.

### The full vision (long term)

- **Availability & instant booking** — clergy, venues, florists, and funeral homes with live
  calendars; hold a full service plan in one evening.
- **Pre-need funding** — insurance-backed pre-payment with licensed partners, so the Letter of
  Wishes can carry its own provision.
- **Mobile apps** — offline-first planning at the hospice bedside; the coordinator console in a
  coordinator's pocket.
- **An API for funeral homes** — embed Legacy's planning companion into their own websites; the
  platform becomes infrastructure for the industry it serves.
- **Community of comfort** — moderated grief support spaces tied to memorials, anniversaries
  remembered together.
- **Trust & compliance** — SOC 2, accessibility certification (WCAG 2.2 AA), and the data
  practices a family's most tender information deserves.

---

## Notes

- Directory entries (funeral homes, clergy, vendors) are illustrative placeholders for the vetted
  partner network; partner applications submitted through `/partners` are real records.
- No account is required to plan — the plan, checklist, and sample-memorial guestbooks persist in
  `localStorage`, and nothing personal leaves the device until a family chooses to sync, publish,
  or send.
- The Letter of Wishes is a statement of wishes, not a legal will; Legacy offers planning help,
  not legal advice.
- Scripture is quoted from the King James Version (public domain). Hymns included are in the
  public domain.
