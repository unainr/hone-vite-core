import { Laptop, Moon, Sun } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"
import { useTheme } from "./theme-provider"

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Laptop },
  { value: "dark", label: "Dark", icon: Moon },
] as const

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === theme),
  )

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="relative inline-flex items-center rounded-full border bg-muted/50 p-0.5"
    >
      {/* sliding thumb */}
      <span
        aria-hidden
        className="absolute left-0.5 size-8 rounded-full bg-background shadow-sm ring-1 ring-border transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />

      {options.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          type="button"
          variant="ghost"
          size="icon"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          title={label}
          onClick={() => setTheme(value)}
          className={cn(
            "relative z-10 size-8 rounded-full hover:bg-transparent dark:hover:bg-transparent",
            theme === value
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon className="size-4" />
        </Button>
      ))}
    </div>
  )
}