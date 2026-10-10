# FIELDNOTE — Technical Foundation & Design System Specification
> *“AI that teaches you to notice.”*  
> Hacktoberfest 2026 Week 1 “Touch Grass” Challenge

---

## 1. Project Folder Structure

The repository is organized as an offline-first TypeScript monorepo with strict package boundaries:

```
FIELDNOTE 🌿/
├── package.json                 # Monorepo root workspace definition
├── .gitignore                   # Ignores build artifacts, logs, sqlite binaries
├── docs/
│   └── FIELDNOTE_SPECIFICATION.md
├── shared/                      # Shared Domain Contracts & Types
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       └── types/
│           ├── domain.ts        # Investigation, Observation, Reflection, Session
│           └── ai.ts            # Ollama provider contracts & generation schemas
├── server/                      # Node.js + Express + Local AI + SQLite
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── config/
│       │   └── index.ts         # Environment and Ollama configuration
│       ├── db/
│       │   ├── schema.sql       # Declarative SQLite schema
│       │   └── database.ts      # Native Node 24 node:sqlite database manager
│       ├── services/
│       │   └── ai/
│       │       ├── prompts.ts   # Naturalist observation system prompts
│       │       ├── ollama-provider.ts # Local Ollama REST client
│       │       ├── ai-service.ts# Swappable AI model facade
│       │       └── index.ts
│       ├── app.ts               # Express application pipeline
│       └── server.ts            # Server entrypoint
└── client/                      # React + TypeScript + Vite + Tailwind PWA
    ├── package.json
    ├── vite.config.ts           # Vite + PWA + API proxy
    ├── tailwind.config.js       # Design tokens & tactile theme extension
    ├── postcss.config.js
    ├── tsconfig.json
    ├── index.html               # Typography loading & PWA meta
    ├── public/
    │   └── icons/
    │       ├── icon-192.svg     # Tactile journal mark
    │       └── icon-512.svg
    └── src/
        ├── index.css            # Stylesheet with CSS variables and layer rules
        ├── main.tsx             # DOM mount
        ├── App.tsx              # View router and session orchestration
        ├── context/
        │   └── field-session-context.tsx # Screen-away tracking & offline store
        ├── styles/
        │   ├── tokens.css       # Semantic tokens & dark field-mode overrides
        │   ├── typography.css   # Editorial serif & modern sans scales
        │   └── motion.css       # Progressive vanish & organic motion easing
        ├── types/
        │   └── index.ts
        └── components/
            ├── common/
            │   ├── EditorialBadge.tsx
            │   └── TactileButton.tsx
            ├── layout/
            │   ├── Header.tsx
            │   └── JournalLayout.tsx
            ├── investigation/
            │   └── InvestigationCard.tsx # Pre-field rich editorial view
            └── field-mode/
                └── FieldModeView.tsx     # Minimal, disappearing screen
```

---

## 2. Design Tokens

The visual language models a **“premium field journal from the future.”** It rejects generic SaaS dashboard aesthetics in favor of unbleached paper textures, grounded mineral pigments, and deep forest hues.

### Primitive Pigment Palette
- **Deep Forest** (`#12372A` / `#0B221A`): Primary grounding color, bound spine, heavy ink headings.
- **Moss** (`#4F6F52` / `#698E6C`): Natural secondary accent, botanical badges, progress accents.
- **Warm Paper** (`#F7F4EC` / `#FDFBF7` / `#EFEADB`): Primary background surface, warm and tactile, avoiding clinical white.
- **Stone** (`#E7E0D3` / `#CEC5B5`): Architectural boundaries, quiet dividers, subtle debossed frames.
- **Terracotta** (`#C96B4B` / `#DE8466`): Restrained accent used sparingly for active focal points, sequence indicators, and bookmarks.
- **Charcoal Ink** (`#17201B` / `#4B5850` / `#859189`): Deep carbon ink for high-legibility editorial prose.

