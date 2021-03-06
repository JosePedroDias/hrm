'use strict';

function equals(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

function nZeros(n) {
  const arr = new Array(n);
  arr.fill(0);
  return arr;
}

function randomInt(n) {
  return Math.floor(Math.random() * n);
}

function randomArray(arr) {
  const n = arr.length;
  return arr[randomInt(n)];
}

function isNumber(n) {
  return typeof n === 'number';
}

function isInteger(n) {
  if (typeof n !== 'number') {
    return false;
  }
  return n === Math.floor(n);
}

/*
IN  .....* ->
OUT        -> *.....
*/

const MAX_STEPS = 40;

const OPS = {
  inbox: function() {
    if (this.in.length === 0) {
      throw new Error('inbox is empty!');
    }
    this.hand = this.in.pop();
  },
  outbox: function() {
    if (this.hand === undefined) {
      throw new Error('outbox requires hand!');
    }
    this.out.unshift(this.hand);
  },
  copyfrom: function(index) {
    if (!isInteger(index)) {
      throw new Error('copyfrom argument 0 (index) must be an integer!');
    }
    this.hand = this.cells[index];
  },
  copyto: function(index) {
    if (!isInteger(index)) {
      throw new Error('copyto argument 0 (index) must be an integer!');
    }
    this.cells[index] = this.hands;
  },
  jump: function(lineNo) {
    if (!isInteger(lineNo)) {
      throw new Error('jump argument 0 (lineNo) must be an integer!');
    }
    this.lineNo = lineNo - 1;
  },
  jump0: function(lineNo) {
    if (!isInteger(lineNo)) {
      throw new Error('jump0 argument 0 (lineNo) must be an integer!');
    }
    if (this.hand === 0) {
      this.lineNo = lineNo - 1;
    }
  },
  jumpneg: function(lineNo) {
    if (!isInteger(lineNo)) {
      throw new Error('jumpneg argument 0 (lineNo) must be an integer!');
    }
    if (this.hand < 0) {
      this.lineNo = lineNo - 1;
    }
  },
  add: function(index) {
    if (!isInteger(index)) {
      throw new Error('add argument 0 (index) must be an integer!');
    }
    if (!isNumber(this.hand)) {
      throw new Error('hand must have a number!');
    }
    if (!isNumber(this.cells[index])) {
      throw new Error(`cell #${index} must have a number!`);
    }
    this.hand += this.cells[index];
  },
  sub: function(index) {
    if (!isInteger(index)) {
      throw new Error('add argument 0 (index) must be an integer!');
    }
    if (!isNumber(this.hand)) {
      throw new Error('hand must have a number!');
    }
    if (!isNumber(this.cells[index])) {
      throw new Error(`cell #${index} must have a number!`);
    }
    this.hand -= this.cells[index];
  }
};

function step(level, cmdName, arg0) {
  const fn = OPS[cmdName];
  if (!fn) {
    throw new Error(`opcode ${cmdName} is unsupported!`);
  }
  fn.call(level, arg0);
}

function printLevel(level) {
  log(`
  in:    ${JSON.stringify(level.in)}
  cells: ${JSON.stringify(level.cells)}
  out:   ${JSON.stringify(level.out)}
  hand:  ${level.hand !== undefined ? JSON.stringify(level.hand) : ''}
\n`);
}

function* run(level, program) {
  level.lineNo = 0;
  level.steps = 0;

  const commands = program.split('\n').map((l) => {
    const tokens = l.split(' ');
    return tokens.map((t, i) => (i === 0 ? t : parseInt(t, 10)));
  });

  yield level;

  // so it does not run indefinetely
  while (level.steps < MAX_STEPS) {
    const [cmdName, arg0] = commands[level.lineNo];

    try {
      step(level, cmdName, arg0);
    } catch (ex) {
      if (ex) {
        log(`ERROR: ${ex}\n`);
        return level;
      }
    }
    level.steps += 1;
    level.lineNo += 1;

    if (level.successReached(level)) {
      level.completed = true;
      return level;
    }

    yield level;
  }
}
