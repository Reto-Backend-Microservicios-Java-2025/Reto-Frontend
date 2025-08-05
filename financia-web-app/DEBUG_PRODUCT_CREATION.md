# Debug Guide: Product Creation Error 400

## 🔍 Cambios Realizados

He agregado logging detallado y validaciones para identificar el problema del error 400 al crear productos.

## 📋 Pasos para Debug

### 1. Abrir Developer Tools
- Presiona `F12` en tu navegador
- Ve a la pestaña **Console**
- Ve a la pestaña **Network**

### 2. Intentar Crear un Producto
1. Ve a **Productos** → **Nuevo Producto**
2. Llena el formulario:
   - **Nombre**: "Mi Cuenta de Prueba"
   - **Tipo de Producto**: Selecciona cualquier opción
   - **Saldo**: 1000.00
   - **Cliente**: Selecciona un cliente de la lista
3. Haz clic en **Crear**

### 3. Revisar Console Logs
Deberías ver logs como estos:
```
Create request: {
  clientId: 1001,
  productType: "SAVINGS_ACCOUNT",
  name: "Mi Cuenta de Prueba",
  balance: 1000
}
Form value: { ... }
```

### 4. Revisar Network Tab
En la pestaña Network, busca la petición a:
```
POST http://localhost:8010/product-service/api/v1/products
```

**Haz clic en la petición** y revisa:
- **Request Headers**
- **Request Payload** (qué datos se están enviando)
- **Response** (qué error devuelve el servidor)

## 🚨 Posibles Problemas y Soluciones

### Problema 1: clientId inválido
**Síntomas**: Console muestra "Invalid clientId"
**Solución**: Verifica que el cliente seleccionado tenga un uniqueCode válido

### Problema 2: productType inválido
**Síntomas**: Console muestra "Invalid productType"
**Solución**: Verifica que se seleccione un tipo de producto

### Problema 3: Backend espera formato diferente
**Síntomas**: Request se ve correcto pero backend responde 400
**Posibles causas**:
- El backend espera `ProductType` como enum, no string
- El backend espera campos adicionales
- El backend tiene validaciones específicas

### Problema 4: Autenticación
**Síntomas**: Error 401 o headers de autorización
**Solución**: Verifica que estés logueado y el token sea válido

## 🔧 Valores Esperados por el Backend

Según `CreateProductResource`:
```java
public record CreateProductResource(
    Long clientId,           // Número, no string
    ProductType productType, // Enum: SAVINGS_ACCOUNT, etc.
    String name,            // String
    Double balance          // Número decimal
)
```

## 📊 Request Correcto
El request debería verse así:
```json
{
  "clientId": 1001,
  "productType": "SAVINGS_ACCOUNT",
  "name": "Mi Cuenta de Prueba",
  "balance": 1000.0
}
```

## 🎯 Próximos Pasos

1. **Ejecuta el debug** siguiendo los pasos arriba
2. **Copia los logs de console** y el **response del servidor**
3. **Comparte esa información** para identificar el problema exacto

### Si el Request se ve correcto:
- El problema está en el backend (validaciones, base de datos, etc.)
- Revisa los logs del servidor backend
- Verifica que el cliente con ese `clientId` exista

### Si el Request está mal formado:
- Revisa que los tipos de datos sean correctos
- Verifica que el `productType` sea uno de los valores válidos
- Asegúrate de que `clientId` sea un número válido

## 🔄 Testing con datos específicos

Prueba crear un producto con estos datos exactos:
```typescript
{
  name: "Cuenta Test",
  productType: "SAVINGS_ACCOUNT", 
  balance: 100.50,
  clientId: [uniqueCode de un cliente existente]
}
```

**¡Con estos logs podremos identificar exactamente qué está causando el error 400!**