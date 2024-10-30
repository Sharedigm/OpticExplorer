/******************************************************************************\
|                                                                              |
|                               tab-pane-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying code tabs.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import EditableTabPaneView from '../../../../../../views/apps/common/mainbar/tabbed-content/editable-tab-panes/editable-tab-pane-view.js';
import SpectrumPanelView from '../../../../../../views/apps/spectrum-editor/mainbar/tabbed-content/panels/spectrum-panel-view.js';

export default EditableTabPaneView.extend({

	//
	// rendering methods
	//

	onAttach: function() {

		// call superclass method
		//
		EditableTabPaneView.prototype.onAttach.call(this);

		// load tab pane contents
		//
		this.loadFile(this.model);
	},

	getContentView: function() {
		return new SpectrumPanelView({
			model: this.model,

			// options
			//
			preferences: this.options.preferences,
			show_sidebar: this.options.show_sidebar,
			sidebar_size: this.options.sidebar_size,
			view_kind: this.options.view_kind,
			app_count: this.options.app_count,
			tab_count: parseInt(this.id().replace('tab-pane', '')),
			colors: this.options.colors
		});
	}
});