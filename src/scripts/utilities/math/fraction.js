/******************************************************************************\
|                                                                              |
|                                 fraction.js                                  |
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

export default class Fraction {

	constructor(numerator, denominator) {

		// set attributes
		//
		this.numerator = numerator;
		this.denominator = denominator;
	}

	//
	// querying methods
	//

	value() {
		return this.numerator / this.denominator;
	}

	parse(string) {
		let terms = string.split('/');
		this.numerator = terms[0];
		this.denominator = terms[1];
		return this;
	}

	//
	// converting methods
	//

	toString() {
		return this.numerator + ' / ' + this.denominator;
	}
}
