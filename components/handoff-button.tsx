"use client"

import { useState } from "react"
import { FileText, Loader2, CheckCircle2, Send } from "lucide-react"

export function HandoffButton() {
  const [status, setStatus] = useState<"idle" | "generating" | "complete">("idle")

  const handleGenerate = () => {
    setStatus("generating")
    // Simulate generation
    setTimeout(() => {
      setStatus("complete")
      // Reset after showing success
      setTimeout(() => setStatus("idle"), 3000)
    }, 2000)
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={status === "generating"}
      className={`w-full flex items-center justify-center gap-4 py-5 px-8 rounded-xl font-bold text-xl uppercase tracking-wider transition-all touch-manipulation active:scale-[0.98] disabled:cursor-not-allowed ${
        status === "complete"
          ? "bg-bp-green text-foreground shadow-[0_0_40px_rgba(34,197,94,0.4)]"
          : status === "generating"
          ? "bg-muted text-muted-foreground"
          : "bg-primary text-primary-foreground shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_50px_rgba(34,197,94,0.5)]"
      }`}
    >
      {status === "idle" && (
        <>
          <FileText className="w-7 h-7" />
          <span>Generate ER Handoff</span>
          <Send className="w-6 h-6" />
        </>
      )}
      {status === "generating" && (
        <>
          <Loader2 className="w-7 h-7 animate-spin" />
          <span>Generating Report...</span>
        </>
      )}
      {status === "complete" && (
        <>
          <CheckCircle2 className="w-7 h-7" />
          <span>Handoff Ready - Sent to ER</span>
        </>
      )}
    </button>
  )
}
