# Problema con las categorías

Estimado equipo de backend,

Hemos identificado un problema con la visualización de categorías en nuestra aplicación. A continuación describimos el problema:

## Problema 1: Categorías en el panel de administración
En el panel de administración ([http://localhost:3000/admin](file:///C:/Users/ANGEL/Downloads/farmacia-frontend/app/admin/page.tsx#L35-L39)), las categorías se muestran con "0 productos" en la columna de productos. Esto sucede porque el endpoint `/api/categorias/obtener` no está devolviendo la información de cantidad de productos por categoría.

## Problema 2: Categorías en la página pública
En la página pública de categorías ([http://localhost:3000/categorias](file:///C:/Users/ANGEL/Downloads/farmacia-frontend/app/categorias/page.tsx)), no se muestran categorías. Esto puede deberse a uno de los siguientes motivos:

1. El endpoint `/api/categorias/obtener` no está devolviendo datos
2. Las categorías existentes no tienen la propiedad `esCategoriaRaiz` en `true`
3. Hay un error en la transformación de datos en el frontend

## Información técnica

### Endpoints involucrados:
1. `/api/categorias/obtener` - Endpoint que debería devolver todas las categorías
2. `/api/categorias/subcategorias/{categoriaPadreId}` - Endpoint para obtener subcategorías

### Estructura de datos esperada actualmente:
```json
{
  "id": "string",
  "nombre": "string",
  "descripcion": "string",
  "imagenUrl": "string (opcional)",
  "keywords": "string[] (opcional)",
  "orden": "number (opcional)",
  "esCategoriaRaiz": "boolean",
  "categoriaPadreId": "string (opcional)",
  "categoriaPadreNombre": "string (opcional)"
}
```

### Lo que necesitamos:
1. Confirmar que el endpoint `/api/categorias/obtener` esté funcionando correctamente
2. Verificar que las categorías tengan correctamente establecida la propiedad `esCategoriaRaiz` en `true` para las categorías raíz
3. Si es posible, incluir información de cantidad de productos en la respuesta (opcional pero deseable)

## Preguntas específicas:
1. ¿El endpoint `/api/categorias/obtener` está devolviendo datos actualmente?
2. ¿Las categorías tienen correctamente configurada la propiedad `esCategoriaRaiz`?
3. ¿Hay algún error en el backend que pueda estar afectando esta funcionalidad?

Gracias por su ayuda.