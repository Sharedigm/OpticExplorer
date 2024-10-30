/******************************************************************************\
|                                                                              |
|                               abbe-equation.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of the Abbe refractive equation.               |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SpectralLines from '../../../../utilities/optics/spectral-lines.js';

export default class AbbeEquation {

	constructor(attributes) {

		// set attributes
		//
		this.index_of_refraction = attributes.index_of_refraction;
		this.abbe_number = attributes.abbe_number;
	}

	// constants
	//
	static lambda_D = SpectralLines.sodium.D.as('nm').val();
	static lambda_D2 = AbbeEquation.lambda_D * AbbeEquation.lambda_D;
	static lambda_C = SpectralLines.hydrogen.C.as('nm').val();
	static lambda_C2 = AbbeEquation.lambda_C * AbbeEquation.lambda_C;
	static lambda_F = SpectralLines.hydrogen.F.as('nm').val();
	static lambda_F2 = AbbeEquation.lambda_F * AbbeEquation.lambda_F;
	static factor = AbbeEquation.lambda_C2 * AbbeEquation.lambda_F2 / (AbbeEquation.lambda_C2 - AbbeEquation.lambda_F2);

	//
	// querying methods
	//
	
	keys() {
		return {
			'n_D': this.index_of_refraction,
			'V_D': this.abbe_number		
		}
	}

	eval(wavelength) {
		if (!isNaN(this.index_of_refraction)) {
			if (this.abbe_number) {
				let lambda = wavelength.in('nm');
				let lambda2 = Math.sqr(lambda);
				let c = (this.index_of_refraction - 1) / this.abbe_number * AbbeEquation.factor;
				let b = this.index_of_refraction - c / AbbeEquation.lambda_D2;
				return b + c / lambda2;
			} else {
				return this.index_of_refraction;
			}
		} else {
			return 1;
		}
	}
}