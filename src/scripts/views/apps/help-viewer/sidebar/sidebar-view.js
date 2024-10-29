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
import IndexPanelView from '../../../../views/apps/help-viewer/sidebar/panels/index-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['index'],

	//
	// querying methods
	//

	hasSelected: function() {
		if (this.hasChildView('index')) {
			return this.getChildView('index').hasSelected();
		}
	},

	//
	// getting methods
	//

	getSelected: function() {
		return this.getChildView('index').getSelected();
	},

	getItemViewByAttribute: function(key, value) {
		return this.getChildView('index').getItemViewByAttribute(key, value);
	},

	//
	// setting methods
	//

	setItemView: function(itemView) {

		// set sidebar to current selection
		//
		this.deselectAll();
		itemView.select({
			silent: true
		});

		// scroll into view
		//
		this.scrollToView(itemView);
	},

	//
	// selecting methods
	//

	deselectAll: function() {
		return this.getChildView('index').deselectAll();
	},

	//
	// panel rendering methods
	//

	showPanel: function(panel) {

		// show specified panel
		//
		switch (panel) {
			case 'index':
				this.showIndexPanel();
				break;
		}
	},

	showIndexPanel: function() {
		this.showChildView('index', new IndexPanelView({
			model: this.model,
			
			// callbacks
			//
			onselect: this.options.onselect
		}));		
	}
});