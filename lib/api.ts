// src/lib/api.ts
export const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/usuarios`;

export async function loginUsuario(email: string, contraseña: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, contraseña }),
  });

  if (!response.ok) {
    throw new Error("Error al iniciar sesión");
  }

  return response.json();
}

export async function registrarUsuario(usuario: any) {
  const response = await fetch(`${API_URL}/registro`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  });

  if (!response.ok) {
    throw new Error("Error al registrar usuario");
  }

  return response.json();
}
