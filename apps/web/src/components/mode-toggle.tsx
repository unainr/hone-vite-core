import * as React from "react"
import { flushSync } from "react-dom"
import { cn } from "../lib/utils"
import { useTheme } from "./theme-provider"

export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [sysDark, setSysDark] = React.useState(false)
  const btn = React.useRef<HTMLButtonElement>(null)
  const swing = React.useRef<HTMLSpanElement>(null)
  const cord = React.useRef<HTMLSpanElement>(null)
  const bulb = React.useRef<HTMLSpanElement>(null)
  const cone = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const sync = () => setSysDark(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  // lamp is "on" in light mode (system follows the OS)
  const isDark = mounted && (theme === "dark" || (theme === "system" && sysDark))

  const animate = () => {
    // 1. cord gets yanked down and snaps back
    cord.current?.animate(
      [
        { transform: "translateY(0)" },
        { transform: "translateY(8px)", offset: 0.3 },
        { transform: "translateY(0)" },
      ],
      { duration: 550, easing: "cubic-bezier(0.3, 1.6, 0.5, 1)" },
    )

    // 2. whole lamp swings like a pendulum, then settles
    swing.current?.animate(
      [
        { transform: "rotate(0deg)" },
        { transform: "rotate(9deg)", offset: 0.18 },
        { transform: "rotate(-6deg)", offset: 0.42 },
        { transform: "rotate(3.5deg)", offset: 0.62 },
        { transform: "rotate(-1.8deg)", offset: 0.8 },
        { transform: "rotate(0deg)" },
      ],
      { duration: 1200, easing: "ease-out" },
    )

    // 3. turning ON: bulb + light flicker like an old filament
    if (isDark) {
      ;[bulb.current, cone.current].forEach((el) =>
        el?.animate(
          [
            { opacity: 0.15 },
            { opacity: 1, offset: 0.15 },
            { opacity: 0.3, offset: 0.3 },
            { opacity: 1, offset: 0.48 },
            { opacity: 0.6, offset: 0.62 },
            { opacity: 1 },
          ],
          { duration: 750, delay: 120 },
        ),
      )
    }
  }

  const toggle = () => {
    const next = isDark ? "light" : "dark"
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!reduce) animate()

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> }
    }
    if (!doc.startViewTransition || reduce) return setTheme(next)

    // light spreads out from the bulb
    const r = btn.current!.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top + 30
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    doc
      .startViewTransition(() => flushSync(() => setTheme(next)))
      .ready.then(() =>
        document.documentElement.animate(
          { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 650,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        ),
      )
  }

  return (
    <button
      ref={btn}
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      title={isDark ? "Light" : "Dark"}
      className={cn(
        "group relative block h-15 w-10 shrink-0 rounded-md outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      {/* everything hangs from the top of the wire and swings together */}
      <span
        ref={swing}
        aria-hidden
        className="absolute inset-0 origin-top transition-transform duration-300 ease-out group-hover:rotate-3 motion-reduce:transition-none"
      >
        {/* soft cone of light */}
        <span
          ref={cone}
          className={cn(
            "pointer-events-none absolute left-1/2 top-7.5 h-7 w-12 -translate-x-1/2",
            "[clip-path:polygon(34%_0,66%_0,100%_100%,0_100%)] bg-linear-to-b from-amber-400/50 to-transparent",
            "transition-opacity duration-500",
            isDark ? "opacity-0" : "opacity-100",
          )}
        />

        {/* wire */}
        <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-muted-foreground/60" />

        {/* shade */}
        <span
          className={cn(
            "absolute left-1/2 top-3 h-4.5 w-9 -translate-x-1/2 transition-colors duration-500",
            "[clip-path:polygon(24%_0,76%_0,100%_100%,0_100%)]",
            isDark ? "bg-zinc-600" : "bg-amber-400",
          )}
        />

        {/* bulb */}
        <span
          ref={bulb}
          className={cn(
            "absolute left-1/2 top-6.5 size-2.5 -translate-x-1/2 rounded-full transition-[background-color,box-shadow] duration-500",
            isDark
              ? "bg-zinc-500"
              : "bg-amber-100 shadow-[0_0_12px_5px_rgba(251,191,36,0.6)]",
          )}
        />

        {/* pull cord (dangles a little further on hover) */}
        <span
          className="absolute left-6 top-7.25 h-7 w-4 transition-transform duration-300 group-hover:translate-y-0.75 motion-reduce:transition-none"
        >
          <span
            ref={cord}
            className={cn(
              "absolute inset-0 origin-top",
              "before:absolute before:left-1.75 before:top-0 before:h-5.5 before:w-px before:bg-muted-foreground",
              "after:absolute after:left-1 after:top-5.25 after:size-1.75 after:rounded-full after:bg-foreground",
            )}
          />
        </span>
      </span>
    </button>
  )
}