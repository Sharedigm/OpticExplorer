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
import VideosPanelView from '../../../../views/apps/video-player/sidebar/panels/videos-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['videos'],

	//
	// querying methods
	//

	hasSelected: function() {
		if (this.hasChildView('videos')) {
			return this.getChildView('videos').hasSelected();
		}
	},

	//
	// getting methods
	//

	getSelected: function() {
		return this.getChildView('videos').getSelected();
	},

	getSelectedModels: function() {
		return this.getChildView('videos').getSelectedModels();
	},
	
	//
	// setting methods
	//

	setModel: function(model) {

		// update attributes
		//
		this.model = model;
	},

	setSelected: function(model, options) {
		this.getChildView('videos').setSelectedModel(model, options);

		// scroll into view
		//
		this.scrollToView(this.getSelected()[0]);
	},

	//
	// panel rendering methods
	//

	showPanel: function(panel) {

		// show specified panel
		//
		switch (panel) {
			case 'videos':
				this.showVideosPanel();
				break;
		}
	},

	showVideosPanel: function() {
		this.showChildView('videos', new VideosPanelView({
			model: this.model,
			collection: this.collection,

			// options
			//
			view_kind: this.options.view_kind,
			tile_size: this.options.tile_size
		}));		
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.showVideosPanel();
	}
});