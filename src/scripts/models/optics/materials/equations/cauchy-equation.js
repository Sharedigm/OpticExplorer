/******************************************************************************\
|                                                                              |
|                              cauchy-equation.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of the Cauchy refractive equation.             |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SpectralLines from '../../../../utilities/optics/spectral-lines.js';

export default class CauchyEquation {

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
		let coeff = 'B';
		let index = 0;
		let terms = this.terms();
		coeffs[coeff] = this.coeffs[index++];
		for (let i = 1; i <= terms - 1; i++) {
			coeff = String.fromCharCode(coeff.charCodeAt(0) + 1);
			coeffs[coeff] = this.coeffs[index++];
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
		let lambda = wavelength.in('nm');
		let lambda2 = Math.sqr(lambda);
		let n = this.coeffs[0];
		for (let i = 1; i < terms; i++) {
			n += this.coeffs[i] / lambda2;
		}
		return n;
	}
}