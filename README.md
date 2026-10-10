# 🌿 FIELDNOTE

> **“AI that teaches you to notice.”**  
> *A collectible field journal from the future for Hacktoberfest 2026 Week 1 “Touch Grass” Challenge.*

---

## Core Product Philosophy

**“The better you use FIELDNOTE, the less you need to look at your phone.”**

FIELDNOTE is not another outdoor GPS tracker, gamified streak app, or generic conversational AI chatbot. It is a local-AI observation engine designed to minimize screen time and maximize physical sensory presence.

### The Naturalist Ritual Loop
```
PREPARE (Define sensory window & intention)
   ↓
FIELD INVESTIGATION (Local AI generates an observation directive)
   ↓
FIELD MODE (7 seconds of inactivity → interface quietly disappears)
   ↓
PHONE AWAY (Observe physical reality with your senses)
   ↓
RETURN (Record raw notes, optional specimen photo & voice note)
   ↓
NATURALIST REFLECTION (Local AI distills ecological dynamics & inquiry)
   ↓
THE LOGBOOK (Permanently sealed into collectible on-device journal)
```

---

## System Architecture

FIELDNOTE is architected as a local-first monorepo:

- **Frontend (`@fieldnote/client`)**: React 19, TypeScript, Vite, Tailwind CSS, Lucide icons, PWA-enabled with Workbox service worker caching.
- **Backend (`@fieldnote/server`)**: Node.js 24, Express, TypeScript, native `node:sqlite` persistence with Write-Ahead Logging (WAL).
- **Shared (`@fieldnote/shared`)**: Shared domain schemas, naturalist prompt invariants, and type definitions.
- **AI Inference Engine**: Local open-weight models via Ollama (`llama3.2:3b` default). Zero cloud API dependencies, zero tracking, zero cloud telemetry.

---

## Prerequisites

- **Node.js**: `v22.0.0` or higher (`v24.20.0` recommended for native `node:sqlite`).
- **npm**: `v10.0.0` or higher.
- **Ollama**: Installed locally on the host machine.
- **OS**: Windows, macOS, or Linux.

---

## Quickstart Guide

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-repo/fieldnote.git
cd fieldnote

# Install all workspace dependencies
npm install
```

### 2. Set Up & Run Ollama

1. Download and install Ollama from [ollama.ai](https://ollama.com).
2. Start the local Ollama service:
   ```bash
   ollama serve
   ```
3. Pull the default naturalist model (`llama3.2:3b`):
   ```bash
   ollama pull llama3.2:3b
   ```
4. Verify the model is downloaded and ready:
   ```bash
   ollama list
   ```

### 3. Environment Configuration

FIELDNOTE works out of the box with default zero-configuration local settings. To customize, configure environment variables:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `4000` | Server HTTP port |
| `HOST` | `127.0.0.1` | Server host binding |
| `DB_PATH` | `./fieldnote.sqlite` | SQLite database file location |
| `OLLAMA_BASE_URL` | `http://127.0.0.1:11434` | Ollama API endpoint |
| `OLLAMA_MODEL` | `llama3.2:3b` | Target local LLM model name |
| `OLLAMA_TIMEOUT_MS` | `90000` | Model generation timeout (90s for CPU inference) |
| `OLLAMA_TEMPERATURE` | `0.4` | Restrained temperature for grounded naturalist synthesis |

### 4. Start Development Mode

Run both the backend server and frontend development server simultaneously:

```bash
npm run dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend API Server**: `http://127.0.0.1:4000`
- **System Health Check**: `http://127.0.0.1:4000/api/system/health`

---

## Verification & Testing

FIELDNOTE features a zero-external-dependency test suite utilizing Node 24's native `node:test` runner.

### Run All Unit & Integration Tests (Mocked AI Provider)
```bash
npm test
```
*Validates 10 test scenarios: structured generation, malformed JSON recovery, Ollama service outages, timeout handling, missing model detection, insufficient observation rejection, state transitions, and SQLite persistence.*

### Run Live Ollama Integration Test (Active `llama3.2:3b`)
```bash
npm run test:live -w server
```
*Executes real end-to-end inference against the running Ollama instance, validating grounded naturalist directives and probabilistic reflections.*

### Run Typecheck & Production Build
```bash
npm run typecheck
npm run build
```

---

## Compulsory Local Ollama Architecture

FIELDNOTE strictly requires local Ollama for all observation directives and naturalist reflection syntheses:

- **Compulsory Local Inference**: The application enforces real on-device AI. Every investigation and reflection is synthesized directly by your local `llama3.2:3b` model running on `127.0.0.1:11434`.
- **Zero Cloud Transmission**: All prompt inferences execute 100% on your device with complete privacy.
- **Service Verification**: The application verifies Ollama status via `/api/system/health`. If Ollama is offline, FIELDNOTE alerts the user to start `ollama serve` and provides exact terminal commands to restore local AI operation.
- **Provable Provenance**: Every generated note in the logbook is stamped with its local model metadata (`llama3.2:3b`).

---

## Privacy, Storage & Offline Capabilities

### Data Persistence
- **Journal Records**: Field notes, prompts, directives, and AI syntheses are stored locally in `fieldnote.sqlite` via Node 24 native `node:sqlite` in WAL mode and synchronized in browser `localStorage`.
- **Media (Photos & Audio)**: Photos and voice notes are captured locally and encoded into standard base64 data URLs. Media **never** leaves the host device.
- **Zero Cloud Transmission**: 100% of telemetry, user inputs, recordings, and model weights remain strictly on the local machine.

### Offline & PWA Limitations
- **PWA Caching**: The application shell, typography, icons, and styles are cached via service workers (`dist/sw.js`) and work completely offline without an internet connection.
- **Local AI Availability**: AI inference requires the Ollama background process running on the host machine. If Ollama is offline or unavailable, FIELDNOTE displays a calm native recovery banner and provides access to the deterministic offline catalog so your field walk is never interrupted.
- **Hosted Environments**: Because FIELDNOTE relies on local Ollama weights, deployed cloud static hosts (e.g. Vercel, Netlify) cannot perform AI inference unless connected to a self-hosted Ollama server with GPU/CPU provisioning.

---

## Troubleshooting

### 1. "Local Model Offline" / Connection Refused
- **Cause**: Ollama is not running on `127.0.0.1:11434`.
- **Resolution**: Open a terminal and run `ollama serve`. Verify with `curl http://127.0.0.1:11434/api/tags` or visit `http://127.0.0.1:4000/api/system/health`.

### 2. "Model Not Found in Ollama"
- **Cause**: The requested model (`llama3.2:3b`) has not been pulled.
- **Resolution**: Run `ollama pull llama3.2:3b` and restart the session.

### 3. "Inference Window Elapsed" / AI Timeout
- **Cause**: CPU inference on older hardware or cold model loading took longer than the default timeout.
- **Resolution**: The default timeout is configured to 90 seconds (`OLLAMA_TIMEOUT_MS=90000`). If your hardware requires additional headroom, set `OLLAMA_TIMEOUT_MS=120000` in your environment. Subsequent queries run significantly faster once the model is warm in RAM.

---

## License

MIT © 2026 FIELDNOTE Contributors. Built with care for Hacktoberfest 2026.
