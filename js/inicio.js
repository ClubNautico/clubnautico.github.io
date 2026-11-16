/* Portada Club Náutico. Lee window.HUB_CONFIG (js/config.js). Sin dependencias. */
(function () {
  'use strict';

  /* ---- Íconos (24x24, trazo 1.75, mismo estilo) ---- */
  var ICONOS = {
    trofeo: '<path d="M3 21h18"/><rect x="9" y="9" width="6" height="12"/><rect x="3" y="14" width="6" height="7"/><rect x="15" y="16" width="6" height="5"/><path d="M12 2.8l.9 1.9 2.1.3-1.5 1.5.4 2.1-1.9-1-1.9 1 .4-2.1L9 5l2.1-.3z"/>',
    perfil: '<circle cx="12" cy="8" r="3.6"/><path d="M4.8 20.5c0-4 3.2-6.2 7.2-6.2s7.2 2.2 7.2 6.2"/>',
    asistencia: '<path d="M4.5 6.8l1.7 1.7L9 5.5"/><path d="M12.5 7h7"/><path d="M4.5 12.8l1.7 1.7L9 11.5"/><path d="M12.5 13h7"/><path d="M5 19h4"/><path d="M12.5 19h7"/>',
    cronometro: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9"/><path d="M9.5 2.5h5M12 2.5V6"/><path d="M18.6 6l1.4 1.4"/>',
    gota: '<path d="M12 2.8c3.2 4 5.8 6.8 5.8 10a5.8 5.8 0 0 1-11.6 0c0-3.2 2.6-6 5.8-10z"/><path d="M12 11v2.8l1.8 1.2"/>',
    bandera: '<path d="M6 21.5V3"/><path d="M6 4.5h12.5L15 9l3.5 4.5H6"/>'
  };
  var ICONO_GEN = '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M9 8.5h6M9 12h6M9 15.5h3"/>';
  var FLECHA ='<svg class="flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
  var EST = {
    abierta: ['<path d="M5 12.5l4.5 4.5L19 7.5"/>', 'Abierta'],
    cerrada: ['<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5M12 16v.1"/>', 'Cerrada: pide que abran ABRIR TODO en la computadora de la piscina'],
    aviso:   ['<path d="M5 12.5a10 10 0 0 1 14 0M8 15.8a6 6 0 0 1 8 0"/><path d="M12 19v.1"/>', 'Solo en el wifi de la piscina'],
    revisando: ['<circle cx="12" cy="12" r="8" stroke-dasharray="3 4"/>', 'Revisando…']
  };

  var cfg = window.HUB_CONFIG;
  var cont = document.getElementById('secciones');
  var err = document.getElementById('error');
  var ayuda = document.getElementById('ayuda');
  var modoLocal = false;
  var locales = []; // {puerto, el}  (solo en modo local)
  var tarjetasLocales = []; // {a, est, puerto, clic}

  function mostrarError(txt) { err.hidden = false; err.textContent = txt; }

  /* ---- Tema ---- */
  var btn = document.getElementById('tema'), btnTxt = document.getElementById('tema-txt');
  function pintaTema() {
    var osc = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.setAttribute('aria-pressed', osc ? 'true' : 'false');
    btnTxt.textContent = osc ? 'Tema claro' : 'Tema oscuro';
    btn.setAttribute('aria-label', osc ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
  }
  btn.addEventListener('click', function () {
    var osc = document.documentElement.getAttribute('data-theme') === 'dark';
    if (osc) document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', 'dark');
    try { localStorage.setItem('club-inicio-tema', osc ? 'light' : 'dark'); } catch (e) {}
    pintaTema();
  });
  pintaTema();

  /* ---- Escudo: si existe el archivo se usa, si no queda la marca SVG ---- */
  if (cfg && typeof cfg.escudo === 'string' && cfg.escudo.replace(/\s+/g, '')) {
    var im = new Image();
    im.onload = function () {
      var c = document.getElementById('marca'); c.innerHTML = ''; im.alt = ''; c.appendChild(im);
    };
    im.onerror = function () { /* sin escudo: queda la marca dibujada */ };
    im.src = cfg.escudo;
  }

  /* ---- Ayuda (modal con respaldo si <dialog> no existe) ---- */
  function abreAyuda() {
    if (typeof ayuda.showModal === 'function') { try { ayuda.showModal(); return; } catch (e) {} }
    ayuda.setAttribute('open', ''); ayuda.classList.add('manual');
  }
  document.getElementById('ayuda-cerrar').addEventListener('click', function () {
    if (typeof ayuda.close === 'function' && !ayuda.classList.contains('manual')) ayuda.close();
    else { ayuda.removeAttribute('open'); ayuda.classList.remove('manual'); }
  });

  /* ---- Construcción ---- */
  function svg(inner) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + inner + '</svg>'; }
  function estado(el, clave) {
    var e = EST[clave];
    el.className = 'estado ' + clave;
    el.innerHTML = svg(e[0]) + '<span></span>';
    el.lastChild.textContent = e[1];
  }

  /* Solo se aceptan enlaces http(s); cualquier otra cosa devuelve ''. */
  function hrefSeguro(u) {
    try {
      var x = new URL(String(u == null ? '' : u).trim());
      return (x.protocol === 'http:' || x.protocol === 'https:') ? x.href : '';
    } catch (e) { return ''; }
  }

  /* Deja solo protocolo + host (sin ruta, sin puerto, sin barras). '' si no es válida. */
  function normalizaDireccion(txt) {
    var d = String(txt == null ? '' : txt).trim();
    if (!d) return '';
    if (!/^https?:\/\//i.test(d)) d = 'http://' + d;
    try {
      var x = new URL(d);
      if ((x.protocol !== 'http:' && x.protocol !== 'https:') || !x.hostname) return '';
      return x.protocol + '//' + x.hostname;
    } catch (e) { return ''; }
  }

  /* Pone una tarjeta local en modo internet (aviso / explicación / enlace a la piscina). */
  function modoInternet(r) {
    var a = r.a;
    if (r.clic) { a.removeEventListener('click', r.clic); r.clic = null; }
    a.removeAttribute('role');
    r.est.removeAttribute('role');
    estado(r.est, 'aviso');
    var base = normalizaDireccion(cfg.direccionPiscina), href = '';
    if (base) { try { href = new URL(base + ':' + r.puerto + '/').href; } catch (e) { href = ''; } }
    if (href) {
      a.href = href;
    } else {
      a.href = '#como-entrar';
      a.setAttribute('role', 'button');
      r.clic = function (ev) { ev.preventDefault(); abreAyuda(); };
      a.addEventListener('click', r.clic);
    }
  }

  /* Pone una tarjeta local en modo local (enlace al mismo equipo + estado). */
  function modoLocalTarjeta(r) {
    if (r.clic) { r.a.removeEventListener('click', r.clic); r.clic = null; }
    r.a.removeAttribute('role');
    r.a.href = location.protocol + '//' + location.hostname + ':' + r.puerto + '/';
    estado(r.est, 'revisando');
    r.est.setAttribute('role', 'status');
    locales.push({ puerto: r.puerto, el: r.est });
  }

  function tarjeta(p) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.className = 'tarjeta';
    var esLocal = typeof p.local === 'number';
    var icono = Object.prototype.hasOwnProperty.call(ICONOS, p.icono) ? ICONOS[p.icono] : ICONO_GEN;
    a.innerHTML = '<span class="ficha">' + svg(icono) + '</span><span class="cuerpo"><h3></h3><p></p></span>' + FLECHA;
    a.querySelector('h3').textContent = p.titulo;
    a.querySelector('p').textContent = p.descripcion || '';
    li.appendChild(a);
    if (!esLocal) {
      var h = hrefSeguro(p.url);
      if (h) { a.href = h; }
      else {
        a.setAttribute('aria-disabled', 'true');
        var mal = document.createElement('div');
        mal.className = 'estado cerrada';
        mal.textContent = 'Dirección no válida';
        a.querySelector('.cuerpo').appendChild(mal);
      }
      return li;
    }

    var est = document.createElement('div');
    a.querySelector('.cuerpo').appendChild(est);
    var r = { a: a, est: est, puerto: p.local, clic: null };
    if (modoLocal) modoLocalTarjeta(r); else modoInternet(r);
    tarjetasLocales.push(r);
    return li;
  }

  function construye() {
    cont.innerHTML = '';
    locales = []; tarjetasLocales = [];
    cfg.secciones.forEach(function (s, i) {
      try {
        if (!s || !Array.isArray(s.paginas)) return;
        var sec = document.createElement('section');
        sec.className = 'seccion';
        sec.setAttribute('aria-labelledby', 'sec' + i);
        var h = document.createElement('h2'); h.id = 'sec' + i; h.textContent = s.titulo;
        var ul = document.createElement('ul');
        ul.className = 'rejilla' + (s.paginas.length >= 6 ? ' tres' : '');
        s.paginas.forEach(function (p) {
          try { if (p && typeof p === 'object') ul.appendChild(tarjeta(p)); } catch (e) {}
        });
        sec.appendChild(h); sec.appendChild(ul); cont.appendChild(sec);
      } catch (e) {}
    });
  }

  /* ---- Comprobación de servidores locales ---- */
  var previo = {};
  function revisa() {
    if (document.hidden) return;
    locales.forEach(function (l) {
      var ctl = ('AbortController' in window) ? new AbortController() : null;
      var rechaza = null;
      var t = setTimeout(function () { if (ctl) ctl.abort(); else if (rechaza) rechaza(new Error('tiempo')); }, 2500);
      var url = location.protocol + '//' + location.hostname + ':' + l.puerto + '/';
      function poner(clave) { clearTimeout(t); if (previo[l.puerto] !== clave) { previo[l.puerto] = clave; estado(l.el, clave); } }
      try {
        var pf = fetch(url, { mode: 'no-cors', cache: 'no-store', signal: ctl ? ctl.signal : undefined });
        if (!ctl) {
          pf = Promise.race([pf, new Promise(function (ok, no) { rechaza = no; })]);
        }
        pf.then(function () { poner('abierta'); }, function () { poner('cerrada'); });
      }
      catch (e) { poner('cerrada'); }
    });
  }

  var vigilando = false;
  function pasaALocal() {
    if (modoLocal) return;
    modoLocal = true;
    tarjetasLocales.forEach(modoLocalTarjeta);
    if (!vigilando) {
      vigilando = true;
      setInterval(revisa, 8000);
      document.addEventListener('visibilitychange', revisa);
    }
    revisa();
  }

  /* ---- Inicio ---- */
  if (!cfg || !Array.isArray(cfg.secciones)) {
    mostrarError('No se pudo leer la lista de páginas (archivo js/config.js). Avisa a quien administra la página.');
    return;
  }
  construye(); // de inmediato, en modo internet
  try {
    fetch('local.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (j && j.local === true) pasaALocal(); })
      .catch(function () {});
  } catch (e) {}
})();
