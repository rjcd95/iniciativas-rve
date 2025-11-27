# Solución de Problemas - Error auth/configuration-not-found

## ✅ Verificación Paso a Paso

### 1. Verificar que .env.local existe y está en la raíz

El archivo debe estar en: `/Users/Rene/Documents/Projects/IniciativasRVE/.env.local`

```bash
# Verificar que existe
ls -la .env.local

# Ver contenido (sin mostrar valores sensibles)
cat .env.local | grep -E "^NEXT_PUBLIC_FIREBASE"
```

### 2. Verificar formato del archivo

El archivo `.env.local` NO debe tener:
- ❌ Espacios antes o después del `=`
- ❌ Comillas alrededor de los valores
- ❌ Comentarios en la misma línea

✅ Formato correcto:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDAHTuvubPIdKA8oN8UUzl7FHYo8mFW3lQ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=iniciativasrve.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=iniciativasrve
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=iniciativasrve.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=453021338824
NEXT_PUBLIC_FIREBASE_APP_ID=1:453021338824:web:c81fb692b213a6829a29fd
```

### 3. Reiniciar el servidor COMPLETAMENTE

```bash
# 1. Detener el servidor (Ctrl+C)
# 2. Limpiar caché
rm -rf .next

# 3. Reiniciar
npm run dev
```

### 4. Verificar en Firebase Console

1. Ve a https://console.firebase.google.com/
2. Selecciona el proyecto "iniciativasrve"
3. Ve a **Authentication** → **Sign-in method**
4. Verifica que **Email/Password** esté **Habilitado**
5. Si no está habilitado, haz clic en "Email/Password" y actívalo

### 5. Verificar credenciales

En Firebase Console:
1. Ve a **Configuración del proyecto** (ícono de engranaje)
2. Scroll hasta "Tus apps"
3. Verifica que las credenciales coincidan con tu `.env.local`

### 6. Verificar en la consola del navegador

Abre la consola del navegador (F12) y busca:
- ✅ "Firebase initialized successfully" = Todo bien
- ❌ "Firebase configuration missing" = Variables no cargadas
- ❌ "Error initializing Firebase" = Problema con las credenciales

## 🔧 Soluciones Comunes

### Problema: Variables no se cargan

**Solución:**
```bash
# 1. Verificar que el archivo existe
ls -la .env.local

# 2. Verificar que no hay espacios extra
cat .env.local

# 3. Eliminar .next y reiniciar
rm -rf .next
npm run dev
```

### Problema: Authentication no habilitado

**Solución:**
1. Ve a Firebase Console → Authentication
2. Click en "Comenzar" si es la primera vez
3. Ve a "Sign-in method"
4. Habilita "Email/Password"
5. Guarda

### Problema: Credenciales incorrectas

**Solución:**
1. Ve a Firebase Console → Configuración del proyecto
2. Scroll hasta "Tus apps"
3. Si no hay app web, crea una (ícono `</>`)
4. Copia las credenciales exactas
5. Actualiza `.env.local`
6. Reinicia el servidor

## 🧪 Test Rápido

Abre la consola del navegador (F12) y ejecuta:

```javascript
console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
```

Si muestra `undefined`, las variables no se están cargando.

## 📞 Si Nada Funciona

1. Verifica que estás en el proyecto correcto de Firebase
2. Crea un nuevo proyecto de Firebase desde cero
3. Copia las credenciales nuevas
4. Actualiza `.env.local`
5. Reinicia el servidor

