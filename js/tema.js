/* Aplica el tema guardado antes de pintar (evita el parpadeo). Claro por defecto. */
(function () {
  try { if (localStorage.getItem('club-inicio-tema') === 'dark') document.documentElement.setAttribute('data-theme', 'dark'); } catch (e) {}
})();
