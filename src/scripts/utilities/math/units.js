/******************************************************************************\
|                                                                              |
|                                    units.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a class for helping with unit conversions.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default class Units {

	/**
	 * Create a new Units object.
	 *
	 * @param number value - the value
	 * @param string units - the units of the value
	 */
	constructor(value, units) {

		// set attributes 
		//
		if (units.indexOf('/') != -1) {

			// rate (ratio) units
			//
			let terms = units.split('/');
			this.numerator = new Units(value, terms[0]);
			this.denominator = new Units(1, terms[1]);
		} else {

			// simple units
			//
			this.value = value;
			this.units = Units.singular(units);
			this.targetUnits = Units.singular(units);			
		}
	}

	//
	// querying methods
	//

	/**
	 * Return this Units object as a differnt type of units, 
	 * leaving this value unchanged.
	 *
	 * @param string units - the units to convert to
	 * @return Units
	 */
	as(units) {
		return this.clone().to(units);
	}

	/**
	 * Return this Units object in the same Units as another Units object. 
	 *
	 * @param Units value - the object to convert to the units of.
	 * @return Units
	 */
	like(value) {
		if (value) {
			return this.as(value.targetUnits);
		} else {
			return this.clone();
		}
	}

	/**
	 * Return whether or not this Units object is in units.
	 *
	 * @param string units - the units to convert to
	 * @return boolean
	 */
	isIn(units) {
		return this.targetUnits == units;
	}

	/**
	 * Return the value of this Units object in another type of units. 
	 *
	 * @param string units - the type of units to convert to.
	 * @return number
	 */
	in(units) {
		return this.as(units).val();
	}

	/**
	 * Return whether this Units object equals a particular amount. 
	 *
	 * @param number amount - the value to compare with.
	 * @return boolean
	 */
	equals(amount) {
		if (amount) {
			return this.value == amount.in(this.targetUnits);
		}
	}

	/**
	 * Return whether this Units object matches another in value and units. 
	 *
	 * @param Units amount - the Units object to compare with.
	 * @return boolean
	 */
	matches(amount) {
		if (amount) {
			return (this.value == amount.value) && (this.units == amount.units);
		}
	}

	/**
	 * Return this Units object's base units (m, kg, s etc.)
	 *
	 * @return string
	 */
	baseUnits() {
		if (this.units.indexOf('^') != -1) {
			let terms = this.units.split('^');
			return terms[0];
		} else {
			return this.units;
		}
	}

	/**
	 * Return the value of this Units object in number form. 
	 *
	 * @return number
	 */
	val() {
		if (this.numerator) {
			
			// compute rate value
			//
			return this.numerator.val() / this.denominator.val();
		} else if (this.value != undefined && this.value !== '' && !isNaN(this.value)) {
			let terms;
			let baseUnits, basePower;
			let targetBaseUnits, targetPower;

			// parse power for current units
			//
			if (this.units.indexOf('^') != -1) {
				terms = this.units.split('^');
				baseUnits = terms[0];
				basePower = terms[1];
			} else {
				baseUnits = this.units;
				basePower = 1;
			}

			// parse power for target units
			//
			if (this.targetUnits.indexOf('^') != -1) {
				terms = this.targetUnits.split('^');
				targetBaseUnits = terms[0];
				targetPower = terms[1];
			} else {
				targetBaseUnits = this.targetUnits;
				targetPower = 1;
			}

			// can not convert from units of different powers
			//
			if (basePower != targetPower) {
				throw new Error('Incompatible powers; cannot convert from "' + this.units + '" to "' + this.targetUnits + '"');			
			}
			
			// first, convert from the current value to the base unit
			//
			let current = Units.table[baseUnits];
			let target = Units.table[targetBaseUnits];
			if (target.base != current.base) {
				throw new Error('Incompatible units; cannot convert from "' + this.units + '" to "' + this.targetUnits + '"');
			}

			// compute conversion
			//
			if (!basePower || basePower == 1) {
				return this.value * (current.multiplier / target.multiplier);
			} else {
				return this.value * (current.multiplier / target.multiplier) ** basePower;
			}
		}
	}

	/**
	 * Return a copy of this Units object. 
	 *
	 * @return Units
	 */
	clone() {
		if (this.numerator) {
			let clone = new Units(undefined, '/');
			clone.numerator = this.numerator.clone();
			clone.denominator = this.denominator.clone();
			return clone;	
		} else {
			return new Units(this.value, this.units);
		}
	}

	/**
	 * Return a scaled copy of this Units object. 
	 *
	 * @return Units
	 */
	times(value) {
		return new Units(this.value * value, this.units);
	}

	/**
	 * Return an offset copy of this Units object. 
	 *
	 * @return Units
	 */
	plus(value) {
		return new Units(this.value + value, this.units);
	}

	/**
	 * Return a reversed copy of this Units object. 
	 *
	 * @return Units
	 */
	reversed() {
		return new Units(-this.value, this.units);
	}

	//
	// converting methods
	//

	/**
	 * Convert this Units object to a differnt type of units.
	 *
	 * @param string units - the units to convert to
	 * @return Units
	 */
	to(units) {
		if (units) {
			if (units.indexOf('/') != -1) {

				// rate (ratio) units
				//
				let terms = units.split('/');
				this.numerator.to(terms[0]);
				this.denominator.to(terms[1]);
			} else {

				// simple units
				//
				this.targetUnits = Units.singular(units);
			}
		}
		return this;
	}

	//
	// rate computing methods
	//

	/**
	 * Return the value of this Units object as a number. 
	 *
	 * @return number
	 */
	num() {
		return this.numerator.value / this.denominator.value;
	}

	/**
	 * Return the value of this Units object as a fraction. 
	 *
	 * @return number
	 */
	rate() {
		return this.numerator.units + '/' + this.denominator.units;
	}

	/**
	 * Return the units of this Units object as a fraction. 
	 *
	 * @return number
	 */
	targetRate() {
		return this.numerator.targetUnits + '/' + this.denominator.targetUnits;
	}

	//
	// converting methods
	//

	/**
	 * Convert the value of this Units object to a string. 
	 *
	 * @return string
	 */
	toStr(options) {
		let value = this.val();

		if (!value || Math.abs(value) < Math.epsilon) {

			// if size of value is smaller than epsilon, return 0
			//
			return '0';
		} else if (Math.abs(value) > 1 / Math.epsilon) {

			// if size of value is greater than 1 / epsilon, return infinity
			//
			return 'Infinity';
		} else if (options && options.precision) {

			// division by 1 removes trailing zeros
			//
			return +(value).toPrecision(options.precision) / 1;
		} else if (options && options.fixed) {

			// format using fixed number of digits after decimal point
			//
			return +(value).toFixed(options.fixed);
		} else {

			// division by 1 removes trailing zeros
			//
			return +(value).toPrecision(6) / 1;
		}
	}

	/**
	 * Convert the value and units of this Units object to a string. 
	 *
	 * @return string
	 */
	toString(options) {
		let value = this.toStr(options);

		if (!value || value == '0' || value == 'Infinity') {
			return value;
		} else {
			let units = (this.value <= 1? this.targetUnits : Units.plural(this.targetUnits));
			return value + ' ' + units;
		}
	}

	/**
	 * Convert this Units object to a descriptive string. 
	 *
	 * @return string
	 */
	debug() {
		if (this.numerator) {
			return this.num() + ' ' + this.rate() + ' is ' + this.val() + ' ' + this.targetRate();
		} else {
			return this.value + ' ' + this.units + ' is ' + this.val() + ' ' + this.targetUnits;
		}
	}

	//
	// static attributes
	//

	static table = {};
	static prefixes = [
		['yotta', 'Y'], 
		['zeta', 'Z'],
		['exa', 'E'],
		['peta', 'P'], 
		['tera', 'T'], 
		['giga', 'G'], 
		['mega', 'M'], 
		['kilo', 'k'], 
		['hecto', 'h'], 
		['deca', 'da'], 
		['', ''],
		['deci', 'd'], 
		['centi', 'c'],
		['milli', 'm'],
		['micro', 'u'],
		['nano', 'n'],
		['pico', 'p'],
		['femto', 'f'], 
		['atto', 'a'],
		['zepto', 'z'], 
		['yocto', 'y']
	];

	static factors = [24, 21, 18, 15, 12, 9, 6, 3, 2, 1, 0, -1, -2, -3, -6, -9, -12, -15, -18, -21, -24];

	// base units
	//
	static base_units = [
		['meter', 'm'], 	// length (meters)
		['gram', 'g'], 		// weight (grams)
		['liter', 'l'], 	// volume (liters)
		['second', 's'], 	// time (seconds)
		['degree', 'deg'],	// angle (degrees)
		['joule', 'j'],		// energy (joules)
		['pascal', 'pa'], 	// pressure (pascals)
		['dollar', 'usd']	// currency (us dollars)
	];

	static units = {
		length: ['mm', 'cm', 'in', 'ft', 'm'],
		distance: ['ft', 'm', 'km', 'mi'],
		mass: ['g', 'oz', 'lb', 'kg'],
		angle: ['deg', 'rad', "'", '"'],
		wavelength: ['nm', 'um'],
		currency: ['usd', 'eur', 'gbp', 'jpy', 'chf', 'aud']
	};

	static singulars = ['inch', 'foot'];
	static plurals = ['inches', 'feet'];
	static abbreviations = [];

	/**
	 * Return whether units are an abbreviated form. 
	 *
	 * @param string units - the units to test.
	 * @return boolean
	 */
	static isAbbreviation(units) {
		return Object.keys(Units.abbreviations).includes(units);
	}

	/**
	 * Return units in singular form. 
	 *
	 * @param string units - the units to convert to singular form.
	 * @return string
	 */
	static singular(units) {
		if (Units.plurals.includes(units)) {
			return Units.singulars[Units.plurals.indexOf(units)];
		} else if (units.endsWith('s') && !Units.isAbbreviation(units)) {
			return units.substring(0, units.length - 1);
		} else {
			return units;
		}
	}

	/**
	 * Return units in plural form. 
	 *
	 * @param string units - the units to convert to plural form.
	 * @return string
	 */
	static plural(units) {
		if (Units.singulars.includes(units)) {
			return Units.plurals[Units.singulars.indexOf(units)];
		} else if (!Units.isAbbreviation(units)) {
			return units + 's';
		} else {
			return units;
		}
	}

	//
	// static methods
	//

	/**
	 * return whether two Units objects are in the same units.
	 *
	 * @param Units units1 - the first Units object.
	 * @param Units units2 - the second Units object.
	 * @return boolean
	 */
	static same(units1, units2) {
		return units1 == units2 || units1 && units1.matches(units2);
	}

	/**
	 * Convert units to a string.
	 *
	 * @param Units units - the type of units.
	 * @param integer power - the exponent of the units.
	 * @return string
	 */
	static toString(units, power) {
		if (!power || power == 1) {
			return units;
		} else if (power == -1) {
			return '/' + units;
		} else if (power < 1) {
			return '/' + units + '^' + power;
		} else {
			return units + '^' + power;
		}
	}

	/**
	 * Convert an array of values to units. 
	 *
	 * @param array values - the array values to convert.
	 * @param string units - the type of units.
	 * @return Units[]
	 */
	static arrayToUnits(values, units) {
		let array = [];
		for (let i = 0; i < values.length; i++) {
			array.push(new Units(values[i], units));
		}
		return array;
	}

	/**
	 * Add units to the units table.
	 *
	 * @param string baseUnits - the base units related to the units to add.
	 * @param string actualUnits - the units to add.
	 * @param number multiplier - the multipler between base and actual units.
	 */
	static addUnits(baseUnits, actualUnits, multiplier) {
		if (typeof actualUnits == 'string') {
			Units.table[actualUnits] = {
				base: baseUnits, 
				actual: actualUnits, 
				multiplier: multiplier
			};
		} else if (actualUnits.length > 0) {

			// add full and abbreviated forms
			//
			let full = actualUnits[0];
			let abbr = actualUnits[1];

			Units.table[full] = {
				base: baseUnits, 
				actual: full, 
				multiplier: multiplier
			};
			Units.table[abbr] = {
				base: baseUnits, 
				actual: abbr, 
				multiplier: multiplier
			};

			// add to list of abbreviations
			//
			Units.abbreviations[abbr] = full;
		}
	}

	/**
	 * Parse a string into a Units object.
	 *
	 * @param string string - the string to parse.
	 * @param object options - the parsing options.
	 * @return Units
	 */
	static parse(string, options) {

		function firstNonDigit(string) {
			for (let i = 0; i < string.length; i++) {
				let char = string[i];
				if (char >= '0' && char <= '9' || char == '.' ||
					char == 'e' || char == 'E' ||
					char == '+' || char == '-') {
					continue;
				} else {
					return i;
				}
			}
		}

		// check if we can parse value
		//
		if (!string || string == '0') {
			if (options && options.base) {
				return new Units(0, options.base);
			} else {
				return null;
			}
		}

		if (string == 'Infinity') {
			return Infinity;
		}

		// split by first alphabetical or quote character
		//
		let digits = string.substring(0, firstNonDigit(string));
		let units = string.substring(digits.length).trim();
		if (!units || units == 'nbsp;') {
			return "Units required.";
		} else {
			units = Units.singular(units);
			if (units in Units.table) {
				if (options && options.base) {
					if (options.base != Units.table[units].base) {
						return "Invalid units.";
					}
				}
				// parse units 
				//
				let value = parseFloat(digits);
				return new Units(value, units);		
			} else {
				return "Invalid units.";
			}
		}
	}
}

