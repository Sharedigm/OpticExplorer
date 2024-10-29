/******************************************************************************\
|                                                                              |
|                                     app.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an application.                               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../models/base-model.js';

export default BaseModel.extend({

	//
	// attributes
	//

	defaults: {
		id: undefined,
		name: 'Application',
		icon: undefined,
		enabled: true,
		group: undefined
	},

	//
	// getting methods
	//

	getImage: function() {
		return '<img src="images/icons/apps/' + this.get('app') + '.svg" />';
	},

	getIcon: function() {
		return '<i class="fa ' + this.get('icon') + '"></i>';
	},

	getName: function() {
		return this.get('name');
	}
});
