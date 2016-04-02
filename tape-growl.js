#!/usr/bin/env node --harmony --harmony-destructuring
var exec = require('child_process').exec;

var data = '';

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => notifyGrowl(data));

function notifyGrowl(tap) {
  var failures = failuresFromTap(tap),
      msg      = failures ? failures   : 'Success',
      icon     = failures ? 'fail.png' : 'success.png',
      iconPath = __dirname + '/icons/' + icon,
      growlCmd = `growlnotify --image ${iconPath} -m ${msg}`;

  exec(growlCmd, {shell: '/bin/bash'});
}

function failuresFromTap(tap) {
  var failures = tap.split("\n")
                    .filter(x => x.match(/^not ok/))
                    .map(x => x.replace(/^not ok \d+/, ''))
                    .map(x => `"${x}"`)
  return failures.length ? failures.join("$'\n'") : null;
}
