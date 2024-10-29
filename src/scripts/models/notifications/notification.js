/******************************************************************************\
|                                                                              |
|                                notification.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an abstract notification class.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Timestamped from '../../models/utilities/timestamped.js';

export default Timestamped.extend({

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/notifications',

	//
	// fetching methods
	//

	dismiss: function(options) {
		return $.ajax(_.extend({
			url: this.url() + '/dismiss',
			type: 'PUT'
		}, options));
	}
});
