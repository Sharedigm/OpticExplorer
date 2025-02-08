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
import GroupsPanelView from '../../../../views/apps/connection-manager/sidebar/panels/groups-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['groups'],

	//
	// attribute methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();

		return {
			'groups': isSignedIn
		};
	},

	//
	// querying methods
	//

	hasSelected: function() {
		if (this.hasChildView('groups')) {
			return this.getChildView('groups').hasSelected();
		}
	},

	//
	// counting methods
	//

	numSelected: function() {
		if (this.hasChildView('groups')) {
			return this.getChildView('groups').numSelected();
		}
	},

	//
	// getting methods
	//

	getSelected: function() {
		if (this.hasChildView('groups')) {
			return this.getChildView('groups').getSelected();
		}
	},

	getSelectedModel: function() {
		if (this.hasChildView('groups')) {
			return this.getChildView('groups').getSelectedModel();
		}
	},

	getSelectedModels: function() {
		if (this.hasChildView('groups')) {
			return this.getChildView('groups').getSelectedModels();
		}
	},

	//
	// selecting methods
	//

	select: function(which) {
		let itemsView = this.getChildView('groups').getChildView('items').getChildView('items');
		let itemView = itemsView.getChildView(which);

		// select next item
		//
		itemsView.deselectAll();
		itemView.select();

		// scroll into view
		//
		this.scrollToView(itemView);
	},

	//
	// panel rendering methods
	//
	
	showPanel: function(panel) {

		// show specified panel
		//
		switch (panel) {
			case 'groups':
				this.showGroupsPanel();
				break;
		}
	},

	showGroupsPanel: function() {
		this.showChildView('groups', new GroupsPanelView({
			collection: this.collection,
			
			// options
			//
			view_kind: this.options.view_kind,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			onchange: this.options.onchange
		}));	
	},

	//
	// event handling methods
	//

	onChange: function() {

		// update panels
		//
		this.getChildView('groups').onChange();
	}
});