(() => {
  'use strict';
  const OWNER_EMAIL = 'duena@isanails.local';
  const DATA_KEY = 'isaNailsData_v3';
  const SESSION_KEY = 'isaNailsSession_v3';
  const $ = id => document.getElementById(id);
  const defaultData = {
    users: [], appointments: [], blocked: [],
    hours: {open:'09:00', close:'18:00', slot:30, weekdays:[1,2,3,4,5,6]},
    services: [
      {id:'s1',name:'Manicure tradicional',price:25000,duration:45},
      {id:'s2',name:'Semipermanente',price:45000,duration:60},
      {id:'s3',name:'Diseño personalizado',price:60000,duration:90}
    ],
    designs: [
      {id:'d1',name:'Elegancia natural',image:'',featured:true,desc:'Tonos suaves y acabado delicado'},
      {id:'d2',name:'Detalles dorados',image:'',featured:true,desc:'Un toque de brillo sutil'},
      {id:'d3',name:'Minimal chic',image:'',featured:false,desc:'Líneas limpias y estilo moderno'},
      {id:'d4',name:'Rosa atemporal',image:'',featured:false,desc:'Un clásico para cualquier ocasión'}
    ]
  };
  let data = loadData();
  let session = loadSession();
  let authMode = 'login';
  let ownerIntent = false;
  let toastTimer = null;

  function clone(v){ return JSON.parse(JSON.stringify(v)); }
  function loadData(){
    try {
      const old = JSON.parse(localStorage.getItem(DATA_KEY));
      if (old && Array.isArray(old.users) && Array.isArray(old.services)) return {...clone(defaultData),...old,hours:{...defaultData.hours,...old.hours}};
      // Migrate the first PWA build's local data if present.
      const prior = JSON.parse(localStorage.getItem('isaNailsData_v2'));
      if (prior && Array.isArray(prior.users)) return {...clone(defaultData),...prior,hours:{...defaultData.hours,...prior.hours}};
    } catch(e) {}
    return clone(defaultData);
  }
  function saveData(){ try {localStorage.setItem(DATA_KEY,JSON.stringify(data));} catch(e){showToast('No se pudieron guardar los datos en este navegador.');} renderAll(); }
  function loadSession(){try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null')}catch(e){return null}}
  function currentUser(){return session && data.users.find(u=>u.id===session.id) || null}
  function isOwner(){const u=currentUser();return !!u && u.email.toLowerCase()===OWNER_EMAIL}
  function uid(){return 'isa-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8)}
  function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function money(v){return '$'+Number(v||0).toLocaleString('es-CO')+' COP'}
  function showToast(message){const el=$('toast');if(!el)return;el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3200)}
  function openAuth(mode='login',owner=false){
    ownerIntent=owner; setAuthMode(mode);
    if(owner){$('authEmail').value=OWNER_EMAIL;$('ownerHelp').classList.remove('hidden');}
    else $('ownerHelp').classList.add('hidden');
    $('authModal').classList.remove('hidden');
    document.body.style.overflow='hidden';
    setTimeout(()=>$(mode==='register'?'authName':'authEmail').focus(),50);
  }
  function closeAuth(){$('authModal').classList.add('hidden');document.body.style.overflow='';$('authMessage').textContent='';}
  function setAuthMode(mode){
    authMode=mode;
    $('loginTab').classList.toggle('active',mode==='login');
    $('registerTab').classList.toggle('active',mode==='register');
    $('authName').classList.toggle('hidden',mode!=='register');
    $('authTitle').textContent=mode==='login'?'Bienvenida':'Crea tu cuenta';
    $('authSubmit').textContent=mode==='login'?'Ingresar':'Crear cuenta';
    $('authPassword').autocomplete=mode==='login'?'current-password':'new-password';
    $('authMessage').textContent=mode==='register'?'Escribe tu nombre y crea una contraseña de al menos 6 caracteres.':'';
    if(ownerIntent)$('authEmail').value=OWNER_EMAIL;
  }
  function submitAuth(e){
    e.preventDefault();
    const email=$('authEmail').value.trim().toLowerCase();
    const password=$('authPassword').value;
    const name=$('authName').value.trim();
    if(!email || !password){$('authMessage').textContent='Completa el correo y la contraseña.';return;}
    if(authMode==='register'){
      if(!name){$('authMessage').textContent='Escribe tu nombre completo.';return;}
      if(password.length<6){$('authMessage').textContent='La contraseña debe tener al menos 6 caracteres.';return;}
      if(data.users.some(u=>u.email.toLowerCase()===email)){$('authMessage').textContent='Ya existe una cuenta con ese correo. Selecciona Ingresar.';return;}
      const user={id:uid(),name,email,password,createdAt:Date.now()};
      data.users.push(user);session={id:user.id};sessionStorage.setItem(SESSION_KEY,JSON.stringify(session));
      saveData();closeAuth();showToast(email===OWNER_EMAIL?'Cuenta de la dueña creada.':'Cuenta creada. ¡Bienvenida a Isa Nails!');return;
    }
    const user=data.users.find(u=>u.email.toLowerCase()===email && u.password===password);
    if(!user){$('authMessage').textContent='Correo o contraseña incorrectos. Si es tu primera vez, selecciona Crear cuenta.';return;}
    session={id:user.id};sessionStorage.setItem(SESSION_KEY,JSON.stringify(session));
    closeAuth();renderAll();showToast('Sesión iniciada correctamente.');
  }
  function dateLocalString(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
  function parseLocalDate(str){const [y,m,d]=str.split('-').map(Number);return new Date(y,m-1,d)}
  function dateAllowed(date){if(!date)return false;const d=parseLocalDate(date);return data.hours.weekdays.includes(d.getDay()) && !data.blocked.some(x=>x.date===date)}
  function slotsFor(date,serviceId){
    if(!dateAllowed(date))return [];
    const service=data.services.find(s=>s.id===serviceId);const duration=Number(service?.duration||30);
    const step=Math.max(15,Number(data.hours.slot)||30);
    const [oh,om]=data.hours.open.split(':').map(Number),[ch,cm]=data.hours.close.split(':').map(Number);
    const start=oh*60+om,end=ch*60+cm,now=new Date(),out=[];
    for(let t=start;t+duration<=end;t+=step){
      const time=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
      if(date===dateLocalString(now)&&t<=now.getHours()*60+now.getMinutes())continue;
      const busy=data.appointments.some(a=>{
        if(a.date!==date||['cancelada','rechazada'].includes(a.status))return false;
        const oldService=data.services.find(s=>s.id===a.serviceId);
        const oldStart=Number((a.time||'00:00').slice(0,2))*60+Number((a.time||'00:00').slice(3,5));
        return t < oldStart+(Number(oldService?.duration)||step) && t+duration>oldStart;
      });
      if(!busy)out.push(time);
    }
    return out;
  }
  function renderDesign(d){return `<article class="design-card"><div class="design-image">${d.image?`<img loading="lazy" src="${esc(d.image)}" alt="${esc(d.name)}" onerror="this.style.display='none'">`:'<span class="design-placeholder">IN</span>'}</div><div class="design-caption"><div><h3>${esc(d.name)}</h3><p>${esc(d.desc||'Diseño de Isa Nails')}</p></div>${d.featured?'<span class="featured-label">Destacado</span>':''}</div></article>`}
  function renderCatalog(){
    const featured=data.designs.filter(d=>d.featured).slice(0,2);
    $('featuredGrid').innerHTML=featured.length?featured.map(renderDesign).join(''):'<p class="empty-state catalog-empty">Pronto encontrarás diseños destacados.</p>';
    $('allCatalog').innerHTML=data.designs.slice(0,40).map(renderDesign).join('');
    $('showCatalog').textContent=$('allCatalog').classList.contains('hidden')?'Explorar catálogo completo':'Ocultar catálogo';
    $('serviceGrid').innerHTML=data.services.map(s=>`<article class="service-card"><h3>${esc(s.name)}</h3><p>Tiempo estimado: ${Number(s.duration)} minutos</p><div class="service-meta"><span>${money(s.price)}</span><span>ISA NAILS</span></div></article>`).join('');
    $('bookService').innerHTML=data.services.map(s=>`<option value="${esc(s.id)}">${esc(s.name)} · ${money(s.price)}</option>`).join('');
    refreshTimes();
  }
  function refreshTimes(){
    const date=$('bookDate').value,service=$('bookService').value,slots=slotsFor(date,service);
    $('bookTime').innerHTML=slots.length?'<option value="">Selecciona una hora</option>'+slots.map(t=>`<option value="${t}">${t}</option>`).join(''):`<option value="">${date?(dateAllowed(date)?'No quedan horas disponibles':'Día no disponible'):'Selecciona una fecha'}</option>`;
  }
  function renderClient(){
    const u=currentUser();
    $('accountBtn').textContent=u?'Mi cuenta':'Ingresar';
    $('mi-cuenta').classList.toggle('hidden',!u||isOwner());
    $('owner').classList.toggle('hidden',!isOwner());
    $('bookingGate').classList.toggle('hidden',!!u);
    $('bookingForm').classList.toggle('hidden',!u);
    if(!u){$('accountContent').innerHTML='';return;}
    if(isOwner()){renderOwner();return;}
    $('accountHeading').textContent='Hola, '+u.name.split(' ')[0];
    const ap=data.appointments.filter(a=>a.userId===u.id).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
    $('accountContent').innerHTML=ap.length?ap.map(a=>`<div class="account-row"><div><strong>${esc(a.serviceName)}</strong><div class="small muted">${esc(a.date)} · ${esc(a.time)}</div><div class="small muted">${esc(a.note||'Sin nota')}</div></div><span class="status ${esc(a.status)}">${esc(a.status)}</span>${['pendiente','confirmada'].includes(a.status)?`<button class="small-btn danger" data-cancel="${a.id}">Cancelar solicitud</button>`:''}</div>`).join(''):'<div class="empty-state">Aún no tienes citas. Elige un servicio y agenda tu primera visita.</div>';
  }
  function renderOwner(){
    const appointments=[...data.appointments].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
    $('ownerAppointments').innerHTML=appointments.length?appointments.map(a=>`<div class="account-row"><div><strong>${esc(a.serviceName)}</strong><div class="small muted">${esc(a.clientName)} · ${esc(a.date)} ${esc(a.time)}</div><div class="small muted">${esc(a.clientEmail)} ${a.note?'· '+esc(a.note):''}</div></div><div><span class="status ${esc(a.status)}">${esc(a.status)}</span><div style="display:flex;gap:5px;margin-top:7px">${a.status==='pendiente'?`<button class="small-btn" data-confirm="${a.id}">Confirmar</button>`:''}${!['cancelada','rechazada'].includes(a.status)?`<button class="small-btn danger" data-reject="${a.id}">Cancelar</button>`:''}</div></div></div>`).join(''):'<div class="empty-state">Todavía no hay solicitudes de citas.</div>';
    $('openTime').value=data.hours.open;$('closeTime').value=data.hours.close;$('slotLength').value=String(data.hours.slot);
    $('weekdayChecks').innerHTML=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].map((d,i)=>`<label><input type="checkbox" value="${i}" ${data.hours.weekdays.includes(i)?'checked':''}>${d}</label>`).join('');
    $('blockedList').innerHTML=data.blocked.map(b=>`<div class="account-row"><span>${esc(b.date)} <small class="muted">${esc(b.reason||'')}</small></span><button class="small-btn" data-unblock="${b.date}">Desbloquear</button></div>`).join('')||'<p class="small muted">No hay fechas bloqueadas.</p>';
    $('ownerServices').innerHTML=data.services.map(s=>`<div class="account-row"><div><strong>${esc(s.name)}</strong><div class="small muted">${money(s.price)} · ${s.duration} min</div></div><button class="small-btn danger" data-delservice="${s.id}">Eliminar</button></div>`).join('');
    $('ownerDesigns').innerHTML=data.designs.map(d=>`<div class="account-row"><div><strong>${esc(d.name)}</strong><div class="small muted">${d.featured?'Destacado':'Catálogo'}</div></div><div><button class="small-btn" data-feature="${d.id}">${d.featured?'Quitar destacado':'Destacar'}</button> <button class="small-btn danger" data-deldesign="${d.id}">Eliminar</button></div></div>`).join('');
  }
  function renderAll(){renderCatalog();renderClient();}
  function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
  function exportCsv(){const rows=[['Cliente','Correo','Servicio','Fecha','Hora','Estado','Nota'],...data.appointments.map(a=>[a.clientName,a.clientEmail,a.serviceName,a.date,a.time,a.status,a.note||''])];const csv=rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(';')).join('\r\n');download(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}),'isa-nails-citas.csv');}
  function init(){
    $('menuBtn').addEventListener('click',()=>{const open=$('nav').classList.toggle('open');$('menuBtn').setAttribute('aria-expanded',String(open));});
    $('nav').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>$('nav').classList.remove('open')));
    $('accountBtn').addEventListener('click',()=>{if(currentUser()){const target=isOwner()?'owner':'mi-cuenta';$(target).scrollIntoView({behavior:'smooth'});}else openAuth('login');});
    $('gateLogin').addEventListener('click',()=>openAuth('login'));
    document.querySelectorAll('[data-go-book]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#agenda').scrollIntoView({behavior:'smooth'});if(!currentUser())openAuth('login');}));
    $('showCatalog').addEventListener('click',()=>{$('allCatalog').classList.toggle('hidden');$('showCatalog').textContent=$('allCatalog').classList.contains('hidden')?'Explorar catálogo completo':'Ocultar catálogo';});
    $('loginTab').addEventListener('click',()=>setAuthMode('login'));$('registerTab').addEventListener('click',()=>setAuthMode('register'));
    $('ownerTab').addEventListener('click',()=>{
      ownerIntent=true;$('authEmail').value=OWNER_EMAIL;
      if(data.users.some(u=>u.email.toLowerCase()===OWNER_EMAIL)){setAuthMode('login');$('ownerHelp').classList.remove('hidden');}
      else {setAuthMode('register');$('ownerHelp').classList.remove('hidden');$('authMessage').textContent='Primera vez: crea la cuenta de la dueña con este correo.';}
    });
    $('authForm').addEventListener('submit',submitAuth);
    document.querySelectorAll('[data-close-auth]').forEach(el=>el.addEventListener('click',closeAuth));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('authModal').classList.contains('hidden'))closeAuth();});
    $('logoutBtn').addEventListener('click',()=>{session=null;sessionStorage.removeItem(SESSION_KEY);renderAll();showToast('Sesión cerrada.');window.scrollTo({top:0,behavior:'smooth'});});
    $('bookDate').min=dateLocalString(new Date());$('bookDate').addEventListener('change',refreshTimes);$('bookService').addEventListener('change',refreshTimes);
    $('bookingForm').addEventListener('submit',e=>{
      e.preventDefault();const u=currentUser();if(!u){openAuth('login');return;}
      const date=$('bookDate').value,time=$('bookTime').value,service=data.services.find(s=>s.id===$('bookService').value);
      if(!service||!date||!time){showToast('Selecciona servicio, fecha y hora.');return;}
      if(!slotsFor(date,service.id).includes(time)){showToast('Esa hora ya no está disponible. Elige otra.');refreshTimes();return;}
      data.appointments.push({id:uid(),userId:u.id,clientName:u.name,clientEmail:u.email,serviceId:service.id,serviceName:service.name,price:service.price,date,time,note:$('bookNote').value.trim(),status:'pendiente',createdAt:Date.now()});
      saveData();$('bookNote').value='';$('bookTime').value='';refreshTimes();showToast('Solicitud enviada. La cita queda pendiente de confirmación.');$('mi-cuenta').scrollIntoView({behavior:'smooth'});
    });
    document.body.addEventListener('click',e=>{
      const t=e.target.closest('[data-cancel],[data-confirm],[data-reject],[data-unblock],[data-delservice],[data-feature],[data-deldesign]');if(!t)return;const a=t.dataset;
      if(a.cancel){const ap=data.appointments.find(x=>x.id===a.cancel);if(ap&&ap.userId===currentUser()?.id&&confirm('¿Cancelar esta solicitud?')){ap.status='cancelada';saveData();showToast('Cita cancelada.');}}
      if(a.confirm||a.reject){if(!isOwner())return;const ap=data.appointments.find(x=>x.id===(a.confirm||a.reject));if(ap){ap.status=a.confirm?'confirmada':'cancelada';saveData();showToast(a.confirm?'Cita confirmada.':'Cita cancelada.');}}
      if(a.unblock){data.blocked=data.blocked.filter(b=>b.date!==a.unblock);saveData();}
      if(a.delservice&&confirm('¿Eliminar este servicio?')){data.services=data.services.filter(s=>s.id!==a.delservice);saveData();}
      if(a.feature){const d=data.designs.find(x=>x.id===a.feature);if(d){if(!d.featured&&data.designs.filter(x=>x.featured).length>=2){showToast('Solo puedes tener 2 diseños destacados.');return;}d.featured=!d.featured;saveData();}}
      if(a.deldesign&&confirm('¿Eliminar este diseño?')){data.designs=data.designs.filter(d=>d.id!==a.deldesign);saveData();}
    });
    $('saveHours').addEventListener('click',()=>{if($('openTime').value>=$('closeTime').value){showToast('La hora de cierre debe ser posterior a la apertura.');return;}const weekdays=[...$('weekdayChecks').querySelectorAll('input:checked')].map(x=>Number(x.value));if(!weekdays.length){showToast('Selecciona al menos un día de atención.');return;}data.hours={open:$('openTime').value,close:$('closeTime').value,slot:Number($('slotLength').value),weekdays};saveData();showToast('Horario actualizado.');});
    $('blockDateBtn').addEventListener('click',()=>{const date=$('blockedDate').value;if(!date){showToast('Selecciona una fecha.');return;}if(data.blocked.some(b=>b.date===date)){showToast('Esa fecha ya está bloqueada.');return;}data.blocked.push({date,reason:$('blockedReason').value.trim()});saveData();$('blockedDate').value='';$('blockedReason').value='';showToast('Fecha bloqueada.');});
    $('addServiceForm').addEventListener('submit',e=>{e.preventDefault();data.services.push({id:uid(),name:$('newServiceName').value.trim(),price:Number($('newServicePrice').value),duration:Number($('newServiceDuration').value)});saveData();e.target.reset();$('newServiceDuration').value=60;showToast('Servicio añadido.');});
    $('addDesignForm').addEventListener('submit',e=>{e.preventDefault();if(data.designs.length>=40){showToast('El catálogo admite máximo 40 diseños.');return;}const featured=$('newDesignFeatured').checked;if(featured&&data.designs.filter(d=>d.featured).length>=2){showToast('Ya hay 2 diseños destacados.');return;}data.designs.push({id:uid(),name:$('newDesignName').value.trim(),image:$('newDesignImage').value.trim(),featured,desc:'Diseño de Isa Nails'});saveData();e.target.reset();showToast('Diseño añadido.');});
    $('exportCsv').addEventListener('click',exportCsv);
    $('exportBackup').addEventListener('click',()=>download(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),'isa-nails-copia.json'));
    $('restoreBackup').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{const b=JSON.parse(await file.text());if(!Array.isArray(b.users)||!Array.isArray(b.appointments)||!Array.isArray(b.services)||!Array.isArray(b.designs))throw Error('invalid');if(confirm('¿Reemplazar los datos actuales con esta copia?')){data={...clone(defaultData),...b};saveData();showToast('Copia restaurada.');}}catch(err){showToast('El archivo no es una copia válida de Isa Nails.');}e.target.value='';});
    if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(err=>console.warn('No se pudo registrar el Service Worker',err));
    renderAll();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();