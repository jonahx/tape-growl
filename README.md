# tape-growl

## what is it?

Growl alerts for your node TDD cycle.  

Simple command line tool that turns [TAP output](https://testanything.org/) into growl alerts.

## requirements

Requires:
  * growl
  * growlnotify  

## recommendations

* [tape](https://github.com/substack/tape)
* [tape-watch](https://www.npmjs.com/package/tape-watch)
* Or any tool that produces TAP output

In this workflow, your `npm test` command starts `tape-watch`, which watches your test (and implementation) files, re-running your `tape` tests anytime a file changes.  You'll instantly get a success or failure alert via growl anytime you save.

This way you don't need an extra tmux pane to view your test results, or have to switch from your editor to your terminal and back (unless you want to view specific results).

## how to use

Say your project has a `test` folder, which includes `index.js`, a main entry point that runs all your other test files (such a file is currently required by `tape-watch`).  Then to start your TDD workflow, create a `scripts` entry in your package.json that looks like this:

    ...
    "scripts": {
      "test": "node node_modules/tape-watch/bin/tape-watch test/index.js 2>&1 | tape-growl | tap-spec"
    },
    ...

This will turn on growl notifications and give you `tap-spec`-formatted output to the command line, should you need to see additional output.  Of course, you could remove `| tap-spec` for the raw TAP output.

## additional notes

The `2>&1`, which combines stderr and stdout, is needed, eg, to catch syntax errors which will not be listed as TAP failures, but which you probably want to consider "red" in your TDD flow.

## recommended formatter

`tap-spec` is the recommended formatter, since it handles syntax error output gracefully, displaying it along with the formatted TAP output.  Some other TAP formatters will swallow up errors.
