# Crear Índice para Contributions

## Problema
La consulta de aportes requiere un índice compuesto porque usa `where` + `orderBy`.

## Solución

### Opción 1: Crear el índice automáticamente
Firebase debería mostrar un enlace de error cuando intentes cargar los aportes. Haz clic en ese enlace.

### Opción 2: Crear el índice manualmente

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto "iniciativasrve"
3. Ve a **Firestore Database** → **Índices**
4. Haz clic en **Crear índice**
5. Configura:
   - **Colección**: `contributions`
   - **Campos del índice**:
     - Campo: `initiativeId` | Orden: Ascendente
     - Campo: `createdAt` | Orden: Descendente
   - Haz clic en **Crear**

### Opción 3: El código ya maneja esto
Si el índice no existe, el código ahora obtiene los aportes sin ordenar y los ordena manualmente. Esto debería funcionar temporalmente.

## Verificar
Después de crear el índice, recarga la página y los aportes deberían aparecer.

