/******************************************************************************\
|                                                                              |
|                                    countries.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of countries.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Country from '../../models/utilities/country.js';
import NamedCollection from '../../collections/utilities/named-collection.js';

export default NamedCollection.extend({

	//
	// attributes
	//

	model: Country,

	//
	// fetching methods
	//

	fetch: function(options) {
		return NamedCollection.prototype.fetch.call(this, _.extend({}, options, {
			url: Country.prototype.urlRoot
		}));
	}
});