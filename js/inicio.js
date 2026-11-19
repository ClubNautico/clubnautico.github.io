/* Portada del Club Náutico: dos entradas. Profesores -> la puerta (dirección en piscina.json). */
(function () {
  'use strict';
  var C = window.CLUB_CONFIG || {};
  var $ = function (id) { return document.getElementById(id); };

  /* ---- tema (oscuro por defecto; la elección se recuerda) ---- */
  function pintaTema() {
    var claro = document.documentElement.getAttribute('data-theme') === 'light';
    $('tema-txt').textContent = claro ? 'Tema oscuro' : 'Tema claro';
    $('tema').setAttribute('aria-label', claro ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro');
  }
  $('tema').addEventListener('click', function () {
    var t = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('club-inicio-tema', t); } catch (e) {}
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', t === 'light' ? '#F3F6FC' : '#060A12');
    pintaTema();
  });
  pintaTema();
  if (C.portal) $('b-portal').href = C.portal;
  if (C.records) $('b-records').href = C.records;

  /* ---- profesores ---- */
  var destino = '';
  var btn = $('b-prof'), est = $('prof-estado'), aviso = $('prof-aviso'), avisoTxt = $('prof-aviso-txt');
  var APAGADA = 'La computadora de la piscina está apagada. Avisa a ' + (C.avisarA || 'Lucio') + '.';

  function estado(clase, txt) { est.className = 'estado ' + clase; est.textContent = txt; }

  function ping() {
    if (!destino) return Promise.resolve(false);
    var ctl = ('AbortController' in window) ? new AbortController() : null;
    var t = setTimeout(function () { if (ctl) ctl.abort(); }, 6000);
    return fetch(destino + 'ping', { cache: 'no-store', signal: ctl ? ctl.signal : undefined })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) { clearTimeout(t); return !!(j && j.club === true); })
      .catch(function () { clearTimeout(t); return false; });
  }

  function direccion() {
    destino = '';
    return fetch('piscina.json?_=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) {
        var u = String((j && j.url) || '').trim().replace(/\/+$/, '');
        if (/^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)*\.trycloudflare\.com$/i.test(u)) destino = u + '/';
      })
      .catch(function () {});
  }

  function revisa() {
    estado('na', 'Revisando la computadora de la piscina…');
    return direccion().then(ping).then(function (ok) {
      if (ok) { estado('ok', '● Computadora de la piscina prendida'); btn.href = destino; }
      else estado('no', '○ Computadora de la piscina apagada');
      return ok;
    });
  }

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    aviso.hidden = true;
    btn.setAttribute('aria-disabled', 'true');
    revisa().then(function (ok) {
      btn.removeAttribute('aria-disabled');
      if (ok) { location.href = destino; return; }
      avisoTxt.textContent = APAGADA;
      aviso.hidden = false;
    });
  });

  revisa();
})();
