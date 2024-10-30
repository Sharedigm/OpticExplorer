/******************************************************************************\
|                                                                              |
|                                 spectral-lines.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a number of spectral lines commonly used in optics.      |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Units from '../../utilities/math/units.js';

export default {

	cadmium: {
		F1: new Units(479.99, 'nm'),	// blue
		C1: new Units(643.85, 'nm')		// red
	},

	calcium: {
		K: new Units(393.366, 'nm'),	// violet
		H: new Units(396.847, 'nm'),	// violet
		G: new Units(430.774, 'nm'),	// indigo
	},

	cesium: {
		s: new Units(852.11, 'nm')		// IR
	},

	helium: {
		d: new Units(587.562, 'nm'),	// yellow
		r: new Units(706.52, 'nm'),		// red
	},

	hydrogen: {
		h: new Units(410.175, 'nm'),	// indigo
		G: new Units(434.047, 'nm'),	// blue
		F: new Units(486.134, 'nm'),	// blue
		C: new Units(656.27, 'nm')		// red
	},

	iron: {
		T: new Units(302.108, 'nm'),	// violet
		N: new Units(358.121, 'nm'),	// violet
		L: new Units(382.044, 'nm'),	// violet
		G: new Units(430.790, 'nm'),	// indigo
		e: new Units(438.355, 'nm'),	// indigo
		d: new Units(466.814, 'nm'),	// blue
		c: new Units(495.761, 'nm'),	// blue
		b3: new Units(516.891, 'nm'),	// green blue
		E2: new Units(527.039, 'nm'),	// green
	},

	magnesium: {
		b1: new Units(518.362, 'nm'),	// green
		b2: new Units(517.270, 'nm'),	// green
		b4: new Units(516.733, 'nm'),	// green blue
	},

	mercury: {
		i: new Units(365.01, 'nm'),		// ultraviolet
		h: new Units(404.66, 'nm'),		// violet
		g: new Units(435.84, 'nm'),		// cyan
		e: new Units(546.073, 'nm'),	// green
	},

	nickel: {
		t: new Units(299.444, 'nm'),	// violet
	},

	oxygen: {
		a: new Units(627.661, 'nm'),	// orange
		B: new Units(686.719, 'nm'),	// red
		A: new Units(759.370, 'nm'),	// dark red
		Z: new Units(822.696, 'nm'),	// IR
		y: new Units(898.765, 'nm'),	// IR
	},

	potassium: {
		A1: new Units(768.2, 'nm')		// IR
	},

	sodium: {
		D: new Units(589.290, 'nm'),	// yellow
		D1: new Units(589.592, 'nm'),	// yellow
		D2: new Units(588.995, 'nm')	// yellow
	},

	titanium: {
		P: new Units(336.112, 'nm')		// violet
	}
};