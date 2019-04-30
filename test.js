let assert = require('assert');

let chromabrew = require('./index.js');

const ERROR_CORRECTION_FACTOR = 1e3;

describe('chromabrew', function () {
  it('has Batch property', function () {
    assert(chromabrew.Batch instanceof Function);
  });

  it('is a function which returns a Batch instance', function () {
    assert(chromabrew instanceof Function);
    let batch = chromabrew({});
    assert(batch instanceof chromabrew.Batch);
  });
});

describe('Batch', function () {
  describe('Constructor', function () {
    let batches = [
      { in: { srm: 10 }, out: { srm: 10, ebc: 10 * 1.97, l: (10 + 0.6) / 1.35 } },
      { in: { ebc: 10 }, out: { srm: 10 / 1.97, ebc: 10, l: (10 / 1.97 + 0.6) / 1.35 } },

      { in: { srm: 4, calculator: 'daniels' }, out: { 'srm("daniels")': 8.4, mcu: 0 }, msg: 'minimum value for selected calculator' },
      { in: { srm: 4, calculator: 'mosher' }, out: { 'srm("mosher")': 4.7, mcu: 0 }, msg: 'minimum value for selected calculator' },

      { in: { batch: { volume: 1, ingredients: [{ l: 10, w: 1 }, { l: 20, w: 1 }] } } },
      { in: { batch: { volume: 1, ingredients: [{ l: 10, w: 1 }, { l: 20, w: 1 }], litres: true } } },
      { in: { batch: { volume: 1, ingredients: [{ l: 10, w: 1 }, { l: 20, w: 1 }], kilograms: true } } },
      { in: { batch: { volume: 1, ingredients: [{ l: 10, w: 1 }, { l: 20, w: 1 }], metric: true } } },
    ];

    batches.forEach(function (batch) {
      describe(`given input ${ JSON.stringify(batch.in) }`, function () {
        let instance = chromabrew(batch.in);

        it('mcu is a non-negative number', function () {
          // this is a test of internals (mcu must always be defined), but is more clear than a test of exact output values
          let result = instance.mcu();
          assert.equal(typeof result, 'number');
          assert(result >= 0);
        });

        if (batch.out) {
          if (Object.keys(batch.out).length) {
            Object.keys(batch.out).forEach(function (key) {
              it(`${ key } is ${ batch.out[key] }${ batch.msg ? ` [${ batch.msg }]` : '' }`, function () {
                let actual = eval(`instance.${ key + (key.endsWith(')') ? '' : '()') }`);
                let expected = batch.out[key];
                if (typeof actual === 'number' && typeof expected === 'number') {
                  // correct floating point errors
                  actual = Math.round(actual * ERROR_CORRECTION_FACTOR) / ERROR_CORRECTION_FACTOR;
                  expected  = Math.round(expected * ERROR_CORRECTION_FACTOR) / ERROR_CORRECTION_FACTOR;
                }
                assert.equal(actual, expected);
              });
            });
          } else {
            it('has specified output');
          }
        }
      });
    })
  });

  describe('#mcu', function () {
    let instance = chromabrew({ srm: 4 });

    it('returns number', function () {
      assert.equal(typeof instance.mcu(), 'number');
    });
  });

  describe('#srm', function () {
    let instance = chromabrew({ srm: 4 });

    it('returns number', function () {
      assert.equal(typeof instance.srm(), 'number');
    });

    it('accepts optional calculator which defaults to "morey"', function () {
      assert.doesNotThrow(instance.srm.bind(instance));

      Object.keys(chromabrew.Batch.mcu).forEach(function (calculator) {
        assert[calculator === 'morey' ? 'equal' : 'notEqual'](instance.srm(calculator), instance.srm());
      });
    });
  });

  describe('#ebc', function () {
    let instance = chromabrew({ srm: 4 });

    it('returns number', function () {
      assert.equal(typeof instance.ebc(), 'number');
    });

    it('accepts optional calculator which defaults to "morey"', function () {
      assert.doesNotThrow(instance.ebc.bind(instance));

      Object.keys(chromabrew.Batch.mcu).forEach(function (calculator) {
        assert[calculator === 'morey' ? 'equal' : 'notEqual'](instance.ebc(calculator), instance.ebc());
      });
    });
  });

  describe('#lovibond', function () {
    let instance = chromabrew({ srm: 4 });

    it('returns number', function () {
      assert.equal(typeof instance.lovibond(), 'number');
    });

    it('accepts optional calculator which defaults to "morey"', function () {
      assert.doesNotThrow(instance.lovibond.bind(instance));

      Object.keys(chromabrew.Batch.mcu).forEach(function (calculator) {
        assert[calculator === 'morey' ? 'equal' : 'notEqual'](instance.lovibond(calculator), instance.lovibond());
      });
    });
  });

  describe('#hex', function () {
    let instance = chromabrew({ srm: 4 });

    it('returns hex string', function () {
      let result = instance.hex();
      assert.equal(typeof result, 'string');
      assert(result.match(/^#[A-F0-9]{6}$/));
    });

    it('accepts optional calculator which defaults to "morey"', function () {
      assert.doesNotThrow(instance.hex.bind(instance));

      Object.keys(chromabrew.Batch.mcu).forEach(function (calculator) {
        assert[calculator === 'morey' ? 'equal' : 'notEqual'](instance.hex(calculator), instance.hex());
      });
    });
  });

  describe('#l', function () {
    it('aliases #lovibond', function () {
      assert.equal(chromabrew.Batch.prototype.l, chromabrew.Batch.prototype.lovibond);
    });
  });

  describe('::mcu', function () {
    describe('#morey', function () {
      it('returns number', function () {
        assert.equal(typeof chromabrew.Batch.mcu.morey(30), 'number');
      });
    });

    describe('#daniels', function () {
      it('returns number', function () {
        assert.equal(typeof chromabrew.Batch.mcu.daniels(30), 'number');
      });
    });

    describe('#mosher', function () {
      it('returns number', function () {
        assert.equal(typeof chromabrew.Batch.mcu.mosher(30), 'number');
      });
    });

    describe('#barry', function () {
      it('returns number', function () {
        assert.equal(typeof chromabrew.Batch.mcu.barry(30), 'number');
      });
    });

  });

  describe('::srm', function () {
    describe('#morey', function () {
      it('returns number', function () {
        assert.equal(typeof chromabrew.Batch.srm.morey(30), 'number');
      });
    });

    describe('#daniels', function () {
      it('returns number', function () {
        assert.equal(typeof chromabrew.Batch.srm.daniels(30), 'number');
      });
    });

    describe('#mosher', function () {
      it('returns number', function () {
        assert.equal(typeof chromabrew.Batch.srm.mosher(30), 'number');
      });
    });

    describe('#barry', function () {
      it('returns number', function () {
        assert.equal(typeof chromabrew.Batch.srm.barry(30), 'number');
      });
    });

  });
});
