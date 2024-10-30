/******************************************************************************\
|                                                                              |
|                          select-rect-button-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a particular type of toolbar button.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MouseModeButtonView from '../../../../../../views/apps/common/toolbars/buttons/mouse-mode-button-view.js';
import MouseDragSelectBehavior from '../../../../../../views/svg/viewports/behaviors/selection/mouse-drag-select-behavior.js';
import MouseWheelZoomBehavior from '../../../../../../views/svg/viewports/behaviors/navigation/mouse-wheel-zoom-behavior.js';

export default MouseModeButtonView.extend({

	//
	// attributes
	//
	
	template: '<img class="svg" src="images/icons/binary/cursor-rect-icon.svg">',

	//
	// activating methods
	//

	activate: function() {
		let viewport = this.getParentView('app').getActiveViewport();

		if (this.behaviors) {
			this.off();
		}

		// create behaviors
		//
		this.behaviors = [
			new MouseDragSelectBehavior(viewport, {
				button: 1,
				on: false
			}),
			new MouseWheelZoomBehavior(viewport, {
				on: false
			})
		];
	},

	//
	// event handling methods
	//

	onActivate: function() {
		this.activate();
	}
});
