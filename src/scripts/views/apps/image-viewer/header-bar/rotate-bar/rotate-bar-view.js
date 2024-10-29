/******************************************************************************\
|                                                                              |
|                              rotate-bar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a rotate toolbar.                           |
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
import RotateLeftButtonView from '../../../../../views/apps/image-viewer/header-bar/rotate-bar/buttons/rotate-left-button-view.js';
import RotateRightButtonView from '../../../../../views/apps/image-viewer/header-bar/rotate-bar/buttons/rotate-right-button-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="rotate-left" data-toggle="tooltip" title="Rotate Left" data-placement="bottom"></div>
		<div class="rotate-right" data-toggle="tooltip" title="Rotate Right" data-placement="bottom"></div>
	`),

	regions: {
		rotate_left: '.rotate-left',
		rotate_right: '.rotate-right',
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.rotation = 0;
	},

	//
	// setting methods
	//

	setRotation: function(rotation) {

		// set attributes
		//
		this.rotation = rotation;
		this.parent.app.setRotation(rotation);

		// enable / disable buttons
		//
		this.setItemsEnabled(!isNaN(rotation));
	},

	rotateTo: function(rotation) {
		this.parent.app.rotateTo(rotation);	
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
		this.showChildView('rotate_left', new RotateLeftButtonView({
			model: this.model
		}));
		this.showChildView('rotate_right', new RotateRightButtonView({
			model: this.model
		}));

		// set initial state
		//
		this.setItemsEnabled(false);
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// set initial state
		//
		this.setRotation(0);
	}
});
