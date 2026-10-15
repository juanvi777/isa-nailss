$ErrorActionPreference = 'Stop'

# Ejecutar desde la carpeta raíz del repositorio isa-nailss.
$repoRoot = (Get-Location).Path
if (-not (Test-Path (Join-Path $repoRoot 'package.json')) -or -not (Test-Path (Join-Path $repoRoot 'public/style.css'))) {
  throw 'No encuentro package.json y public/style.css. Abre PowerShell dentro de la carpeta raíz de isa-nailss y vuelve a ejecutar este script.'
}

$public = Join-Path $repoRoot 'public'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
function Read-Utf8($path) { return [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8) }
function Write-Utf8($path, $content) { [System.IO.File]::WriteAllText($path, $content, $utf8NoBom) }
function Replace-Text($path, $pairs) {
  if (-not (Test-Path $path)) { return }
  $text = Read-Utf8 $path
  foreach ($pair in $pairs) { $text = $text.Replace($pair[0], $pair[1]) }
  Write-Utf8 $path $text
}

$commonPairs = @(
  @('Suldery Nails', 'Isa Nails'),
  @('Suldery', 'Isa'),
  @('suldery-nails', 'isa-nails'),
  @('SULDERY NAILS', 'ISA NAILS'),
  @('suldery_token', 'isa_nails_token'),
  @('suldery_user', 'isa_nails_user'),
  @('suldery_theme', 'isa_nails_theme'),
  @('/style.css?v=2032', '/style.css?v=isa-1')
)
foreach ($file in @('index.html','registro.html','cliente.html','duena.html','login.js','registro.js','cliente.js','duena.js')) {
  Replace-Text (Join-Path $public $file) $commonPairs
}

# Remove all references to Suldery's logo, then use text/monogram branding for Isa.
foreach ($file in @('index.html','registro.html','cliente.html','duena.html')) {
  $path = Join-Path $public $file
  $text = Read-Utf8 $path
  $text = [regex]::Replace($text, '<img\s+src="/assets/suldery-nails-logo\.jpeg"\s+alt="[^"]*"\s*/?>', '')
  $text = [regex]::Replace($text, '<link rel="apple-touch-icon" href="/assets/suldery-nails-icon-180\.png">\s*', '')
  # Substitute typefaces: the interface uses Manrope, paired with Playfair Display for editorial headings.
  $text = $text.Replace('family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700','family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700')
  $text = $text.Replace('family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700','family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700')
  # Clear the old business-specific biography/contact content. Do not invent Isa's WhatsApp number.
  $text = $text.Replace('Un rincón tierno para consentirte, elegir tu diseño y salir feliz con unas uñas hechas con amor.','Un espacio para expresar tu estilo. Explora diseños, encuentra tu próxima cita y deja el resto en nuestras manos.')
  $text = $text.Replace('Hola, soy Isa. Llevo 17 años dedicando mi corazón a esta hermosa profesión y creando uñas que cuentan tu estilo.','Diseños cuidados, atención cercana y una agenda sencilla para reservar con tranquilidad.')
  $text = $text.Replace('17 años de experiencia','Un momento solo para ti')
  $text = $text.Replace('Conoce nuestros diseños y, cuando estés lista, presiona el botón para comenzar tu reserva paso a paso.','Explora los diseños del estudio y, cuando encuentres tu momento, agenda tu cita paso a paso.')
  $text = $text.Replace('Tu próximo momento de<br><em>brillo</em> comienza aquí.','Una pausa para ti.<br><em>Un estilo propio.</em>')
  $text = $text.Replace('Tu agenda, bajo<br><em>control.</em>','Tu estudio.<br><em>Tu ritmo.</em>')
  $text = $text.Replace('Fotos de tus diseños','Diseños del estudio')
  $text = $text.Replace('Diseños hechos con amor','Encuentra tu próxima inspiración')
  $text = $text.Replace('Uñas hechas con amor ♡','Diseño · Cuidado · Estilo')
  $text = $text.Replace('Instalar Suldery Nails','Instalar Isa Nails')
  $text = $text.Replace('href="https://wa.me/573106319093" target="_blank" rel="noopener">310 631 9093</a>','href="#">contacto por confirmar</a>')
  Write-Utf8 $path $text
}

# Keep independent browser settings; clear inherited sessions once, then use Isa-specific keys.
$authPath = Join-Path $public 'auth.js'
$auth = Read-Utf8 $authPath
$auth = $auth.Replace('suldery_token','isa_nails_token').Replace('suldery_user','isa_nails_user').Replace('suldery_theme','isa_nails_theme')
$auth = $auth.Replace('Instalar Suldery Nails','Instalar Isa Nails')
Write-Utf8 $authPath $auth

# Replace the original brand stylesheet's palette/typography with a distinct dark-green, ivory and champagne-gold art direction.
$cssPath = Join-Path $public 'style.css'
$css = Read-Utf8 $cssPath
$isaCss = @'

