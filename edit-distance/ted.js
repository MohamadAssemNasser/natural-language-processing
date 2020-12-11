var Mapping, postOrderWalk, ted, tedBt, trackedMin, zero, _ref;

  _ref = require('./util'), Mapping = _ref.Mapping, zero = _ref.zero, trackedMin = _ref.trackedMin;

  postOrderWalk = function(root, childrenCb, visitCb) {
    var child, children, firstChild, index, node, stack1, stack2, _i, _len, _ref1, _ref2, _ref3, _ref4;
    stack1 = [];
    stack2 = [];
    stack1.push([void 0, root]);
    while (stack1.length > 0) {
      _ref1 = stack1.pop(), index = _ref1[0], node = _ref1[1];
      children = childrenCb(node);
      firstChild = (_ref2 = children != null ? children[0] : void 0) != null ? _ref2 : null;
      stack2.push([index, node, firstChild]);
      _ref3 = children != null ? children : [];
      for (index = _i = 0, _len = _ref3.length; _i < _len; index = ++_i) {
        child = _ref3[index];
        stack1.push([index, child]);
      }
    }
    while (stack2.length > 0) {
      _ref4 = stack2.pop(), index = _ref4[0], node = _ref4[1], firstChild = _ref4[2];
      visitCb(index, node, firstChild);
    }
  };

  ted = function(rootA, rootB, childrenCb, insertCb, removeCb, updateCb) {
    var fdist, i, j, preprocess, tA, tB, tdist, tdistance, treeDistance, ttrack, _i, _j, _len, _len1, _ref1, _ref2;
    preprocess = function(root) {
      var t;
      t = {
        nodes: [],
        llds: [],
        keyroots: []
      };
      postOrderWalk(root, childrenCb, function(index, node, firstChild) {
        var childIndex, lldIndex, nIndex;
        nIndex = t.nodes.length;
        t.nodes.push(node);
        if (firstChild == null) {
          lldIndex = nIndex;
        } else {
          childIndex = t.nodes.indexOf(firstChild);
          lldIndex = t.llds[childIndex];
        }
        t.llds.push(lldIndex);
        if (index !== 0) {
          t.keyroots.push(nIndex);
        }
      });
      t.keyroots.sort();
      return t;
    };
    treeDistance = function(i, j) {
      var a, aL, aN, b, bL, bN, iOff, jOff, m, min, n, p, q, _i, _j, _k, _l;
      aL = tA.llds;
      bL = tB.llds;
      aN = tA.nodes;
      bN = tB.nodes;
      iOff = aL[i] - 1;
      jOff = bL[j] - 1;
      m = i - aL[i] + 2;
      n = j - bL[j] + 2;
      for (a = _i = 1; _i < m; a = _i += 1) {
        fdist[a][0] = fdist[a - 1][0] + removeCb(aN[a + iOff]);
      }
      for (b = _j = 1; _j < n; b = _j += 1) {
        fdist[0][b] = fdist[0][b - 1] + insertCb(bN[b + jOff]);
      }
      for (a = _k = 1; _k < m; a = _k += 1) {
        for (b = _l = 1; _l < n; b = _l += 1) {
          if (aL[i] === aL[a + iOff] && bL[j] === bL[b + jOff]) {
            min = trackedMin(fdist[a - 1][b] + removeCb(aN[a + iOff]), fdist[a][b - 1] + insertCb(bN[b + jOff]), fdist[a - 1][b - 1] + updateCb(aN[a + iOff], bN[b + jOff]));
            ttrack[a + iOff][b + jOff] = min.index;
            tdist[a + iOff][b + jOff] = fdist[a][b] = min.value;
          } else {
            p = aL[a + iOff] - 1 - iOff;
            q = bL[b + jOff] - 1 - jOff;
            fdist[a][b] = Math.min(fdist[a - 1][b] + removeCb(aN[a + iOff]), fdist[a][b - 1] + insertCb(bN[b + jOff]), fdist[p][q] + tdist[a + iOff][b + jOff]);
          }
        }
      }
    };
    tA = preprocess(rootA);
    tB = preprocess(rootB);
    ttrack = zero(tA.nodes.length, tB.nodes.length);
    tdist = zero(tA.nodes.length, tB.nodes.length);
    fdist = zero(tA.nodes.length + 1, tB.nodes.length + 1);
    _ref1 = tA.keyroots;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      i = _ref1[_i];
      _ref2 = tB.keyroots;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        j = _ref2[_j];
        treeDistance(i, j);
      }
    }
    tdistance = tdist[tA.nodes.length - 1][tB.nodes.length - 1];
    return new Mapping(tA, tB, tdistance, ttrack, tedBt);
  };

  tedBt = function(tA, tB, ttrack) {
    var i, j, mapping;
    mapping = [];
    i = tA.nodes.length - 1;
    j = tB.nodes.length - 1;
    while (i >= 0 && j >= 0) {
      switch (ttrack[i][j]) {
        case 0:
          mapping.push([tA.nodes[i], null]);
          --i;
          break;
        case 1:
          mapping.push([null, tB.nodes[j]]);
          --j;
          break;
        case 2:
          mapping.push([tA.nodes[i], tB.nodes[j]]);
          --i;
          --j;
          break;
        default:
          throw new Error("Invalid operation " + ttrack[i][j] + " at (" + i + ", " + j + ")");
      }
    }
    if (i === -1 && j !== -1) {
      while (j >= 0) {
        mapping.push([null, tB.nodes[j]]);
        --j;
      }
    }
    if (i !== -1 && j === -1) {
      while (i >= 0) {
        mapping.push([tA.nodes[i], null]);
        --i;
      }
    }
    return mapping;
  };

  module.exports = ted;