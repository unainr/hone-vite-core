import * as React from "react"
import { flushSync } from "react-dom"
import { Moon, Sun, SunMoon } from "lucide-react"
import { cn } from "../lib/utils"
import { useTheme } from "./theme-provider"

type Theme = "light" | "system" | "dark"

const options: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
  { value: "dark", label: "Dark" },
]

const CELL = 28 // px, one slot of the track
const THUMB = 22 // px

// Fade between stacked layers (gradients can't be transitioned directly).
const layer = (on: boolean, extra = "") =>
  cn(
    "absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none",
    on ? "opacity-100" : "opacity-0",
    extra,
  )

const stars = [
  { x: 8, y: 7, s: 1.5, d: "0s" },
  { x: 20, y: 18, s: 1, d: "0.6s" },
  { x: 30, y: 6, s: 1, d: "1.1s" },
  { x: 43, y: 19, s: 1.5, d: "0.3s" },
  { x: 56, y: 8, s: 1, d: "0.9s" },
  { x: 72, y: 17, s: 1.5, d: "1.4s" },
  { x: 76, y: 6, s: 1, d: "0.2s" },
]

export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])
  React.useEffect(() => setMounted(true), [])

  const current = (mounted ? theme : "system") as Theme
  const index = options.findIndex((o) => o.value === current)
  const isDay = current === "light"
  const isDusk = current === "system"
  const isNight = current === "dark"

  const change = (value: Theme, e?: React.MouseEvent<HTMLElement>) => {
    if (value === theme) return
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> }
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!doc.startViewTransition || reduce) return setTheme(value)

    const r = e?.currentTarget.getBoundingClientRect()
    const x = r ? r.left + r.width / 2 : innerWidth / 2
    const y = r ? r.top + r.height / 2 : 0
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    doc
      .startViewTransition(() => flushSync(() => setTheme(value)))
      .ready.then(() =>
        document.documentElement.animate(
          { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 600,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        ),
      )
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = (index + dir + options.length) % options.length
    refs.current[next]?.focus()
    change(options[next].value)
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      onKeyDown={onKeyDown}
      className={cn(
        "relative isolate overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/15",
        "shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)]",
        className,
      )}
      style={{ width: CELL * 3, height: CELL }}
    >
      {/* ---------- sky ---------- */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className={layer(isDay, "bg-linear-to-b from-sky-400 to-sky-200")} />
        <div className={layer(isDusk, "bg-linear-to-r from-orange-300 via-rose-400 to-indigo-900")} />
        <div className={layer(isNight, "bg-linear-to-b from-slate-950 to-indigo-950")} />

        {/* stars */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none",
            isNight ? "opacity-100" : isDusk ? "opacity-40" : "opacity-0",
          )}
        >
          {stars.map((s, i) => (
            <span
              key={i}
              className="absolute animate-pulse rounded-full bg-white motion-reduce:animate-none"
              style={{ left: s.x, top: s.y, width: s.s, height: s.s, animationDelay: s.d }}
            />
          ))}
        </div>

        {/* clouds */}
        <div
          className={cn(
            "absolute inset-0 transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none",
            isDay ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          <span className="absolute -bottom-1 left-9 h-2.5 w-7 rounded-full bg-white/90" />
          <span className="absolute -bottom-0.5 left-13.5 h-3 w-6 rounded-full bg-white/80" />
          <span className="absolute -bottom-1 right-1 h-2 w-5 rounded-full bg-white/70" />
        </div>
      </div>

      {/* faint icons for every slot, so each option is readable at a glance */}
      <div aria-hidden className="pointer-events-none absolute inset-0 grid grid-cols-3 place-items-center">
        <Sun className="size-3.5 text-white/80" strokeWidth={2.25} />
        <SunMoon className="size-3.5 text-white/80" strokeWidth={2.25} />
        <Moon className="size-3.5 text-white/80" strokeWidth={2.25} />
      </div>

      {/* thumb: solid disc + crisp icon */}
      <span
        aria-hidden
        className="pointer-events-none absolute rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.35)] transition-transform duration-700 ease-[cubic-bezier(0.34,1.35,0.64,1)] motion-reduce:transition-none"
        style={{
          width: THUMB,
          height: THUMB,
          left: (CELL - THUMB) / 2,
          top: (CELL - THUMB) / 2,
          transform: `translateX(${index * CELL}px)`,
        }}
      >
        <span className={layer(isDay, "grid place-items-center")}>
          <Sun className="size-4 fill-amber-400 text-amber-500" strokeWidth={2.25} />
        </span>
        <span className={layer(isDusk, "grid place-items-center")}>
          <SunMoon className="size-4 text-orange-500" strokeWidth={2.25} />
        </span>
        <span className={layer(isNight, "grid place-items-center")}>
          <Moon className="size-4 fill-indigo-500 text-indigo-600" strokeWidth={2.25} />
        </span>
      </span>

      {/* ---------- hit areas ---------- */}
      <div className="absolute inset-0 grid grid-cols-3">
        {options.map(({ value, label }, i) => (
          <button
            key={value}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={current === value}
            aria-label={label}
            title={label}
            tabIndex={current === value ? 0 : -1}
            onClick={(e) => change(value, e)}
            className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80"
          />
        ))}
      </div>
    </div>
  )
}