// Minimal utilities used by the app. Replace with real implementations.
export function createPageUrl(name) {
  if (!name) return '/'
  // simple mapping, adjust to your routing conventions
  return `/${String(name).replace(/\s+/g, '').toLowerCase()}`
}
