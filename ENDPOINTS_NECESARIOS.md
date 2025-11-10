# Endpoints necesarios para el panel de administración

Estimado equipo de backend,

Para que el panel de administración funcione correctamente, necesitamos que nos proporcionen los endpoints correctos para las siguientes funcionalidades:

## Estadísticas del sistema
- **Descripción**: Obtener estadísticas generales del sistema (total de productos, usuarios, pedidos, ingresos, etc.)
- **Método**: GET
- **Endpoint propuesto**: `/api/admin/estadisticas` o similar
- **Respuesta esperada**:
```json
{
  "success": true,
  "data": {
    "totalProducts": 156,
    "totalUsers": 1247,
    "totalOrders": 89,
    "totalRevenue": 15420.5,
    "lowStockProducts": 12,
    "pendingOrders": 8
  }
}
```

## Gestión de usuarios
- **Descripción**: Obtener lista de todos los usuarios registrados
- **Método**: GET
- **Endpoint propuesto**: `/api/admin/usuarios` o similar
- **Respuesta esperada**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Juan Pérez",
      "email": "juan@email.com",
      "role": "user",
      "status": "active",
      "createdAt": "2024-01-15",
      "lastLogin": "2024-03-20"
    }
  ]
}
```

## Gestión de pedidos
- **Descripción**: Obtener lista de todos los pedidos
- **Método**: GET
- **Endpoint propuesto**: `/api/admin/pedidos` o similar
- **Respuesta esperada**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "userId": "1",
      "userName": "Juan Pérez",
      "userEmail": "juan@email.com",
      "items": [
        {
          "productId": "1",
          "productName": "Paracetamol 500mg",
          "quantity": 2,
          "price": 8.5
        }
      ],
      "total": 32.99,
      "status": "pending",
      "createdAt": "2024-03-22",
      "shippingAddress": {
        "street": "Calle 123 #45-67",
        "city": "Bogotá",
        "state": "Cundinamarca",
        "zipCode": "110111"
      }
    }
  ]
}
```

## Gestión de productos
- **Descripción**: Obtener lista de todos los productos
- **Método**: GET
- **Endpoint propuesto**: `/api/admin/productos` o similar
- **Respuesta esperada**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Paracetamol 500mg",
      "description": "Analgésico y antipirético",
      "price": 8.5,
      "stock": 150,
      "category": "Medicamentos",
      "image": "/paracetamol-tablets.jpg",
      "status": "active",
      "createdAt": "2024-01-15"
    }
  ]
}
```

## Gestión de categorías
- **Descripción**: Obtener lista de todas las categorías
- **Método**: GET
- **Endpoint propuesto**: `/api/categorias/obtener` o similar
- **Respuesta esperada**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Medicamentos",
      "description": "Medicamentos de venta libre y con receta",
      "productCount": 45,
      "status": "active"
    }
  ]
}
```

## Gestión de promociones
- **Descripción**: Obtener lista de todas las promociones
- **Método**: GET
- **Endpoint propuesto**: `/api/admin/promociones` o similar
- **Respuesta esperada**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Descuento Vitaminas",
      "description": "20% de descuento en todas las vitaminas",
      "type": "percentage",
      "value": 20,
      "startDate": "2024-03-01",
      "endDate": "2024-03-31",
      "status": "active",
      "applicableProducts": ["2", "3", "4"]
    }
  ]
}
```

## Creación de productos
- **Descripción**: Crear un nuevo producto
- **Método**: POST
- **Endpoint propuesto**: `/api/productos/crear` o similar
- **Datos enviados**:
```json
{
  "nombre": "Nombre del producto",
  "descripcion": "Descripción del producto",
  "precio": 15.99,
  "categoria": { "id": "1" },
  "imagenUrl": "ruta/a/la/imagen.jpg",
  "stock": 100,
  "activo": true
}
```

Por favor, confírmenos cuáles son los endpoints reales disponibles en el backend para estas funcionalidades, o si necesitamos ajustar nuestras llamadas de alguna manera.

Gracias.