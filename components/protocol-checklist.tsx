"use client"

import { useEffect, useState } from "react"
import { Check, AlertTriangle, Zap } from "lucide-react"
import type { ProtocolType } from "@/app/page"

interface ChecklistItem {
  id: string
  label: string
  completed: boolean
  critical?: boolean
}

const protocols: Record<ProtocolType, { name: string; icon: React.ReactNode; items: ChecklistItem[] }> = {
  trauma: {
    name: "TRAUMA PROTOCOL",
    icon: <AlertTriangle className="w-5 h-5" />,
    items: [
      { id: "t1", label: "Scene safety confirmed",   completed: true  },
      { id: "t2", label: "C-spine stabilization",    completed: true,  critical: true },
      { id: "t3", label: "Airway assessment",         completed: true  },
      { id: "t4", label: "Breathing assessment",      completed: true  },
      { id: "t5", label: "Circulation check",         completed: false, critical: true },
      { id: "t6", label: "Control hemorrhage",        completed: false, critical: true },
      { id: "t7", label: "IV access established",     completed: false },
      { id: "t8", label: "Fluid resuscitation",       completed: false },
      { id: "t9", label: "Pain management",           completed: false },
      { id: "t10", label: "Reassess vitals",          completed: false },
    ],
  },
  cardiac: {
    name: "CARDIAC PROTOCOL",
    icon: <Zap className="w-5 h-5" />,
    items: [
      { id: "c1",  label: "12-Lead ECG acquired",     completed: true,  critical: true },
      { id: "c2",  label: "Aspirin administered",     completed: true  },
      { id: "c3",  label: "Nitro x3 if indicated",    completed: true  },
      { id: "c4",  label: "IV access established",    completed: false },
      { id: "c5",  label: "Cardiac monitor applied",  completed: false, critical: true },
      { id: "c6",  label: "Morphine if indicated",    completed: false },
      { id: "c7",  label: "STEMI alert called",       completed: false, critical: true },
      { id: "c8",  label: "Cath lab notified",        completed: false },
      { id: "c9",  label: "Transport decision",       completed: false },
      { id: "c10", label: "Reassess symptoms",        completed: false },
    ],
  },
}

interface ProtocolChecklistProps {
  activeProtocol: ProtocolType
  onProtocolSwitch: (p: ProtocolType) => void
}

export function ProtocolChecklist({ activeProtocol, onProtocolSwitch }: ProtocolChecklistProps) {
  const [checklist, setChecklist] = useState(protocols[activeProtocol].items)

  // Sync checklist when protocol switches externally (e.g. voice trigger)
  useEffect(() => {
    setChecklist(protocols[activeProtocol].items)
  }, [activeProtocol])

  const handleProtocolSwitch = (p: ProtocolType) => {
    onProtocolSwitch(p)
    setChecklist(protocols[p].items)
  }

  const toggleItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    )
  }

  const completedCount = checklist.filter(i => i.completed).length
  const totalCount     = checklist.length
  const progress       = (completedCount / totalCount) * 100

  // The first incomplete CRITICAL task drives the NEXT STEP banner
  const nextCritical = checklist.find(i => i.critical && !i.completed)

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden">

      {/* ── NEXT STEP banner ── */}
      <div className={`px-4 py-3 border-b border-border transition-colors ${
        nextCritical ? "bg-pulse-red/10" : "bg-bp-green/10"
      }`}>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
          Next Step
        </p>
        <p className={`text-base font-extrabold uppercase tracking-wide leading-tight ${
          nextCritical ? "text-pulse-red" : "text-bp-green"
        }`}>
          {nextCritical ? nextCritical.label : "✓ All critical steps done"}
        </p>
      </div>

      {/* Header + tabs */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h2 className="text-lg font-semibold text-foreground tracking-wide mb-3">ACTIVE PROTOCOL</h2>

        <div className="flex gap-2">
          {(["trauma", "cardiac"] as ProtocolType[]).map(p => (
            <button
              key={p}
              onClick={() => handleProtocolSwitch(p)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all touch-manipulation active:scale-95 ${
                activeProtocol === p
                  ? "bg-pulse-red text-foreground"
                  : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              {p === "trauma" ? <AlertTriangle className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>PROGRESS</span>
          <span>{completedCount}/{totalCount}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-bp-green transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {checklist.map(item => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1.5 transition-all touch-manipulation active:scale-[0.98] ${
              item.completed
                ? "bg-bp-green/10 border border-bp-green/30"
                : item.critical
                ? "bg-pulse-red/10 border border-pulse-red/40 animate-critical-glow"
                : "bg-muted/30 border border-transparent"
            }`}
          >
            {/* Checkbox */}
            <div className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md border-2 transition-all ${
              item.completed
                ? "bg-bp-green border-bp-green"
                : item.critical
                ? "border-pulse-red"
                : "border-muted-foreground"
            }`}>
              {item.completed && <Check className="w-4 h-4 text-foreground" strokeWidth={3} />}
            </div>

            {/* Label */}
            <span className={`flex-1 text-left text-sm font-semibold transition-all ${
              item.completed
                ? "text-muted-foreground line-through"
                : item.critical
                ? "text-pulse-red"
                : "text-foreground"
            }`}>
              {item.label}
            </span>

            {/* CRITICAL badge */}
            {item.critical && !item.completed && (
              <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-extrabold rounded bg-pulse-red/20 text-pulse-red tracking-widest">
                CRITICAL
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
