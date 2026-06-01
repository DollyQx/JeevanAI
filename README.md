# 🚑 Jivan AI — Real-Time Emergency Medical Dashboard
> **Jivan** (जीवन) means *life* in Hindi/Sanskrit.  
> A voice-powered, AI-assisted dashboard for paramedics and first responders — designed to run fully **offline** on local hardware.
---
## ✨ Features
|
 Feature 
|
 Description 
|
|
---
|
---
|
|
 🎙️ 
**
Live Voice Transcription
**
|
 Web Speech API captures paramedic speech in real time, with a scrollable timestamped transcript 
|
|
 🧠 
**
AI Vitals Extraction
**
|
 Spoken vitals (pulse, BP, SpO₂) are parsed by a local 
**
Gemma 2B
**
 model via Ollama — no cloud required 
|
|
 📊 
**
Live Vitals Cards
**
|
 Real-time pulse, blood pressure, and SpO₂ cards with trend arrows (↑ ↓ →) and alert animations 
|
|
 📋 
**
Protocol Checklists
**
|
 Full 
**
Trauma
**
 and 
**
Cardiac
**
 protocol checklists; auto-switches when cardiac keywords are detected by voice 
|
|
 🔥 
**
NEXT STEP Banner
**
|
 Highlights the next incomplete critical step at the top of the checklist 
|
|
 🔌 
**
Fully Offline
**
|
 The AI engine badge reads 
`LOCAL ENGINE ACTIVE (OFFLINE)`
 — all inference runs on-device via Ollama 
|
|
 ⏱️ 
**
ETA + Live Clock
**
|
 Countdown ETA to hospital and a live 24-hour clock in the header 
|
|
 🤝 
**
Handoff Button
**
|
 One-tap patient handoff action for ER handover 
|
---
## 🛠️ Tech Stack
|
 Layer 
|
 Technology 
|
|
---
|
---
|
|
 Framework 
|
[
Next.js 16
](
https://nextjs.org/
)
 (App Router) 
|
|
 Language 
|
 TypeScript 5 
|
|
 Styling 
|
 Tailwind CSS v4 + 
`tw-animate-css`
|
|
 UI Components 
|
[
shadcn/ui
](
https://ui.shadcn.com/
)
 + Radix UI 
|
|
 Icons 
|
[
Lucide React
](
https://lucide.dev/
)
|
|
 AI Model 
|
[
Gemma 2B
](
https://ollama.com/library/gemma2
)
 via 
[
Ollama
](
https://ollama.com/
)
|
|
 Speech API 
|
 Browser Web Speech API (
`webkitSpeechRecognition`
) 
|
|
 Package Manager 
|
 pnpm 
