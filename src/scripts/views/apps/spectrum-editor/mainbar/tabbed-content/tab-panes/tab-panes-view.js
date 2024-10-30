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
import TabPaneView from '../../../../../../views/apps/spectrum-editor/mainbar/tabbed-content/tab-panes/tab-pane-view.js';

export default EditableTabPanesView.extend({

	//
	// attributes
	//

	childView: TabPaneView,

	template: template(`
		<div class="chart panes"></div>
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
		this.setChildOptions(key, value);
	},

	setChildOptions: function(key, value) {
		for (let i = 0; i < this.children.length; i++) {
			this.getChildViewAt(i).setOption(key, value);
		}
	}
});