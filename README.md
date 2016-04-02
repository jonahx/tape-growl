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
      "test": "node --harmony --harmony-destructuring node_modules/tape-watch/bin/tape-watch -o '| bash -c \"tee >(tape-growl)\" | faucet' test/index.js"
    },
    ...

This will turn on growl notifications and give you `faucet`-formatted output to the command line, should you need to see additional output.  Of course, you could replace `| faucet` with ` >&1` for the raw TAP output.  Or you could include neither, and rely solely on the terse growl info.
