const PREFIX = 'submission-tracker'

export const STORAGE_KEYS = {
  data: `${PREFIX}:data`,
  currentUserId: `${PREFIX}:current-user-id`,
}

/*
  Every call here is wrapped in try and catch on purpose. localStorage throws
  rather than returning null when the browser blocks it, which happens in
  private windows and when a user turns off site data. Whatever is stored can
  also be stale or hand edited, so parsing it can throw too. In every one of
  those cases the right answer is to fall back to the seed data instead of
  letting the whole app fail to start.
*/

export function load(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) {
      return fallback
    }
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be full or blocked. The app still works from memory for the
    // rest of this session, so there is nothing useful to do about it here.
  }
}

export function remove(key) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Same reasoning as save.
  }
}
