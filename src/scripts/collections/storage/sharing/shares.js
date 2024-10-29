/******************************************************************************\
|                                                                              |
|                                   shares.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of shared items.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Share from '../../../models/storage/sharing/share.js';
import BaseCollection from '../../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: Share,

	//
	// fetching methods
	//

	fetchReceivedBy: function(user, options) {
		return this.fetch(_.extend(options, {
			url: user.url() + '/shares/received'
		}));
	},

	fetchSentBy: function(user, options) {
		return this.fetch(_.extend(options, {
			url: user.url() + '/shares/sent'
		}));
	}
});
