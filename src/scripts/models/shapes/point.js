/******************************************************************************\
|                                                                              |
|                                   point.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a model of a basic point shape.               |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../models/base-model.js';

export default BaseModel.extend({

	//
	// querying methods
	//

	getValue: function() {
		return this.get('location');
	},

	//
	// setting methods
	//

	moveTo: function(location) {
		this.set('location', location);
	}
});