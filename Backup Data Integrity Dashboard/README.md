# Backup Data Integrity Dashboard

A single-page dashboard for monitoring the integrity of firewall traffic log backups. Backup data is split into minute-based chunks (1,440 per day), and this dashboard allows security administrators to visualize, select, download, and delete those chunks through an interactive heatmap grid.

## Getting Started

```bash
npm install
npm run dev
```

## Tech Stack

| Technology | Version |
|---|---|
| Nuxt | 4.3.1 |
| Nuxt UI | 4.5.1 |
| Pinia | 3.0.4 |
| TypeScript | 5.7.3 |

---

## Architecture

### Directory Structure

```
├── app/
│   ├── assets/css/            # Tailwind + Nuxt UI entry point
│   ├── components/
│   │   ├── grid/              # ChunkGrid, ChunkRow, ChunkRowStats
│   │   ├── modals/            # DownloadModal, DeleteModal
│   │   └── tooltip/           # ChunkTooltipOverlay
│   ├── composables/           # Shared stateful logic (useChunkTooltip)
│   ├── pages/                 # Route pages
│   ├── stores/                # Pinia stores
│   └── utils/                 # Pure utility functions (colorScale, formatters)
├── server/
│   └── api/                   # Nuxt server routes (mock API)
└── shared/
    └── types/                 # TypeScript interfaces shared between app and server
```

### State Management

A single Pinia store (`stores/chunks.ts`) owns all application state:

- **`data`** — the full API response (24 groups × 60 buckets)
- **`selectedDates`** — array of selected chunk timestamps
- **`selectedSet`** — a `computed` `Set` derived from `selectedDates` for O(1) lookup

Selection operations (`toggleChunk`, `toggleGroup`, `toggleAll`) all mutate `selectedDates`. Components never touch selection state directly — they call store actions.

### Component Structure

```
pages/index.vue                       # Lean orchestrator: layout, modals, events
├── ActionBar.vue                     # Select-all checkbox + Download / Delete buttons
├── grid/ChunkGrid.vue                # Renders 24 hour-sorted ChunkRow components
│   └── grid/ChunkRow.vue            # One hourly row: checkbox + label + 60 cells + stats
│       └── grid/ChunkRowStats.vue   # Per-row totals with icons and compression savings %
├── tooltip/ChunkTooltipOverlay.vue  # Single global floating tooltip (Teleport to body)
├── modals/DownloadModal.vue         # Download flow: fetch URLs → file list → download all
├── modals/DeleteModal.vue           # Delete flow: warning → summary → confirm → result
└── DashboardFooter.vue              # Totals row + color scale legend
```

`nuxt.config.ts` sets `pathPrefix: false` so all components are auto-imported without their subdirectory prefix (e.g., `<ChunkGrid />` not `<GridChunkGrid />`).

**Key design decision — single tooltip overlay:** Instead of wrapping all 1,440 cells in a `UTooltip` component (1,440 instances), a single `ChunkTooltipOverlay` is teleported to `<body>` and repositioned on `mousemove`. This keeps the component tree flat and avoids tooltip library constraints on popup sizing.

### Composables

`composables/useChunkTooltip.ts` manages the tooltip's shared state using Nuxt's `useState()` instead of a module-level `reactive()`. This ensures state is scoped to the Nuxt instance and is safe across SSR contexts — module-level reactive objects are shared across all requests on the server.

### API Layer

Three Nuxt server routes under `server/api/` serve mock data:

| Method | Route | Behaviour |
|---|---|---|
| `GET` | `/api/chunks` | Reads `mock-data/signedfiles.json` from disk |
| `POST` | `/api/chunks/download-urls` | Generates signed URL entries from the request body |
| `DELETE` | `/api/chunks` | Returns a mock success result — does not mutate data |

Server routes resolve the `mock-data/` directory via `fileURLToPath(new URL('../../../mock-data', import.meta.url))` rather than `process.cwd()`, which is unreliable depending on where the Nuxt server process is started from.

Server routes are kept thin — no business logic, just data shaping. TypeScript interfaces in `shared/types/` are imported by both the server routes and the client components.

### Color Mapping

An 8-level green palette (`utils/colorScale.ts`) maps each bucket's `dataCount` to a color using linear scaling between the day's `minDataCount` and `maxDataCount`. The same palette is used in the footer legend and the tooltip density bar.

### Performance

- **`v-memo`** on each grid cell — Vue skips virtual DOM diffing for cells whose selection state and color mode haven't changed. A single cell click causes exactly 2 cell re-renders instead of 1,440.
- **`selectedSet` computed** — O(1) selection lookup via `Set`, avoiding O(n) array scans on every render.
- **Event delegation opportunity** — Mouse events are currently per-cell (4,320 listeners). If live data polling is added, migrating to a single delegated listener on the row container would reduce listener overhead.
- **Backend aggregation** — Raw log records never reach the frontend. The API returns pre-aggregated bucket summaries, so millions of log records have no impact on UI performance.
