/******************************************************************************\
|                                                                              |
|                         connection-requests-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a list of connection requests.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ConnectionRequests from '../../../../collections/connections/connection-requests.js';
import BaseView from '../../../../views/base-view.js';
import ConnectionRequestsListView from '../../../../views/apps/connection-manager/connection-requests/lists/connection-requests-list-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<h1 class="mobile-only"><i class="fa fa-user-plus"></i>My Connection Requests</h1>
		
		<div class="connection-requests panel"></div>
	`),

	regions: {
		connection_requests: '.connection-requests'
	},

	//
	// rendering methods
	//

	onRender: function() {

		// fetch connection requests
		//
		new ConnectionRequests().fetchPendingReceivedBy(this.model, {

			// callbacks
			//
			success: (collection) => {

				// show list view
				//
				this.showConnectionRequestsList(collection);
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not get connection requests.",
					response: response
				});
			}
		});
	},

	showConnectionRequestsList: function(collection) {
		this.showChildView('connection_requests', new ConnectionRequestsListView({
			collection: collection,
			multicolumn: true
		}));
	}
});