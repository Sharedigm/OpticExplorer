/******************************************************************************\
|                                                                              |
|                             nav-mode-bar-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a mouse mode toolbar.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ToolbarView from '../../../../../views/apps/common/toolbars/toolbar-view.js';
import NavModeButtonsView from '../../../../../views/apps/optic-editor/header-bar/nav-mode-bar/nav-mode-buttons-view.js';

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

	getNavMode: function() {
		return this.getChildView('nav_mode').getValue();
	},

	//
	// setting methods
	//
	
	setNavMode: function(navMode) {

		// enable / disble buttons
		//
		this.setItemsEnabled(navMode != undefined);

		// select / deselect actual size button
		//
		this.getChildView('nav_mode').setValue(navMode);
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

		// activate nav mode buttons
		//
		this.getChildView('nav_mode').onActivate();

		// set initial nav mode
		//
		this.setNavMode('pan');
	}
});
