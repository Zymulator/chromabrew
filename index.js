// decisrm.json sourced from https://www.barleydogbrewery.com/xml/colors.xml
// each index represents an increment of 0.1 SRM; 0.0 to 40.0, inclusive
const DECI_SRM = require('./decisrm');

const SRM_TO_EBC = 1.97;
const LITRE_TO_GALLON = 0.2199692;
const KILOGRAM_TO_POUND = 2.204623;

const DEFAULT_SRM_FORMULA = 'morey';

let chromabrew = function (options) {
  return new chromabrew.Batch(options);
};

let Batch = chromabrew.Batch = function (options) {
  if (options.srm) {
    this._setSRM(options.srm, options);
  } else if (options.ebc) {
    this._setSRM(options.ebc / SRM_TO_EBC, options);
  } else if (options.l || options.lovibond) {
     this._setSRM(1.35 * (options.l || options.lovibond) - 0.6, options);
  } else if (options.mcu) {
    this._mcu = options.mcu;
  } else if (options.batch) {
    let batch = options.batch;

    let grains = Array.isArray(batch.ingredients) ? batch.ingredients : [batch.ingredients];

    this._mcu = grains.reduce(function (sum, grain) {
      return sum + (grain.l || grain.lovibond) * (grain.w || grain.weight);
    }, 0) / (batch.v || batch.volume);

    if (batch.metric || batch.litres || batch.liters) {
      this._mcu /= LITRE_TO_GALLON;
    }

    if (batch.metric || batch.kilograms || batch.kilos) {
      this._mcu *= KILOGRAM_TO_POUND;
    }
  }
};

Batch.prototype._setSRM = function (srm, options) {
  this._mcu = Batch.mcu[options.calculator || DEFAULT_SRM_FORMULA](srm);
};

Batch.prototype.mcu = function () {
  return this._mcu;
};

Batch.prototype.srm = function (calculator) {
  return Batch.srm[calculator || DEFAULT_SRM_FORMULA](this._mcu);
};

Batch.prototype.ebc = function (calculator) {
  return this.srm(calculator) * SRM_TO_EBC;
};

Batch.prototype.l = Batch.prototype.lovibond = function (calculator) {
  return (this.srm(calculator) + 0.6) / 1.35;
};

Batch.prototype.hex = function (calculator) {
  let deciSRM = Math.max(0, Math.round(this.srm(calculator) * 10));
  return DECI_SRM[Math.min(DECI_SRM.length - 1, deciSRM)];
};

Batch.mcu = {
  morey:   (srm) => Math.pow(srm / 1.4922, 1 / 0.6859),
  daniels: (srm) => Math.max(0, srm - 8.4) / 0.2,
  mosher:  (srm) => Math.max(0, srm - 4.7) / 0.3,
  barry:   (srm) => Math.pow(srm / 1.5, 1 / 0.7),
};

Batch.srm = {
  morey:   (mcu) => 1.4922 * Math.pow(mcu, 0.6859),
  daniels: (mcu) => 0.2 * mcu + 8.4,
  mosher:  (mcu) => 0.3 * mcu + 4.7,
  barry:   (mcu) => 1.5 * Math.pow(mcu, 0.7),
};

module.exports = chromabrew;
