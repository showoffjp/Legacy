# Legacy

**A Christian companion for life's final farewell.**

Legacy walks with families through everything a funeral asks — like wedding planning, but for a
homegoing: reverent, unhurried, and complete. It captures the essence of a loved one, coordinates
trusted local providers, and turns every choice into beautiful keepsakes.

## What it does

- **Planning companion** (`/plan`) — a nine-step wizard covering the loved one's story, the kind
  of service, funeral home coordination by location, clergy booking by denomination, casket & urn
  selection with honest prices, floral arrangements, hymns & scripture readings, eulogists and
  pallbearers. The plan autosaves to the browser as the family goes.
- **Printable order-of-service program** (`/plan/program`) — a letter-format program generated
  live from the plan: cover with portrait and favorite verse, order of worship, obituary, full
  KJV reading texts, pallbearers, and acknowledgments. One click prints the handout.
- **Tribute video studio** (`/tribute`) — creates a real video file entirely in the browser:
  photographs with gentle Ken Burns motion and crossfades, opening and closing title cards, a
  synthesized instrumental hymn *or* an uploaded favorite song, exported to WebM via
  `canvas.captureStream()` + `MediaRecorder`. Nothing is uploaded anywhere.
- **Trusted directory** (`/directory`) — funeral homes, pastors & priests of nine Christian
  traditions, florists, and providers (caskets, monuments, repast catering, livestreaming),
  searchable by state/city/ZIP, with one-click "add to our plan".
- **Memorial pages** (`/memorials`) — lasting pages that capture a person's essence: their story,
  the little things everyone remembers, the hymns they loved, and a condolence guestbook.
- **Bereavement checklist** (`/checklist`) — everything that must be done from the first hours to
  the first months, with progress saved locally.
- **Pre-planning, "My Wishes"** (`/plan/wishes`) — choose "Planning ahead" in the wizard to record
  wishes for yourself or a loved one still living; every choice gathers into a printable,
  signable Letter of Wishes kept with your important documents.
- **More printouts** — a generated obituary with copy-ready newspaper text (`/plan/obituary`) and
  matching acknowledgment cards, four to a sheet (`/plan/cards`).
- **The Repast Table** — on published memorials, church family promises dishes for the meal after
  the service; the family's dashboard tallies dishes and servings alongside RSVPs.
- **Grief resources** (`/resources`) — scriptures of comfort, prayers, pastoral guidance, and
  Christ-centered support groups.
- **Honest pricing & checkout** (`/pricing`, `/checkout`) — three transparent packages plus à la
  carte services, honoring the FTC Funeral Rule, with an order flow built behind a pluggable
  payment-provider interface (demo provider included; Stripe slots in via the same interface).
- **Family accounts** (`/account`) — optional sign-in that keeps the plan safely synced to the
  server (newer copy wins, device copy always works offline) and shows coordination requests and
  orders on a family dashboard.
- **Real coordination** — sending a plan from the review step records a coordination request and
  queues messages to the funeral home, the minister, and the family (email + SMS outbox).
- **Partner onboarding** (`/partners`) — funeral homes, clergy, florists, and providers apply to
  join the vetted network.
- **Coordinator console** (`/admin`) — coordinators see every request (with the full plan),
  partner applications, orders, and the message outbox, and update statuses inline.

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run e2e      # full Playwright end-to-end suite (starts the server itself)
```

## Deploying

The app needs a Node server with a writable disk for SQLite (`./data`) — any VM, VPS, Fly.io,
Railway, or Render service works. A production `Dockerfile` is included:

```bash
docker build -t legacy .
docker run -p 3000:3000 -v legacy-data:/app/data \
  -e LEGACY_SECRET=<long-random-string> -e COOKIE_SECURE=1 legacy
```

(Serverless platforms without persistent disk need the data layer in `lib/server/` pointed at a
hosted database first — the helpers are the only thing to swap.)

Built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS v4. Server data lives
in SQLite via Node's built-in `node:sqlite` (no native dependencies) in the gitignored `./data`
directory; sessions are scrypt-hashed passwords with HMAC-signed cookies.

## Demo accounts & configuration

- The coordinator console (`/admin`) seeds a demo account on first sign-in attempt:
  `coordinator@legacy.example` / `walk-beside-families` (override with `LEGACY_ADMIN_PASSWORD`).
- `LEGACY_SECRET` — session-signing secret (auto-generated into `data/.session-secret` if unset).
- `COOKIE_SECURE=1` — set behind HTTPS in production.

## Notes

- Directory entries (funeral homes, clergy, vendors) are illustrative sample data for the vetted
  partner network; partner onboarding (`/partners`) records real applications for review.
- No account is required to plan: the family's plan, checklist progress, and guestbook entries
  persist in `localStorage`. Signing in adds a server copy and coordination history.
- Outgoing email/SMS is recorded to the message outbox (visible in `/admin`) in this build; a
  production SMTP/Twilio transport plugs into the same `Transport` interface in
  `lib/server/notify.ts`. Payments follow the same pattern in `lib/server/payments.ts`.
