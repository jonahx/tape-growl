#!/usr/bin/env node --harmony --harmony-destructuring

var exec     = require('child_process').exec,
    debounce = require('lodash.debounce'),
    debouncedGrowlAlert = debounce(showGrowlAlert, 50),
    stdin = '';

////////////////////////////////////////////////////////////
// Stdin will contain TAP output from tape-watch, and
// possibly JS syntax/runtime errors.  tape-watch won't
// send an "end" event, so instead we debounce the growl
// alerts, so that we only get 1 for each burst of TAP output
////////////////////////////////////////////////////////////

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  stdin += chunk;
  debouncedGrowlAlert();
})
process.stdin.on('end', debouncedGrowlAlert);

function showGrowlAlert() {
  var growlCmd = growlCommand(extractFailureLines(stdin));
  exec(growlCmd);
  console.log(stdin); // pipe through
  stdin = '';
}

//////////////////////////////////////////
// PARSING AND IMPLEMENTATION DETAIL BELOW
//////////////////////////////////////////

function growlCommand(failureLines) {
  var success  = failureLines.length == 0,
      msg      = success ? 'Success' : growlFormat(failureLines),
      icon     = success ? 'success.png' : 'fail.png',
      iconPath = __dirname + '/icons/' + icon,
      growlCmd = `growlnotify --image ${iconPath} -m ${msg}`;
  return growlCmd;
}

function extractFailureLines(pollutedTap) {
  return [].concat(jsErrorLines(pollutedTap))
           .concat(tapFailureLines(pollutedTap));
}

// bc stderr has been merged with stdout
// we may not have pure TAP output.  
// this will extract syntax or runtime errors
function jsErrorLines(pollutedTap) {
  return pollutedTap.split("\n").filter(x => x.match(jsErrorRegex()));
}

function tapFailureLines(pollutedTap) {
  return pollutedTap
         .split("\n")
         .filter(x => x.match(/^not ok|    at:/))
         .map(x => x.replace(/^not ok \d+/, ''))
         .map(x => x.replace(/^    at:.*\/([^\/]+)\)/, 'at $1'))
}

function jsErrorRegex() { 
  return /^\w+Error:|    at /
}

function pureTap(pollutedTap) {
  return pollutedTap
         .split("\n")
         .filter(x => !x.match(jsErrorRegex()))
         .join("\n");
}

// some funky stuff to make newlines work right in growl
function growlFormat(lines) {
  return lines.map(x => `"${x}"`).join("$'\n'");
}
