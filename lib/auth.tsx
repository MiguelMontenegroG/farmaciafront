"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  name?: string
  nombre: string
  apellido: string
  telefono?: string
  direccion?: string
  role?: "admin" | "user"
  rol?: "CLIENTE" | "ADMIN" | "FARMACEUTICO"
  fechaRegistro?: string
  activo?: boolean
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/usuarios`
const LOGOUT_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/logout`

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Error en el login: ${errorText || response.statusText}`)
    }

    const data = await response.json()
    console.log("[authService.login] Respuesta del servidor:", data)
    
    // El servidor devuelve: { success, data: { id, nombre, apellido, email, rol, token }, ... }
    const token = data.data?.token || data.token || "no-token"
    const user = data.data || data.usuario || data.user || data

    console.log("[authService.login] Token extraído:", token)
    console.log("[authService.login] Usuario extraído:", user)
    console.log("[authService.login] Estructura del usuario:", { id: user?.id, nombre: user?.nombre, email: user?.email, rol: user?.rol })

    localStorage.setItem("auth-token", token)
    localStorage.setItem("user", JSON.stringify(user))

    console.log("[authService.login] Verificando localStorage:")
    console.log("[authService.login] - auth-token:", localStorage.getItem("auth-token"))
    console.log("[authService.login] - user:", localStorage.getItem("user"))

    // Disparar evento para que el carrito se sincronice
    window.dispatchEvent(new Event("user-login"))

    return { user, token }
  },

  async register(userData: {
    email: string
    password: string
    nombre: string
    apellido: string
    telefono?: string
  }): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_URL}/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        telefono: userData.telefono,
        contraseña: userData.password,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Error en el registro: ${errorText || response.statusText}`)
    }

    const data = await response.json()
    console.log("[authService.register] Respuesta del servidor:", data)
    
    // El servidor puede devolver: { data: { id, nombre, ... } } o directamente el usuario
    const user = data.data || data.usuario || data.user || data
    const token = data.data?.token || data.token || "registro-token"

    console.log("[authService.register] Usuario extraído:", user)
    console.log("[authService.register] Token:", token)

    localStorage.setItem("auth-token", token)
    localStorage.setItem("user", JSON.stringify(user))

    // Disparar evento para que el carrito se sincronice
    window.dispatchEvent(new Event("user-login"))

    return { user, token }
  },

  async logout(): Promise<void> {
    try {
      const token = this.getToken()
      if (token) {
        await fetch(LOGOUT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        })
      }
    } catch (error) {
      console.error("Error calling logout API:", error)
      // Continue with local logout even if API fails
    }

    localStorage.removeItem("auth-token")
    localStorage.removeItem("user")

    // Disparar evento para que el carrito se limpie
    window.dispatchEvent(new Event("user-logout"))
  },

  async forgotPassword(email: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(`Password reset email sent to ${email}`)
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Password reset successfully")
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth-token")
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}

export const AuthContext = createContext<{
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    email: string
    password: string
    nombre: string
    apellido: string
    telefono?: string
  }) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  isLoading: boolean
  isAuthenticated: boolean
} | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[AuthProvider] Leyendo localStorage al inicializar...")
    console.log("[AuthProvider] - localStorage.getItem('user'):", localStorage.getItem("user"))
    console.log("[AuthProvider] - localStorage.getItem('auth-token'):", localStorage.getItem("auth-token"))
    
    const currentUser = authService.getCurrentUser()
    const token = authService.getToken()
    console.log("[AuthProvider] Inicializando auth:", {
      user: currentUser,
      token: token ? "TOKEN EXISTE" : "NO HAY TOKEN",
      isAuthenticated: !!token,
    })
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { user } = await authService.login(email, password)
      setUser(user)
    } catch (error) {
      console.error("Error en login:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: {
    email: string
    password: string
    nombre: string
    apellido: string
    telefono?: string
  }) => {
    setIsLoading(true)
    try {
      const { user } = await authService.register(userData)
      setUser(user)
    } catch (error) {
      console.error("Error en registro:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }


  const forgotPassword = async (email: string) => {
    await authService.forgotPassword(email)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, forgotPassword, isLoading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}