/******************************************************************************\
|                                                                              |
|                                base-object.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a base light emitting object.               |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../models/base-model.js';

export default BaseModel.extend({

	//
	// converting methods
	//

	toObject: function() {
		let object = {};

		// add optional attributes
		//
		if (this.has('color')) {
			object.color = '"' + this.get('color') + '"';
		}

		return object;
	},
});