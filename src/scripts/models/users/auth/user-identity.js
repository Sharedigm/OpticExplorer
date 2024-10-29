/******************************************************************************\
|                                                                              |
|                               user-identity.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model for a user's federated (auth) identity.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Timestamped from '../../../models/utilities/timestamped.js';

export default Timestamped.extend({

	//
	// Backbone attributes
	//

	urlRoot: config.servers.api + '/identities',

	//
	// fetching methods
	//

	setEnabled: function(enabled, options) {
		$.ajax(_.extend(options, {
			url: config.servers.api + '/identities/' + this.get('id') + '/enabled',
			type: 'POST',
			data: {
				enabled_flag: enabled
			},
		}));
	}
});