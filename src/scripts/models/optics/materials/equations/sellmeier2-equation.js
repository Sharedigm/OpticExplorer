/******************************************************************************\
|                                                                              |
|                             sellmeier2-equation.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of the Sellmeier refractive equation.          |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SpectralLines from '../../../../utilities/optics/spectral-lines.js';

export default class Sellmeier2Equation {

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
		let lambda = wavelength.in('um');
		let lambda2 = Math.sqr(lambda);
		let n2 = 1;
		for (let i = 0; i < terms; i++) {
			let index = i * 2;
			let b = this.coeffs[index];
			let c = this.coeffs[index + 1];
			n2 += (b * lambda2) / (lambda2 - Math.sqr(c))
		}
		return Math.sqrt(n2);
	}
}