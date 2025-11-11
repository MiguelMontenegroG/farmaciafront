// Servicio de Usuarios - Integración con API Backend

export interface ActualizarPerfilDTO {
  nombre: string
  apellido: string
  telefono: string
}

export interface ActualizarDireccionDTO {
  direccion: string
  ciudad: string
  estado: string
  codigoPostal: string
}

export interface ActualizarUsuarioAdminDTO {
  nombre: string
  apellido: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  estado: string
  codigoPostal: string
  activo: boolean
}

export interface UsuarioDetalleDTO {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  estado: string
  codigoPostal: string
  rol: "CLIENTE" | "ADMIN" | "FARMACEUTICO"
  activo: boolean
  fechaRegistro: string
  fechaUltimaActualizacion: string
  totalCompras: number
  montoTotalCompras: number
  prescripciones: string[]
}

export interface ListaUsuariosResponseDTO {
  usuarios: UsuarioDetalleDTO[]
  total: number
}

export interface PerfilUsuarioDTO extends UsuarioDetalleDTO {}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/usuarios`

// Función auxiliar para obtener token
const getToken = () => {
  if (typeof window === "undefined") return null
  const auth = localStorage.getItem("auth")
  if (!auth) return null
  try {
    const parsed = JSON.parse(auth)
    return parsed.token || parsed.accessToken
  } catch {
    return null
  }
}

// Función auxiliar para hacer peticiones con autenticación
const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = getToken()
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.mensaje || errorData.message || "Error en la petición")
  }

  return response.json()
}

// ============ SERVICIO DE USUARIOS ============

export const usuariosService = {
  // ====== Gestión de Perfil (Cliente) ======

  /**
   * Obtener perfil del usuario autenticado
   * GET /api/usuarios/{id}/perfil
   */
  async obtenerPerfil(userId: string): Promise<PerfilUsuarioDTO> {
    return fetchWithAuth(`${API_BASE_URL}/${userId}/perfil`)
  },

  /**
   * Actualizar perfil del usuario (nombre, apellido, teléfono)
   * PUT /api/usuarios/{id}/perfil
   */
  async actualizarPerfil(
    userId: string,
    datos: ActualizarPerfilDTO
  ): Promise<PerfilUsuarioDTO> {
    return fetchWithAuth(`${API_BASE_URL}/${userId}/perfil`, {
      method: "PUT",
      body: JSON.stringify(datos),
    })
  },

  /**
   * Actualizar dirección del usuario
   * PUT /api/usuarios/{id}/direccion
   */
  async actualizarDireccion(
    userId: string,
    datos: ActualizarDireccionDTO
  ): Promise<PerfilUsuarioDTO> {
    return fetchWithAuth(`${API_BASE_URL}/${userId}/direccion`, {
      method: "PUT",
      body: JSON.stringify(datos),
    })
  },

  // ====== Gestión de Usuarios (Admin) ======

  /**
   * Listar todos los usuarios
   * GET /api/usuarios/admin/lista
   */
  async listarUsuarios(): Promise<ListaUsuariosResponseDTO> {
    const response = await fetchWithAuth(`${API_BASE_URL}`)
    
    // Asegurarse de que la respuesta tenga el formato correcto
    if (!response) {
      return { usuarios: [], total: 0 }
    }
    
    // Manejar el formato de respuesta del backend: { success, mensaje, data: { usuarios, total }, error }
    if (response.data) {
      const { usuarios, total } = response.data;
      return {
        usuarios: Array.isArray(usuarios) ? usuarios : [],
        total: total || (Array.isArray(usuarios) ? usuarios.length : 0)
      }
    }
    
    // Si la respuesta es un array directamente, adaptarlo al formato esperado
    if (Array.isArray(response)) {
      return { usuarios: response, total: response.length }
    }
    
    // Si ya tiene el formato correcto, devolverlo
    if (response.usuarios) {
      return {
        usuarios: Array.isArray(response.usuarios) ? response.usuarios : [],
        total: response.total || response.usuarios.length || 0
      }
    }
    
    // Si no coincide con ninguno de los formatos esperados
    return { usuarios: [], total: 0 }
  },

  /**
   * Listar clientes activos
   * GET /api/usuarios/admin/clientes-activos
   */
  async listarClientesActivos(): Promise<ListaUsuariosResponseDTO> {
    return fetchWithAuth(`${API_BASE_URL}/admin/clientes-activos`)
  },

  /**
   * Buscar usuarios por nombre o apellido
   * GET /api/usuarios/admin/buscar?termino=nombre
   */
  async buscarUsuarios(termino: string): Promise<ListaUsuariosResponseDTO> {
    const response = await fetchWithAuth(`${API_BASE_URL}/buscar?termino=${encodeURIComponent(termino)}`)
    
    // Asegurarse de que la respuesta tenga el formato correcto
    if (!response) {
      return { usuarios: [], total: 0 }
    }
    
    // Manejar el formato de respuesta del backend: { success, mensaje, data: { usuarios, total }, error }
    if (response.data) {
      const { usuarios, total } = response.data;
      return {
        usuarios: Array.isArray(usuarios) ? usuarios : [],
        total: total || (Array.isArray(usuarios) ? usuarios.length : 0)
      }
    }
    
    // Si la respuesta es un array directamente, adaptarlo al formato esperado
    if (Array.isArray(response)) {
      return { usuarios: response, total: response.length }
    }
    
    // Si ya tiene el formato correcto, devolverlo
    if (response.usuarios) {
      return {
        usuarios: Array.isArray(response.usuarios) ? response.usuarios : [],
        total: response.total || response.usuarios.length || 0
      }
    }
    
    // Si no coincide con ninguno de los formatos esperados
    return { usuarios: [], total: 0 }
  },

  /**
   * Obtener detalles de un usuario específico
   * GET /api/usuarios/admin/detalles/{id}
   */
  async obtenerDetallesUsuario(userId: string): Promise<UsuarioDetalleDTO> {
    const response = await fetchWithAuth(`${API_BASE_URL}/detalles/${userId}`)
    // Manejar el formato de respuesta del backend: { success, mensaje, data, error }
    if (response.data) {
      return response.data;
    }
    return response;
  },

  /**
   * Actualizar usuario (Admin)
   * PUT /api/usuarios/admin/{id}
   */
  async actualizarUsuarioAdmin(
    userId: string,
    datos: ActualizarUsuarioAdminDTO
  ): Promise<PerfilUsuarioDTO> {
    const response = await fetchWithAuth(`${API_BASE_URL}/${userId}`, {
      method: "PUT",
      body: JSON.stringify(datos),
    })
    // Manejar el formato de respuesta del backend: { success, mensaje, data, error }
    if (response.data) {
      return response.data;
    }
    return response;
  },

  /**
   * Desactivar usuario (Admin)
   * PUT /api/usuarios/admin/{id}/desactivar
   */
  async desactivarUsuario(userId: string): Promise<void> {
    const response = await fetchWithAuth(`${API_BASE_URL}/${userId}/desactivar`, {
      method: "PUT",
    })
    // Manejar el formato de respuesta del backend: { success, mensaje, data, error }
    return response.data || response;
  },

  /**
   * Activar usuario (Admin)
   * PUT /api/usuarios/admin/{id}/activar
   */
  async activarUsuario(userId: string): Promise<void> {
    const response = await fetchWithAuth(`${API_BASE_URL}/${userId}/activar`, {
      method: "PUT",
    })
    // Manejar el formato de respuesta del backend: { success, mensaje, data, error }
    return response.data || response;
  },
}