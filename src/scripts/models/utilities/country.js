/******************************************************************************\
|                                                                              |
|                                     country.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an instance of model of a country.                       |
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
	// ajax attributes
	//

	urlRoot: config.servers.api + '/countries',

	//
	// getting methods
	//

	getFlag: function() {
		return this.get('iso').toLowerCase();
	}
});