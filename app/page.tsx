"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Ambulance, Clock, MapPin, Radio } from "lucide-react"
import { VoiceTranscript } from "@/components/voice-transcript"
import { VitalsCards } from "@/components/vitals-cards"
import { ProtocolChecklist } from "@/components/protocol-checklist"
import { HandoffButton } from "@/components/handoff-button"

// ─── Browser Speech API globals (not in default TS lib) ───────────────────────
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VitalsState {
  pulse: { value: string; trend: "up" | "down" | "stable"; isAlert: boolean }
  bp: { systolic: string; diastolic: string; trend: "up" | "down" | "stable"; isAlert: boolean }
  spo2: { value: string; trend: "up" | "down" | "stable"; isAlert: boolean }
}

export interface TranscriptEntry {
  id: number
  timestamp: string
  text: string
}

export type ProtocolType = "trauma" | "cardiac"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const OLLAMA_URL = "http://localhost:11434/api/generate"
const GEMMA_MODEL = "gemma2:2b"

const GEMMA_SYSTEM =
  'You are an emergency medical extractor. Listen to Hinglish or English. ' +
  'If you hear vitals, return ONLY JSON: {"pulse": num, "bp": "string", "spo2": num, "protocol": "string"}. ' +
  'If \'Cardiac\' or \'Heart\' is mentioned, set protocol to \'cardiac\'. ' +
  'No conversational text.'

function buildPrompt(transcript: string): string {
  return transcript
}

