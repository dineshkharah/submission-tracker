import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner } from "sonner"

/*
  This is shadcn's toaster with one change. As it ships it reads the current
  theme from next-themes so it can follow a dark mode. There is no dark mode
  here, so that import and the package behind it were removed and the theme is
  fixed to light. One fewer dependency, and nothing to explain that the app
  does not actually do.

  The colours come from the same CSS variables as everything else, so a toast
  matches the cards it appears over without repeating any hex value.
*/
const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)",
      }}
      {...props}
    />
  )
}

export { Toaster }
