const PREFIX = 'submission-tracker'

/*
  The version sits in the key rather than inside the saved object. Round 2 changed every collection, so anyone still carrying Round 1 data would load a shape the app no longer understands. Bumping the key means the old data is simply never read and the app starts from seed, with no migration code and no shape checking to get wrong.

  Round 1's README named unversioned storage as a known limitation. This closes it. The cost is that the old key stays behind in localStorage, a few kilobytes nobody reads, which is a fair trade for not writing a migration.

  Bump this whenever a collection changes shape again.
*/
const DATA_VERSION = 'v2'

export const STORAGE_KEYS = {
  data: `${PREFIX}:${DATA_VERSION}:data`,
  token: `${PREFIX}:token`,
}

/*
  Every call is wrapped in try and catch on purpose. localStorage throws rather than returning null when the browser blocks it, which happens in private windows and when site data is turned off. Whatever is stored can also be stale or hand edited, so parsing can throw too. In all of those cases the right answer is to fall back to the seed rather than fail to start.
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
    // Storage can be full or blocked. The app still works from memory for the rest of this session, so there is nothing useful to do about it here.
  }
}

export function remove(key) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Same reasoning as save.
  }
}

/*
  Read a raw string without parsing it. The auth token is already a string, and running JSON.parse over it would turn a perfectly good token into a throw.
*/
export function loadRaw(key) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function saveRaw(key, value) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Same reasoning as save.
  }
}
