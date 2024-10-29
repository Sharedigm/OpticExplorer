/******************************************************************************\
|                                                                              |
|                                  check-in.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a geographical check-in.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Place from '../../models/places/place.js';

export default Place.extend({

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/check-ins',

	//
	// converting methods
	//

	toPlace: function() {
		return new Place({
			name: this.get('name'),
			description: this.get('description'),
			latitude: this.get('latitude'),
			longitude: this.get('longitude'),
			zoom_level: this.get('zoom_level')
		});
	},

	//
	// fetching methods
	//

	checkOut: function(options) {
		return $.ajax(_.extend({
			url: this.url() + '/check-out',
			type: 'PUT'
		}, options));
	}
});
