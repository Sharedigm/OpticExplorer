/******************************************************************************\
|                                                                              |
|                            us-census-geocoding.js                            |
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

		// prepare address format for geocoder
		//
		address = address.replace(/,/g, ' ').replace(/\s+/g, '+');

		// compose query url
		//
		let url = config.geocoding.us_census.server + '&' + config.geocoding.us_census.appKey + '=' + address;

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
					if (data.result && data.result.addressMatches.length > 0) {
						let coords = data.result.addressMatches[0].coordinates;
						options.success({
							latitude: coords.y,
							longitude: -coords.x,				
						});
					} else {
						options.success();
					}
				}
			}
		}));
	}
};