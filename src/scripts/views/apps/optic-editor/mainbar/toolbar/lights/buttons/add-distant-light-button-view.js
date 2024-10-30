/******************************************************************************\
|                                                                              |
|                          add-distant-light-button-view.js                    |
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
import DistantLight from '../../../../../../../models/optics/lights/distant-light.js'; 
import AddDistantLightDialogView from '../../../../../../../views/apps/optic-editor/dialogs/lights/add-distant-light-dialog-view.js';
import Units from '../../../../../../../utilities/math/units.js';

export default MouseModeButtonView.extend({

	//
	// attributes
	//
	
	template: `
		<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 512 512">
			<polygon points="256,60.082 293.022,225.727 462,209.75 315.903,296.147 383.314,451.918 256,339.67 128.686,451.918 196.097,296.147 50,209.75 218.978,225.727" transform="matrix(1.1,0,0,1.1,-53.76,-53.76)" />
		</svg>
	`,

	cursor: 'crosshair',

	//
	// dialog rendering methods
	//

	showDialog: function(point) {
		let app = this.getParentView('app');
		let distance = point.length();
		let angle = Math.atan2(-point.y, -point.x) * 180 / Math.PI;

		// show add distant light dialog
		//
		app.show(new AddDistantLightDialogView({
			model: new DistantLight({
				distance: new Units(distance, 'mm'),
				angle: new Units(angle, 'deg'),
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