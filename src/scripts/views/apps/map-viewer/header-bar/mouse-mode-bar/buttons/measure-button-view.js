/******************************************************************************\
|                                                                              |
|                              measure-button-view.js                          |
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
import MouseDragMeasureBehavior from '../../../../../../views/apps/map-viewer/mainbar/behaviors/measuring/mouse-drag-measure-behavior.js';
import MouseDragZoomBehavior from '../../../../../../views/svg/viewports/behaviors/navigation/mouse-drag-zoom-behavior.js';
import MouseWheelZoomBehavior from '../../../../../../views/svg/viewports/behaviors/navigation/mouse-wheel-zoom-behavior.js';

export default MouseModeButtonView.extend({

	//
	// attributes
	//
	
	template: '<img class="svg" src="images/icons/binary/ruler-diagonal-icon.svg">',

	//
	// activating methods
	//

	activate: function() {
		let viewport = this.getParentView('app').getLayerView('map');
		let preferences = this.getParentView('app').preferences;
		let minZoomLevel = 1;
		let maxZoomLevel = preferences.get('max_zoom_level') || 10;

		// create behaviors
		//
		if (viewport) {
			this.behaviors = [
				new MouseDragMeasureBehavior(viewport, {
					button: 1,
					on: false,
					preferences: this.options.preferences
				}),
				new MouseDragZoomBehavior(viewport, {
					button: 2,
					on: false
				}),
				new MouseWheelZoomBehavior(viewport, {
					on: false,
					minScale: viewport.zoomLevelToScale(minZoomLevel),
					maxScale: viewport.zoomLevelToScale(maxZoomLevel)
				})
			];
		}
	}
});
