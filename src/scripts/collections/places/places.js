/******************************************************************************\
|                                                                              |
|                                  places.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of geographical places.                |
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
import BaseCollection from '../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: Place,
	url: config.servers.api + '/places',
	comparator: 'name',

	//
	// fetching methods
	//

	fetchByCurrentUser: function(options) {
		return this.fetch(_.extend(options, {
			url: this.url
		}));
	}
});
