/******************************************************************************\
|                                                                              |
|                               common-materials.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a small catalog of common standard materials.                 |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Material from '../../../../models/optics/materials/material.js';
import Materials from '../../../../collections/optics/materials/materials.js';

export default new Materials([

	// common materials
	//
	new Material({
		name: 'water',
		index_of_refraction: 1.3330, 
		abbe_number: 56,
		catalog: 'Materials'
	}),
	new Material({
		name: 'air',
		index_of_refraction: 1.00028, 
		abbe_number: 89.30,
		catalog: 'Materials'
	}),
	new Material({
		name: 'flourite',
		index_of_refraction: 1.433, 
		abbe_number: 95,
		catalog: 'Materials'
	}),
	/*
	new Material({
		name: 'sapphire',
		index_of_refraction: 1.77, 
		abbe_number: 72.2,
		catalog: 'Materials'
	}),
	*/
	new Material({
		name: 'diamond',
		index_of_refraction: 2.417, 
		abbe_number: 55,
		catalog: 'Materials'
	}),
	new Material({
		name: 'sapphire',
		formula: 'sellmeier',
		coeffs: [
			1.43134930,
			5.2799261e-3,
			0.65054713,
			1.42382647e-2,
			5.3414021,
			3.25017834e2
		],
		catalog: 'Materials'
	}),
	new Material({
		name: 'fused quartz',
		formula: 'sellmeier2',
		coeffs: [
			0.6961663,
			0.0684043,
			0.4079426,
			0.1162414,
			0.8974794,
			9.896161
		],
		catalog: 'Materials'
	}),
	new Material({
		name: 'vacuum',
		index_of_refraction: 1, 
		abbe_number: 0,
		catalog: 'Materials'
	})
]);