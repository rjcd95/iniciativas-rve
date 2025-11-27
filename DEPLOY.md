# Guía de Despliegue - Iniciativas RVE

## Opción 1: Vercel (Recomendado - Más Fácil) ⭐

Vercel es la plataforma creada por los mismos desarrolladores de Next.js. Es gratis y muy fácil de usar.

### Pasos:

1. **Crear cuenta en Vercel**
   - Ve a https://vercel.com
   - Regístrate con GitHub, GitLab o email

2. **Subir tu código a GitHub** (si no lo has hecho)
   ```bash
   # Inicializar git (si no lo has hecho)
   git init
   git add .
   git commit -m "Initial commit"
   
   # Crear repositorio en GitHub y conectar
   git remote add origin https://github.com/tu-usuario/iniciativas-rve.git
   git push -u origin main
   ```

3. **Conectar proyecto en Vercel**
   - En Vercel, haz clic en "Add New Project"
   - Conecta tu repositorio de GitHub
   - Vercel detectará automáticamente que es Next.js

4. **Configurar Variables de Entorno**
   - En la configuración del proyecto, ve a "Environment Variables"
   - Agrega todas las variables de `.env.local`:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
     NEXT_PUBLIC_FIREBASE_PROJECT_ID
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
     NEXT_PUBLIC_FIREBASE_APP_ID
     ```

5. **Deploy**
   - Haz clic en "Deploy"
   - Vercel construirá y desplegará automáticamente
   - Obtendrás una URL como: `https://iniciativas-rve.vercel.app`

6. **Dominio personalizado (opcional)**
   - En Settings → Domains puedes agregar tu propio dominio

### Ventajas de Vercel:
- ✅ 100% gratis para proyectos personales
- ✅ Deploy automático en cada push a GitHub
- ✅ SSL gratuito
- ✅ CDN global
- ✅ Muy fácil de usar

---

## Opción 2: Firebase Hosting

### Pasos:

1. **Instalar Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login en Firebase**
   ```bash
   firebase login
   ```

3. **Inicializar Firebase Hosting**
   ```bash
   firebase init hosting
   ```
   
   Selecciona:
   - Usar un proyecto existente: "iniciativasrve"
   - Public directory: `.next` (NO, esto está mal)
   - Public directory: `out` (para static export) o usar configuración personalizada
   - Configure as a single-page app: No
   - Set up automatic builds: No

4. **Configurar Next.js para export estático** (si quieres usar Firebase Hosting)
   
   Edita `next.config.js`:
   ```js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   };
   
   module.exports = nextConfig;
   ```

5. **Build del proyecto**
   ```bash
   npm run build
   ```

6. **Deploy**
   ```bash
   firebase deploy --only hosting
   ```

### Nota:
Firebase Hosting funciona mejor con sitios estáticos. Para Next.js con funciones del servidor, Vercel es mejor opción.

---

## Opción 3: Netlify (Alternativa)

Similar a Vercel, también gratis y fácil.

1. Ve a https://www.netlify.com
2. Conecta tu repositorio de GitHub
3. Configura:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Agrega las variables de entorno
5. Deploy

---

## Recomendación Final

**Usa Vercel** porque:
- Es la plataforma oficial de Next.js
- Configuración automática
- Deploy en segundos
- 100% gratis para tu caso de uso
- Mejor rendimiento para Next.js

---

## Después del Deploy

1. **Actualizar reglas de Firestore**
   - Asegúrate de que las reglas de seguridad estén configuradas correctamente
   - En Firebase Console → Firestore → Reglas

2. **Actualizar reglas de Storage**
   - En Firebase Console → Storage → Reglas

3. **Probar la aplicación**
   - Visita la URL de producción
   - Prueba crear una iniciativa y hacer un aporte

---

## Variables de Entorno en Producción

Asegúrate de agregar TODAS las variables de entorno en la plataforma de hosting:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## Troubleshooting

### Error: "Firebase configuration not found"
- Verifica que todas las variables de entorno estén configuradas en Vercel/Netlify

### Error: "Index not found"
- Crea los índices necesarios en Firestore Console

### Error: "Authentication not enabled"
- Verifica que Email/Password esté habilitado en Firebase Console

