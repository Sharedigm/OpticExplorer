/******************************************************************************\
|                                                                              |
|                                  contact.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an instance of model of a contact message.               |
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

	urlRoot: config.servers.api + '/contacts',

	//
	// ajax methods
	//

	save: function(attributes, options) {

		// create form data
		//
		let formData = new FormData();
		let keys = Object.keys(attributes);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let value = attributes[key];
			formData.append(key, value);
		}

		$.ajax(_.extend({}, options, {
			type: 'POST',
			url: this.urlRoot,
			data: formData,
			contentType: false,
			processData: false
		}));
	}
});