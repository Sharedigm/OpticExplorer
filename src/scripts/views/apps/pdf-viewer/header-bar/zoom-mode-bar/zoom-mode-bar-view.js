/******************************************************************************\
|                                                                              |
|                             zoom-mode-bar-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a zoom mode toolbar.                        |
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
import ZoomModeButtonsView from '../../../../../views/apps/image-viewer/header-bar/zoom-mode-bar/zoom-mode-buttons-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	template: template(`<div class="zoom-mode"></div>`),

	regions: {
		zoom_mode: '.zoom-mode'
	},

	//
	// getting methods
	//

	getValue: function() {
		return this.getChildView('zoom_mode').getValue();
	},

	//
	// setting methods
	//
	
	setValue: function(zoomMode) {

		// enable / disable buttons
		//
		this.setItemsEnabled(zoomMode != undefined);

		// select / deselect actual size button
		//
		this.getChildView('zoom_mode').setValue(zoomMode);
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
		this.showChildView('zoom_mode', new ZoomModeButtonsView({
			model: this.model,
			selected: this.options.zoom
		}));

		// set initial state
		//
		this.setItemsEnabled(false);
	}
});