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
import ActionsPanelView from '../../../../views/apps/theme-manager/sidebar/panels/actions-panel-view.js';
import ThemesPanelView from '../../../../views/apps/theme-manager/sidebar/panels/themes-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['actions', 'themes'],

	//
	// attribute methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();

		return {
			'actions': true,
			'themes': isSignedIn
		};
	},

	//
	// querying methods
	//

	hasSelected: function() {
		if (this.hasChildView('themes')) {
			return this.getChildView('themes').hasSelected();
		}
	},

	//
	// setting methods
	//

	setSelected: function(model, options) {
		if (this.hasChildView('themes')) {
			this.getChildView('themes').setSelectedModel(model, options);

			// scroll into view
			//
			let selected = this.getChildView('themes').getSelected();
			if (selected) {
				this.scrollToView(selected[0]);
			}
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
			case 'themes':
				this.showThemesPanel();
				break;
		}
	},

	showActionsPanel: function() {
		this.showChildView('actions', new ActionsPanelView());		
	},
	
	showThemesPanel: function() {
		this.showChildView('themes', new ThemesPanelView({
			model: this.model,

			// options
			//
			view_kind: this.options.view_kind,

			// callbacks
			//
			onload: this.options.onload
		}));		
	}
});