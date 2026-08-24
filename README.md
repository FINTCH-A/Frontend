# 🏦 Fintech - Plataforma de Créditos Virtuales

> **Solicita tu crédito sin salir de casa. Rápido, seguro y completamente digital.**

---

## 📋 Descripción General

**Fintech** es una aplicación web moderna que permite a los usuarios solicitar créditos virtuales de manera 100% digital, eliminando la necesidad de visitar una agencia física. La plataforma ofrece una experiencia fluida y segura, con procesos automatizados de verificación, aprobación y seguimiento de préstamos.

### 🎯 Propósito

Democratizar el acceso al crédito mediante un proceso:

- ✅ **100% Digital** - Sin papeleo ni filas
- ⚡ **Rápido** - Aprobación en minutos
- 🔒 **Seguro** - Datos encriptados y protección de información
- 📱 **Accesible** - Desde cualquier dispositivo

---

## 🏗️ Arquitectura del Sistema

### Frontend (Next.js 16)

```
src/
├── app/
│   ├── (admin)/          → Panel de administración
│   │   ├── dashboard/    → Estadísticas y KPIs
│   │   ├── usuarios/     → Gestión de usuarios
│   │   ├── prestamos/    → Gestión de préstamos
│   │   ├── solicitudes/  → Revisión de solicitudes
│   │   ├── pagos/        → Gestión de pagos
│   │   ├── cuotas/       → Gestión de cuotas
│   │   ├── notificaciones/ → Centro de notificaciones
│   │   └── credit-score/ → Evaluación crediticia
│   │
│   ├── (portal)/         → Portal del cliente
│   │   ├── mis-prestamos/ → Historial de préstamos
│   │   ├── mis-cuotas/   → Calendario de pagos
│   │   ├── mis-pagos/    → Historial de pagos
│   │   ├── mi-perfil/    → Editar perfil
│   │   ├── solicitar/    → Wizard de solicitud (6 pasos)
│   │   └── mis-notificaciones/ → Notificaciones
│   │
│   └── (auth)/           → Autenticación
│       ├── login/        → Inicio de sesión
│       └── register/     → Registro de usuario
│
├── features/             → Módulos funcionales (arquitectura por características)
│   ├── auth/             → Autenticación (login/register)
│   ├── dashboard/        → Dashboard con gráficos y métricas
│   ├── usuarios/         → CRUD de usuarios (admin)
│   ├── prestamos/        → Gestión de préstamos (admin)
│   ├── solicitudes/      → Revisión de solicitudes (admin)
│   ├── pagos/            → Gestión de pagos (admin)
│   ├── cuotas/           → Gestión de cuotas (admin)
│   ├── notificaciones/   → Sistema de notificaciones
│   ├── credit-score/     → Evaluación de score crediticio
│   └── portal/           → Funcionalidades del cliente
│
├── components/           → Componentes reutilizables
│   ├── ui/              → 30+ componentes Shadcn/ui personalizados
│   ├── shared/          → Header, NotificationDropdown
│   ├── landing/         → Landing page (Hero, Services, Catalog)
│   └── sidebar/         → Navegación lateral
│
├── lib/                  → Utilidades y configuración
│   ├── api-client.ts   → Cliente HTTP con interceptores
│   ├── cookies.ts      → Manejo de cookies (JWT)
│   └── utils.ts        → Funciones helper
│
├── hooks/                → Custom hooks globales
│   └── useTheme.ts     → Toggle dark/light mode
│
├── store/               → Estado global (Redux/RTK Query)
│   └── auth.store.ts  → Slice de autenticación
│
└── public/             → Assets estáticos (imágenes, iconos)
```

### 🔐 Roles y Permisos

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| **Admin** | Administrador del sistema | Todas las rutas `(admin)/*` |
| **Cliente** | Usuario registrado | Rutas `(portal)/*` |
| **Invitado** | No autenticado | `(auth)/login` y `(auth)/register` |

---

## 🚀 Funcionalidades Principales

### 🟢 Para Clientes (Portal)

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| **Solicitar Crédito** | Wizard de 6 pasos para solicitar préstamo | ✅ Implementado |
| **Mis Préstamos** | Historial y estado de préstamos activos | ✅ Implementado |
| **Mis Cuotas** | Calendario de pagos pendientes y realizados | ✅ Implementado |
| **Mis Pagos** | Historial completo de pagos | ✅ Implementado |
| **Mi Perfil** | Edición de información personal | ✅ Implementado |
| **Notificaciones** | Centro de notificaciones del sistema | ✅ Implementado |

#### 📝 Wizard de Solicitud (6 Pasos)

```
Paso 1 → Datos del Préstamo   (monto, plazo, propósito)
Paso 2 → Dirección             (domicilio, referencia)
Paso 3 → Información Laboral   (empleo, ingresos, antigüedad)
Paso 4 → Datos Personales      (contacto, referencias)
Paso 5 → Método de Pago        (cuenta bancaria)
Paso 6 → Confirmación          (resumen y envío)
```

