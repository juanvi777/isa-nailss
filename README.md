# Isa Nails — paquete inicial desde cero

Sitio ligero con identidad propia:
- Verde bosque `#182C2B`, marfil `#F5F3ED` y dorado champán `#D5B77C`.
- Tipografías Manrope y Playfair Display.
- Inicio con máximo 2 diseños destacados.
- Catálogo de máximo 40 diseños.
- Registro e inicio de sesión de demostración, reserva de citas, agenda de la dueña, confirmación/cancelación, horario y bloqueo de fechas.
- Exportación de agenda a CSV y diseño adaptable a móvil.

## Cómo probarlo
1. Descomprime el ZIP.
2. Abre `index.html` en Chrome o usa Live Server en VS Code.
3. Para acceder al panel de dueña, pulsa Entrar, elige el formulario de registro de dueña si se ofrece desde el acceso privado del panel. El correo reservado de esta demo es `duena@isanails.local`.

## Importante: límites de esta versión
Esta es una **demo estática**, no un sistema de producción con servidor. Los usuarios, citas, horarios y diseños se guardan en el almacenamiento local del navegador. No se sincronizan entre dispositivos ni con otras clientas, y no hay seguridad real para cuentas de administración. No introduzcas datos sensibles ni publiques contraseñas reales.

Los recordatorios de 15 minutos solo pueden mostrarse como notificación del navegador si el sitio sigue abierto, el navegador lo permite y se concedió permiso. **No se garantiza el recordatorio con el navegador cerrado.** Para recordatorios fiables, inicio de sesión seguro, agenda compartida y carga pública de fotos, hace falta un backend/servicio de base de datos y un proveedor de notificaciones (correo o WhatsApp), que debe configurarse y probarse.

GitHub Pages puede publicar esta versión estática, pero no ejecuta Node.js ni una base de datos. No incluye conexión a MySQL, credenciales ni servicios de pago.
