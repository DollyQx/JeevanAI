"use client"

import { Heart, Activity, Wind } from "lucide-react"
import type { VitalsState } from "@/app/page"

interface VitalCardProps {
  label: string
  value: string
  unit: string
  icon: React.ReactNode
  color: "red" | "green" | "blue"
  trend?: "up" | "down" | "stable"
  isAlert?: boolean
}

function VitalCard({ label, value, unit, icon, color, trend, isAlert }: VitalCardProps) {
  const colorClasses = {
    red: {
      bg: "bg-pulse-red/10",
      border: "border-pulse-red/50",
      text: "text-pulse-red",
      glow: "shadow-[0_0_30px_rgba(239,68,68,0.3)]",
      icon: "bg-pulse-red/20",
    },
    green: {
      bg: "bg-bp-green/10",
      border: "border-bp-green/50",
      text: "text-bp-green",
      glow: "shadow-[0_0_30px_rgba(34,197,94,0.3)]",
      icon: "bg-bp-green/20",
    },
    blue: {
      bg: "bg-spo2-blue/10",
      border: "border-spo2-blue/50",
      text: "text-spo2-blue",
      glow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]",
      icon: "bg-spo2-blue/20",
    },
  }

  const styles = colorClasses[color]

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${styles.bg} ${styles.border} ${isAlert ? `${styles.glow} animate-pulse` : ""}`}
    >
      {/* Icon badge */}
      <div className={`absolute top-4 left-4 p-2 rounded-lg ${styles.icon}`}>
        {icon}
      </div>

      {/* Trend indicator */}
      {trend && (
        <div className="absolute top-4 right-4">
          <span className={`text-2xl ${styles.text}`}>
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {trend === "stable" && "→"}
          </span>
        </div>
      )}

      {/* Label */}
      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2">
        {label}
      </p>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className={`text-6xl font-bold tabular-nums tracking-tight ${styles.text}`}>
          {value}
        </span>
        <span className={`text-xl font-medium ${styles.text} opacity-70`}>
          {unit}
        </span>
      </div>

      {/* Alert indicator */}
      {isAlert && (
        <div className={`mt-3 px-3 py-1 rounded-full ${styles.bg} border ${styles.border}`}>
          <span className={`text-xs font-bold uppercase ${styles.text}`}>ALERT</span>
        </div>
      )}
    </div>
  )
}

interface VitalsCardsProps {
  vitals: VitalsState
}

export function VitalsCards({ vitals }: VitalsCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      <VitalCard
        label="Pulse"
        value={vitals.pulse.value}
        unit="BPM"
        icon={<Heart className="w-6 h-6 text-pulse-red" />}
        color="red"
        trend={vitals.pulse.trend}
        isAlert={vitals.pulse.isAlert}
      />
      <VitalCard
        label="Blood Pressure"
        value={`${vitals.bp.systolic}/${vitals.bp.diastolic}`}
        unit="mmHg"
        icon={<Activity className="w-6 h-6 text-bp-green" />}
        color="green"
        trend={vitals.bp.trend}
        isAlert={vitals.bp.isAlert}
      />
      <VitalCard
        label="SpO2"
        value={vitals.spo2.value}
        unit="%"
        icon={<Wind className="w-6 h-6 text-spo2-blue" />}
        color="blue"
        trend={vitals.spo2.trend}
        isAlert={vitals.spo2.isAlert}
      />
    </div>
  )
}
