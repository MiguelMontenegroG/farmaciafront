// Servicio para manejar las órdenes/pedidos

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress: Address;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export interface CheckoutData {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentDetails?: {
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardholderName?: string;
  };
}

export interface UserOrdersResponse {
  success: boolean;
  mensaje: string;
  data: Order[];
  error: null;
}

export interface AdminOrdersResponse {
  success: boolean;
  mensaje: string;
  data: {
    pedidos: Order[];
    total: number;
  };
  error: null;
}

export interface OrderResponse {
  success: boolean;
  mensaje: string;
  data: Order;
  error: null;
}

export interface DashboardStats {
  totalUsuarios: number;
  usuariosActivos: number;
  totalProductos: number;
  productosActivos: number;
  totalPedidos: number;
  pedidosPendientes: number;
  ingresoTotal: number;
  ingresoHoy: number;
  pedidosHoy: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  mensaje: string;
  data: DashboardStats;
  error: null;
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api`;

// Función auxiliar para obtener token
const getToken = () => {
  if (typeof window === "undefined") return null;
  const auth = localStorage.getItem("auth");
  if (!auth) return null;
  try {
    const parsed = JSON.parse(auth);
    return parsed.token || parsed.accessToken;
  } catch {
    return null;
  }
};

// Función auxiliar para hacer peticiones con autenticación
const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.mensaje || errorData.message || "Error en la petición");
  }

  return response.json();
};

// ============ SERVICIO DE ÓRDENES ============

export const ordersService = {
  /**
   * Crear un nuevo pedido
   * POST /api/pedidos
   */
  async createOrder(checkoutData: CheckoutData): Promise<Order> {
    const response: OrderResponse = await fetchWithAuth(
      `${API_BASE_URL}/pedidos/crear`,
      {
        method: "POST",
        body: JSON.stringify(checkoutData),
      }
    );
    
    // Manejar el formato de respuesta del backend
    if (response.data) {
      return response.data;
    }
    
    throw new Error("No se pudo crear el pedido");
  },

  /**
   * Obtener historial de pedidos de un usuario específico
   * GET /api/pedidos/usuario/{usuarioId}
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    const response: UserOrdersResponse = await fetchWithAuth(
      `${API_BASE_URL}/pedidos/usuario/${userId}`
    );
    
    // Manejar el formato de respuesta del backend
    if (response.data) {
      return Array.isArray(response.data) ? response.data : [];
    }
    
    return [];
  },

  /**
   * Obtener todos los pedidos (administrador)
   * GET /api/admin/pedidos
   */
  async getAllOrders(
    estado?: string,
    fechaInicio?: string,
    fechaFin?: string
  ): Promise<{ pedidos: Order[]; total: number }> {
    let url = `${API_BASE_URL}/admin/pedidos`;
    const params = new URLSearchParams();
    
    if (estado) params.append("estado", estado);
    if (fechaInicio) params.append("fechaInicio", fechaInicio);
    if (fechaFin) params.append("fechaFin", fechaFin);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response: AdminOrdersResponse = await fetchWithAuth(url);
    
    // Manejar el formato de respuesta del backend
    if (response.data) {
      return {
        pedidos: Array.isArray(response.data.pedidos) ? response.data.pedidos : [],
        total: response.data.total || 0
      };
    }
    
    return { pedidos: [], total: 0 };
  },

  /**
   * Obtener un pedido específico
   * GET /api/pedidos/{orderId}
   */
  async getOrder(orderId: string): Promise<Order | null> {
    const response: OrderResponse = await fetchWithAuth(
      `${API_BASE_URL}/pedidos/${orderId}`
    );
    
    // Manejar el formato de respuesta del backend
    if (response.data) {
      return response.data;
    }
    
    return null;
  },

  /**
   * Obtener estadísticas del dashboard (administrador)
   * GET /api/admin/dashboard/stats
   */
  async getDashboardStats(): Promise<DashboardStats | null> {
    const response: DashboardStatsResponse = await fetchWithAuth(
      `${API_BASE_URL}/admin/dashboard/stats`
    );
    
    // Manejar el formato de respuesta del backend
    if (response.data) {
      return response.data;
    }
    
    return null;
  }
};