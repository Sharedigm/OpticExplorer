/******************************************************************************\
|                                                                              |
|                                 s3-storage.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a remote file system.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../models/base-model.js';

export default BaseModel.extend({

	//
	// attributes
	//

	defaults: {
		host: undefined,
		key: undefined,
		secret: undefined,
		region: undefined,
		bucket: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/storage',

	//
	// querying methods
	//

	check: function(options) {
		$.ajax(_.extend({}, options, {
			url: this.urlRoot + '/exists',
			type: 'GET',
			data: this.attributes
		}));
	}
});