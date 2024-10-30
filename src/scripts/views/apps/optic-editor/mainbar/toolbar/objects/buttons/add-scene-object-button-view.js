/******************************************************************************\
|                                                                              |
|                          add-scene-object-button-view.js                     |
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
import SceneObject from '../../../../../../../models/optics/objects/scene-object.js'; 
import AddSceneObjectDialogView from '../../../../../../../views/apps/optic-editor/dialogs/objects/add-scene-object-dialog-view.js';
import Units from '../../../../../../../utilities/math/units.js';

export default MouseModeButtonView.extend({

	//
	// attributes
	//
	
	template: `
		<i class="fa fa-arrow-up-long"></i>
	`,

	cursor: 'crosshair',
	kind: 'object',

	//
	// dialog rendering methods
	//

	showDialog: function(point) {
		let app = this.getParentView('app');
		let distance = -point.x;
		let offset = -point.y;

		// show add object dialog
		//
		app.show(new AddSceneObjectDialogView({
			model: new SceneObject({
				kind: this.kind,
				distance: new Units(distance, 'mm'),
				offset: new Units(offset, 'mm')
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
					this.showDialog(viewport.toPoint(position.left, position.top));
				}
			}),
			new MouseWheelZoomBehavior(viewport, {
				on: false
			})
		];
	}
});