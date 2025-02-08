/******************************************************************************\
|                                                                              |
|                            connection-requests.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of connection requests.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ConnectionRequest from '../../models/connections/connection-request.js';
import BaseCollection from '../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: ConnectionRequest,

	//
	// fetching methods
	//

	fetchPendingReceivedBy: function(user, options) {
		return this.fetch(_.extend(options, {
			url: user.url() + '/connection-requests/received/pending'
		}));
	},

	fetchPendingSentBy: function(user, options) {
		return this.fetch(_.extend(options, {
			url: user.url() + '/connection-requests/sent/pending'
		}));
	},

	fetchReceivedBy: function(user, options) {
		return this.fetch(_.extend(options, {
			url: user.url() + '/connection-requests/received'
		}));
	},

	fetchSentBy: function(user, options) {
		return this.fetch(_.extend(options, {
			url: user.url() + '/connection-requests/sent'
		}));
	}
});
