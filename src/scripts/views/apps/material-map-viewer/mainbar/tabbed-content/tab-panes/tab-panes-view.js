/******************************************************************************\
|                                                                              |
|                              tab-panes-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying tab panes.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import EditableTabPanesView from '../../../../../../views/apps/common/mainbar/tabbed-content/editable-tab-panes/editable-tab-panes-view.js';
import TabPaneView from '../../../../../../views/apps/material-map-viewer/mainbar/tabbed-content/tab-panes/tab-pane-view.js';
import AbbeToolbarView from '../../../../../../views/apps/material-map-viewer/mainbar/toolbar/abbe-toolbar-view.js';

export default EditableTabPanesView.extend({

	//
	// attributes
	//

	childView: TabPaneView,

	template: template(`
		<div class="abbe panes"></div>
		<div class="toolbar"></div>
	`),

	childViewContainer: '.panes',

	regions: {
		'toolbar': {
			el: '.toolbar',
			replaceElement: true
		}
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {
			
			// mainbar options
			//
			case 'show_toolbar':
				this.setToolbarVisibility(value);
				break;

			default:
				for (let i = 0; i < this.children.length; i++) {
					this.getChildViewAt(i).setOption(key, value);
				}
		}
	},

	setToolbarVisibility: function(visible) {
		if (visible) {
			this.getChildView('toolbar').$el.show();
		} else {
			this.getChildView('toolbar').$el.hide();
		}
	},

	//
	// rendering methods
	//

	onAttach: function() {
		this.showChildView('toolbar', new AbbeToolbarView({
			parent: this
		}));

		// hide toolbar
		//
		if (this.options.preferences) {
			let toolbars = this.options.preferences.get('toolbars');
			if (!toolbars.includes('map')) {
				this.setToolbarVisibility(false);
			}
		}
	}
});