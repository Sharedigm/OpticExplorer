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
import FilesPanelView from '../../../../views/apps/code-editor/sidebar/panels/files-panel-view.js';
import FavoritesPanelView from '../../../../views/apps/code-editor/sidebar/panels/favorites-panel-view.js';

export default SideBarView.extend(_.extend({

	//
	// attributes
	//

	panels: ['favorites', 'files'],

	//
	// attribute methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();

		return {
			'favorites': isSignedIn,
			'files': isSignedIn
		};
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('files')) {
			this.getChildView('files').each(callback, filter, options);
		}
	},

	//
	// querying methods
	//

	hasSelectedItems: function() {
		if (this.hasChildView('files')) {
			return this.getChildView('files').hasSelected();
		} else {
			return false;
		}
	},

	//
	// getting methods
	//

	getSelectedItems: function() {
		if (this.hasChildView('files')) {
			return this.getChildView('files').getSelectedModels();
		} else {
			return [];
		}
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

	showFilesPanel: function() {
		this.showChildView('files', new FilesPanelView({
			model: this.model,

			// options
			//
			view_kind: this.options.view_kind,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen
		}));		
	}
}));