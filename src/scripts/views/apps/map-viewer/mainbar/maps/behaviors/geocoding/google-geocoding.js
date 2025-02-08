/******************************************************************************\
|                                                                              |
|                              google-geocoding.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for converting addresses to geocoords.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import URL from '../../../../../../../utilities/web/url.js';

export default {

	//
	// ajax geocoding methods
	//

	fetchByAddress: function(address, options) {
		let server = config.geocoding.google.server;

		// compose query url
		//
		let url = server + '?address=' + URL.encode(address) + '&key=' + config.geocoding.google.apiKey;

		// make geocoding request
		//
		$.ajax(_.extend({}, options, {
			url: config.servers.api + '/proxy?url=' + URL.encode(url),
			type: 'GET',
			dataType: 'JSON',

			// callbacks
			//
			success: (data) => {
				if (options.success) {
					if (data.results) {
						options.success({
							latitude: data.results[0].geometry.location.lat, 
							longitude: -data.results[0].geometry.location.lng
						});
					} else {
						options.success();
					}
				}
			}
		}));
	}
};