### Field Mode Tokens (Minimal In-Field Palette)
When stepping outside into the physical world, the interface shifts to an ultra-low-luminance palette designed to preserve dark adaptation and encourage turning the screen off:
- `--field-bg`: `#0C1611` (Deep nocturnal forest, non-glare)
- `--field-surface`: `#122019`
- `--field-text-primary`: `#C5D3C7` (Soft foliage light)
- `--field-text-muted`: `#687D70`
- `--field-accent`: `#E28766` (Quiet amber warmth)
- `--field-border`: `rgba(197, 211, 199, 0.12)`

---

## 3. Typography System

The typography creates an intentional dichotomy between timeless naturalist literature and modern precision.

1. **Editorial Display Serif** (`Newsreader`, `Fraunces`, `Georgia`):
   - Used for investigation titles, naturalist prompts, and AI reflection commentaries.
   - High legibility, distinct optical sizes, classical italic styling for direct quotes.
   - Scale: Hero (`clamp(2.25rem, 5vw, 3.5rem)`), Heading (`clamp(1.5rem, 3.5vw, 2.25rem)`), Lead (`1.25rem`).

2. **Clean Modern Sans-Serif** (`Plus Jakarta Sans`, `Inter`, `system-ui`):
   - Used for UI affordances, grounding rules, buttons, and user input notes.
   - Crisp, neutral, non-distracting letterforms.

3. **Restrained Technical Monospace** (`JetBrains Mono`, `Space Mono`):
   - Used **strictly** for metadata: sequence numbers (`INV 01`), elapsed silent-observation counters (`00:30`), sensory tags, and timestamp coordinates.

---

## 4. Component Architecture

The component hierarchy is modular, semantic, and decoupled from heavy third-party UI libraries:

- **Layout Hierarchy**:
  - `JournalLayout`: Simulates a bound notebook surface that handles transitions between standard paper mode and low-luminance field mode.
  - `Header`: Clean, editorial header that conditionally unmounts when field mode is active to prevent distraction, and provides persistent navigation between Home, Investigate, and Journal.

- **Investigation Components**:
  - `HomeView`: Editorial hero landing experience with concentric botanical observation crest, core loop overview, and offline/local badges.
  - `InvestigationSetup`: Tactile journal configuration for Time (10, 20, 30 min) and Intention (NOTICE, EXPLORE, UNDERSTAND, CREATE, SURPRISE ME).
  - `InvestigationReveal`: Cinematic journal-card reveal displaying the generated prompt, grounding constraint, inquiry focus, and sensory tags.
  - `EditorialBadge`: Reusable tag for sensory faculties (`visual`, `tactile`, `temporal`, etc.).
  - `TactileButton`: Physical-feeling buttons with deliberate depression states (`active:translate-y-px`) and contrast rings.

- **Field Mode Components**:
  - `FieldModeView`: The centerpiece of the phone-away philosophy. Displays `LOOK. NOTICE. REMEMBER.`, breath pulse pacing, 7-second progressive disappearance / screen dimming, and Screen-Away presence tracking.

- **Observation & Journal Components**:
  - `ReturnView`: Post-field recollection interface for recording raw physical impressions, sensory nuances, deferred photo captures (unlocked post-observation), and optional voice memos.
  - `ReflectionView`: Pure field journal analysis featuring `YOU NOTICED`, `WHAT IT MIGHT MEAN`, `A QUESTION TO CARRY`, curiosity tags, and next investigation seeds.
  - `JournalArchive`: Physical field notebook archive in vertical journal flow displaying previous entries, dates, observation recollections, and naturalist commentary.

---

## 5. Routing Architecture

Rather than relying on URL navigation that encourages multi-tab distraction, FIELDNOTE uses a **Phase-Driven State Router** reflecting the naturalist core loop:

```
PREPARE ──(Go Outside)──► OBSERVE ──(Return)──► RETURN ──(Reflect)──► REFLECT ──(Done)──► DISCOVER/ARCHIVE
```

1. **`prepare`**: Review the upcoming investigation directive.
2. **`field` (`observe`)**: Fullscreen, progressive disappearance mode.
3. **`return`**: Logging unhurried observations immediately upon returning.
4. **`reflect`**: Local AI processes the observation and yields editorial insights.
5. **`archive`**: Historical journal reviewing past discoveries and growth in perceptual acuity.

