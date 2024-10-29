/******************************************************************************\
|                                                                              |
|                              button-bar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a file toolbar.                             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ToolbarView from '../../../../../views/apps/common/toolbars/toolbar-view.js';
import NewButtonView from '../../../../../views/apps/map-viewer/header-bar/button-bar/buttons/new-button-view.js';
import OpenButtonView from '../../../../../views/apps/map-viewer/header-bar/button-bar/buttons/open-button-view.js';
import SaveButtonView from '../../../../../views/apps/map-viewer/header-bar/button-bar/buttons/save-button-view.js';
import ResetButtonView from '../../../../../views/apps/map-viewer/header-bar/button-bar/buttons/reset-button-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	className: 'toolbar',

	template: template(`
		<div class="new-map" data-toggle="tooltip" title="New Map" data-placement="bottom"></div>
		<div class="open-map" data-toggle="tooltip" title="Open Map" data-placement="bottom"></div>
		<div class="save-map" data-toggle="tooltip" title="Save Map" data-placement="bottom"></div>
		<div class="reset-view" data-toggle="tooltip" title="Reset" data-placement="bottom"></div>
	`),

	regions: {
		new: '.new-map',
		open: '.open-map',
		save: '.save-map',
		reset: '.reset-view'
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ToolbarView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('new', new NewButtonView());
		this.showChildView('open', new OpenButtonView());
		this.showChildView('save', new SaveButtonView());
		this.showChildView('reset', new ResetButtonView());
	}
});
