# Isa Nails — sitio web y PWA

## Qué incluye
- Identidad propia de Isa Nails: verde bosque, marfil y dorado suave.
- Inicio con máximo 2 diseños destacados y catálogo limitado a 40 diseños.
- Registro e inicio de sesión; **no se puede enviar una reserva sin iniciar sesión**.
- Panel de clienta para consultar o cancelar solicitudes.
- Panel de la dueña para gestionar citas, servicios/precios, horarios, días bloqueados y diseños.
- Exportación de citas CSV y copia/restauración de los datos en JSON.
- Manifest, iconos y Service Worker para instalar la PWA y guardar la estructura principal para abrirla sin conexión. Puede programar un único aviso del navegador 15 minutos antes de una cita confirmada si se permiten las notificaciones y la página permanece abierta.

## Cuenta de la dueña
Correo reservado: `duena@isanails.local`.
Primera vez: abre “Ingresar” → “Acceso de la dueña” → “Crear cuenta”; usa ese correo, tu nombre y una contraseña de al menos 6 caracteres. Después ingresa normalmente.

## Probar en el computador
1. Extrae todos los archivos en una carpeta.
2. Abre PowerShell dentro de esa carpeta.
3. Ejecuta `python -m http.server 8000`.
4. Abre `http://localhost:8000`.
5. Para detener el servidor, vuelve a PowerShell y pulsa `Ctrl+C`.

Abrir directamente `index.html` como archivo puede impedir que funcione el Service Worker; usa un servidor local o publica en HTTPS.

## Publicar en GitHub Pages
1. Sube estos archivos al repositorio de Isa Nails.
2. En GitHub abre **Settings → Pages**.
3. En **Build and deployment**, elige **Deploy from a branch**.
4. Selecciona `main` y la carpeta `/(root)`, guarda y espera el despliegue.
5. Abre `https://juanvi777.github.io/isa-nailss/` y recarga. Si la versión anterior sigue apareciendo, cierra la PWA y borra los datos/caché del sitio; el Service Worker nuevo sustituye la caché tras activarse.

## Instalar
- **Android/Chrome:** abre la URL publicada, menú ⋮ → “Instalar aplicación” o “Añadir a pantalla principal”.
- **iPhone/iPad:** abre la URL en Safari → Compartir → “Añadir a pantalla de inicio”.
- **PC:** busca el icono de instalación en la barra de direcciones o el menú del navegador.

## Guía de uso
### Clientas
1. Pulsa “Ingresar” → “Crear cuenta”.
2. Registra nombre, correo y contraseña.
3. Ve a “Agendar cita”; elige servicio, fecha y hora.
4. Envía la solicitud. La cita queda pendiente.
5. En “Mi cuenta” revisa el estado. La dueña debe confirmar la solicitud.
6. Para cancelar, usa “Cancelar solicitud”.

### Dueña
1. Abre “Ingresar” → “Acceso de la dueña”.
2. La primera vez registra `duena@isanails.local` con tu nombre y una contraseña propia.
3. Entra al panel de Isa Nails.
4. Configura apertura, cierre, duración de espacios y días de atención. Los domingos no están habilitados por defecto.
5. Añade fechas bloqueadas cuando no vayas a atender.
6. Ajusta servicios y precios.
7. Añade diseños (máximo 40) y marca hasta 2 como destacados.
8. Confirma o cancela citas; descarga CSV para revisar las reservas.
9. Descarga una copia JSON regularmente. Para recuperar los datos, usa “Restaurar copia JSON”.

## Importante sobre los datos
Esta edición guarda cuentas, citas y ajustes en el almacenamiento del navegador donde se utiliza. No comparte los datos automáticamente entre dispositivos ni entre clientas, y no constituye autenticación segura para un negocio en producción. La agenda necesita conexión para enviar/consultar cambios compartidos; el aviso de 15 minutos depende del navegador, del permiso de notificaciones y de que la página siga abierta, por lo que no es garantizado si se cierra la aplicación; para operar con reservas reales desde varios teléfonos hace falta conectar un backend y una base de datos. La PWA puede abrir su estructura principal sin conexión, pero no puede confirmar nuevas citas compartidas sin conexión. No guardes contraseñas reales ni información sensible en esta edición local.
