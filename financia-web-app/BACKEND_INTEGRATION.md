# Backend Integration Guide

## 📋 Resumen de Cambios

He actualizado todos los modelos y componentes del frontend para que coincidan exactamente con los recursos (Resources) del backend que proporcionaste.

## 🔄 Modelos Actualizados

### 1. User Model (`user.model.ts`)
**Antes:**
```typescript
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}
```

**Después (coincide con `UserResource`):**
```typescript
interface User {
  id: number;
  email: string;
}
```

**Cambios en SignUp:**
- Removido `firstName` y `lastName`
- Solo requiere `email` y `password` (mínimo 8 caracteres)

### 2. Client Model (`client.model.ts`)
**Antes:**
```typescript
interface Client {
  id: number;
  fullName: string;
  fullLastName: string;
  typeDocument: string;
  documentNumber: string;
  uniqueCode: number;
}
```

**Después (coincide con `ClientResource`):**
```typescript
interface Client {
  full_name: string;
  full_last_name: string;
  type_document: string;
  number_document: string;
  uniqueCode: string;
}
```

**ClientWithProducts (coincide con `ClientWithProductsResource`):**
```typescript
interface ClientWithProducts {
  id: number;
  full_name: string;
  full_lastName: string; // Nota: diferente de Client.full_last_name
  type_document: string;
  number_document: string;
  uniqueCode: number;
  products: ClientProduct[];
}
```

### 3. Product Model (`product.model.ts`)
**Antes:**
```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  clientId: number;
  createdAt: string;
  updatedAt: string;
}
```

**Después (coincide con `ProductResource`):**
```typescript
interface Product {
  id: number;
  clientId: number;
  productType: string;
  name: string;
  balance: number;
}
```

## 🎯 Componentes Actualizados

### 1. Autenticación
- **Sign Up**: Removidos campos de nombre y apellido
- **Validación**: Contraseña mínimo 8 caracteres
- **Display**: Muestra email en lugar de firstName

### 2. Gestión de Clientes
- **Formularios**: Usan `full_name`, `full_last_name`, `type_document`, `number_document`
- **Campo adicional**: `uniqueCode` como número requerido
- **Tabla**: Actualizada para mostrar los campos correctos
- **Navegación**: Usa `uniqueCode` para detalles y productos

### 3. Gestión de Productos
- **Campos**: `productType`, `name`, `balance`, `clientId`
- **Tipos de Producto**: 
  - SAVINGS_ACCOUNT (Cuenta de Ahorros)
  - CHECKING_ACCOUNT (Cuenta Corriente)
  - CREDIT_CARD (Tarjeta de Crédito)
  - LOAN (Préstamo)
  - INVESTMENT (Inversión)
- **Validación**: Balance mínimo 0 (puede ser 0)
- **Selección de Cliente**: Por `uniqueCode` en creación

## 🔗 Mapeo de Endpoints

### IAM Service
- `POST /sign-up` → `SignUpResource(email, password)`
- `POST /sign-in` → `SignInResource(email, password)`
- `GET /me` → `UserResource(id, email)`

### Customer Service
- `GET /` → `ClientResource[]`
- `POST /` → `CreateClientResource` → `ClientResource`
- `GET /{encryptedCode}` → `ClientWithProductsResource`
- `GET /{encryptedCode}/basic` → `ClientResource`
- `GET /id/{clientId}` → `ClientWithProductsResource`

### Product Service
- `GET /` → `ProductResource[]`
- `POST /` → `CreateProductResource` → `ProductResource`
- `GET /{productId}` → `ProductResource`
- `PUT /{productId}` → `UpdateProductResource` → `ProductResource`
- `DELETE /{productId}` → void
- `GET /client/{clientId}` → `ProductResource[]`

## ⚠️ Consideraciones Importantes

### 1. Campos Inconsistentes
- `ClientResource.full_last_name` vs `ClientWithProductsResource.full_lastName`
- El frontend maneja ambos casos

### 2. IDs vs Códigos
- `ClientResource` no tiene `id`
- `ClientWithProductsResource` sí tiene `id`
- Navegación usa `uniqueCode` para encriptación

### 3. Tipos de Documento
Los valores esperados por el backend:
- `DNI`
- `PASSPORT` 
- `CE`
- `RUC`

### 4. Tipos de Producto
Los valores esperados por el backend (enum `ProductType`):
- `SAVINGS_ACCOUNT`
- `CHECKING_ACCOUNT`
- `CREDIT_CARD`
- `LOAN`
- `INVESTMENT`

## 🧪 Testing

### Flujo de Pruebas Recomendado:
1. **Registro**: Crear cuenta con email y contraseña
2. **Login**: Iniciar sesión
3. **Crear Cliente**: Con todos los campos requeridos incluyendo uniqueCode
4. **Crear Producto**: Seleccionar cliente y tipo de producto
5. **Navegación**: Verificar filtros y visualización

### Datos de Prueba:
```typescript
// Cliente de prueba
{
  full_name: "Juan",
  full_last_name: "Pérez García",
  type_document: "DNI",
  number_document: "12345678",
  uniqueCode: 1001
}

// Producto de prueba
{
  name: "Mi Cuenta de Ahorros",
  productType: "SAVINGS_ACCOUNT",
  balance: 1500.50,
  clientId: 1001
}
```

## ✅ Estado del Frontend

- ✅ Compilación TypeScript exitosa
- ✅ Servidor de desarrollo inicia correctamente
- ✅ Modelos sincronizados con backend
- ✅ Validaciones actualizadas
- ✅ Navegación y filtros configurados
- ✅ Componentes Material Design funcionando

El frontend está completamente actualizado y listo para conectarse con tus microservicios backend.