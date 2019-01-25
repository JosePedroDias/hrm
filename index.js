function qs(sel) {
  return document.querySelector(sel);
}

const outputEl = qs('#output');
const programEl = qs('#program');
const resetBtnEl = qs('#reset');
const runEl = qs('#run');

function _log(s) {
  console.log(s);
}

function log(s) {
  output.appendChild(document.createTextNode(s));
}

const level = {
  in: [2, 4, 8],
  cells: [],
  out: [],
  successReached: function(level) {
    return naiveEquals(level.out, [2, 4, 8]);
  }
};

resetBtnEl.addEventListener('click', (ev) => {
  // TODO
});

runEl.addEventListener('click', (ev) => {
  const program = programEl.value;
  console.log(program);
  run(level, program);
});

/*
const program = `inbox
outbox
jump 0`;
run(level, program);
*/
