'use strict';

(function() {
  function qs(sel) {
    return document.querySelector(sel);
  }

  const objectiveEl = qs('#objective');
  const programEl = qs('#program');
  const outputPreEl = qs('pre');
  const outputEl = qs('#output');
  const resetBtnEl = qs('#reset');
  const runEl = qs('#run');

  function log(s) {
    outputEl.appendChild(document.createTextNode(s));
    outputPreEl.scrollTop = outputPreEl.scrollHeight;
  }
  window.log = log;

  const LEVELS = [
    {
      description: 'put all zeros in the outbox',
      generateLevel: function(level) {
        const ib = nZeros(6).map(() => randomArray([0, 1]));
        const ob = ib.filter((v) => v === 0);
        level.in = ib;
        level.expectedOut = ob;
      },
      onOutbox: function(level) {
        log('TODO');
      },
      successReached: function(level) {
        return level.in.length === 0 && equals(level.out, level.expectedOut);
      },
      leastCommands: 0,
      leastSteps: 0
    }
  ];

  const BASIC_LEVEL = {
    cells: [],
    out: []
  };

  function reset(levelNo) {
    let level = clone(BASIC_LEVEL);
    level = { ...BASIC_LEVEL, ...LEVELS[levelNo] };
    level.generateLevel(level);
    return level;
  }

  let currentLevel = reset(0);
  objectiveEl.innerHTML = currentLevel.description;
  programEl.value = `inbox
jump0 3
jump 0
outbox
jump 0`;

  resetBtnEl.addEventListener('click', (ev) => {
    currentLevel = reset(0);
    outputEl.innerHTML = '';
  });

  runEl.addEventListener('click', (ev) => {
    const program = programEl.value;
    run(currentLevel, program);
  });
})();
