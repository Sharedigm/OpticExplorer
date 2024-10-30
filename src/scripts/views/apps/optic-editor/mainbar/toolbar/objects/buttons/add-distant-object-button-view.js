/******************************************************************************\
|                                                                              |
|                      add-distant-object-button-view.js                       |
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
import DistantObject from '../../../../../../../models/optics/objects/distant-object.js'; 
import AddDistantObjectDialogView from '../../../../../../../views/apps/optic-editor/dialogs/objects/add-distant-object-dialog-view.js';
import Units from '../../../../../../../utilities/math/units.js';

export default MouseModeButtonView.extend({

	//
	// attributes
	//
	
	template: `
		<svg width="512" height="512" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
			<g transform="translate(2 0)"><path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937z" /></g>
			<g><path d="M3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162z" /></g>
		</svg>
	`,

	kind: 'stars',
	cursor: 'crosshair',
	height: new Units(100, 'mm'),
	
	//
	// dialog rendering methods
	//

	showDialog: function(point) {
		let app = this.getParentView('app');
		let angle = Math.atan2(-point.y, -point.x) * 180 / Math.PI;
		let distance = point.length();

		// show add object dialog
		//
		app.show(new AddDistantObjectDialogView({
			model: new DistantObject({
				kind: this.kind,
				angle: new Units(angle, 'deg'),
				distance: new Units(distance, 'mm'),
				size: this.size
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