// initialize non-base / prefixed units (centimeter, kilometer etc.)
//
for (let i = 0; i < Units.base_units.length; i++) {
	let baseUnits = Units.base_units[i];
	let full = baseUnits[0];
	let abbr = baseUnits[1];
	for (let i = 0; i < Units.prefixes.length; i++) {
		let prefixes = Units.prefixes[i];
		let prefixFull = prefixes[0];
		let prefixAbbr = prefixes[1];
		Units.addUnits(abbr, [prefixFull + full, prefixAbbr + abbr], 10 ** Units.factors[i]);
	}
}

// add US units of length
//
Units.addUnits('m', ['inch', 'in'], 0.0254);
Units.addUnits('m', ['foot', 'ft'], 0.3048);
Units.addUnits('m', ['feet', 'ft'], 0.3048);
Units.addUnits('m', ['yard', 'yd'], 0.9144);
Units.addUnits('m', ['mile', 'mi'], 1609.34);

// add imperial units of length
//
Units.addUnits('m', ['rod', 'rd'], 5.0292);
Units.addUnits('m', ['chain', 'ch'], 20.1168);
Units.addUnits('m', ['furlong', 'fur'], 201.168);
Units.addUnits('m', ['nautical mile', 'nmi'], 1852);

// add US units of mass / weight
//
Units.addUnits('g', ['ounce', 'oz'], 28.3495231);
Units.addUnits('g', ['pound', 'lb'], 453.59237);
Units.addUnits('g', ['ton', 'tn'], 907185);