---

## 6. Data Model Proposal

Defined in `@fieldnote/shared` to enforce full type safety across backend and client:

- **`Investigation`**:
  - `id`: string
  - `sequenceNumber`: number
  - `title`: string
  - `prompt`: string (Direct imperative: *"Find something that has changed because of the weather."*)
  - `groundingConstraint`: string (*"Don't photograph it yet. Observe it for 30 seconds."*)
  - `inquiryQuestion`: string (*"What evidence do you see?"*)
  - `sensoryFocus`: `SensoryFocus[]` (`['visual', 'tactile', 'auditory', 'temporal', 'spatial']`)
  - `targetDurationSeconds`: number (e.g., 30, 60, 90)
  - `fieldModeNotice`: string (*"LOOK. NOTICE. REMEMBER."*)
  - `status`: `'pending' | 'in_field' | 'observed' | 'reflected' | 'completed' | 'archived'`

- **`Observation`**:
  - `id`: string
  - `investigationId`: string
  - `recordedAt`: ISO 8601 string
  - `actualDurationSeconds`: number
  - `rawNotes`: string (User's memory description)
  - `sensoryDetails`: `{ visual?: string; auditory?: string; tactile?: string; temporal?: string }`
  - `putAwayComplied`: boolean (Tracked via Page Visibility API)

- **`Reflection`**:
  - `id`: string
  - `observationId`: string
  - `investigationId`: string
  - `syntheticInsight`: string (Naturalist editorial synthesis, NOT chatbot chit-chat)
  - `deepeningQuestion`: string (Perceptual challenge for future noticing)
  - `curiosityTags`: string[] (Micro-phenomena e.g., `["weathering", "lichen", "oxidation"]`)
  - `modelMetadata`: `{ modelName, inferenceDurationMs, provider }`

- **`Discovery`**:
  - `id`: string
  - `investigationId`: string
  - `reflectionId`: string
  - `title`: string
  - `fieldCategory`: string (e.g. *"Weather Artifacts"*, *"Micro-Ecologies"*)

---

## 7. AI Service Architecture

The AI layer is architected around **disciplined local inference**:

### Philosophy & Anti-Chatbot Guardrails
- **No Chatbot Persona**: Does not answer general questions, generate itineraries, or converse.
- **No GPS/Trail Dictation**: Does not tell the user *where* to walk. Investigations are location-agnostic micro-investigations applicable to any backyard, curb, park, or courtyard.
- **Phone-Away Directive Enforcement**: Every investigation prompt automatically injects an explicit physical grounding constraint (observe without photographing first).

### Architecture & Swappability
- **Provider Interface (`IAIModelService`)**: Defines `checkHealth()`, `generateInvestigation()`, and `generateReflection()`.
- **Default Engine (`OllamaModelProvider`)**: Connects to local Ollama instance (`http://127.0.0.1:11434`) using open-weight models (e.g., `llama3.2:3b`, `mistral:7b`, `phi3:mini`). Structured JSON outputs are requested via Ollama's native JSON mode.
- **Provider Hot-Swapping**: The `AIService` facade allows swapping to another local provider, fine-tuned model, or fallback heuristics with zero changes to business logic.

---

## 8. SQLite Schema Proposal

Persistent storage uses Node 24’s native `node:sqlite` (`DatabaseSync`), configured with `WAL` mode and foreign key constraints:

```sql
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS investigations (
  id TEXT PRIMARY KEY,
  sequence_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  grounding_constraint TEXT NOT NULL,
  inquiry_question TEXT NOT NULL,
  sensory_focus TEXT NOT NULL,
  target_duration_seconds INTEGER NOT NULL DEFAULT 30,
  field_mode_notice TEXT NOT NULL DEFAULT 'LOOK. NOTICE. REMEMBER. Put your phone away.',
  status TEXT NOT NULL DEFAULT 'pending',
  environment_context TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS observations (
  id TEXT PRIMARY KEY,
  investigation_id TEXT NOT NULL,
  recorded_at TEXT NOT NULL DEFAULT (datetime('now')),
  actual_duration_seconds INTEGER NOT NULL DEFAULT 0,
  raw_notes TEXT NOT NULL,
  sensory_details TEXT,
  photo_uri TEXT,
  put_away_complied INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reflections (
  id TEXT PRIMARY KEY,
  observation_id TEXT NOT NULL,
  investigation_id TEXT NOT NULL,
  synthetic_insight TEXT NOT NULL,
  deepening_question TEXT NOT NULL,
  curiosity_tags TEXT NOT NULL,
  model_name TEXT NOT NULL,
  inference_duration_ms INTEGER NOT NULL DEFAULT 0,
  provider TEXT NOT NULL DEFAULT 'ollama',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (observation_id) REFERENCES observations(id) ON DELETE CASCADE,
  FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS discoveries (
  id TEXT PRIMARY KEY,
  investigation_id TEXT NOT NULL,
  reflection_id TEXT NOT NULL,
  title TEXT NOT NULL,
  field_category TEXT NOT NULL,
  significance_score INTEGER NOT NULL DEFAULT 1,
  unlocked_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE,
  FOREIGN KEY (reflection_id) REFERENCES reflections(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS field_sessions (
  id TEXT PRIMARY KEY,
  active_investigation_id TEXT,
  current_phase TEXT NOT NULL DEFAULT 'prepare',
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  field_entered_at TEXT,
  returned_at TEXT,
  phone_away_seconds INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (active_investigation_id) REFERENCES investigations(id) ON DELETE SET NULL
);
```

---

## 9. State-Management Approach

- **Core Context (`FieldSessionProvider`)**:
  - Implements a deterministic finite state machine handling transitions through `prepare`, `observe`, `return`, and `reflect`.
  - Integrates the browser's **Page Visibility API** (`document.visibilityState`) to measure how long the user put their phone in their pocket or turned the screen off while outside.
  - Automatically mirrors session state to `localStorage` for offline survivability so session continuity is maintained even if the browser process is backgrounded or restarted.

---

## 10. PWA Architecture

- **Manifest**: Standalone display mode with `portrait` lock, themed in deep forest (`#12372A`) and warm paper (`#F7F4EC`).
- **Service Worker (`vite-plugin-pwa` with Workbox)**:
  - Cache-first strategy for static shell assets, fonts, and icons.
  - Network-first strategy with offline fallbacks for local API endpoints.
  - Enables zero-latency launching even with no cellular or Wi-Fi connection in the wild.

---

## 11. Accessibility Strategy

- **Semantic HTML**: Proper `<article>`, `<header>`, `<main>`, `<blockquote aria-label="...">`, and `<nav>`.
- **Keyboard Navigation**: Distinct, tactile `focus-visible` ring styled in `--focus-ring` (`#12372A` in paper mode, `#E28766` in field mode).
- **Contrast Ratios**:
  - Body text on warm paper: `14.2:1` (exceeds WCAG AAA).
  - Field mode text on nocturnal forest: `11.5:1` (exceeds WCAG AAA).
- **Reduced Motion Support**:
  - Strict `@media (prefers-reduced-motion: reduce)` rules disable all unfolding transitions and pulsing breath animations.

---

## 12. Motion Strategy

Motion exists solely to reinforce the product philosophy:

1. **Investigation Unfold (`animate-investigation-unfold`)**: A gentle, organic expansion simulating unfolding an envelope or opening a field notebook.
2. **Progressive Field Vanish (`animate-field-vanish`)**:
   - The screen gently dims and blurs off extraneous UI after 7 seconds of inactivity in the field, guiding the user's gaze away from the glass.
   - Touching the screen restores low-luminance controls without jarring flash.
3. **Silent Breath Pulse (`animate-observation-breath`)**: A slow, 6-second rhythmic expansion for the observation timer, pacing breathing and encouraging quiet presence.
4. **Explicit Anti-Patterns**: No bouncing menus, no decorative particle effects, no gratuitous glassmorphism, and no endless scrolling animations.
