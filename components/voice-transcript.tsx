"use client"

import { useEffect, useRef } from "react"
import { Mic, MicOff } from "lucide-react"
import type { TranscriptEntry } from "@/app/page"

interface VoiceTranscriptProps {
  transcript: TranscriptEntry[]
  isListening: boolean
  onToggleListening: () => void
}

export function VoiceTranscript({ transcript, isListening, onToggleListening }: VoiceTranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom whenever transcript updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [transcript])

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isListening ? "bg-pulse-red/20" : "bg-muted"}`}>
            {isListening ? (
              <Mic className="w-5 h-5 animate-pulse-red" />
            ) : (
              <MicOff className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground tracking-wide">VOICE TRANSCRIPT</h2>
              {isListening && (
                <span className="flex items-center gap-1.5">
                  {/* Pulsing red dot — scales up/down via animate-rec */}
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-pulse-red animate-rec" />
                  <span className="text-xs font-bold text-pulse-red uppercase tracking-widest leading-none">
                    REC
                  </span>
                </span>
              )}
            </div>
            <p className={`text-xs uppercase tracking-wider font-semibold ${
              isListening
                ? "animate-pulse-red"
                : "text-muted-foreground"
            }`}>
              {isListening ? "Recording Active" : "Mic off"}
            </p>
          </div>
        </div>
        <button
          onClick={onToggleListening}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all touch-manipulation active:scale-95 ${
            isListening
              ? "bg-pulse-red text-foreground"
              : "bg-muted text-muted-foreground border border-border"
          }`}
        >
          {isListening ? "STOP" : "START MIC"}
        </button>
      </div>

      {/* Transcript Scroll Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scroll-smooth"
      >
        {transcript.map((entry, index) => (
          <div
            key={entry.id}
            className={`flex gap-3 py-2 px-3 rounded-lg transition-all ${
              index === transcript.length - 1
                ? "bg-primary/10 border border-primary/30"
                : "bg-muted/20"
            }`}
          >
            <span className="text-xs font-mono text-muted-foreground whitespace-nowrap pt-0.5">
              {entry.timestamp}
            </span>
            <p
              className={`text-base leading-relaxed ${
                index === transcript.length - 1 ? "text-foreground font-medium" : "text-foreground/80"
              }`}
            >
              {entry.text}
            </p>
          </div>
        ))}

        {/* Live indicator */}
        {isListening && (
          <div className="flex items-center gap-2 py-2 px-3 text-muted-foreground">
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-pulse-red rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-pulse-red rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-pulse-red rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
            <span className="text-sm">Listening…</span>
          </div>
        )}
      </div>
    </div>
  )
}
