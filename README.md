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
   portrait photograph (downscaled in the browser), and **veteran honors** — branch of service
   noted so flag presentation, Taps, and an honor guard can be arranged at no cost to the family.
2. **The service** — traditional burial, cremation with service, memorial, or graveside;
   date/time/venue; visitation, livestream (with an optional watch link), and committal choices;
   the service location that drives every match below.
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

- **Order-of-service program** (`/plan/program`) — cover with portrait, favorite verse, and a
  veteran honor line; the order of worship built from the family's hymns and readings (military
  honors included for those who served), the obituary, full reading texts, pallbearers, and
  acknowledgments; print-ready for double-sided folding.
- **Obituary** (`/plan/obituary`) — a composed obituary with age and homegoing date, plus a
  copy-ready plain-text version formatted for newspaper submission.
- **Acknowledgment cards** (`/plan/cards`) — four matching thank-you cards per sheet with cut
  guides.
- **Letter of Wishes** (`/plan/wishes`) — the pre-planning document above.
- **The eulogy, gently drafted** (`/plan/eulogy`) — a blank page is cruel in the week of a loss,
  so the studio asks small, human questions ("Tell one story that captures them", "What did they
  teach you without ever calling it a lesson?") and weaves the answers into a first draft — in
  the family's own words, with their chosen pronouns and a verse to hold the room, always theirs
  to edit. A speaking-time estimate (~130 words a minute) and a **large-type pulpit copy** help
  whoever stands up to speak. Everything stays on the device; nothing is uploaded or
  machine-generated — the words are the family's own, arranged.

### 🎞️ Tribute video studio — `/tribute`

Creates a **real video file entirely in the browser** — nothing is uploaded anywhere. Photographs
move with gentle Ken Burns motion and crossfades between reverent title cards; music is a
synthesized instrumental hymn (Amazing Grace, It Is Well, How Great Thou Art, and more) *or the
family's own uploaded song*; the finished WebM downloads ready to play at the visitation or
service. Built on `canvas.captureStream()` + `MediaRecorder` + WebAudio.

### 🌹 Published memorials — `/memorials`

One click on the review step publishes a living page of remembrance: portrait, their story, their
verse, the hymns they loved, and who survives them. Each memorial carries:

- **Service details** with a downloadable **calendar file (.ics)** and a **"Join the service
  online"** button when the family adds a livestream link; veterans carry an honor line beneath
  their name.
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
  deleting its records), all with inline status updates — plus **partner portal invitations**:
  open a portal account for any directory funeral home or minister (temporary password delivered
  via the outbox).
- **Partner portal** (`/portal`) — invited funeral homes and clergy sign in to receive the
  coordination requests addressed to them: the family's contact, the loved one, the full plan,
  and inline status updates that appear on the family's dashboard the moment they are made.
- **Memorial management** (`/account/memorials/<slug>`) — owners edit their published memorial's
  story, nickname, community, and service details; choose **public or link-only** privacy
  (link-only pages stay reachable but unlisted); or unpublish — every record kept.
- **Checkout** (`/pricing` → `/checkout`) — three transparent packages and à la carte services
  behind a pluggable `PaymentProvider` (the included demo provider completes without charging;
  Stripe implements the same interface).
- **Insurance-assignment funding** — the way most at-need services are actually paid for: at
  checkout the family can assign a life-insurance policy instead of paying today. The order is
  held with **nothing due from the family**, the coordinator verifies the policy in the console
  (assignment-pending → assignment-verified → funded), the demo/Stripe payment path is sealed
  off for these orders, and the benefit's balance beyond the package stays with the family.

### 🤍 Care beyond the arrangements

- **Bereavement checklist** (`/checklist`) — the first hours through the first months, with
  progress saved locally.
- **Grief resources** (`/resources`) — scriptures of comfort, prayers, pastoral guidance for
  walking with grief and supporting a grieving family, and Christ-centered support groups
  (GriefShare), including gentle signposting to the 988 Lifeline when grief needs more help.

### 🕯️ Aftercare & the estate path — `/aftercare`

The year after the service, carried together:

- **The Estate Path** — every administrative matter a death asks of a family, grouped by season
  (the first days → the first year): death certificates, Social Security, life insurance,
  probate, credit bureaus, the DMV, digital accounts, final taxes, closing the estate — with
  progress saved on the device, and honest "this is guidance, not legal advice" signposting to
  the vetted probate partners.
- **Notification letters, written for you** — the same sad letter every bank, insurer, credit
  bureau, and subscription needs, composed **entirely on the family's device** (nothing typed is
  sent to or stored by Legacy): sender, relationship, institutions (one-click add for the three
  credit bureaus), account references — printed one letter per page with enclosure lines.
- **The Grief Year** — opt-in notes of comfort timed to the hardest milestones: one month, three
  months, six months, **the first Christmas**, and the first anniversary. Each carries a verse
  and a word written for that day, an unsubscribe link in every note, dashboard management
  ("End the notes"), and delivery through the same messaging rails as everything else — a daily
  Vercel cron (`vercel.json`) calls `/api/remembrances/dispatch`, protectable with `CRON_SECRET`.

---

