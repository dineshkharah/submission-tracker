/*
  Checks a value really is a web link. Reading it with the URL parser rather than looking at the start of the string means "httpfoo" and a bare "https://" are both turned down, which matching on the start could not tell apart from a real link.

  Allowing only http and https matters because these values end up in an href. Anything else, a javascript: URL being the obvious one, never gets there.

  This lived inside the create form until the submission modal needed the same check. Moved here once there were two callers rather than guessed at up front.
*/
export function isWebLink(value) {
  try {
    const url = new URL(value)

    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/*
  Deliberately loose. Validating an email address properly is a well known rabbit hole, the real specification allows things nobody expects, and the only test that actually proves an address works is sending a message to it. So this catches the mistakes people really make, a missing at sign or a missing dot, and lets everything else through.
*/
export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}
