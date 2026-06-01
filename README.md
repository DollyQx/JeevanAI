# 🚑 Jivan AI

### AI-Powered Offline Emergency Response Dashboard for First Responders

**Jivan AI** is a real-time emergency medical dashboard built for paramedics, ambulance teams, and emergency responders. It combines live voice transcription, AI-powered vitals extraction, emergency protocol guidance, and patient handoff workflows into a single offline-first platform.

> 🏥 Built to support emergency teams when every second matters.

---

## 🌟 Features

### 🎙️ Live Voice Transcription
Capture paramedic speech in real time using the Web Speech API with timestamped transcripts.

### 🧠 AI Vitals Extraction
Automatically extract critical patient vitals such as:

- Pulse Rate
- Blood Pressure
- Oxygen Saturation (SpO₂)

using a local **Gemma 2B** model running through **Ollama**.

### 📊 Real-Time Vitals Dashboard
Monitor patient vitals through interactive cards with:

- Trend indicators (↑ ↓ →)
- Alert animations
- Critical condition highlighting

### 📋 Smart Emergency Protocols
Supports both:

- Trauma Protocol
- Cardiac Protocol

The system automatically switches protocols when cardiac-related keywords are detected.

### 🚨 Next Step Guidance
Displays the next incomplete critical action to help responders follow procedures efficiently.

### ⏱️ ETA & Live Clock
Track transport ETA alongside a real-time clock.

### 🤝 Patient Handoff Workflow
One-click handoff support for emergency room transfer.

### 🔒 Fully Offline AI
All AI processing happens locally using Ollama.

No cloud APIs. No internet dependency.

---

## 📸 Dashboard Overview

### Voice Input

Example speech:

```text
Pulse 110
BP 140 over 90
SpO2 94 percent
Patient has cardiac arrest
```

### AI Output

```json
{
  "pulse": 110,
  "bp": "140/90",
  "spo2": 94,
  "protocol": "cardiac"
}
```

### Automatic Actions

- Updates vitals cards
- Triggers alerts
- Switches protocol mode
- Updates next-step guidance

---

## 🏗️ System Architecture

```text
Paramedic Speech
        │
        ▼
 Web Speech API
        │
        ▼
 Live Transcript
        │
        ▼
 Ollama + Gemma 2B
        │
        ▼
 Structured JSON Output
        │
        ▼
 Dashboard State
        │
        ▼
 Vitals Monitoring + Protocol Updates
```

---

## 🛠️ Tech Stack

| Category | Technology |
|-----------|-----------|
| Frontend | Next.js 16 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| AI Runtime | Ollama |
| AI Model | Gemma 2B |
| Speech Recognition | Web Speech API |
| Icons | Lucide React |
| Package Manager | pnpm |

---

## 📁 Project Structure

```text
jivan-ai/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── voice-transcript.tsx
│   ├── vitals-cards.tsx
│   ├── protocol-checklist.tsx
│   ├── handoff-button.tsx
│   └── ui/
│
├── hooks/
├── lib/
├── styles/
├── public/
└── .vscode/
```

---

## ⚙️ Prerequisites

- Node.js 18+
- pnpm
- Ollama
- Chromium-based browser (Chrome, Edge)

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/your-username/jivan-ai.git
cd jivan-ai
```

### Install Dependencies

```bash
pnpm install
```

### Install AI Model

```bash
ollama pull gemma2:2b
```

### Start Ollama

```bash
ollama serve
```

### Run Development Server

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

---

## 🎯 How It Works

1. Start microphone input.
2. Speak patient vitals naturally.
3. Voice is transcribed in real time.
4. Transcript is sent to Ollama.
5. Gemma extracts structured medical data.
6. Dashboard updates automatically.
7. Protocol recommendations adjust dynamically.

---

## 🚨 Alert Thresholds

| Vital | Critical Condition |
|---------|---------|
| Pulse | < 60 BPM or > 110 BPM |
| Blood Pressure | Systolic < 90 or > 140 mmHg |
| SpO₂ | < 92% |

---

## 📋 Supported Protocols

### Trauma Protocol

- Scene Safety
- C-Spine Stabilization
- Airway Assessment
- Breathing Assessment
- Circulation
- Hemorrhage Control
- IV Access
- Fluid Administration
- Pain Management
- Reassess Vitals

### Cardiac Protocol

- 12-Lead ECG
- Aspirin Administration
- Nitroglycerin
- IV Access
- Cardiac Monitoring
- Morphine
- STEMI Alert
- Cath Lab Notification
- Transport Decision
- Reassess Symptoms

---

## 🔒 Privacy & Security

Jivan AI is designed with patient privacy in mind.

✅ Fully Offline Processing  
✅ No Cloud Dependencies  
✅ No External AI APIs  
✅ No Patient Data Transmission  
✅ Local Inference with Ollama

---

## 🎨 Custom UI Features

- Animated REC Indicator
- Critical Alert Glow Effects
- Live Engine Status Badge
- Dynamic Vitals Alerts
- Responsive Dashboard Layout

---

## ⚠️ Known Limitations

- Requires Chromium-based browsers for speech recognition.
- Ollama must be running locally.
- Speech accuracy may decrease in noisy environments.
- Optimized for tablets and larger screens.

---

## 🎯 Potential Use Cases

- Emergency Medical Services (EMS)
- Ambulance Operations
- Rural Healthcare
- Disaster Response Teams
- Medical Training Simulations
- Emergency Response Research

---

## 📄 License

Licensed under the MIT License.

---

<div align="center">

### ❤️ Built for frontline responders who save lives under pressure.

**Jivan AI | Voice-Powered Emergency Intelligence**

</div>
