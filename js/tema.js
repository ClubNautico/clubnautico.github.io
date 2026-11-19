/* Aplica el tema guardado antes de pintar. Oscuro por defecto (DISEÑO CLUB.md). */
(function () {
  var t = 'dark';
  try { if (localStorage.getItem('club-inicio-tema') === 'light') t = 'light'; } catch (e) {}
  document.documentElement.setAttribute('data-theme', t);
  var m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute('content', t === 'light' ? '#F3F6FC' : '#060A12');
})();
