Turbo Test Runner
=================

Turbo is a no fluff, no huff node.js Test Runner. Its guiding principles are as follows:

* it executes each exported function in a test file, there is nothing special about these functions, they are just normal javascript functions that you write in pure node, with a callback that you call when the test is done (no sugar here thanks - do whatever and use whatever you want in your test!) e.g.

```
    exports.test_foo = function(callback) {
      ...
      assert.ok(something);  // use assert if you want

      if(err) callback(err); // or return an error 
      ...
      return callback(); // when you're done, callback as per normal
    }     
```

* fail fast: Turbo bails on the first failed test

* the need for speed, tests are run in parallel by default (there is a '--series' option)

* if you have an exported function called 'setUp' it will be run before the rest of the exported tests in the test file.

* if you have an exported function called 'tearDown' it will be run after all the other exported tests in the test file

* support for 'global' setUp and tearDown via the '--setUp' and '--tearDown' flags. These functions are run before/after all others in the test suite. These can be used to start external services, etc, if needs be.

* code coverage friendly: instead of using code coverage internally, Turbo is built in such a way that code coverage tools (like Istanbul) can be run externally in whatever manner you see fit

* flexible command line arguments, pass in multiple directories and/or multiple files and Turbo will run the lot. This encourages multiple groups of small test suites

* uses the excellent 'rc' module for config loading. This allows incredibly flexible config file options, see: https://npmjs.org/package/rc


Usage
-----

```
$ turbo
turbo.js <test-dir-or-file>*
Available options: 
--series=<true|false>  run tests sequentially, default is false (i.e. run all tests in parallel)
--setUp=<file>         global setUp file (i.e. file containing an exported 'setUp' function)
--tearDown=<file>      global tearDown file (i.e. file contining an exported 'tearDown' function)
--help                 help
```

Examples
--------

Typical usage:

    $ env NODE_PATH=./lib turbo ./test

    $ env NODE_PATH=./lib turbo ./test/test-one.js ./test/test-two.js

    $ env NODE_PATH=./lib turbo ./test/unit-1 ./test/unit-2 

    $ env NODE_PATH=./lib turbo --setUp ./test/globalSetup.js --series=true ./test/accept 

Use with code coverage:

    $ env NODE_PATH=./lib istanbul cover ./turbo.js -- ./test/unit

Multiple code coverages:

    $ env NODE_PATH=./lib istanbul cover --dir cov-unit ./turbo.js -- ./test/unit
    $ env NODE_PATH=./lib istanbul cover --dir cov-accept ./turbo.js -- --series=true ./test/accept
    $ istanbul report   # generates an amalgamated code coverage report

TODO
====

- Turbo needs its own repo (currently lives in DynoFarm)
- pretty output reports, e.g. Tap or similar (currently console.log's an array of results)
- Turbo needs tests of its own (ironically!)
- real examples directory, basic & express usage
- support for node inspector debugging, e.g. turbo --debug <test>
- investigate the use of domains for uncaught exception Asserts
- optionally swallow stdout for quite output
- jenkins integration
- document use from within 'npm test'