### 🔵 Para Administradores (Admin)

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| **Dashboard** | KPIs, gráficos y métricas en tiempo real | ✅ Implementado |
| **Usuarios** | CRUD completo de usuarios del sistema | ✅ Implementado |
| **Préstamos** | Gestión de préstamos (aprobar/rechazar) | ✅ Implementado |
| **Solicitudes** | Bandeja de solicitudes pendientes | ✅ Implementado |
| **Pagos** | Registro y verificación de pagos | ✅ Implementado |
| **Cuotas** | Configuración y gestión de cuotas | ✅ Implementado |
| **Notificaciones** | Envío de notificaciones masivas | ✅ Implementado |
| **Credit Score** | Evaluación crediticia de usuarios | ✅ Implementado |

---

## 🛠️ Stack Tecnológico

### Frontend
```json
{
  "framework": "Next.js 16 (App Router)",
  "language": "TypeScript 5",
  "styling": "Tailwind CSS 4",
  "ui": "Shadcn/ui + Radix UI",
  "state": "Redux Toolkit + RTK Query",
  "forms": "React Hook Form + Zod",
  "charts": "Recharts",
  "icons": "Lucide React",
  "animations": "Framer Motion",
  "theme": "Next Themes",
  "notifications": "Sonner",
  "auth": "JWT + Cookies"
}
```

### Características Técnicas

- ✅ **App Router** - Enrutamiento basado en archivos
- ✅ **Server Components** - Renderizado en servidor
- ✅ **Client Components** - Interactividad en cliente
- ✅ **Layouts Anidados** - Estructura por roles (admin/auth/portal)
- ✅ **API Client** - Interceptores y manejo de errores
- ✅ **Lazy Loading** - Carga dinámica de módulos
- ✅ **Dark/Light Mode** - Tema oscuro/claro
- ✅ **Responsive** - Diseño mobile-first

---

## 🚦 Guía de Uso

### 🏁 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
npm start

# Linter
npm run lint

# TypeScript check
npm run type-check
```

### 📁 Estructura de Archivos por Feature

Cada módulo sigue el mismo patrón para mantener consistencia:

```
features/[nombre]/
├── components/          # Componentes UI del módulo
│   ├── Main*.tsx       # Componente principal
│   └── *Form.tsx       # Formularios específicos
├── hooks/
│   └── use-*.ts        # Lógica de negocio y estado
├── services/
│   └── *.service.ts    # Comunicación con API
└── types/
    └── *.types.ts      # Tipos TypeScript
```
---

## 🏷️ Estado de las Funcionalidades

| Módulo | Frontend | Backend | Integración |
|--------|----------|---------|-------------|
| Autenticación | ✅ 100% | ✅ 100% | ✅ Conectado |
| Dashboard | ✅ 100% | ✅ 100% | ✅ Conectado |
| Usuarios | ✅ 100% | ✅ 100% | ✅ Conectado |
| Préstamos | ✅ 100% | ✅ 100% | ✅ Conectado |
| Solicitudes | ✅ 100% | ✅ 100% | ✅ Conectado |
| Pagos | ✅ 100% | ✅ 100% | ✅ Conectado |
| Cuotas | ✅ 100% | ✅ 100% | ✅ Conectado |
| Notificaciones | ✅ 100% | ✅ 100% | ✅ Conectado |
| Credit Score | ✅ 100% | 🔜 Pendiente | 🔜 Pendiente |
| Portal Cliente | ✅ 100% | ✅ 100% | ✅ Conectado |

---

## 📱 Landing Page

La landing page incluye:

- **Hero** - Llamada a la acción principal
- **Servicios** - Beneficios del crédito digital
- **Proceso** - Cómo funciona en 3 pasos
- **Catálogo** - Tipos de préstamos disponibles
- **Productos** - Opciones de crédito
- **Contacto** - Formulario de contacto
- **Footer** - Información de la empresa

---

## 🔐 Seguridad

- ✅ JWT almacenado en cookies HttpOnly
- ✅ Protección de rutas por rol (middleware)
- ✅ Validación de formularios con Zod
- ✅ Encriptación de datos sensibles
- ✅ CORS configurado

---

## 🎨 Temas

- **Dark Mode** - Tema oscuro por defecto
- **Light Mode** - Tema claro
- **System** - Sigue preferencias del sistema

---

## 🤝 Flujo de Trabajo Recomendado

### Para completar la integración backend-frontend:

1. **Configurar API Client** `lib/api-client.ts`
2. **Conectar Autenticación** (login/register)
3. **Implementar Módulo Usuarios** (CRUD completo)
4. **Implementar Módulo Préstamos**
5. **Implementar Módulo Solicitudes**
6. **Implementar Módulo Portal** (wizard de solicitud)
7. **Implementar Dashboard y demás módulos**

---