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

/*
IN  .....* ->
OUT        -> *.....
*/

const MAX_STEPS = 20;

const OPS = {
  inbox: function() {
    this.hand = this.in.pop();
  },
  outbox: function() {
    this.out.unshift(this.hand);
  },
  copyfrom: function(index) {
    this.hand = this.cells[index];
  },
  copyto: function(index) {
    this.cells[index] = this.hands;
  },
  jump: function(lineNo) {
    this.lineNo = lineNo - 1;
  },
  jump0: function(lineNo) {
    if (this.hand === 0) {
      this.lineNo = lineNo - 1;
    }
  },
  jumpneg: function(lineNo) {
    if (this.hand < 0) {
      this.lineNo = lineNo - 1;
    }
  },
  add: function(index) {
    this.hand += this.cells[index];
  },
  sub: function(index) {
    this.hand -= this.cells[index];
  }
};

function step(level, cmdName, arg0) {
  const fn = OPS[cmdName];
  fn.call(level, arg0);
}

function printLevel(level) {
  log(`
  in:    ${JSON.stringify(level.in)}
  cells: ${JSON.stringify(level.cells)}
  out:   ${JSON.stringify(level.out)}
  hand:  ${level.hand !== undefined ? JSON.stringify(level.hand) : ''}
`);
}

function run(level, program) {
  level.lineNo = 0;
  level.steps = 0;

  const commands = program.split('\n').map((l) => {
    const tokens = l.split(' ');
    return tokens.map((t, i) => (i === 0 ? t : parseInt(t, 10)));
  });

  printLevel(level);

  // so it does not run indefinetely
  while (level.steps < MAX_STEPS) {
    const [cmdName, arg0] = commands[level.lineNo];

    try {
      log(
        `<< step no ${level.steps} >>     ${level.lineNo}: ${cmdName} ${
          arg0 !== undefined ? JSON.stringify(arg0) : ''
        }`
      );
      step(level, cmdName, arg0);
    } catch (ex) {
      if (ex) {
        log('command failed! aborting...');
        return;
      }
    }
    level.steps += 1;
    level.lineNo += 1;

    printLevel(level);

    if (level.successReached(level)) {
      log('program completed the objective! all done.');
      return;
    }
  }
}
