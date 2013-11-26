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


Install
-------

To install globally: 

    $ npm install -g turbo-test-runner

Or add to your "devDependencies" in package.json, and use locally: 
   
    $ ./node_modules/.bin/turbo

Usage
-----

```
$ turbo
turbo.js <test-dir-or-file>*
Available options: 
--help                 help
--level=<level>        logging level: fatal, error, warn, info, debug, trace. Default is fatal. Log output goes to stderr.
--series=<true|false>  run tests sequentially, default is false (i.e. run all tests in parallel)
--setUp=<file>         global setUp file (i.e. file containg an exported 'setUp' function)
--tearDown=<file>      global tearDown file (i.e. file containg an exported 'tearDown' function)
--test=<test>          run single test function in a file (only works when one test file used)
--timeout=<seconds>    timeout value for each test function (60 seconds by default)
```

Examples
--------

Typical usage:

    $ env NODE_PATH=./lib turbo ./test

    $ env NODE_PATH=./lib turbo ./test/test-one.js ./test/test-two.js

    $ env NODE_PATH=./lib turbo ./test/unit-1 ./test/unit-2 

    $ env NODE_PATH=./lib turbo --setUp ./test/globalSetup.js --series=true ./test/accept 

    $ env NODE_PATH=./lib turbo --timeout=10 ./test/test-three.js

Use with code coverage:

    $ env NODE_PATH=./lib istanbul cover ./turbo.js -- ./test/unit

Multiple code coverages:

    $ env NODE_PATH=./lib istanbul cover --dir cov-unit ./turbo.js -- ./test/unit
    $ env NODE_PATH=./lib istanbul cover --dir cov-accept ./turbo.js -- --series=true ./test/accept
    $ istanbul report   # generates an amalgamated code coverage report

Logging: turbo uses [Bunyan](https://github.com/trentm/node-bunyan) for internal json logging. This can be handy for both debugging turbo itself, and also gives more insight into what turbo is doing when running your tests. By default, log outtput goes to stderr.

    $ env NODE_PATH=./lib turbo --level=trace ./test 2>/tmp/turbo.log
    $ # then filter the log through a json tool of your choice, eg.
    $ cat /tmp/turbo.log | jq . 

Debugging
---------

You can debug tests with Turbo and your Node.js debugging tool of choice as follows:

- first put 'debug' in the test you wish to debug
- then run Turbo as follows: 

    $ node --debug ./node_modules/.bin/turbo <turbo-args>



