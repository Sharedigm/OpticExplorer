/******************************************************************************\
|                                                                              |
|                                   links.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of links.                              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Link from '../../../models/storage/sharing/link.js';
import BaseCollection from '../../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: Link,

	//
	// fetching methods
	//

	fetchByItem: function(item, options) {
		return this.fetch(_.extend(options, {
			url: Link.prototype.urlRoot + '?' + item.getQueryString()
		}));
	},

	fetchByUser: function(user, options) {
		return this.fetch(_.extend(options, {
			url: user.url() + '/links'
		}));
	}
});