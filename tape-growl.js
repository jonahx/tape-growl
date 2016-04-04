#!/usr/bin/env node --harmony --harmony-destructuring
var exec     = require('child_process').exec,
    debounce = require('lodash.debounce'),
    debouncedTap = debounce(notifyTap, 50),
    debouncedError = debounce(notifyError, 50),
    tap = '';
    error = '';


process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  tap += chunk;
  debouncedTap();
})
process.stdin.on('end', debouncedTap);


process.stderr.resume();
process.stderr.setEncoding('utf8');
process.stderr.on('data', chunk => {
  error += chunk;
  debouncedNotifyError();
})

function notifyError() {
  var msg      = error,
      iconPath = __dirname + '/icons/fail.png',
      growlCmd = `growlnotify --image ${iconPath} -m ${msg}`;

  exec(growlCmd);
  error = '';
}

function notifyTap() {
  var failures = failuresFromTap(tap),
      msg      = failures ? failures   : 'Success',
      icon     = failures ? 'fail.png' : 'success.png',
      iconPath = __dirname + '/icons/' + icon,
      growlCmd = `growlnotify --image ${iconPath} -m ${msg}`;

  // console.log('--------------------');
  // console.log(failures);
  exec(growlCmd);
  tap = '';
}

function failuresFromTap(tap) {
  var failures = tap.split("\n")
                    .filter(x => x.match(/^not ok|\w+Error|    at/))
                    .map(x => x.replace(/^not ok \d+/, ''))
                    // .map(x => `"${x}"`)
                    .map(x => `${x}`)
  // return failures.length ? failures.join("$'\n'") : null;
  return failures.length ? failures.join("\n") : null;
}
