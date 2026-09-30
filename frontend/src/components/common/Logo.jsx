/*
  inverted swaps the two tokens rather than reaching for a new colour, so the mark still works when it sits on the indigo panel instead of on a white one. Both values are palette tokens, which keeps the claim in index.css true.
*/
export default function Logo({ inverted = false }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${inverted ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
  )
}
