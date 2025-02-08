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
import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';

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
		application.loadAppView('connection_manager', {

			// callbacks
			//
			success: (ConnectionManagerView) => {

				// fetch mutual
				//
				ConnectionManagerView.fetchMutualConnections(this.model, {

					// callbacks
					//
					success: (connections) => {
						this.showConnections(connections);
					}
				})
			}
		});
	},

	showConnections: function(connections) {
		application.loadAppView('profile_browser', {

			// callbacks
			//
			success: (ProfileBrowserView) => {
				this.showChildView('items', ProfileBrowserView.getUsersView({
					collection: connections,

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
	}
});