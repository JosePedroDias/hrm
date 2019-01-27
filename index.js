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
  const stepEl = qs('#step');
  const runEl = qs('#run');
  const speedEl = qs('#speed');

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

  programEl.value = `inbox
jump0 3
jump 0
outbox
jump 0`;

  let currentLevel = reset(0);
  objectiveEl.innerHTML = currentLevel.description;
  let execution;

  function onStep(level, lastCall) {
    printLevel(level);

    !lastCall &&
      log(
        `<< step #${level.steps} >> next line is #${level.lineNo}: ${
          programEl.value.split('\n')[level.lineNo]
        }\n`
      );

    lastCall && log('program halted.');

    level.completed && log('\nobjective completed.');
  }

  let timer;

  function killTimer() {
    if (!timer) {
      return;
    }
    clearInterval(timer);
    stepEl.removeAttribute('disabled');
    runEl.removeAttribute('disabled');
    timer = undefined;
  }

  resetBtnEl.addEventListener('click', (ev) => {
    killTimer();
    currentLevel = reset(0);
    outputEl.innerHTML = '';
    execution = undefined;
  });

  stepEl.addEventListener('click', (ev) => {
    if (!execution) {
      execution = run(currentLevel, programEl.value);
    }
    killTimer();
    const { value, done } = execution.next();
    onStep(value, done);
  });

  runEl.addEventListener('click', (ev) => {
    execution = run(currentLevel, programEl.value);

    stepEl.setAttribute('disabled', '');
    runEl.setAttribute('disabled', '');

    const STEP_MS = parseInt(speedEl.value, 10);

    function eachTime() {
      const { value, done } = execution.next();
      onStep(value, done);
      if (done) {
        execution = undefined;
        killTimer();
      }
    }

    timer = setInterval(eachTime, STEP_MS);
  });
})();
