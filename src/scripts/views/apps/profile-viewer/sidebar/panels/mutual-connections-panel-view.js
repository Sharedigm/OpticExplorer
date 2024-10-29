/******************************************************************************\
|                                                                              |
|                       mutual-connections-panel-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a type of sidebar panel.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import Connections from '../../../../../collections/users/connections/connections.js';
import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import UsersView from '../../../../../views/apps/profile-browser/mainbar/users/users-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'mutual-connections panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-user-friends"></i>Mutual</label>
		</div>
		
		<div class="items"></div>
	`),

	regions: {
		'items': '.items'
	},

	//
	// rendering methods
	//

	onRender: function() {

		// fetch mutual connections
		//
		new Connections().fetchMutual(application.session.user, this.model, {

			// callbacks
			//
			success: (collection) => {

				// show mutual connections
				//
				this.showMutualConnections(collection);
			}
		});		
	},

	showMutualConnections: function(collection) {

		// show list of mutual connections
		//
		this.showChildView('items', new UsersView({
			collection: collection,

			// options
			//
			preferences: new UserPreferences({
				view_kind: this.options.view_kind
			}),
			empty: "No connections.",

			// capabilities
			//
			selectable: true,

			// callbacks
			//
			onopen: this.options.onopen
		}));
	}
});