## Architecture

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4, custom parchment/ink/gold design tokens, Cormorant Garamond + Inter |
| Data | One async data layer, two drivers: embedded SQLite (Node's built-in `node:sqlite`, zero native deps, `./data`) by default; **hosted Postgres** (Neon/Supabase/RDS) the moment `DATABASE_URL` is set — same SQL, `?`→`$n` translated, TLS verified |
| Auth | scrypt password hashing, HMAC-signed httpOnly session cookies |
| Messaging | `Transport` interface (`lib/server/notify.ts`) — outbox now, SMTP/Twilio later |
| Payments | `PaymentProvider` interface (`lib/server/payments.ts`) — demo now, Stripe later |
| Client state | The family's plan lives in `localStorage` and syncs to the account when signed in |
| Tests | Playwright E2E suite in `e2e/` (nine specs), run by GitHub Actions CI on every push/PR |

The interfaces are the architecture: the SQLite↔Postgres swap, the outbox↔Resend/Twilio swap,
and the demo↔Stripe swap all live behind `lib/server/` — no page changes, each activated by an
environment variable. The full E2E suite passes identically on both database drivers.

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
| `CRON_SECRET` | Optional shared secret for `/api/remembrances/dispatch` — Vercel sends it automatically as a Bearer token when set; without it the endpoint is open (it only sends what is already due) |

### Going live — flip the switches

The live integrations are already implemented behind the demo defaults; each activates the
moment its keys exist, and reverts to demo/outbox behavior without them:

| Variable(s) | What turns on |
|---|---|
| `DATABASE_URL` | Every server-side record — accounts, plans, coordination requests, memorials and their guestbooks/RSVPs/meals/gifts, orders, remembrances, message threads — moves to hosted Postgres and becomes **permanent across serverless cold starts**. Any Postgres 14+ works (Neon and Supabase have free tiers); use the connection string with `sslmode=require` and the schema creates itself on first touch. Unset, the embedded SQLite carries on exactly as before. |
| `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` | Checkout moves to Stripe's hosted payment page; the webhook at `/api/stripe/webhook` (subscribe it to `checkout.session.completed`) marks orders paid, with a session check on the receipt page so families never wait on webhook latency. The in-app demo confirmation stops being able to complete orders. |
| `RESEND_API_KEY` (+ optional `EMAIL_FROM`) | Outbox emails to families and partners are actually delivered via Resend; the console outbox shows sent/failed status. Placeholder `.example.com` addresses stay queued. |
| `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` + `TWILIO_FROM` | Outbox SMS (family confirmations) delivered via Twilio. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for share links, sitemaps, and Stripe redirect URLs. |

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

**Making Vercel permanent:** without a database URL, Vercel's ephemeral filesystem means
server-side records (accounts, published memorials, coordination requests, orders) work within
a session but reset between cold starts — everything on-device is unaffected. To make it all
permanent, create a free Postgres database (e.g. [Neon](https://neon.tech) or
[Supabase](https://supabase.com)) and add its connection string as `DATABASE_URL` in
**Settings → Environment Variables**. That's the whole migration — the schema creates itself
on first touch.

---

## Roadmap — where Legacy goes next

### Going live (near term)

- **Hosted database, deepened** — Postgres behind `DATABASE_URL` ships today (schema
  self-creates, full E2E suite passes on both drivers); next: managed migrations and automated
  backups.
- **Real payments, deepened** — Stripe Checkout + webhooks and life-insurance assignment intake
  ship today; next: payment plans and assignment e-signature with insurer API verification.
- **Real messaging** — SMTP (Resend/Postmark) and Twilio SMS transports behind `Transport`, with
  delivery status tracked in the outbox the console already shows.
- **Real partner network** — the portal exists (`/portal`); next: verification workflow
  (licensing, references), partner-initiated onboarding to portal accounts, and in-portal
  messaging with families and coordinators.
- **File storage** — portraits, memorial photo galleries, and tribute assets in S3/R2 instead of
  data URLs.
- **Family collaboration** — multiple plans per account, inviting co-planners (siblings sharing
  the load), roles and gentle change history.
- **Memorial management** — editing after publishing, custom slugs, privacy levels
  (public / link-only), and ownership claims.

### Deepening the ministry (mid term)

- **Memorial gifts** — "in lieu of flowers" donations to a ministry or charity, receipted, with
  totals shared gently with the family.
- **Livestream, embedded** — the "Join the service online" link is live today; next, the stream
  player and its recording living on the memorial page afterward.
- **Higher-fidelity tribute films** — optional server-side rendering to MP4/1080p with more
  motion styles, licensed hymn recordings, and voice-over recording.
- **Writing help, deepened** — the interview-woven eulogy studio ships today (`/plan/eulogy`);
  next: optional AI assistance for the obituary and eulogy, always in the family's voice and
  always theirs to edit.
- **The grief year, deepened** — the milestone notes ship today (`/aftercare`); next: prompts
  for the family to gather, and integration with GriefShare group finders.
- **Church partnership portal** — congregations connect their sanctuary calendar, choir and AV
  teams, and repast hall so booking a church service is one coordinated step.
- **Veteran honors, completed** — branch intake, program honors, and partner notification ship
  today; next: DD-214 document intake, flag and honor-guard scheduling, VA claim filing help.
- **Monuments** — a headstone designer with engraving preview and cemetery-regulation checks.
- **The estate vault** — the executor checklist and generated account-closure letters ship today
  (`/aftercare`); next: a secure document vault for the will, deeds, and certificates.
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
