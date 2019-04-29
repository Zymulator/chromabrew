// decisrm.json sourced from https://www.barleydogbrewery.com/xml/colors.xml
// each index represents an increment of 0.1 SRM; 0.0 to 40.0, inclusive
const DECI_SRM = require('./decisrm');

const EBC_TO_SRM = 0.508;

let beerColor = {
  fromSRM: function (srm) {
    srm = Math.max(0, srm);

    let deciSRM = Math.round(srm * 10);

    deciSRM = Math.min(DECI_SRM.length - 1, deciSRM);

    return DECI_SRM[deciSRM];
  },

  fromEBC: function (ebc) {
    return this.fromSRM(ebc * EBC_TO_SRM);
  },
};

module.exports = beerColor;
