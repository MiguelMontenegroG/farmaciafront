# 🏥 FarmaNet - Frontend

Aplicación web de farmacia construida con Next.js 14, TypeScript y Tailwind CSS.

## 🚀 Características

- 🛒 Catálogo de productos farmacéuticos
- 👤 Sistema de autenticación y roles (Cliente/Admin)
- 📊 Panel de administración completo
- 🛍️ Carrito de compras y checkout
- 📱 Diseño responsive
- 🔐 Autenticación JWT

## 🛠️ Tecnologías

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **State Management:** React Context
- **Deployment:** Vercel

## 📁 Estructura del Proyecto

```
├── app/                    # Next.js App Router
│   ├── admin/             # Páginas de administración
│   ├── auth/              # Autenticación (login/registro)
│   └── ...                # Otras páginas
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── auth/             # Componentes de autenticación
│   └── admin/            # Componentes de admin
├── lib/                   # Utilidades y servicios
│   ├── admin.ts          # API calls de admin
│   ├── auth.tsx          # Contexto de autenticación
│   └── ...               # Otros servicios
└── public/               # Assets estáticos
```

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
pnpm run dev
```

## 📦 Despliegue

Ver [Guía de Despliegue](./DEPLOYMENT_GUIDE.md) para instrucciones completas.

## 🔧 Configuración

### Variables de Entorno

```env
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com
```

## 📄 Scripts Disponibles

- `pnpm run dev` - Servidor de desarrollo
- `pnpm run build` - Build de producción
- `pnpm run start` - Servidor de producción
- `pnpm run lint` - Linting

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.