function trend(next: number, prev: number): "up" | "down" | "stable" {
  if (next > prev) return "up"
  if (next < prev) return "down"
  return "stable"
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function EmergencyDashboard() {
  const [currentTime, setCurrentTime] = useState("")
  const [eta, setEta] = useState("8 MIN")

  // ── Vitals (lifted from VitalsCards so Gemma can update them) ──
  const [vitals, setVitals] = useState<VitalsState>({
    pulse: { value: "98", trend: "stable", isAlert: false },
    bp: { systolic: "128", diastolic: "82", trend: "stable", isAlert: false },
    spo2: { value: "96", trend: "stable", isAlert: false },
  })

  // ── Transcript (lifted from VoiceTranscript) ──
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([
    { id: 1, timestamp: "14:32:01", text: "Patient is a 45-year-old male, unresponsive at scene" },
    { id: 2, timestamp: "14:32:15", text: "GCS score 8, pupils reactive bilaterally" },
    { id: 3, timestamp: "14:32:28", text: "Visible trauma to the right temporal region" },
    { id: 4, timestamp: "14:32:45", text: "Airway secured with OPA, bag-valve-mask ventilation initiated" },
    { id: 5, timestamp: "14:33:02", text: "Large bore IV access established in left AC" },
    { id: 6, timestamp: "14:33:18", text: "500ml normal saline bolus initiated" },
  ])

  // ── Speech API state ──
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const recognitionRef = useRef<any>(null)

  // ── Active protocol (lifted so speech + Gemma can both switch it) ──
  const [activeProtocol, setActiveProtocol] = useState<ProtocolType>("trauma")

  // ── Clock + ETA ──
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString("en-US", { hour12: false }))
    }
    updateTime()
    const clockInterval = setInterval(updateTime, 1000)

    let minutes = 8
    const etaInterval = setInterval(() => {
      minutes = Math.max(1, minutes - 1)
      setEta(`${minutes} MIN`)
    }, 60000)

    return () => {
      clearInterval(clockInterval)
      clearInterval(etaInterval)
    }
  }, [])

  // ── Send transcript to Gemma and update vitals ──
  const sendToGemma = useCallback(
    async (text: string) => {
      if (!text.trim()) return
      setIsProcessing(true)
      try {
        const res = await fetch(OLLAMA_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: GEMMA_MODEL,
            system: GEMMA_SYSTEM,
            prompt: buildPrompt(text),
            stream: false,
            num_predict: 20,
            options: { temperature: 0.1 },
          }),
        })

        if (!res.ok) throw new Error(`Ollama responded with ${res.status}`)

        const data = await res.json()
        const raw: string = data.response ?? ""

        // Extract JSON from the model reply (it may include surrounding text)
        const jsonMatch = raw.match(/\{[\s\S]*?\}/)
        if (!jsonMatch) return

        const parsed = JSON.parse(jsonMatch[0]) as {
          pulse?: number | null
          bp?: string | null
          spo2?: number | null
          protocol?: string | null
        }

        if (parsed.protocol) {
          const p = parsed.protocol.toLowerCase()
          if (p === "cardiac") setActiveProtocol("cardiac")
          else if (p === "trauma") setActiveProtocol("trauma")
        }

        setVitals((prev) => {
          const nextPulse = parsed.pulse ?? parseInt(prev.pulse.value)
          const nextSpo2 = parsed.spo2 ?? parseInt(prev.spo2.value)
          const bpParts = parsed.bp ? parsed.bp.split("/") : [prev.bp.systolic, prev.bp.diastolic]
          const nextSystolic = parseInt(bpParts[0])
          const nextDiastolic = parseInt(bpParts[1] ?? prev.bp.diastolic)

          return {
            pulse: {
              value: String(nextPulse),
              trend: trend(nextPulse, parseInt(prev.pulse.value)),
              isAlert: nextPulse > 110 || nextPulse < 60,
            },
            bp: {
              systolic: String(nextSystolic),
              diastolic: String(nextDiastolic),
              trend: trend(nextSystolic, parseInt(prev.bp.systolic)),
              isAlert: nextSystolic > 140 || nextSystolic < 90,
            },
            spo2: {
              value: String(nextSpo2),
              trend: trend(nextSpo2, parseInt(prev.spo2.value)),
              isAlert: nextSpo2 < 92,
            },
          }
        })
      } catch (err) {
        console.error("[Gemma] Failed to parse vitals:", err)
      } finally {
        setIsProcessing(false)
      }
    },
    []
  )

  // ── Web Speech API setup ──
  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.warn("Web Speech API not supported in this browser.")
      return
    }

    const recognition: any = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.continuous = true
    recognition.interimResults = false

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1]
      if (!result.isFinal) return

      const spokenText = result[0].transcript.trim()
      if (!spokenText) return

      // Keyword-based cardiac auto-switch (instant, no AI round-trip needed)
      const lower = spokenText.toLowerCase()
      if (lower.includes("cardiac") || lower.includes("heart attack") || lower.includes("heart")) {
        setActiveProtocol("cardiac")
      }

      const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false })
      const entry: TranscriptEntry = { id: Date.now(), timestamp, text: spokenText }

      setTranscript((prev) => [...prev.slice(-10), entry])
      sendToGemma(spokenText)
    }

    recognition.onerror = (event: any) => {
      console.error("[SpeechRecognition] error:", event.error)
      // Auto-restart on recoverable errors
      if (event.error === "no-speech" || event.error === "audio-capture") {
        recognition.stop()
        recognition.start()
      }
    }

    recognition.onend = () => {
      // Restart automatically if we're still meant to be listening
      if (recognitionRef.current === recognition) {
        try { recognition.start() } catch { /* already started */ }
      }
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [sendToGemma])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null // prevent auto-restart
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  return (
    <div className="min-h-screen h-screen flex flex-col p-3 gap-3 overflow-hidden">

      {/* ── Edge engine badge ── */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-bp-green/40 bg-bp-green/10 backdrop-blur-sm animate-engine pointer-events-none select-none">
        <span className="font-mono text-xs font-bold text-bp-green tracking-widest">
          ● LOCAL ENGINE ACTIVE (OFFLINE)
        </span>
      </div>

      {/* Top Status Bar */}
      <header className="flex items-center justify-between px-4 py-2 bg-card rounded-xl border border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-pulse-red">
            <Ambulance className="w-6 h-6" />
            <span className="font-bold text-lg tracking-wide">UNIT 47</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <Radio className="w-4 h-4 text-bp-green animate-pulse" />
            <span className="text-sm font-medium">CONNECTED</span>
          </div>
          {/* Gemma processing indicator */}
          {isProcessing && (
            <>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-spo2-blue rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-spo2-blue rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-spo2-blue rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
                <span className="text-xs font-medium text-spo2-blue uppercase tracking-wide">Gemma Parsing…</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-spo2-blue" />
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase">ETA</p>
              <p className="text-xl font-bold text-spo2-blue tabular-nums">{eta}</p>
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="text-2xl font-mono font-bold text-foreground tabular-nums">
              {currentTime}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-[1fr_380px] gap-3 min-h-0">
        {/* Left Section - Voice + Vitals */}
        <div className="flex flex-col gap-3 min-h-0">
          {/* Voice Transcript - Top */}
          <div className="h-[45%] min-h-0">
            <VoiceTranscript
              transcript={transcript}
              isListening={isListening}
              onToggleListening={toggleListening}
            />
          </div>

          {/* Vitals Cards - Middle */}
          <div className="flex-1 min-h-0">
            <VitalsCards vitals={vitals} />
          </div>
        </div>

        {/* Right Sidebar - Protocol Checklist */}
        <div className="min-h-0">
          <ProtocolChecklist
            activeProtocol={activeProtocol}
            onProtocolSwitch={setActiveProtocol}
          />
        </div>
      </div>

      {/* Bottom - Handoff Button */}
      <footer>
        <HandoffButton />
      </footer>
    </div>
  )
}
