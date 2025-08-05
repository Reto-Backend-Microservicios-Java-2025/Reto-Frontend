# Financia Web App

Una aplicación web moderna desarrollada con Angular 20 y Angular Material que implementa un sistema de gestión de clientes y productos siguiendo principios de Domain Driven Design (DDD).

## 🚀 Características

### 🔐 Autenticación
- Sistema completo de registro e inicio de sesión
- Gestión de tokens JWT
- Guards de autenticación para rutas protegidas
- Persistencia de sesión con localStorage

### 👥 Gestión de Clientes
- Lista de clientes con tabla Material
- Creación de nuevos clientes
- Validaciones de formularios
- Tipos de documento: DNI, Pasaporte, CE, RUC
- Búsqueda y filtrado

### 📦 Gestión de Productos
- CRUD completo de productos
- Asociación de productos con clientes
- Diálogos modales para crear/editar
- Filtrado por cliente
- Validaciones de precio y descripción

### 🎨 Interfaz de Usuario
- Diseño responsive con Angular Material
- Tema personalizado
- Navegación con sidenav
- Estados de carga y notificaciones
- Iconografía Material Icons

## 🏗️ Arquitectura

### Domain Driven Design (DDD)
```
src/app/
├── core/                 # Servicios y utilidades centrales
│   ├── guards/          # Guards de autenticación
│   ├── interceptors/    # Interceptores HTTP
│   └── services/        # Servicios HTTP base
├── shared/              # Código compartido
│   ├── components/      # Componentes reutilizables
│   ├── models/         # Interfaces y tipos
│   ├── services/       # Servicios compartidos
│   └── utils/          # Utilidades y helpers
└── features/           # Módulos de funcionalidad
    ├── auth/           # Autenticación
    ├── clients/        # Gestión de clientes
    ├── products/       # Gestión de productos
    └── dashboard/      # Panel principal
```

### Tecnologías Utilizadas
- **Angular 20** - Framework principal
- **Angular Material 20** - Componentes UI
- **RxJS** - Programación reactiva
- **TypeScript** - Tipado estático
- **SCSS** - Preprocesador CSS

## 🔧 Configuración del Proyecto

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- Angular CLI

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd financia-web-app

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Scripts Disponibles
```bash
npm start          # Desarrollo
npm run build      # Construcción para producción
npm run test       # Ejecutar pruebas
npm run lint       # Linting del código
```

## 🌐 Configuración de API

### Endpoints de Backend
La aplicación está configurada para conectarse con los siguientes microservicios:

```typescript
// src/environments/environment.ts
export const environment = {
  apiUrl: 'http://localhost:8010',
  endpoints: {
    auth: '/iam-service/api/v1/users',
    clients: '/customer-service/api/v1/clients', 
    products: '/product-service/api/v1/products'
  }
};
```

### Servicios Requeridos
1. **IAM Service** - `http://localhost:8010/iam-service/api/v1/users`
   - POST `/sign-up` - Registro de usuarios
   - POST `/sign-in` - Inicio de sesión
   - GET `/me` - Información del usuario actual

2. **Customer Service** - `http://localhost:8010/customer-service/api/v1/clients`
   - GET `/` - Listar todos los clientes
   - POST `/` - Crear nuevo cliente
   - GET `/{encryptedCode}` - Obtener cliente con productos
   - GET `/id/{clientId}` - Obtener cliente por ID

3. **Product Service** - `http://localhost:8010/product-service/api/v1/products`
   - GET `/` - Listar todos los productos
   - POST `/` - Crear nuevo producto
   - GET `/{productId}` - Obtener producto por ID
   - PUT `/{productId}` - Actualizar producto
   - DELETE `/{productId}` - Eliminar producto
   - GET `/client/{clientId}` - Productos por cliente

## 📱 Funcionalidades

### Autenticación
- **Registro**: Formulario con validaciones para crear nueva cuenta
- **Inicio de Sesión**: Autenticación con email y contraseña
- **Persistencia**: Mantiene sesión activa entre reinicios
- **Protección**: Rutas protegidas con guards

### Dashboard
- **Visión General**: Cards con acceso rápido a funcionalidades
- **Navegación**: Menú lateral responsive
- **Información de Usuario**: Datos del usuario autenticado

### Clientes
- **Lista**: Tabla con información completa de clientes
- **Crear**: Formulario con validaciones para nuevos clientes
- **Buscar**: Filtros y búsqueda en tiempo real
- **Productos**: Acceso directo a productos del cliente

### Productos
- **CRUD Completo**: Crear, leer, actualizar y eliminar
- **Asociación**: Vinculación con clientes existentes
- **Filtros**: Por cliente específico
- **Validaciones**: Precio, descripción y campos requeridos

## 🎨 Personalización

### Tema
El tema se puede personalizar en `src/custom-theme.scss`:
```scss
@use '@angular/material' as mat;

$primary-palette: mat.define-palette(mat.$indigo-palette);
$accent-palette: mat.define-palette(mat.$pink-palette);
$warn-palette: mat.define-palette(mat.$red-palette);
```

### Estilos Globales
Estilos adicionales en `src/styles.css` para:
- Utilidades CSS
- Overrides de Material
- Responsive design
- Estados de notificación

## 🔒 Seguridad

### Autenticación JWT
- Tokens almacenados en localStorage
- Headers de autorización automáticos
- Interceptores para manejo de errores
- Logout automático en caso de tokens inválidos

### Validaciones
- Formularios reactivos con validaciones
- Sanitización de inputs
- Validaciones personalizadas para documentos
- Manejo de errores del servidor

## 🚀 Despliegue

### Construcción para Producción
```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/` listos para despliegue.

### Variables de Entorno
Configurar `src/environments/environment.prod.ts` para producción:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com',
  endpoints: {
    // ... endpoints de producción
  }
};
```

## 📞 Soporte

Para soporte técnico o reportar problemas, por favor crear un issue en el repositorio del proyecto.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
