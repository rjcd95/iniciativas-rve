# Guía de Configuración - Iniciativas RVE

## ⚠️ Requisito Previo: Node.js

El proyecto requiere **Node.js versión 18.17.0 o superior**.

### Verificar tu versión actual:
```bash
node --version
```

### Opciones para actualizar Node.js:

#### Opción A: Usar NVM (Node Version Manager) - Recomendado

1. **Instalar NVM** (si no lo tienes):
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```
   Luego reinicia tu terminal.

2. **Instalar Node.js 18 o superior**:
   ```bash
   nvm install 18
   nvm use 18
   ```

3. **Verificar**:
   ```bash
   node --version  # Debe mostrar v18.x.x o superior
   ```

#### Opción B: Descargar desde nodejs.org

1. Ve a https://nodejs.org/
2. Descarga la versión LTS (Long Term Support)
3. Instala siguiendo las instrucciones

---

## 📦 Paso 1: Instalar Dependencias

Una vez que tengas Node.js 18+, ejecuta:

```bash
npm install
```

---

## 🔥 Paso 2: Configurar Firebase

### 2.1 Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Agregar proyecto" o "Crear un proyecto"
3. Ingresa un nombre (ej: "iniciativas-rve")
4. Sigue los pasos de configuración

### 2.2 Habilitar Servicios Necesarios

#### Authentication:
1. En el menú lateral, ve a **Authentication**
2. Click en "Comenzar"
3. Ve a la pestaña **Sign-in method**
4. Habilita **Email/Password**
5. Guarda los cambios

#### Firestore Database:
1. En el menú lateral, ve a **Firestore Database**
2. Click en "Crear base de datos"
3. Selecciona **Modo de prueba** (para desarrollo)
4. Elige una ubicación (ej: us-central)
5. Click en "Habilitar"

#### Storage:
1. En el menú lateral, ve a **Storage**
2. Click en "Comenzar"
3. Acepta las reglas por defecto
4. Elige la misma ubicación que Firestore
5. Click en "Listo"

### 2.3 Obtener Credenciales

1. Ve a **Configuración del proyecto** (ícono de engranaje)
2. Scroll hasta "Tus apps"
3. Si no tienes una app web, click en el ícono `</>` (Web)
4. Registra la app (puedes dejar el nombre por defecto)
5. **Copia las credenciales** que aparecen

### 2.4 Crear Archivo de Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con este contenido:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

**Reemplaza** `tu_api_key_aqui`, `tu_project_id`, etc. con los valores reales de Firebase.

### 2.5 Configurar Reglas de Seguridad

#### Firestore Rules:

1. En Firebase Console, ve a **Firestore Database** → **Reglas**
2. Reemplaza el contenido con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.email == userId;
    }
    
    match /initiatives/{initiativeId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.createdBy == request.auth.token.email;
    }
    
    match /contributions/{contributionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        resource.data.contributorEmail == request.auth.token.email;
      allow delete: if false;
    }
  }
}
```

3. Click en **Publicar**

#### Storage Rules:

1. En Firebase Console, ve a **Storage** → **Reglas**
2. Reemplaza el contenido con:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /initiatives/{initiativeId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click en **Publicar**

---

## 🚀 Paso 3: Ejecutar el Proyecto

```bash
npm run dev
```

El proyecto estará disponible en: **http://localhost:3000**

---

## ✅ Verificar que Funciona

1. Abre http://localhost:3000 en tu navegador
2. Deberías ver la página de login
3. Ingresa cualquier correo electrónico (ej: test@example.com)
4. El sistema te creará automáticamente la cuenta
5. Deberías ver la lista de iniciativas (vacía inicialmente)

---

## 🐛 Solución de Problemas

### Error: "Module not found"
- Ejecuta `npm install` nuevamente

### Error: "Firebase: Error (auth/...)"
- Verifica que las variables de entorno en `.env.local` sean correctas
- Asegúrate de haber habilitado Email/Password en Authentication

### Error: "Permission denied" en Firestore
- Verifica que hayas publicado las reglas de seguridad correctamente

### El proyecto no inicia
- Verifica que tengas Node.js 18+ instalado
- Borra `node_modules` y `package-lock.json`, luego ejecuta `npm install` nuevamente

---

## 📱 Desplegar en Producción

### Opción 1: Vercel (Recomendado - Gratis)

1. Crea cuenta en [Vercel](https://vercel.com)
2. Conecta tu repositorio de GitHub/GitLab
3. Agrega las variables de entorno en la configuración
4. Click en "Deploy"

### Opción 2: Firebase Hosting

1. Instala Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Inicializa: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

---

¡Listo! Tu sistema de gestión de iniciativas está funcionando. 🎉

