# AI Infrastructure Protein Demo — Template

Parameterizable frontend for the protein-folding inference demo. Edit one config file to brand
for any institution — same shared backend ([ai-infra-demo-proteins](https://github.com/WandLZhang/ai-infra-demo-proteins)),
no redeployment of inference lanes.

Ships with **Cornell** as the default. The setup wizard (gear icon on the home screen) helps
generate a new config for any institution.

## Quick start

```bash
# 1. Clone
git clone https://github.com/WandLZhang/ai-infra-protein-demo-template.git
cd ai-infra-protein-demo-template

# 2. Install
npm install

# 3. Configure
cp .env.example .env
# Fill in VITE_GOOGLE_MAPS_API_KEY and VITE_STATE_SERVER

# 4. (Optional) Edit src/config/institution.config.ts for a new institution
#    Or use the gear icon on the home screen to generate the config.

# 5. Dev server
npm run dev        # http://localhost:3000

# 6. Deploy
npm run build
firebase deploy --only hosting
```

## Configuration

### `src/config/institution.config.ts`

Institution identity, building coordinates, login node, and display bucket. Cornell values
are the defaults — edit for a new institution.

The **setup wizard** (gear icon on the home-screen location card) provides a Google Maps
Places Autocomplete search to look up a building, auto-fills lat/lng and building name,
and generates the config to copy-paste.

### `src/config/theme.config.ts`

Accent color and light/dark mode. Components read from this file; CSS custom properties
derive from it.

### Talk track (slide narration)

The per-slide narration is in `src/App.tsx` in the `sections` prop of `<InfoButton>`.
Edit the HTML strings per phase to customize for an institution. The `talk_track.md` in
the institution's engagement repo (e.g. `cornell-rfi/talk_track.md`) is the authoring
source; mirror changes into `App.tsx` for the live deck.

## Architecture

```
┌─────────────────────────────────────┐
│  This repo (frontend only)          │
│  Vite + React + Google Maps         │
│  Deployed to Firebase Hosting       │
└──────────────┬──────────────────────┘
               │ polls GCS + Cloud Run
┌──────────────▼──────────────────────┐
│  ai-infra-demo-proteins (backend)   │
│  6 inference lanes (ESMFold/AF2/    │
│  Boltz-2 × TPU/GPU) on Slurm       │
│  Cloud Run state server             │
│  GCS shared bucket                  │
└─────────────────────────────────────┘
```

The backend is **shared** — all institution frontends point at the same Cloud Run server
and GCS bucket (`VITE_STATE_SERVER` in `.env`). No backend redeployment needed.

## Files

| File | Purpose |
|---|---|
| `src/config/institution.config.ts` | Institution name, building, lat/lng, login node |
| `src/config/theme.config.ts` | Accent color, light/dark mode |
| `src/App.tsx` | Main app — reads config; talk track in `sections` prop |
| `src/components/InfraMap.tsx` | Google Maps with home marker from config |
| `src/components/SetupWizard.tsx` | Gear-icon config generator with Places Autocomplete |
| `.env.example` | Environment variables (Maps API key, state server URL) |
