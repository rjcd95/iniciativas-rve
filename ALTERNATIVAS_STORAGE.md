# Alternativas a Firebase Storage (Sin Tarjeta de Crédito)

## ⚠️ Nota Importante sobre Firebase

**Firebase NO cobra automáticamente** - La tarjeta es solo para verificación. El plan gratuito sigue siendo 100% gratuito y solo se cobraría si excedes los límites (muy improbable). Pero si prefieres no dar tu tarjeta, aquí hay alternativas:

---

## Opción 1: Cloudinary (Recomendado) ⭐

### Ventajas:
- ✅ **25 GB de almacenamiento gratis**
- ✅ **25 GB de transferencia/mes gratis**
- ✅ **Sin tarjeta de crédito**
- ✅ Optimización automática de imágenes
- ✅ CDN incluido

### Configuración:

1. **Crear cuenta gratuita**:
   - Ve a https://cloudinary.com/users/register/free
   - Regístrate con tu email

2. **Obtener credenciales**:
   - Ve a Dashboard → Settings
   - Copia:
     - `Cloud name`
     - Crea un `Upload preset` (Settings → Upload → Add upload preset)
       - Nombre: `iniciativas-rve`
       - Signing mode: `Unsigned` (para no requerir firma)

3. **Agregar al `.env.local`**:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=iniciativas-rve
   ```

4. **Modificar el código**:
   - Ya está creado el archivo `lib/storage/cloudinary.ts`
   - Necesitas cambiar `lib/firebase/storage.ts` para usar Cloudinary

---

## Opción 2: Base64 en Firestore (Más Simple)

### Ventajas:
- ✅ **100% gratis** (usa el plan gratuito de Firestore)
- ✅ **Sin servicios adicionales**
- ✅ **Sin configuración extra**

### Desventajas:
- ⚠️ Límite de 1 MB por documento en Firestore
- ⚠️ Las imágenes se comprimen automáticamente
- ⚠️ Puede ser más lento con muchas imágenes

### Configuración:
- Ya está creado el archivo `lib/storage/base64.ts`
- Solo necesitas modificar el código para usar base64 en lugar de URLs

---

## Opción 3: ImgBB (Muy Simple)

### Ventajas:
- ✅ **Completamente gratis**
- ✅ **Sin registro necesario** (pero mejor con API key)
- ✅ **Sin límites de almacenamiento** (pero 32 MB por imagen)

### Configuración:

1. **Obtener API key** (opcional pero recomendado):
   - Ve a https://api.imgbb.com/
   - Regístrate y obtén tu API key

2. **Agregar al `.env.local`**:
   ```env
   NEXT_PUBLIC_IMGBB_API_KEY=tu_api_key
   ```

3. **Implementar**:
   ```typescript
   const formData = new FormData();
   formData.append("key", process.env.NEXT_PUBLIC_IMGBB_API_KEY);
   formData.append("image", file);

   const response = await fetch("https://api.imgbb.com/1/upload", {
     method: "POST",
     body: formData,
   });
   ```

---

## Recomendación

**Para tu caso, recomiendo Cloudinary** porque:
- Es el más profesional
- Tiene mejor rendimiento
- Optimiza imágenes automáticamente
- Es completamente gratis para tu uso

---

## ¿Quieres que modifique el código?

Puedo modificar el código para usar cualquiera de estas alternativas. Solo dime cuál prefieres:
1. **Cloudinary** (recomendado)
2. **Base64 en Firestore** (más simple, sin servicios extra)
3. **ImgBB** (muy simple)

