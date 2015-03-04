var bar = [];

function Foo() {
  this.hello = 'world';
}

exports.leakTest = function(finish) {
  var count = 0;

  function leak() {
    for (var i=0; i<10000; i++) {
      bar.push(new Foo());
    }
    count += 1;
    if (count < 10000) {
      setTimeout(function() {
        leak();
      },2);
    } else {
      finish();
    }
  }

  setTimeout(function() {
    leak();
  }, 500);
}
