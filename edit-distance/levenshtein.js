var Mapping, levenshtein, levenshteinBt, trackedMin, zero, _ref;

  _ref = require('./util'), Mapping = _ref.Mapping, zero = _ref.zero, trackedMin = _ref.trackedMin;

  levenshtein = function(stringA, stringB, insertCb, removeCb, updateCb) {
    var a, aC, b, bC, dist, distance, i, j, min, track, _i, _j, _k, _l, _ref1, _ref2, _ref3, _ref4;
    a = stringA;
    b = stringB;
    track = zero(a.length + 1, b.length + 1);
    dist = zero(a.length + 1, b.length + 1);
    for (i = _i = 1, _ref1 = a.length; _i <= _ref1; i = _i += 1) {
      dist[i][0] = i;
    }
    for (j = _j = 1, _ref2 = b.length; _j <= _ref2; j = _j += 1) {
      dist[0][j] = j;
    }
    for (i = _k = 1, _ref3 = a.length; _k <= _ref3; i = _k += 1) {
      for (j = _l = 1, _ref4 = b.length; _l <= _ref4; j = _l += 1) {
        aC = a.charAt(i - 1);
        bC = b.charAt(j - 1);
        min = trackedMin(dist[i - 1][j] + removeCb(aC), dist[i][j - 1] + insertCb(bC), dist[i - 1][j - 1] + updateCb(aC, bC));
        track[i][j] = min.index;
        dist[i][j] = min.value;
      }
    }
    distance = dist[a.length][b.length];
    return new Mapping(a, b, distance, track, levenshteinBt);
  };

  levenshteinBt = function(a, b, track) {
    var i, j, mapping;
    i = a.length;
    j = b.length;
    mapping = [];
    while (i > 0 && j > 0) {
      switch (track[i][j]) {
        case 0:
          mapping.push([a[i - 1], null]);
          --i;
          break;
        case 1:
          mapping.push([null, b[j - 1]]);
          --j;
          break;
        case 2:
          mapping.push([a[i - 1], b[j - 1]]);
          --i;
          --j;
          break;
        default:
          throw new Error("Invalid operation " + track[i][j] + " at (" + i + ", " + j + ")");
      }
    }
    if (i === 0 && j !== 0) {
      while (j > 0) {
        mapping.push([null, b[j - 1]]);
        --j;
      }
    }
    if (i !== 0 && j === 0) {
      while (i > 0) {
        mapping.push([a[i - 1], null]);
        --i;
      }
    }
    return mapping;
  };

  module.exports = levenshtein;