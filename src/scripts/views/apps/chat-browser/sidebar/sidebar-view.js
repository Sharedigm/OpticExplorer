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
import ActionsPanelView from '../../../../views/apps/chat-browser/sidebar/panels/actions-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['actions'],

	//
	// setting methods
	//

	setNumSelected: function(numSelected) {
		if (this.hasChildView('actions')) {
			this.getChildView('actions').setNumSelected(numSelected);
		}
	},

	//
	// panel rendering methods
	//

	showPanel: function(panel) {

		// show specified panel
		//
		switch (panel) {
			case 'actions':
				this.showActionsPanel();
				break;
		}
	},

	showActionsPanel: function() {
		this.showChildView('actions', new ActionsPanelView({
			hidden: this.options.hidden,
			onsave: this.options.onsave
		}));		
	},

	//
	// event handling methods
	//

	onChangeSelected: function() {
		this.getChildView('actions').onChangeSelected();
	}
});