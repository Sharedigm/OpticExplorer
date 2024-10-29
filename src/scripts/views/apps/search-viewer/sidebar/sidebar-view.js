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
import ParamsPanelView from '../../../../views/apps/search-viewer/sidebar/panels/params-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['params'],

	//
	// panel rendering methods
	//

	showPanel: function(panel) {

		// show specified panel
		//
		switch (panel) {
			case 'params':
				this.showParamsPanel();
				break;
		}
	},

	showParamsPanel: function() {
		this.showChildView('params', new ParamsPanelView());
	}
});