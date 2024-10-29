/******************************************************************************\
|                                                                              |
|                               pan-button-view.js                             |
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
import MouseDragPanBehavior from '../../../../../../views/apps/image-viewer/mainbar/behaviors/navigation/mouse-drag-pan-behavior.js';
import MouseDragZoomBehavior from '../../../../../../views/apps/image-viewer/mainbar/behaviors/navigation/mouse-drag-zoom-behavior.js';
import MouseWheelZoomBehavior from '../../../../../../views/apps/image-viewer/mainbar/behaviors/navigation/mouse-wheel-zoom-behavior.js';
import Browser from '../../../../../../utilities/web/browser.js';

export default MouseModeButtonView.extend({

	//
	// attributes
	//
	
	template: '<i class="fa fa-arrows-alt"></i>',

	//
	// activating methods
	//

	activate: function() {
		let app = this.getParentView('app');

		// create behaviors
		//
		if (Browser.is_touch_enabled) {
			this.behaviors = [
				new MouseWheelZoomBehavior(app, {
					on: false
				})
			];
		} else {
			this.behaviors = [
				new MouseDragPanBehavior(app, {
					button: 1,
					on: false
				}),
				new MouseDragZoomBehavior(app, {
					button: 2,
					on: false
				}),
				new MouseWheelZoomBehavior(app, {
					on: false
				})
			];
		}
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