// add imperial units of mass / weight
//
Units.addUnits('g', ['grain', 'gr'], 0.0647989);
Units.addUnits('g', ['drachm', 'dr'], 0.5643833);
Units.addUnits('g', ['stone', 'st'], 6350.29);
Units.addUnits('g', ['imperial ton', 't'], 1.016e6);

// add US  units of volume
//
Units.addUnits('l', ['teaspoon', 'tsp'], 0.00492892);
Units.addUnits('l', ['tablespoon', 'tbsp'], 0.0147868);
Units.addUnits('l', ['ounce', 'fl oz'], 0.0295735);
Units.addUnits('l', ['cup', 'cp'], 0.24);
Units.addUnits('l', ['pint', 'pt'], 0.473176);
Units.addUnits('l', ['quart', 'qt'], 0.946353);
Units.addUnits('l', ['gallon', 'gal'], 3.78541);

// add imperial units of volume
//	
Units.addUnits('l', ['imperial teaspoon', 'imp tsp'], 0.00591939);
Units.addUnits('l', ['imperial tablespoon', 'imp tbsp'], 0.0177582);
Units.addUnits('l', ['imperial ounce', 'imp oz'], 0.0284131);
Units.addUnits('l', ['imperial cup', 'imp cp'], 0.284131);
Units.addUnits('l', ['imperial pint', 'imp pt'], 0.568261);
Units.addUnits('l', ['imperial quart', 'imp qt'], 1.13652);
Units.addUnits('l', ['imperial gallon', 'imp gal'], 4.54609);

