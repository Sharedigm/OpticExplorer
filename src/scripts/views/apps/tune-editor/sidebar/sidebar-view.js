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
import TunesPanelView from '../../../../views/apps/tune-editor/sidebar/panels/tunes-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['tunes'],

	//
	// attribute methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();

		return {
			'tunes': isSignedIn
		};
	},

	//
	// setting methods
	//

	setDirectory: function(directory, options) {
		this.getChildView('tunes').setDirectory(directory, options);
	},

	setSelectedModel: function(model, options) {
		this.getChildView('tunes').setSelectedModel(model, options);
	},

	//
	// panel rendering methods
	//

	showPanel: function(panel) {

		// show specified panel
		//
		switch (panel) {
			case 'tunes':
				this.showTunesPanel();
				break;
		}
	},

	showTunesPanel: function() {
		this.showChildView('tunes', new TunesPanelView({
			model: this.model,
			collection: this.collection,

			// options
			//
			view_kind: this.options.view_kind
		}));		
	}
});