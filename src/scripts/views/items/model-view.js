/******************************************************************************\
|                                                                              |
|                                 model-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract base class for creating views.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../views/base-view.js';

export default BaseView.extend({

	//
	// querying methods
	//

	is: function(state) {
		if (this.model) {
			return this.model.is(state);
		}
	},

	has: function(key) {
		if (this.model) {
			return this.model.has(key);
		}
	},

	//
	// getting methods
	//

	get: function(key) {
		if (this.model) {
			return this.model.get(key);
		}
	},
	
	//
	// setting methods
	//

	set: function(key, value) {
		if (value == undefined) {
			this.model.set(key);
		} else {
			this.model.set(key, value);
		}
	}
});