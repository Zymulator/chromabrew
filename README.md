# Chromabrew

Convert SRM, EBC, or a list of Lovibond values to another color scale, or to a hex color.

Color values are provided by Barley Dog Brewery [here](https://www.barleydogbrewery.com/xml/colors.xml)

## Usage

Install the library:

```
npm install --save chromabrew
```

Require the module:

```javascript
let chromabrew = require('chromabrew');
```

Pass options which describe a batch to the `Batch` constructor, or directly to the required module.  See the list of accepted options below.  Call `hex` on the returned object to get a color:

```javascript
new chromabrew.Batch({ srm: 4 }).hex();
// => '#ECE61A'

chromabrew({ srm: 4 }).hex();
// => '#ECE61A'

chromabrew({ ebc: 4 }).hex();
// => '#F8F753'
```

Convert between color scales:

```javascript
let batch = chromabrew({ srm: 4 });

batch.srm();
// => 4

batch.ebc();
// => 7.88

batch.mcu();
// => 4.210535199414287

batch.lovibond();
// => 3.407407407407407
```

Specify which calculation method was used to determine the provided `srm` or `ebc`, or which method to use when converting between scales:

```javascript
let batch = chromabrew({ srm: 14, calculator: 'daniels' });

batch.srm('daniels');
// => 14

// defaults to 'morey'
batch.srm();
// => 14.670088349307665

batch.srm('mosher');
// => 13.099999999999998

// defaults to 'morey'
batch.ebc();
// => 28.9000740481361
```

### Options

#### Primary Options

Any one of the following options must be passed to the module:

| option | description | type |
|-|-|-|
| `srm` | the SRM of a batch | `Number` |
| `ebc` | the EBC of a batch | `Number` |
| `l` or `lovibond` | the degrees Lovibond of a batch | `Number` |
| `batch` | options describing a batch in detail **(see below)** | `Object` |

This option may be used in combination with the TODO option to specify which calculation method was used:

| option | description | type |
|-|-|-|
| `calculator` | the SRM calculation method used: `'morey'` **(default)**, `'daniels'`, `'mosher'`, or `'barry'` † | `String` |

† apparently they let anyone create a beer color scale

#### Batch Options

The following options define the `batch` primary option:

| option | description | type |
|-|-|-|
| `mcu` | the MCU of the batch, if it is already known | `Number` |
| `v` or `volume` | the total liquid volume of the wort **(required)** | `Number` |
| `ingredients` | an `Array` of ingredient options **(see below; required)** | `Array[Object]` |
| `litres` or `liters` | whether `volume` is expressed in litres | `Boolean` |
| `kilograms` or `kilos` | whether `weight` of each item in `ingredients` is expressed in kilograms | `Boolean` |
| `metric` | shortcut to apply both `litres` and `kilograms` options | `Boolean` |

#### Ingredient Options

The following options define each ingredient in the `ingredients` batch option:

| option | description | type |
|-|-|-|
| `l` or `lovibond` | the value in degrees Lovibond of the ingredient  **(required)** | `Number` |
| `w` or `weight` | the weight of the ingredient used **(required)** | `Number` |

### Functional Domain

The domain of valid inputs is 0 through 40 SRM.  Input values are rounded to the nearest 0.1 SRM within this domain:

```javascript
chromabrew({ srm: -1 }).hex() === chromabrew({ srm: 0 }).hex();
// => true

chromabrew({ srm: Number.MAX_VALUE }).hex() === chromabrew({ srm: 40 }).hex();
// => true

chromabrew({ srm: Math.PI }).hex() === chromabrew({ srm: 3.1 }).hex();
// => true  
```

The `'daniels'` and `'mosher'` SRM calculation scales have a minimum result of `8.4` and `4.7`, respectively.  Where a provided `srm` would result in a negative `mcu`, the `mcu` is set to 0:

```javascript
let daniels = chromabrew({ srm: 4, calculator: 'daniels' });

daniels.mcu();
// => 0

daniels.srm();
// => 0

daniels.srm('daniels');
// => 8.4

let mosher = chromabrew({ srm: 4, calculator: 'mosher' });

mosher.mcu();
// => 0

mosher.srm();
// => 0

mosher.srm('mosher');
// => 4.7
```