// add units of time
//
Units.addUnits('s', ['min', "'"], 60);
Units.addUnits('s', ['minute', "'"], 60);
Units.addUnits('s', ['hr', '"'], 3600);
Units.addUnits('s', ['hour', '"'], 3600);
Units.addUnits('s', ['day', 'd'], 86400);
Units.addUnits('s', ['week', 'wk'], 604800);
Units.addUnits('s', ['month', 'mn'], 2.628e6);
Units.addUnits('s', ['year', 'yr'], 3.154e7);

// add angular units
//
Units.addUnits('deg', ['arcseconds', '"'], 1 / 3600);
Units.addUnits('deg', ['arcminutes', "'"], 1 / 60);
Units.addUnits('deg', ['grad', 'gon'], 360 / 400);
Units.addUnits('deg', ['sextant', 'sxt'], 60);
Units.addUnits('deg', ['radians', 'rad'], 180 / Math.PI);
Units.addUnits('deg', ['quadrant', 'quad'], 90);
Units.addUnits('deg', ['turn', 'tr'], 360);

// add units of energy
//
Units.addUnits('j', ['calorie', 'cal'], 4.184);
Units.addUnits('j', ['kilocalorie', 'kcal'], 4184);
Units.addUnits('j', ['watt hour', 'wh'], 3600);
Units.addUnits('j', ['kilowatt hour', 'kwh'], 3.6e6);
Units.addUnits('j' ,['electron volt', 'ev'], 1.6022e-19);
Units.addUnits('j' ,['british thermal unit', 'btu'], 1055.06);
Units.addUnits('j' ,['therm', 'thm'], 1.055e+8);
Units.addUnits('j' ,['foot pound', 'ft lb'], 1.35582);

// add units of pressure
//
Units.addUnits('pa', ['bar', 'b'], 100000);
Units.addUnits('pa', ['atmosphere', 'atm'], 101325);
Units.addUnits('pa', ['pounds per square inch', 'ppi'], 6894.76);
Units.addUnits('pa', ['torr'], 133.32242079569);

// add units of currency
//
Units.addUnits('usd', ['euro', 'eur'], 1.1);
Units.addUnits('usd', ['pound', 'gbp'], 1.25);
Units.addUnits('usd', ['yen', 'jpy'], 0.01);
Units.addUnits('usd', ['swiss franc', 'chf'], 1);
Units.addUnits('usd', ['australian dollar', 'aud'], 0.75);