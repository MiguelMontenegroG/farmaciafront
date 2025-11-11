// User profile types and services
export interface UserProfile {
  id: string
  email: string
  nombre: string
  apellido: string
  telefono?: string
  fechaNacimiento?: string
  genero?: "masculino" | "femenino" | "otro"
  direcciones: Direccion[]
  rol: "CLIENTE" | "ADMIN" | "FARMACEUTICO"
  fechaRegistro: string
  activo: boolean
  preferencias: {
    notificacionesEmail: boolean
    notificacionesSMS: boolean
    ofertas: boolean
    newsletter: boolean
  }
}

export interface Direccion {
  id: string
  tipo: "casa" | "trabajo" | "otro"
  nombre: string
  direccion: string
  ciudad: string
  codigoPostal: string
  telefono?: string
  esPrincipal: boolean
}

export interface PasswordChangeRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// User service functions
export const userService = {
  async getProfile(): Promise<UserProfile> {
    try {
      // Obtener el usuario autenticado actual desde localStorage
      const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null
      
      if (!userStr) {
        throw new Error("Usuario no autenticado")
      }

      const currentUser = JSON.parse(userStr)
      
      // Llamar a la API del backend para obtener el perfil completo
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/usuarios/${currentUser.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth-token")}`
        }
      })

      if (!response.ok) {
        console.error("Error fetching profile:", response.status)
        // Fallback: devolver un perfil básico construido desde localStorage
        return {
          id: currentUser.id,
          email: currentUser.email,
          nombre: currentUser.nombre,
          apellido: currentUser.apellido,
          telefono: currentUser.telefono,
          rol: currentUser.rol === "ADMINISTRADOR" ? "ADMIN" : "CLIENTE",
          fechaRegistro: currentUser.fechaRegistro || new Date().toISOString(),
          activo: true,
          direcciones: [],
          preferencias: {
            notificacionesEmail: true,
            notificacionesSMS: false,
            ofertas: true,
            newsletter: true,
          },
        }
      }

      const data = await response.json()
      console.log("[userService.getProfile] Profile data received:", data)
      
      // Mapear respuesta del backend al formato UserProfile
      const profileData = data.data || data
      
      return {
        id: profileData.id,
        email: profileData.email,
        nombre: profileData.nombre,
        apellido: profileData.apellido,
        telefono: profileData.telefono,
        fechaNacimiento: profileData.fechaNacimiento,
        genero: profileData.genero,
        rol: profileData.rol === "ADMINISTRADOR" ? "ADMIN" : "CLIENTE",
        fechaRegistro: profileData.fechaRegistro,
        activo: profileData.activo ?? true,
        direcciones: profileData.direcciones || [],
        preferencias: {
          notificacionesEmail: true,
          notificacionesSMS: false,
          ofertas: true,
          newsletter: true,
        },
      }
    } catch (error) {
      console.error("[userService.getProfile] Error:", error)
      throw new Error("No se pudo cargar el perfil del usuario")
    }
  },

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful update
    const currentProfile = await this.getProfile()
    const updatedProfile = { ...currentProfile, ...profile }

    // Save to localStorage for demo
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile))

    return updatedProfile
  },

  async changePassword(request: PasswordChangeRequest): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation
    if (request.currentPassword !== "currentpass") {
      throw new Error("La contraseña actual es incorrecta")
    }

    if (request.newPassword !== request.confirmPassword) {
      throw new Error("Las contraseñas no coinciden")
    }

    if (request.newPassword.length < 6) {
      throw new Error("La nueva contraseña debe tener al menos 6 caracteres")
    }

    console.log("Password changed successfully")
  },

  async deleteAccount(): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Clear user data
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user")
    localStorage.removeItem("userProfile")
    localStorage.removeItem("cart")

    console.log("Account deleted successfully")
  },

  async addAddress(address: Omit<Direccion, "id">): Promise<Direccion> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newAddress: Direccion = {
      ...address,
      id: Date.now().toString(),
    }

    return newAddress
  },

  async updateAddress(id: string, address: Partial<Direccion>): Promise<Direccion> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const profile = await this.getProfile()
    const addressIndex = profile.direcciones.findIndex((a) => a.id === id)

    if (addressIndex === -1) {
      throw new Error("Dirección no encontrada")
    }

    const updatedAddress = { ...profile.direcciones[addressIndex], ...address }
    return updatedAddress
  },

  async deleteAddress(id: string): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log(`Address ${id} deleted successfully`)
  },
}
