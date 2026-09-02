export const API_BASE_URL = "http://localhost:3000/api/v1"

export const endpoints = {
  googleAuth: `${API_BASE_URL}/auth/google`,
  profile: `${API_BASE_URL}/profile`,
} as const
