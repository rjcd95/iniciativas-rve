# Crear Índice en Firestore

## 🔗 Enlace Directo

Haz clic en este enlace para crear el índice automáticamente:

https://console.firebase.google.com/v1/r/project/iniciativasrve/firestore/indexes?create_composite=ClJwcm9qZWN0cy9pbmljaWF0aXZhc3J2ZS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvaW5pdGlhdGl2ZXMvaW5kZXhlcy9fEAEaCgoGc3RhdHVzEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg

## 📋 Pasos Manuales (si el enlace no funciona)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto "iniciativasrve"
3. Ve a **Firestore Database** → **Índices**
4. Haz clic en **Crear índice**
5. Configura el índice así:
   - **Colección**: `initiatives`
   - **Campos del índice**:
     - Campo: `status` | Orden: Ascendente
     - Campo: `createdAt` | Orden: Descendente
   - Haz clic en **Crear**

## ⏱️ Tiempo de Creación

El índice puede tardar unos minutos en crearse. Una vez creado, el error desaparecerá automáticamente.

## ✅ Verificar

Después de crear el índice, recarga la página y el error debería desaparecer.

