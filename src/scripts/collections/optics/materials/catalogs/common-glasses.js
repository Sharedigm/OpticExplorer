/******************************************************************************\
|                                                                              |
|                                common-glasses.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a small catalog of common standard glass types.               |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Material from '../../../../models/optics/materials/material.js';
import Materials from '../../../../collections/optics/materials/materials.js';

export default new Materials([

	// common glass types
	//
	new Material({
		name: 'Crown',
		index_of_refraction: 1.52, 
		abbe_number: 75,
		catalog: 'Common'
	}),
	new Material({
		name: 'Flint',
		index_of_refraction: 1.65, 
		abbe_number: 50,
		catalog: 'Common'
	}),
	new Material({
		name: 'BK7',
		index_of_refraction: 1.5168,
		abbe_number: 64.17
	})
]);