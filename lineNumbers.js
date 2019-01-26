'use strict';

(function() {
  const linesEl = document.getElementById('lines');
  const sourceEl = document.getElementById('program');

  function syncTA() {
    linesEl.scrollTop = sourceEl.scrollTop;
  }
  window.syncTA = syncTA;

  // populate TA:
  let text = '';
  for (let i = 0; i < 100; ++i) {
    text += (i < 10 ? ' ' : '') + i + '\r\n';
  }
  linesEl.value = text;
})();
