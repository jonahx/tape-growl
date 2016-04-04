#!/usr/bin/env node --harmony --harmony-destructuring
var data = '';

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  data += chunk;
  doStuff();
})
//process.stdin.on('end', () => doStuff());

function doStuff() {
  console.log('--------------------');
  console.log(data);
}