|
---
## 📁 Project Structure
```
jivan-ai/
├── app/
│   ├── page.tsx          # Main dashboard (EmergencyDashboard) — all state lives here
│   ├── layout.tsx        # Root layout with theme provider
│   └── globals.css       # Tailwind v4 theme + custom animations
├── components/
│   ├── voice-transcript.tsx    # Voice input panel with live transcript feed
│   ├── vitals-cards.tsx        # Pulse / BP / SpO₂ metric cards
│   ├── protocol-checklist.tsx  # Trauma & Cardiac protocol checklists
│   ├── handoff-button.tsx      # ER handoff action button
│   └── ui/                     # shadcn/ui base components
├── hooks/                      # Custom React hooks
├── lib/                        # Shared utilities
├── styles/
│   └── globals.css             # Global styles (Tailwind v4)
├── public/                     # Static assets
└── .vscode/
    └── settings.json           # Disables CSS validator for Tailwind v4 at-rules
```
---
## ⚙️ Prerequisites
- **Node.js** ≥ 18
- **pnpm** (`npm install -g pnpm`)
- **[Ollama](https://ollama.com/)** — local AI runtime
- A **Chromium-based browser** (Chrome, Edge) for Web Speech API support
---
## 🚀 Getting Started
### 1. Clone the repository
```bash
git clone https://github.com/your-username/jivan-ai.git
cd jivan-ai
```
### 2. Install dependencies
```bash
pnpm install
```
### 3. Start the Ollama AI engine
```bash
# Install Ollama from https://ollama.com, then pull the model:
ollama pull gemma2:2b
# Start the Ollama server (runs on http://localhost:11434 by default):
ollama serve
```
### 4. Run the development server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in Chrome or Edge.
---
## 🎙️ How to Use
1. **Open the dashboard** in a Chromium-based browser (required for the Web Speech API).
2. **Click `START MIC`** in the Voice Transcript panel — allow microphone access when prompted.
3. **Speak patient information** in English or Hinglish, for example:
   - *"Pulse 110, BP 140 over 90, SpO2 94 percent"*
   - *"Patient has cardiac arrest"*
4. **Watch the dashboard update in real time:**
   - Vitals cards update with new readings and trend arrows.
   - If you say "cardiac" or "heart attack," the checklist automatically switches to **Cardiac Protocol**.
   - The **NEXT STEP** banner always shows the next critical action.
5. **Manually tick checklist items** by tapping/clicking each row.
6. **Click `STOP`** to end the microphone session.
7. **Use the Handoff Button** at the bottom to complete the ER handover.
---
## 🧠 AI Vitals Extraction — How It Works
```
Paramedic speaks → Web Speech API → spoken text string
    ↓
POST to Ollama (http://localhost:11434/api/generate)
    model: gemma2:2b
    system: "You are an emergency medical extractor..."
    prompt: <spoken text>
    ↓
Gemma returns JSON: { "pulse": 110, "bp": "140/90", "spo2": 94, "protocol": "trauma" }
    ↓
Dashboard state updates → Vitals cards re-render with new values + alerts
```
The model is prompted to return **only JSON** — `temperature: 0.1` ensures deterministic, consistent output.
### Alert Thresholds
|
 Vital 
|
 Alert Condition 
|
|
---
|
---
|
|
 Pulse 
|
`> 110 BPM`
 or 
`< 60 BPM`
|
|
 Blood Pressure 
|
 Systolic 
`> 140 mmHg`
 or 
`< 90 mmHg`
|
|
 SpO₂ 
|
`< 92%`
|
---
## 🎨 Custom Animations
Defined in [`styles/globals.css`](./styles/globals.css):
|
 Class 
|
 Effect 
|
|
---
|
---
|
|
`.animate-rec`
|
 Scale breathe on the REC indicator dot 
|
|
`.animate-pulse-red`
|
 Red color pulse + glow on the mic icon 
|
|
`.animate-engine`
|
 Gentle opacity breathe on the offline engine badge 
|
|
`.animate-critical-glow`
|
 Red box-shadow breathe on critical checklist rows 
|
|
`.animate-card-alert`
|
 Full-background red glow on alert vitals cards 
|
---
## 🔧 Configuration
|
 Constant 
|
 File 
|
 Default 
|
|
---
|
---
|
---
|
|
 Ollama endpoint 
|
`app/page.tsx`
|
`http://localhost:11434/api/generate`
|
|
 AI model 
|
`app/page.tsx`
|
`gemma2:2b`
|
|
 Speech language 
|
`app/page.tsx`
|
`en-US`
|
---
## 📋 Protocol Reference
### Trauma Protocol
Scene safety → C-spine stabilization → Airway → Breathing → Circulation → Hemorrhage control → IV access → Fluids → Pain management → Reassess vitals
### Cardiac Protocol
12-Lead ECG → Aspirin → Nitroglycerin → IV access → Cardiac monitor → Morphine → STEMI alert → Cath lab notification → Transport decision → Reassess symptoms
---
## ⚠️ Known Limitations
- **Web Speech API** is only available in Chromium-based browsers (Chrome, Edge). Firefox and Safari are not supported.
- **Ollama must be running locally** — if it is down, vitals will not update from voice input (the transcript still works).
- Gemma 2B extracts vitals from clearly spoken English/Hinglish. Heavy accents or noisy environments may reduce accuracy.
- The dashboard is designed for **landscape / large-screen** use (tablet or larger recommended).
---
## 📄 License
MIT License — see [LICENSE](./LICENSE) for details.
---
> Built with ❤️ for frontline emergency responders.
