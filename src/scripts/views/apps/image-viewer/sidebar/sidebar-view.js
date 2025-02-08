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
import FavoritesPanelView from '../../../../views/apps/image-viewer/sidebar/panels/favorites-panel-view.js';
import ImagesPanelView from '../../../../views/apps/image-viewer/sidebar/panels/images-panel-view.js';
import FilesPanelView from '../../../../views/apps/image-viewer/sidebar/panels/files-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['favorites', 'images', 'files'],

	//
	// attribute methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();

		return {
			'favorites': isSignedIn,
			'images': true,
			'files': isSignedIn
		};
	},

	//
	// querying methods
	//

	hasSelected: function() {
		if (this.hasChildView('images')) {
			return this.getChildView('images').hasSelected();
		}
	},

	hasSelectedFiles: function() {
		if (this.hasChildView('files')) {
			return this.getChildView('files').hasSelected();
		}
	},

	hasSelectedItems: function() {
		return this.hasSelected() || this.hasSelectedFiles();
	},

	//
	// getting methods
	//

	getSelected: function() {
		return this.getChildView('images').getSelected();
	},

	getSelectedModels: function() {
		return this.getChildView('images').getSelectedModels();
	},

	getSelectedFiles: function() {
		return this.getChildView('files').getSelected();
	},

	getSelectedItems: function() {
		if (this.hasSelectedFiles()) {
			return this.getSelectedFiles();
		} else {
			return this.getSelectedModels();
		}
	},
	
	//
	// setting methods
	//

	setModel: function(model) {

		// update attributes
		//
		this.model = model;

		// update panels
		//
		if (this.hasChildView('exif_info')) {
			this.showImageInfo();
		}
	},

	setSelected: function(model, options) {
		this.getChildView('images').setSelectedModel(model, options);

		// scroll into view
		//
		this.scrollToView(this.getSelected()[0]);
	},

	//
	// rendering methods
	//

	update: function() {
		this.showPanels();
	},

	clear: function() {
		this.model = null;
		this.showPanels();
	},

	//
	// panel rendering methods
	//

	showPanel: function(panel) {

		// show specified panel
		//
		switch (panel) {
			case 'favorites':
				this.showFavoritesPanel();
				break;
			case 'images':
				this.showImagesPanel();
				break;
			case 'files':
				this.showFilesPanel();
				break;
		}
	},

	showFavoritesPanel: function() {
		this.showChildView('favorites', new FavoritesPanelView({

			// options
			//
			view_kind: this.options.view_kind,

			// callback options
			//
			onchange: this.options.onchange,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		}));
	},

	showImagesPanel: function() {
		this.showChildView('images', new ImagesPanelView({
			model: this.model,
			collection: this.collection,

			// options
			//
			view_kind: this.options.view_kind,
			tile_size: this.options.tile_size
		}));		
	},

	showFilesPanel: function() {
		this.showChildView('files', new FilesPanelView({
			model: application.getDirectory(),

			// options
			//
			view_kind: this.options.view_kind,

			// callbacks
			//
			onchange: () => this.onChange(),
			onselect: (item) => this.onOpen(item)
		}));
	},

	//
	// event handling methods
	//

	onChange: function() {

		// update panels
		//
		if (this.hasChildView('files')) {
			this.getChildView('files').update();
		}

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	}
});