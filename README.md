# Beer Color

Convert SRM or EBC to hex color.

Color values are provided by Barley Dog Brewery [here](https://www.barleydogbrewery.com/xml/colors.xml)

## Usage

Install the library:

```
npm install --save beer-color
```

Require the module and call one of the conversion functions:

```javascript
let beerColor = require('beer-color');

beerColor.fromSRM(4);
// => '#ECE61A'

beerColor.fromEBC(4);
// => '#F8F753'
```

The domain of valid inputs is 0 through 40 SRM.  Input values are rounded to the nearest 0.1 SRM within this domain:

```javascript
beerColor.fromSRM(-1) === beerColor.fromSRM(0);
// => true

beerColor.fromSRM(Number.MAX_VALUE) === beerColor.fromSRM(40);
// => true

beerColor.fromSRM(Math.PI) === beerColor.fromSRM(3.1);
// => true
```
