(function () {
  function applyStylesheet(link) {
    link.media = 'all';
  }
  var links = document.querySelectorAll('link[data-defer-style]');
  links.forEach(function (link) {
    if (link.sheet) {
      applyStylesheet(link);
      return;
    }
    link.addEventListener('load', function onLoad() {
      link.removeEventListener('load', onLoad);
      applyStylesheet(link);
    });
  });
})();
