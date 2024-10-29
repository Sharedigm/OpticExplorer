/******************************************************************************\
|                                                                              |
|                             nav-mode-bar-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a nav mode toolbar.                         |
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
import NavModeButtonsView from '../../../../../views/apps/map-viewer/header-bar/nav-mode-bar/nav-mode-buttons-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="nav-mode"></div>
	`),

	regions: {
		nav_mode: '.nav-mode'
	},

	//
	// getting methods
	//

	getMouseMode: function() {
		return this.getChildView('nav_mode').getValue();
	},

	//
	// setting methods
	//
	
	setMouseMode: function(mouseMode) {

		// enable / disable buttons
		//
		this.setItemsEnabled(mouseMode != undefined);

		// select / deselect actual size button
		//
		this.getChildView('nav_mode').setValue(mouseMode);
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
		this.showChildView('nav_mode', new NavModeButtonsView({
			model: this.model,
			viewport: this.options.viewport,
			preferences: this.options.preferences
		}));
	},

	//
	// event handling methods
	//

	onActivate: function() {

		// activate mouse mode buttons
		//
		this.getChildView('nav_mode').onActivate();

		// set initial mouse mode
		//
		this.setMouseMode('pan');
	}
});
