"use client"

export const setAuthCookie = (token: string) => {
  // Set cookie that expires in 7 days
  const expires = new Date()
  expires.setDate(expires.getDate() + 7)

  document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`
}

export const removeAuthCookie = () => {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
}

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null

  const cookies = document.cookie.split(";")
  const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("token="))

  if (tokenCookie) {
    return tokenCookie.split("=")[1]
  }

  return null
}
