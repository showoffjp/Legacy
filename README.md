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
- **Grief resources** (`/resources`) — scriptures of comfort, prayers, pastoral guidance, and
  Christ-centered support groups.
- **Honest pricing** (`/pricing`) — three transparent packages plus à la carte services, honoring
  the FTC Funeral Rule.

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS v4.

## Notes

- Directory entries (funeral homes, clergy, vendors) are illustrative sample data for the vetted
  partner network; production would back these with a real database and partner onboarding.
- The family's plan, checklist progress, and guestbook entries persist in `localStorage` — no
  account needed for a first visit, and no personal data leaves the device in this build.
