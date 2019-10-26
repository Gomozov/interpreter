const assert = require('assert');
//const assert = require('chai').assert;
const mc = require('./../interpretator.js');

describe('Calculate simple expression', function() {
  let intr = new mc();
  const tests = [
    ['1+1', 2],
    ['1 - 1', 0],
    ['1* 1', 1],
    ['1 /1', 1],
    ['-123', -123],
    ['123', 123],
    ['2 /2+3 * 4.75- -6', 21.25],
    ['12* 123', 1476],
    ['2 / (2 + 3) * 4.33 - -6', 7.732],
    ["0--0", 0],
    ["1--1", 2],
    ["1+-1", 0],
    ["1223421", 1223421],
    ["-213", -213] 
  ];

  tests.forEach(function (m) {
    it("should return: " + m[1] +" when input is: " + m[0], function(){
      assert.equal(intr.input(m[0]), m[1]);
    });
  });
});

describe('Calculate hard expression', function() {
  let intr = new mc();
  const tests = [
    ['11 * 7 * 34 - 26 - 87 - 90 / 2 * 73 + 77 * 68 * 19 + 41 * 62', 101246],
    ['84 / 54 / 89 * 43 * 40 - 79 * 97 + 48 / 3 - 49 * 76 * 7 + 81 / 2', -33644.437578027464],
    ['58 + 12 * 24 * 27 - 45 - 62 * 21 + 28 * 52 / 1 / 72 + 10 - 7 * 43 + 63 * 85 - 55 + 17 * 80 + 56 - 22 - 96 * 53 / 1', 7822.222222222223],
    ['52 / 18 - 89 + 44 * 94 - 56 - 35 + 18 / 95 + 52 * 46 + 77 * 90 - 30 + 28 / 68 - 37 * 57 - 92 - 30 + 21 - 30 * 83 * 47 * 36', -4202038.509872721]
  ];

  tests.forEach(function (m) {
    it("should return: " + m[1] +" when input is: " + m[0], function(){
      assert.equal(intr.input(m[0]), m[1]);
    });
  });
});

describe('Error handling', function() {
  let intr = new mc();
  const tests = [
    ['11 * 7 * g', "ReferenceError: g is not defined"],
    ['84 / 54 / 89 * )', "Error! Result is NaN"],
    ['--1', "Error! Result is NaN"],
    ['1+--1', "Error! Result is NaN"],
    ["a", "ReferenceError: a is not defined"]
  ];

  tests.forEach(function (m) {
    it("should return: " + m[1] +" when input is: " + m[0], function() {
      try {
        intr.input(m[0]);
        assert.fail('expected exception not thrown');
      } catch (e) {
        if (e instanceof ReferenceError) {
          throw e;
        }
      assert.equal(e.message, m[1]);
      }
    });
  });
});

describe('Calculate expressions with parenthesis', function() {
  let intr = new mc();
  const tests = [
    ['((80 - (19)))', 61]
  ];

  tests.forEach(function (m) {
    it("should return: " + m[1] +" when input is: " + m[0], function(){
      assert.equal(intr.input(m[0]), m[1]);
    });
  });
});

describe('Tests for variables', function() {
  let intr = new mc();
  const tests = [
    ['a =1', 1],
    ["b = 0", 0],
    ["a+b", 1],
    ["c = a+b", 1],
    ["c", 1],
    ["r=t=7", 7],
    ["u = 9 + (v=11)", 20]
  ];

  tests.forEach(function (m) {
    it("should return: " + m[1] +" when input is: " + m[0], function(){
      assert.equal(intr.input(m[0]), m[1]);
    });
  });
});

describe('Tests for functions', function() {
  let intr = new mc();
  const tests = [
    ['fn avg x y => (x+y)/2', ""],
    ["avg 2 4", 3],
    ["avg 6 8", 7],
    ["avg avg 8 0 avg 1 2", 2.75]
  ];

  tests.forEach(function (m) {
    it("should return: " + m[1] +" when input is: " + m[0], function(){
      assert.equal(intr.input(m[0]), m[1]);
    });
  });
});