/* ISA NAILS — identidad visual independiente */
:root{--rose:#b6a06a;--rose-dark:#8c7747;--rose-soft:#e8dfc8;--rose-pale:#f2eee3;--blush:#f5f3ed;--wine:#182c2b;--ink:#263a37;--muted:#6f7c75;--line:#dedfd6;--white:#fffefa;--green:#3f7a5e;--red:#bc4b4b;--shadow:0 24px 60px rgba(24,44,43,.11);--shadow-soft:0 12px 30px rgba(24,44,43,.08);--radius:18px}
body,.dashboard-page{font-family:'Manrope','DM Sans',sans-serif;background:#f5f3ed;color:#263a37}
.brand-panel{background:#182c2b;color:#f5f3ed}
.brand-panel:before{background:linear-gradient(135deg,transparent 0 44%,#d5b77c 44.1% 44.3%,transparent 44.4% 60%,#d5b77c 60.1% 60.3%,transparent 60.4%),radial-gradient(ellipse at 10% 90%,#56736b,transparent 60%);opacity:.22}
.brand-panel h1,.hero-dashboard h1{font-family:'Playfair Display',Georgia,serif;color:#f5f3ed;letter-spacing:-.045em}
.brand-panel h1 em,.hero-dashboard h1 em{color:#d5b77c}
.brand-copy{color:#c3cec7}.editorial-kicker{margin:2rem 0 .5rem;color:#d5b77c;font-size:.7rem;font-weight:800;letter-spacing:.24em}
.brand-pill{border:1px solid rgba(213,183,124,.45);border-radius:3px;background:rgba(255,255,255,.045);color:#e7d7b1;letter-spacing:.15em}
.experience-cloud{border:1px solid rgba(213,183,124,.28);border-radius:4px;background:rgba(245,243,237,.06);box-shadow:none}.experience-cloud strong{color:#f5f3ed}.experience-cloud p{color:#bbc8c0}.cloud-sparkle{border-radius:4px;background:transparent;border:1px solid #7f754f;color:#d5b77c;box-shadow:none}
.brand-features{gap:.8rem}.feature-chip{border-radius:0;border:0;border-top:1px solid rgba(213,183,124,.27);background:transparent;box-shadow:none;color:#f5f3ed}.feature-chip>span{border-radius:0;background:transparent;color:#d5b77c;font-family:Georgia,serif}.feature-chip small{color:#bbc8c0}
.form-panel{background:#f5f3ed}.form-card{border-radius:2px;border:1px solid #dedfd6;background:#fffefa;box-shadow:0 24px 60px rgba(24,44,43,.11)}.form-card h2,.card-heading h2,.portfolio-heading h2{font-family:'Playfair Display',Georgia,serif;color:#182c2b}
.eyebrow{color:#8c7747;letter-spacing:.18em}.isa-monogram{display:flex;align-items:center;justify-content:center;gap:.12rem;width:76px;height:76px;margin-bottom:1.8rem;border:1px solid #d5b77c;border-radius:50%;color:#182c2b;font:600 2.2rem Georgia,serif;letter-spacing:-.1em}.isa-monogram span{color:#b6a06a;font-style:italic;transform:translateY(5px)}
input,select{border-radius:7px;border-color:#dedfd6;background:#fffefa}input:focus,select:focus{border-color:#b6a06a;box-shadow:0 0 0 3px rgba(182,160,106,.14)}.primary-button{border-radius:7px;border:1px solid #182c2b;background:#182c2b;color:#f5f3ed;box-shadow:0 10px 22px rgba(24,44,43,.15);letter-spacing:.015em}.primary-button:hover:not(:disabled){background:#274642;box-shadow:0 14px 26px rgba(24,44,43,.2)}.secondary-button,.theme-toggle{border-radius:7px}.link-button{color:#8c7747}.install-app-button{border-color:#b6a06a;border-radius:7px;background:#f2eee3;color:#182c2b}
.dashboard-shell{max-width:1200px}.glass-card,.stat-card,.admin-card,.booking-card,.appointments-card{border-radius:4px;border-color:#dedfd6;background:#fffefa;box-shadow:0 12px 30px rgba(24,44,43,.06)}.dashboard-header{border-radius:4px}.logo{font-family:'Playfair Display',Georgia,serif;color:#182c2b}.logo span{font:600 1.3rem 'Playfair Display',Georgia,serif;letter-spacing:.04em}.logo em{color:#a58d55}.logo img,.floating-logo-card img{display:none}.floating-logo-card,.owner-mini-card{border:1px solid #b6a06a;border-radius:0;background:#182c2b;color:#f5f3ed;box-shadow:none}.floating-logo-card span{font:italic 1.1rem Georgia,serif;color:#d5b77c}
.stats-grid{gap:.8rem}.stat-card{border-radius:3px}.stat-card>span{color:#8c7747;letter-spacing:.16em}.stat-card strong{color:#182c2b;font-family:'Playfair Display',Georgia,serif}.admin-card{border-radius:4px}.flower{color:#a58d55}.calendar-card{border-radius:2px;border-color:#dedfd6;background:#fffefa}.calendar-brand-logo{display:none}.calendar-brand-copy strong{font:600 1.5rem 'Playfair Display',Georgia,serif;color:#182c2b}.calendar-theme-mark{color:#b6a06a}.calendar-title h3{font-family:'Playfair Display',Georgia,serif;color:#182c2b}.month-button{border-radius:0;border-color:#dedfd6;color:#182c2b}.calendar-day{border-radius:2px;background:#f2eee3}.calendar-day.selected,.time-slot.selected{background:#182c2b;color:#f5f3ed}.calendar-day.today{border-color:#b6a06a}.time-slot{border-radius:3px}.booking-summary h3{font-family:'Playfair Display',Georgia,serif}.summary-grid{background:#f5f3ed}.carousel-frame{border-radius:3px}.carousel-arrow{border-radius:3px;background:#182c2b}.carousel-dot.active{background:#a58d55}
.dark-mode{background:#111c1b!important;color:#eae9e0!important}.dark-mode .form-panel,.dark-mode.dashboard-page{background:#111c1b!important}.dark-mode .form-card,.dark-mode .glass-card,.dark-mode .stat-card,.dark-mode .admin-card,.dark-mode .booking-card,.dark-mode .appointments-card{background:#1c2927;border-color:#35433f;color:#eae9e0}.dark-mode .form-card h2,.dark-mode .card-heading h2,.dark-mode .portfolio-heading h2,.dark-mode .logo,.dark-mode .field-label,.dark-mode .calendar-title h3{color:#f5f3ed}.dark-mode input,.dark-mode select,.dark-mode .calendar-card,.dark-mode .summary-grid,.dark-mode .schedule-day{background:#182321;color:#eae9e0;border-color:#3a4943}.dark-mode .manager-note,.dark-mode .form-intro,.dark-mode .portfolio-heading p,.dark-mode .user-menu,.dark-mode .card-copy{color:#b4c0b7}.dark-mode .secondary-button,.dark-mode .theme-toggle{background:#182321;border-color:#3a4943;color:#eae9e0}.dark-mode .calendar-day{background:#293632;color:#eae9e0}.dark-mode .calendar-day:disabled{background:#342627;color:#bf9999}.dark-mode .calendar-day.selected,.dark-mode .time-slot.selected{background:#d5b77c;color:#182c2b}.dark-mode .time-slot{background:#182321;color:#eae9e0;border-color:#3a4943}.dark-mode .admin-list>*,.dark-mode .appointments-list>*,.dark-mode .blocked-dates-list>*{background:#182321;border-color:#3a4943}
@media(max-width:900px){.auth-shell,.auth-shell-reverse{grid-template-columns:1fr}.brand-panel{padding:2rem 1.4rem}.brand-panel-inner{max-width:720px;margin:auto}.brand-panel h1{font-size:clamp(3rem,12vw,5rem)}.form-panel{padding:1.2rem}.form-card{max-width:600px}.booking-layout{grid-template-columns:1fr}.hero-dashboard{align-items:flex-start;flex-direction:column}.floating-logo-card{width:100%}.owner-grid{grid-template-columns:1fr}}
@media(max-width:600px){.dashboard-shell{width:min(100% - 1rem,1200px)}.dashboard-header{align-items:flex-start}.user-menu{width:100%}.stats-grid{gap:.5rem}.stat-card{padding:.8rem}.stat-card strong{font-size:1.8rem}.stat-card small{font-size:.67rem}.schedule-grid,.blocked-date-form,.owner-booking-form{grid-template-columns:1fr}.owner-gallery,.photo-gallery{grid-template-columns:repeat(2,minmax(0,1fr))}.portfolio-heading{align-items:flex-start;flex-direction:column;gap:.2rem}.calendar-card{padding:.7rem}.calendar-weekdays,.calendar-days{gap:.2rem}.calendar-day{min-height:2.1rem;padding:.15rem;font-size:.78rem}.calendar-theme-mark{display:none}.calendar-brand-copy strong{font-size:1.2rem}.calendar-legend{font-size:.62rem}.user-menu>.secondary-button{margin-left:auto}.form-card{padding:1.3rem}.brand-features{gap:.65rem}.feature-chip{padding:.8rem 0}.experience-cloud{padding:1rem}.time-header{align-items:flex-start;flex-direction:column;gap:.4rem}}
'@
$css = $css + $isaCss
Write-Utf8 $cssPath $css

# New PWA icons so the installed app is not branded as Suldery Nails.
$assets = Join-Path $public 'assets'
New-Item -ItemType Directory -Force -Path $assets | Out-Null
$icon192 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" rx="42" fill="#182c2b"/><circle cx="96" cy="96" r="72" fill="none" stroke="#d5b77c" stroke-width="2"/><text x="70" y="117" font-family="Georgia,serif" font-size="74" fill="#f5f3ed">I</text><text x="104" y="117" font-family="Georgia,serif" font-size="56" font-style="italic" fill="#d5b77c">N</text><path d="M56 137h80" stroke="#d5b77c" stroke-width="2"/></svg>'
$icon512 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="110" fill="#182c2b"/><circle cx="256" cy="256" r="194" fill="none" stroke="#d5b77c" stroke-width="5"/><text x="184" y="312" font-family="Georgia,serif" font-size="198" fill="#f5f3ed">I</text><text x="279" y="312" font-family="Georgia,serif" font-size="150" font-style="italic" fill="#d5b77c">N</text><path d="M150 366h212" stroke="#d5b77c" stroke-width="5"/></svg>'
Write-Utf8 (Join-Path $assets 'isa-nails-icon-192.svg') $icon192
Write-Utf8 (Join-Path $assets 'isa-nails-icon-512.svg') $icon512

$manifest = @'
{
  "name": "Isa Nails",
  "short_name": "Isa Nails",
  "description": "Agenda y reservas del estudio Isa Nails.",
  "lang": "es-CO",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#f5f3ed",
  "theme_color": "#182c2b",
  "icons": [
    {"src":"/assets/isa-nails-icon-192.svg","sizes":"192x192","type":"image/svg+xml","purpose":"any maskable"},
    {"src":"/assets/isa-nails-icon-512.svg","sizes":"512x512","type":"image/svg+xml","purpose":"any maskable"}
  ],
  "shortcuts": [{"name":"Agendar cita","short_name":"Agendar","url":"/cliente.html#agenda"}]
}
'@
Write-Utf8 (Join-Path $public 'manifest.webmanifest') $manifest
$sw = @'
const CACHE_NAME='isa-nails-shell-v1';
const APP_SHELL=['/','/index.html','/registro.html','/cliente.html','/duena.html','/style.css?v=isa-1','/auth.js','/login.js','/registro.js','/cliente.js','/duena.js','/assets/isa-nails-icon-192.svg','/assets/isa-nails-icon-512.svg','/manifest.webmanifest'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{const request=event.request;if(request.method!=='GET')return;const url=new URL(request.url);if(url.origin!==self.location.origin||url.pathname.startsWith('/api/')||url.pathname.startsWith('/uploads/'))return;event.respondWith(caches.match(request).then(cached=>{const network=fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));}return response;}).catch(()=>cached);return cached||network;}));});
'@
Write-Utf8 (Join-Path $public 'sw.js') $sw

# Project label/documentation.
Replace-Text (Join-Path $repoRoot 'package.json') @(@('"name": "suldery-nails-mysql"','"name": "isa-nails"'),@('"version": "1.6.0"','"version": "1.0.0"'))
$readme = @'
ISA NAILS — AGENDA DIGITAL
VERSIÓN VISUAL 1.0

Proyecto de agenda para estudio de uñas con identidad independiente. No incorpora funciones de inteligencia artificial.

Funciones que se conservan del código actual:
- Registro e inicio de sesión de clientas.
- Aprobación de cuentas por la dueña.
- Calendario y reserva por pasos (día, hora, servicio y confirmación).
- Duración de servicios y validación de disponibilidad.
- Administración de citas, horarios semanales y fechas bloqueadas.
- Galería de fotografías.
- Tema claro/oscuro y PWA instalable.

Nueva identidad:
- Verde profundo, marfil y dorado champán.
- Manrope para interfaz y Playfair Display para titulares.
- Monograma inicial IN; nuevo manifest e iconos PWA.

Antes de publicar:
1. Confirma los servicios, precios, horarios y el WhatsApp real de Isa.
2. Comprueba las variables del .env y la base de datos MySQL de Isa Nails; no reutilices credenciales de otro negocio.
3. Ejecuta npm install y npm start, y prueba registro, acceso de dueña, reservas y subida de fotos.
4. Verifica el sitio en móvil y escritorio. Este paquete modifica los archivos locales; no despliega automáticamente a Railway.

Nunca subas el archivo .env ni claves al repositorio.
'@
Write-Utf8 (Join-Path $repoRoot 'README_ACTUALIZAR.txt') $readme

Write-Host 'Isa Nails actualizado localmente.' -ForegroundColor Green
Write-Host 'Se conservaron los archivos de backend, API y esquema SQL.'
Write-Host 'Siguiente: revisar git diff; ejecutar pruebas; luego hacer commit y push.'
