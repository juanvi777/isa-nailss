# Guía paso a paso — Isa Nails

## A. Abrir y probar
1. Extrae `ISA-NAILS-PWA-COMPLETA.zip`.
2. Abre la carpeta extraída.
3. Si tienes Python instalado, abre PowerShell en la carpeta y ejecuta `python -m http.server 8000`.
4. Abre `http://localhost:8000`.
5. Si PowerShell dice que Python no está instalado, publica primero en GitHub Pages o usa otro servidor local.

## B. Publicar sin mezclar otros proyectos
1. Asegúrate de estar en el repositorio `isa-nailss`, no en EMPRE.IA, SmartStock ni Suldery Nails.
2. Haz una copia de seguridad de lo que ya existe en GitHub antes de reemplazar archivos.
3. Copia los archivos de este ZIP a la carpeta raíz del repositorio elegido: `index.html`, `style.css`, `app.js`, `sw.js`, `manifest.webmanifest`, `icon-192.svg`, `icon-512.svg`, `README.md`.
4. No borres ni reemplaces archivos de otros proyectos.
5. Ejecuta `git status` y revisa los archivos antes de hacer commit.
6. Ejecuta `git add index.html style.css app.js sw.js manifest.webmanifest icon-192.svg icon-512.svg README.md`
7. Ejecuta `git commit -m "Publicar Isa Nails PWA"`
8. Ejecuta `git push origin main`.
9. En GitHub, abre Settings → Pages → Deploy from a branch → `main` → `/(root)`.
10. Espera el despliegue y visita `https://juanvi777.github.io/isa-nailss/`.

## C. Primer acceso de la dueña
1. Pulsa “Ingresar”.
2. Pulsa “Acceso de la dueña”.
3. La primera vez el formulario te llevará a “Crear cuenta”.
4. Usa exactamente `duena@isanails.local`, tu nombre y una contraseña de 6 o más caracteres.
5. Entra con esa cuenta para ver el panel.
6. Configura los días y horas de atención antes de recibir citas.

## D. Prueba de reserva como clienta
1. Cierra la sesión de la dueña.
2. Crea una cuenta de clienta con otro correo.
3. Intenta reservar sin iniciar sesión: el sitio pedirá entrar.
4. Inicia sesión, elige servicio, fecha y hora.
5. Envía la solicitud; aparece como pendiente.
6. Vuelve a iniciar como dueña y confirma la cita.
7. Entra otra vez como clienta para revisar el estado.

## E. Instalar como aplicación
- Android: Chrome → menú ⋮ → Instalar aplicación / Añadir a pantalla principal.
- iPhone: Safari → Compartir → Añadir a pantalla de inicio.
- PC: botón de instalar del navegador.
- La instalación requiere abrir el sitio por HTTPS (o usar localhost al probar).

## F. Copias y recuperación
1. En el panel de la dueña, pulsa “Descargar copia de datos”.
2. Guarda el archivo JSON fuera del navegador.
3. Para restaurarlo, selecciona ese JSON en “Restaurar copia JSON”.
4. Exporta también las citas a CSV cuando lo necesites.

## G. Qué funciona y qué requiere una mejora de servidor
La cuenta y agenda de esta versión se almacenan en el navegador. Si una clienta agenda desde su teléfono, la dueña no verá esa cita automáticamente en otro dispositivo. Para tener citas compartidas de verdad, inicio de sesión seguro, recordatorio garantizado 15 minutos antes y datos sincronizados se necesita un backend con base de datos y un servicio de notificaciones. No anuncies como confirmado un recordatorio que el teléfono puede bloquear.

## H. Aviso de 15 minutos
Cuando la clienta tenga una cita confirmada, Isa Nails puede programar un único aviso del navegador 15 minutos antes si la clienta ha aceptado las notificaciones y la página permanece abierta. Los navegadores y sistemas móviles pueden suspender avisos si se cierra la aplicación; para una notificación garantizada hace falta un servicio de servidor.
