/******************************************************************************\
|                                                                              |
|                             polynomial-equation.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of the Polynomial refractive equation.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SpectralLines from '../../../../utilities/optics/spectral-lines.js';

export default class PolynomialEquation {

	constructor(coeffs) {

		// set attributes
		//
		this.coeffs = coeffs;
	}

	//
	// querying methods
	//
	
	terms() {
		return Math.ceil(this.coeffs.length / 2);
	}

	keys() {
		let coeffs = {};
		let index = 0;
		let terms = this.terms();
		for (let i = 1; i <= terms; i++) {
			coeffs['B_' + i] = this.coeffs[index++];
			coeffs['C_' + i] = this.coeffs[index++];
		}
		return coeffs;
	}

	eval(wavelength) {

		// set optional parameter defaults
		//
		if (!wavelength) {
			wavelength = SpectralLines.sodium.D;
		}
		
		let terms = this.coeffs.length / 2;
		let n2 = 0;
		let lambda = wavelength.in('um');
		for (let i = 0; i < terms - 1; i++) {
			let index = i * 2;
			n2 += this.coeffs[index] * Math.pow(lambda, this.coeffs[index + 1]);
		}
		return Math.sqrt(n2);
	}
}