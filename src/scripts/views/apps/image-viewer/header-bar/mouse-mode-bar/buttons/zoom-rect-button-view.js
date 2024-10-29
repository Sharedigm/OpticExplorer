/******************************************************************************\
|                                                                              |
|                            zoom-rect-button-view.js                          |
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
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MouseModeButtonView from '../../../../../../views/apps/common/toolbars/buttons/mouse-mode-button-view.js';
import MouseDragZoomRectBehavior from '../../../../../../views/apps/image-viewer/mainbar/behaviors/navigation/mouse-drag-zoom-rect-behavior.js';
import MouseWheelZoomBehavior from '../../../../../../views/apps/image-viewer/mainbar/behaviors/navigation/mouse-wheel-zoom-behavior.js';

export default MouseModeButtonView.extend({

	//
	// attributes
	//
	
	template: '<img class="svg" src="images/icons/binary/select-rect-icon.svg">',

	//
	// activating methods
	//

	activate: function() {
		let app = this.getParentView('app');
		
		// create behaviors
		//
		this.behaviors = [
			new MouseDragZoomRectBehavior(app, {
				button: 1,
				on: false,

				// callbacks
				//
				onfinish: () => {

					// switch to pan mode
					//
					this.parent.getChildView('pan').select();
				}
			}),
			new MouseWheelZoomBehavior(app, {
				on: false
			})
		];
	},

	//
	// event handling methods
	//

	onLoad: function() {
		if (!this.behaviors) {
			this.activate();
		}
	}
});
