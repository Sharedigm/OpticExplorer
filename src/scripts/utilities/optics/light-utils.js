/******************************************************************************\
|                                                                              |
|                                light-utils.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a number of light related utility functions.             |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// optics methods
	//

	reflect: function(direction, normal) {

		// In reflection, the component of the light ray parallel to the normal
		// reverses direction while the perpendicular component remains unchanged.
		//
		return direction.minus(direction.parallel(normal).scaledBy(2));
	},

	refract: function(direction, normal, fromIndex, toIndex) {
		direction.normalize();

		// component of ray perpendicular to surface
		//
		let perpendicularLength = direction.dot(normal);
		let perpendicular = normal.scaledBy(perpendicularLength);
		perpendicularLength = Math.abs(perpendicularLength);

		// component of ray parallel to surface
		//
		let parallel = direction.minus(perpendicular);
		let parallelLength = parallel.length();

		if (parallelLength != 0) {
			let ratio = fromIndex / toIndex;
			let refraction = parallelLength * ratio;

			if (refraction < 1) {

				// compute refraction
				//
				return perpendicular.plus(parallel.scaledBy(refraction *
					(perpendicularLength / parallelLength) / Math.sqrt(1 - refraction * refraction)));
			} else {
				
				// total internal reflection
				//
				return null;
			}
		} else {

			// ray is parallel to surface
			//
			return direction;
		}
	},

	fresnelReflectance: function(n1, n2, angle, polarization) {

		// check mandatory parameters
		//
		if (!n1 || !n2 || isNaN(angle)) {
			return undefined;
		}

		let rad = angle * Math.PI / 180;
		switch (polarization) {

			case 's-polarized': {
				let factor = 1 - Math.sqr(n1 / n2 * Math.sin(rad));
				if (factor > 0) {
					return Math.sqr(
						(n1 * Math.cos(rad) - n2 * Math.sqrt(factor)) /
						(n1 * Math.cos(rad) + n2 * Math.sqrt(factor))
					);
				} else {
					return 1;
				}
			}

			case 'p-polarized': {
				let factor = 1 - Math.sqr(n1 / n2 * Math.sin(rad));
				if (factor > 0) {
					return Math.sqr(
						(n1 * Math.sqrt(factor) - n2 * Math.cos(rad)) /
						(n1 * Math.sqrt(factor) + n2 * Math.cos(rad))
					);
				} else {
					return 1;
				}
			}

			case 'unpolarized':
			default: 
				return (this.fresnelReflectance(n1, n2, angle, 's-polarized') +
					this.fresnelReflectance(n1, n2, angle, 'p-polarized')) / 2;
		}
	},

	absorptionCoefficient: function(k, wavelength, units) {
		return 4 * Math.PI * k / wavelength.as(units).val();
	},

	beerLambertTransmission: function(k, thickness, wavelength) {
		return Math.exp(-1 * thickness.as('um').val() * this.absorptionCoefficient(k, wavelength, 'um'));
	},

	//
	// physics methods
	//

	wavelengthToColor: function(wavelength, alpha) {
		let r, g, b;
		let minWavelength = 300;
		let maxWavelength = 800;

		// check for argument
		//
		if (!wavelength) {
			return;
		}

		// convert to nanometers
		//
		if (wavelength.in) {
			wavelength = wavelength.in('nm');
		}

		if (wavelength < minWavelength) {

			// violet
			//
			r = 0;
			g = 0;
			b = 0;
		} else if (wavelength >= minWavelength && wavelength < 440) {

			// violet
			//
			r = (440 - wavelength) / (440 - minWavelength) / 2;
			g = 0;
			b = (wavelength - minWavelength) / (440 - minWavelength);
		} else if (wavelength >= 440 && wavelength < 490) {

			// blue
			//
			r = 0;
			g = (wavelength - 440) / (490 - 440);
			b = 1;  
		} else if (wavelength >= 490 && wavelength < 510) {

			// green
			//
			r = 0;
			g = 1;
			b = -1 * (wavelength - 510) / (510 - 490);
		} else if (wavelength >= 510 && wavelength < 580) {

			// yellow
			//
			r = (wavelength - 510) / (580 - 510);
			g = 1;
			b = 0;
		} else if (wavelength >= 580 && wavelength < 645) {

			// orange
			//
			r = 1;
			g = (645 - wavelength) / (645 - 580);
			b = 0;
		} else if (wavelength >= 645 && wavelength <= maxWavelength) {

			// red
			//
			r = (maxWavelength - wavelength) / (maxWavelength - 645);
			g = 0;
			b = 0;
		} else {

			// infrared, ultraviolet
			//
			r = 0;
			g = 0;
			b = 0;
		}

		// intensty is lower at the edges of the visible spectrum.
		//
		if (alpha == true) {
			let dropoff = 200;

			if (wavelength > (maxWavelength + dropoff) || wavelength < (minWavelength - dropoff)) {
				alpha = 0;
			} else if (wavelength > maxWavelength) {
				alpha = (maxWavelength - wavelength) / dropoff;
			} else if (wavelength < minWavelength) {
				alpha = (wavelength - minWavelength) / dropoff;
			}
		}

		// convert to rgba color
		//
		r = Math.trunc(r * 255);
		g = Math.trunc(g * 255);
		b = Math.trunc(b * 255);
		if (alpha) {
			return "rgba(" + r + "," + g + "," + b + ", " + alpha + ")";
		} else {
			return "rgb(" + r + "," + g + "," + b + ")";
		}
	},

	wavelengthsToColors: function(wavelengths, alpha) {
		let colors = [];
		if (wavelengths) {
			for (let i = 0; i < wavelengths.length; i++) {
				colors.push(this.wavelengthToColor(wavelengths[i], alpha));
			}
		}
		return colors;
	}
};