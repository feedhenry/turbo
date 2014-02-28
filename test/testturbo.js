#!/usr/bin/env node
var assert = require('assert');
var util = require('util');
var proxyquire = require('proxyquire');

// Basic tests - purposely doesn't use turbo itself as a test runner..

function testHappy(cb) {
  var mock_rc = function(name, opts) {
    return {
      _ : ['./test/testfiles/test-one.js']
    };
  };

  var turbo = proxyquire('../turbo.js', {'rc': mock_rc});
  turbo.go(function(err, results){
    if(err) return cb(err);
    assert.ok(results);
    cb();
  });
};

function testDir(cb) {
  var mock_rc = function(name, opts) {
    return {
      _ : ['./test/testfiles']
    };
  };

  var turbo = proxyquire('../turbo.js', {'rc': mock_rc});
  turbo.go(function(err, results){
    if (err) return cb(err);
    assert.ok(results);
    cb();
  });
};

function testSingleTest(cb) {
  var mock_rc = function(name, opts) {
    return {
      _ : ['./test/testfiles/test-one.js'],
      test: 'second_test'
    };
  };

  var turbo = proxyquire('../turbo.js', {'rc': mock_rc});
  turbo.go(function(err, results){
    if(err) return cb(err);
    assert.ok(results);
    cb();
  });
};


function testGlobalSetupTeardown(cb) {
  var mock_rc = function(name, opts) {
    return {
      _ : ['./test/testfiles/test-one.js'],
      setUp: './test/testfiles/setupTeardown.js',
      tearDown: './test/testfiles/setupTeardown.js'
    };
  };

  var turbo = proxyquire('../turbo.js', {'rc': mock_rc});
  turbo.go(function(err, results){
    if (err) return cb(err);
    assert.ok(results);
    cb();
  });
};

// tests usage functions..
function testUsage(cb) {
  var realExit = process.exit;
  var gotExit = false;
  process.exit = function() {
    gotExit = true;
  }

  var realLog = console.log;
  console.log = function(log) {};

  var mock_rc = function(name, opts) {
    return {
      _ : []
    };
  };

  var turbo = proxyquire('../turbo.js', {'rc': mock_rc});
  turbo.go(function(err, results){
    process.exit = realExit;
    console.log =realLog;
    if (err) return cb(err);
    assert.ok(gotExit, 'Expected process.exit to be called');
    return cb();
  });
};

// test help
function testHelp(cb) {
  var realExit = process.exit;
  var gotExit = false;
  process.exit = function() {
    gotExit = true;
  }

  var realLog = console.log;
  console.log = function(log) {};

  var mock_rc = function(name, opts) {
    return {
      _ : [],
      help: true
    };
  };

  var turbo = proxyquire('../turbo.js', {'rc': mock_rc});
  turbo.go(function(err, results){
    process.exit = realExit;
    console.log =realLog;
    if (err) return cb(err);
    assert.ok(gotExit, 'Expected process.exit to be called');
    return cb();
  });
};

function testReturnError(cb) {
  var realErr = console.error;
  console.error = function(msg) {
  };

  var realTrace = console.trace;
  console.trace = function() {};

  var mock_rc = function(name, opts) {
    return {
      _ : ['./test/testfiles/badtest/test-bad.js'],
      'tearDown': 'i-dont-exit.js'
    };
  };

  var turbo = proxyquire('../turbo.js', {'rc': mock_rc});
  turbo.go(function(err, results){
    console.error = realErr;
    console.trace = realTrace;
    assert.ok(err, 'Expected an error here!');
    return cb();
  });
};

testHappy(function(err) {
  assert.ok(!err);
  testDir(function(err) {
    assert.ok(!err);
    testGlobalSetupTeardown(function(err) {
      assert.ok(!err);
      testSingleTest(function(err) {
        assert.ok(!err);
        testUsage(function(err) {
          assert.ok(!err);
          testHelp(function(err) {
            assert.ok(!err);
            testReturnError(function(err) {
              assert.ok(!err);
              console.log("All done..");
            });
          });
        });
      });
    });
  });
});
