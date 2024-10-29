/******************************************************************************\
|                                                                              |
|                           user-connections-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for viewing a user's connections.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Connections from '../../../../../collections/users/connections/connections.js';
import UsersView from '../../../../../views/apps/profile-browser/mainbar/users/users-view.js';

export default UsersView.extend({

	//
	// attributes
	//

	className: 'user connections panel',

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.collection = new Connections();
	},

	//
	// rendering methods
	//
	
	onRender: function() {

		// fetch user's connections
		//
		this.request = this.collection.fetchByUser(this.model, {

			// callbacks
			//
			success: () => {
				if (this.collection.length == 0) {
					this.$el.prepend('No connections.');
				} else {
					UsersView.prototype.onRender.call(this);
				}
			},

			error: () => {
				if (this.collection.length == 0) {
					this.$el.prepend('No connections.');
				}
			}
		});
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// abort request
		//
		if (this.request && this.request.state() == 'pending') {
			this.request.abort();
		}
	}
});