/*
  A simulated JWT. It has the shape of a real one, three base64url parts separated by dots, so the flow around it is honest: something is issued on login, kept in localStorage, read on every load to find out who is signed in, and thrown away on logout.

  What it is not is secure, and the README says so plainly. The third part is a fixed string where a signature belongs, and nothing verifies it. Anyone can paste the payload into a base64 decoder, read it, change the role to professor, and this app would believe them. A real system signs the payload on the server with a secret and rejects a token whose signature does not match, which is the one thing a browser cannot do for itself, because shipping the secret to the browser is the same as not having one.

  The expiry is real though, and is checked. A token older than its lifetime resolves to nobody and the route guards send you back to the login screen.
*/

const SIGNATURE = 'not-a-real-signature'

const LIFETIME_MS = 1000 * 60 * 60 * 8

/*
  btoa only handles characters in the Latin 1 range, so a name with an accent in it would throw. Encoding to UTF-8 bytes first and reading those as characters keeps any name working, which matters because the register form takes whatever somebody types.
*/
function encode(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value))

  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function decode(part) {
  const binary = atob(part.replace(/-/g, '+').replace(/_/g, '/'))

  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))

  return JSON.parse(new TextDecoder().decode(bytes))
}

export function makeToken(user) {
  const header = { alg: 'none', typ: 'JWT' }
  const now = Date.now()

  const payload = {
    sub: user.id,
    role: user.role,
    name: user.name,
    iat: Math.floor(now / 1000),
    exp: Math.floor((now + LIFETIME_MS) / 1000),
  }

  return `${encode(header)}.${encode(payload)}.${SIGNATURE}`
}

/*
  Returns the payload, or null for anything this app should not trust: not a string, not three parts, not valid base64, not valid JSON, or past its expiry. Every one of those ends the same way, with nobody signed in, so they are all handled by returning null rather than by throwing.
*/
export function readToken(token) {
  if (typeof token !== 'string') {
    return null
  }

  const parts = token.split('.')

  if (parts.length !== 3) {
    return null
  }

  try {
    const payload = decode(parts[1])

    if (typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now()) {
      return null
    }

    return payload
  } catch {
    return null
  }
}
