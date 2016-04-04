#!/usr/bin/env node --harmony --harmony-destructuring
var exec     = require('child_process').exec,
    debounce = require('lodash.debounce'),
    debouncedNotifyGrowl = debounce(notifyGrowl, 50),
    data = '';


process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  data += chunk;
  debouncedNotifyGrowl();
})
process.stdin.on('end', debouncedNotifyGrowl);

function notifyGrowl() {
  tap = data;
  var failures = failuresFromTap(tap),
      msg      = failures ? failures   : 'Success',
      icon     = failures ? 'fail.png' : 'success.png',
      iconPath = __dirname + '/icons/' + icon,
      growlCmd = `growlnotify --image ${iconPath} -m ${msg}`;

  // console.log('--------------------');
  // console.log(failures);
  exec(growlCmd);
  data = '';
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
