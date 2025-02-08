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

import Connections from '../../../../collections/connections/connections.js';
import UsersView from '../../../../views/apps/profile-browser/mainbar/users/users-view.js';

export default UsersView.extend({

	//
	// attributes
	//

	className: 'user connections panel',

	//
	// constructor
	//

	initialize: function() {
		if (!this.collection) {
			this.collection = new Connections();
		}
	},

	//
	// loading methods
	//

	load: function(model) {
		this.request = this.collection.fetchByUser(model, {

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
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		UsersView.prototype.onRender.call(this);

		// load user's connections
		//
		if (this.model && this.options.load) {
			this.load(this.model);
		}
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