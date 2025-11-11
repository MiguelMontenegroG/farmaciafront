// Comentarios service
export interface ComentarioDTO {
  id?: string
  productoId: string
  usuarioId: string
  nombreUsuario: string
  calificacion: number
  titulo?: string
  contenido: string
  fechaCreacion?: string
  activo?: boolean
  flaggedAsSpam?: boolean
  reportesSpam?: number
}

export interface ComentariosResponse {
  comentarios: ComentarioDTO[]
  calificacionPromedio: number
  total: number
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/comentarios`

export const comentarioService = {
  async crearComentario(comentario: ComentarioDTO): Promise<ComentarioDTO> {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify(comentario),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.mensaje || "Error al crear el comentario")
    }

    const data = await response.json()
    return data.data || data
  },

  async obtenerComentariosProducto(productoId: string): Promise<ComentariosResponse> {
    const response = await fetch(`${API_URL}/producto/${productoId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Error al obtener comentarios")
    }

    const data = await response.json()
    return {
      comentarios: data.data?.comentarios || [],
      calificacionPromedio: data.data?.calificacionPromedio || 0,
      total: data.data?.total || 0,
    }
  },

  async obtenerCalificacionPromedio(productoId: string): Promise<number> {
    const response = await fetch(`${API_URL}/producto/${productoId}/calificacion-promedio`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return 0
    }

    const data = await response.json()
    return data.data?.calificacionPromedio || 0
  },

  async reportarSpam(comentarioId: string): Promise<void> {
    const response = await fetch(`${API_URL}/${comentarioId}/reportar-spam`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error al reportar comentario como spam")
    }
  },

  async eliminarComentario(comentarioId: string): Promise<void> {
    const response = await fetch(`${API_URL}/${comentarioId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error al eliminar comentario")
    }
  },

  async actualizarComentario(comentarioId: string, comentario: Partial<ComentarioDTO>): Promise<ComentarioDTO> {
    const response = await fetch(`${API_URL}/${comentarioId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify(comentario),
    })

    if (!response.ok) {
      throw new Error("Error al actualizar comentario")
    }

    const data = await response.json()
    return data.data || data
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth-token")
  },
}