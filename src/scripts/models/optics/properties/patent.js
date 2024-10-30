/******************************************************************************\
|                                                                              |
|                                     patent.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a patent reference.                           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Backbone from '../../../backbone.js';

export default Backbone.Model.extend({

	//
	// attributes
	//

	defaults: {
		'country-code': 'US',
		'year': undefined,
		'number': undefined,
		'type': 'A1'
	}
});