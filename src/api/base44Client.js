// Minimal stub for base44 auth client used in Layout.
export const base44 = {
  auth: {
    me: async () => {
      // Return null to represent unauthenticated by default.
      // Replace with real API call.
      return null
    },
    logout: () => {
      // placeholder
      console.log('logout called')
    },
    redirectToLogin: () => {
      // simple redirect placeholder
      window.location.href = '/login'
    }
  }
}
