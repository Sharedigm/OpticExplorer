/******************************************************************************\
|                                                                              |
|                           add-point-light-button-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a particular type of toolbar button.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MouseModeButtonView from '../../../../../../../views/apps/common/toolbars/buttons/mouse-mode-button-view.js';
import MouseBehavior from '../../../../../../../views/behaviors/mouse/mouse-behavior.js';
import MouseWheelZoomBehavior from '../../../../../../../views/svg/viewports/behaviors/navigation/mouse-wheel-zoom-behavior.js';
import PointLight from '../../../../../../../models/optics/lights/point-light.js'; 
import AddPointLightDialogView from '../../../../../../../views/apps/optic-editor/dialogs/lights/add-point-light-dialog-view.js';
import Units from '../../../../../../../utilities/math/units.js';

export default MouseModeButtonView.extend({

	//
	// attributes
	//
	
	template: `
		<i class="fa fa-lightbulb"></i>
	`,

	cursor: 'crosshair',
	
	//
	// dialog rendering methods
	//

	showDialog: function(point) {
		let app = this.getParentView('app');
		let distance = -point.x;
		let offset = -point.y;

		// show add point light dialog
		//
		app.show(new AddPointLightDialogView({
			model: new PointLight({
				distance: new Units(distance, 'mm'),
				offset: new Units(offset, 'mm'),
				number_of_rays: app.preferences.get('number_of_rays')
			}),

			// callbacks
			//
			onsubmit: () => {
				this.revert();
			}
		}));
	},

	//
	// event handling methods
	//

	onActivate: function() {
		let viewport = this.getParentView('app').getActiveViewport();
		
		// create behaviors
		//
		this.behaviors = [
			new MouseBehavior(viewport.el, {
				on: false,

				// callbacks
				//
				onclick: (event) => {
					let position = this.behaviors[0].getEventOffset(event);
					let point = viewport.toPoint(position.left, position.top);
					this.showDialog(point);
				}
			}),
			new MouseWheelZoomBehavior(viewport, {
				on: false
			})
		];
	}
});