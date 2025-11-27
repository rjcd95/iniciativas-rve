# Sistema de Gestión de Iniciativas RVE

Sistema web responsive para gestionar iniciativas de seguridad en un residencial. Permite crear iniciativas, gestionar aportes de los residentes y hacer seguimiento del progreso de recaudación.

## Características

- ✅ Autenticación simple con email (sin contraseña)
- ✅ Lista de iniciativas con filtros (activas/finalizadas, mis iniciativas)
- ✅ Crear y editar iniciativas con fotos
- ✅ Sistema de aportes con edición
- ✅ Visualización de progreso de recaudación
- ✅ Diseño responsive (mobile-first)
- ✅ Galería de fotos para materiales y presupuestos

## Tecnologías

- **Frontend/Backend**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Base de datos**: Firebase Firestore
- **Autenticación**: Firebase Authentication
- **Almacenamiento**: Firebase Storage
- **Notificaciones**: React Hot Toast

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar los siguientes servicios:
   - **Authentication**: Habilitar el proveedor "Email/Password"
   - **Firestore Database**: Crear base de datos en modo de prueba inicialmente
   - **Storage**: Habilitar Firebase Storage

3. Obtener las credenciales de Firebase:
   - Ir a Configuración del proyecto → General → Tus apps
   - Crear una app web si no existe
   - Copiar las credenciales

4. Crear archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Configurar reglas de seguridad

#### Firestore Rules

En Firebase Console → Firestore Database → Reglas, usar:

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

#### Storage Rules

En Firebase Console → Storage → Reglas, usar:

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

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Despliegue

### Vercel (Recomendado)

1. Conectar el repositorio a Vercel
2. Agregar las variables de entorno en la configuración de Vercel
3. Desplegar automáticamente

### Firebase Hosting

```bash
npm run build
firebase init hosting
firebase deploy
```

## Notas sobre Autenticación

El sistema utiliza autenticación por email sin contraseña. Por limitaciones de Firebase, se usa una contraseña temporal interna. Esto es adecuado para un sistema de uso interno en una comunidad residencial.

## Estructura del Proyecto

```
/
├── app/                    # Páginas Next.js (App Router)
│   ├── login/             # Página de login
│   ├── initiatives/       # Páginas de iniciativas
│   └── page.tsx           # Página principal (lista)
├── components/            # Componentes React
│   ├── Layout/           # Componentes de layout
│   └── ...               # Otros componentes
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y configuración
│   └── firebase/         # Configuración de Firebase
├── types/                # Tipos TypeScript
└── public/               # Archivos estáticos
```

## Uso

1. **Iniciar sesión**: Ingresar con tu correo electrónico
2. **Ver iniciativas**: La página principal muestra las iniciativas activas por defecto
3. **Filtrar**: Usar los filtros para ver iniciativas finalizadas o solo las que creaste
4. **Crear iniciativa**: Click en "Nueva Iniciativa" y completar el formulario
5. **Aportar**: En el detalle de una iniciativa, click en "Aportar" y completar el formulario
6. **Editar aporte**: Si ya aportaste, puedes aumentar el monto desde el detalle de la iniciativa
7. **Editar iniciativa**: Solo el creador puede editar o finalizar una iniciativa

## Licencia

Proyecto personal para uso comunitario.

