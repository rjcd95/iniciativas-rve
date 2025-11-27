# Sistema de Gestión de Iniciativas RVE

Sistema web responsive para gestionar iniciativas de seguridad en un residencial. Permite crear iniciativas, gestionar aportes de los residentes y hacer seguimiento del progreso de recaudación.

## 🚀 Tecnologías Utilizadas

- **Frontend/Backend**: [Next.js 14.2.5](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Base de datos**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Autenticación**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Almacenamiento**: [Firebase Storage](https://firebase.google.com/docs/storage)
- **Notificaciones**: [React Hot Toast](https://react-hot-toast.com/)
- **Formularios**: [React Hook Form](https://react-hook-form.com/)

## 🌐 Despliegue

El proyecto está desplegado en **[Vercel](https://vercel.com/)**.

- **URL de producción**: [Ver en Vercel](https://vercel.com)
- **Repositorio**: [GitHub](https://github.com/rjcd95/iniciativas-rve)

## ✨ Características

- ✅ Autenticación simple con email (sin contraseña)
- ✅ Lista de iniciativas con filtros (activas/finalizadas, mis iniciativas)
- ✅ Crear y editar iniciativas con fotos
- ✅ Sistema de aportes con edición
- ✅ Visualización de progreso de recaudación
- ✅ Diseño responsive (mobile-first)
- ✅ Galería de fotos para materiales y presupuestos
- ✅ Cálculo automático de cuota sugerida

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## ⚙️ Configuración

1. Crear archivo `.env.local` con las credenciales de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

2. Configurar Firebase:
   - Habilitar Authentication (Email/Password)
   - Crear base de datos Firestore
   - Habilitar Storage
   - Configurar reglas de seguridad (ver archivos `firestore.rules` y `storage.rules`)

## 📝 Uso

1. **Iniciar sesión**: Ingresar con tu correo electrónico
2. **Ver iniciativas**: La página principal muestra las iniciativas activas por defecto
3. **Filtrar**: Usar los filtros para ver iniciativas finalizadas o solo las que creaste
4. **Crear iniciativa**: Click en "Nueva Iniciativa" y completar el formulario
5. **Aportar**: En el detalle de una iniciativa, click en "Aportar" y completar el formulario
6. **Editar aporte**: Si ya aportaste, puedes modificar el monto desde el detalle de la iniciativa
7. **Editar iniciativa**: Solo el creador puede editar o finalizar una iniciativa

## 📄 Licencia

Proyecto personal para uso comunitario.
