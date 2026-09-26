const BASE =
  'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-200 focus:outline-none'

/*
  A label, a field and an error message in the shape both forms need. Anything
  it does not name, such as maxLength, min, rows or placeholder, is passed
  straight through to the element.

  The focus ring is here rather than left to the browser because the border
  colour alone was too faint to see, and taking the outline away without
  putting something visible in its place makes the form unusable by keyboard.
*/
export default function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  type = 'text',
  multiline = false,
  ...rest
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-slate-700">
        {label}
      </label>

      {multiline ? (
        <textarea id={id} value={value} onChange={onChange} className={BASE} {...rest} />
      ) : (
        <input id={id} type={type} value={value} onChange={onChange} className={BASE} {...rest} />
      )}

      {error === undefined || error === '' ? null : (
        <p className="mt-1 text-xs text-amber-700">{error}</p>
      )}

      {hint === undefined ? null : <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  )
}
