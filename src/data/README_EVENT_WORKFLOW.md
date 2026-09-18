# Melbourne Event Radar — Event Maintenance & AI Workflow Guide

## 1. Where the Event Data is Stored
All event records are centrally managed in a single, human-readable JSON file:
```
src/data/events.json
```
And typed/exported with helper functions via:
```
src/data/events.ts
```

---

## 2. How to Ask AI Studio to Update the Data
Whenever you gather messy event listings (from MCEC, Eventbrite, industry associations, or newsletters), simply paste the raw text into your AI Studio conversation and prompt:

> **Copy-Paste Prompt Template for AI Studio:**
> 
> *"Extract all relevant Melbourne professional events from this text, classify them according to our schema, and update `src/data/events.json`. Follow these rules:*
> - *Assign the primary category from: Conference, Expo, Networking, Corporate, Business, Community, Workshop, Seminar, Other.*
> - *Extract confirmed dates (ISO YYYY-MM-DD) and venue.*
> - *Provide a concise 1-2 sentence factual description.*
> - *Keep official URLs and reference the source URL.*
> - *Set `lastVerified` to the current month (e.g., 'October 2026').*
> - *Set `status` to 'Confirmed' (or 'Postponed' / 'TBC' if noted).*
> - *Do not invent unverified details (prices, attendee numbers, or organisers).*
> - *Keep the list sorted chronologically by startDate."*

---

## 3. How to Add a New Event Manually
You can directly add an object to the array in `src/data/events.json`:

```json
{
  "id": "event-slug-name-2026",
  "name": "Official Event Title",
  "startDate": "2026-10-15",
  "endDate": "2026-10-16",
  "dateDisplay": "15–16 October 2026",
  "venue": "Melbourne Convention and Exhibition Centre",
  "suburb": "South Wharf",
  "category": "Conference",
  "organiser": "Official Organiser Name",
  "description": "Factual description of what the event covers.",
  "officialWebsite": "https://example.com/event",
  "sourceUrl": "https://mcec.com.au/whats-on",
  "lastVerified": "October 2026",
  "status": "Confirmed",
  "industry": "Industry Sector",
  "audience": "Target Audience",
  "priceFrom": "Free Expo Pass / $199",
  "featured": false
}
```

---

## 4. How to Change an Existing Event
- Search for the event's `id` or `name` in `src/data/events.json`.
- Edit any field (e.g., update dates, change status from `Confirmed` to `Postponed` or `Cancelled`, or update the description).
- Update the `lastVerified` field (e.g., `"October 2026"`) so visitors see that the record is verified.

---

## 5. How to Deploy as a Static Website
This app has **zero server-side database requirements and zero runtime AI API calls**. It compiles down to pure static HTML/CSS/JavaScript.

To build the static distribution:
```bash
npm run build
```
This generates the optimized static assets inside the `dist/` folder.

### Deployment Options:
- **GitHub Pages:**
  1. Set your `base` in `vite.config.ts` if deploying to a project subpath (e.g., `base: '/melbourne-event-radar/'`).
  2. Deploy the `dist/` directory via `gh-pages` or GitHub Actions.
- **Vercel / Netlify / Cloudflare Pages:**
  - Build command: `npm run build`
  - Output directory: `dist`
- **Cloud Run / Container:**
  - Already configured and runs out-of-the-box in Google AI Studio / Cloud Run containers on port 3000.
