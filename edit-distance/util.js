var Mapping,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports.Mapping = Mapping = (function() {
    function Mapping(_at_a, _at_b, _at_distance, _at_track, _at_backtrackFn) {
      this.a = _at_a;
      this.b = _at_b;
      this.distance = _at_distance;
      this.track = _at_track;
      this.backtrackFn = _at_backtrackFn;
      this.alignment = __bind(this.alignment, this);
      this.pairs = __bind(this.pairs, this);
      this.pairCache = null;
    }

    Mapping.prototype.pairs = function() {
      if (this.pairCache == null) {
        this.pairCache = this.backtrackFn(this.a, this.b, this.track);
      }
      return this.pairCache;
    };

    Mapping.prototype.alignment = function() {
      var alignmentA, alignmentB, pair, pairs, _i, _len, _ref;
      pairs = this.pairs();
      alignmentA = [];
      alignmentB = [];
      _ref = pairs.reverse();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pair = _ref[_i];
        alignmentA.push(pair[0]);
        alignmentB.push(pair[1]);
      }
      return {
        alignmentA: alignmentA,
        alignmentB: alignmentB
      };
    };

    return Mapping;

  })();

  module.exports.zero = function(width, height) {
    var i, j, x, y, _i, _j;
    x = new Array(width);
    for (i = _i = 0; _i < width; i = _i += 1) {
      y = x[i] = new Array(height);
      for (j = _j = 0; _j < height; j = _j += 1) {
        y[j] = 0;
      }
    }
    return x;
  };

  module.exports.trackedMin = function(a, b, c) {
    var min;
    min = {
      value: a,
      index: 0 | 0
    };
    if (b < min.value) {
      min.value = b;
      min.index = 1 | 0;
    }
    if (c < min.value) {
      min.value = c;
      min.index = 2 | 0;
    }
    return min;
  };