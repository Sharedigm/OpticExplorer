/******************************************************************************\
|                                                                              |
|                               sidebar-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing an app's sidebar.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SideBarView from '../../../../views/apps/common/sidebar/sidebar-view.js';
import ActivityPanelView from '../../../../views/apps/profile-viewer/sidebar/panels/activity-panel-view.js';
import StatusPanelView from '../../../../views/apps/profile-viewer/sidebar/panels/status-panel-view.js';
import ActionsPanelView from '../../../../views/apps/profile-viewer/sidebar/panels/actions-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['activity', 'status', 'actions', 'mutual_connections'],

	//
	// panel rendering methods
	//

	showPanel: function(panel) {
		let hasMapViewer = config.apps.map_viewer != undefined && config.apps.map_viewer.hidden != true;

		// skip actions panel
		//
		if (panel == 'actions' && !hasMapViewer) {
			return;
		}

		// show specified panel
		//
		switch (panel) {
			case 'activity':
				this.showActivityPanel();
				break;
			case 'status':
				this.showStatusPanel();
				break;
			case 'actions':
				this.showActionsPanel();
				break;
			case 'mutual_connections':
				this.showMutualConnectionsPanel();
				break;
		}
	},

	showActivityPanel: function() {
		this.showChildView('activity', new ActivityPanelView({
			model: this.options.profile
		}));		
	},

	showStatusPanel: function() {
		this.showChildView('status', new StatusPanelView({
			model: this.model
		}));		
	},

	showActionsPanel: function() {
		this.showChildView('actions', new ActionsPanelView({
			model: this.model
		}));		
	},

	showMutualConnectionsPanel: function() {

		// check if we are viewing the profile of the current user
		//
		if (this.model.isCurrent() || !config.apps.profile_browser) {
			return;
		}

		import(
			'../../../../views/apps/profile-viewer/sidebar/panels/mutual-connections-panel-view.js'
		).then((MutualConnectionsPanelView) => {
			this.showChildView('mutual_connections', new MutualConnectionsPanelView.default({
				model: this.model,

				// options
				//
				view_kind: this.options.view_kind,

				// callbacks
				//
				onopen: this.options.onopen
			}));
		});
	}
});