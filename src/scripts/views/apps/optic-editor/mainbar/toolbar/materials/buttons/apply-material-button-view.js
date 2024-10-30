/******************************************************************************\
|                                                                              |
|                          apply-material-button-view.js                       |
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

export default MouseModeButtonView.extend({

	//
	// attributes
	//
	
	template: template(`
		<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="-3 -3 30 30">
			<path d="M 0 21.398 c 5.504.456 3.533 -5.392 8.626 -5.445l2.206 1.841c.549 6.645 -7.579 8.127 -10.832 3.604zm16.878 -8.538c1.713 -2.687 7.016 -11.698 7.016 -11.698.423 -.747 -.515 -1.528 -1.17 -.976 0 0 -7.887 6.857 -10.213 9.03 -1.838 1.719 -1.846 2.504 -2.441 5.336l2.016 1.681c2.67 -1.098 3.439 -1.248 4.792 -3.373 z"/>
		</svg>
	`),

	cursor: 'crosshair',

	//
	// querying methods
	//

	elementAt: function(point) {
		let viewport = this.getParentView('app').getActiveViewport();

		// get elements from viewport
		//
		let elementsView = viewport.elementsView;
		for (let i = 0; i < elementsView.children.length; i++) {
			let view = elementsView.children.findByIndex(i);
			let bounds = view.getBounds();
			if (bounds.contains(point)) {
				return view.model;
			}
		}
	},

	//
	// getting methods
	//

	getCurrentMaterial: function() {
		let toolbar = this.parent.parent;
		return toolbar.getChildView('current_material').model;
	},

	//
	// setting methods
	//

	setMaterialAt: function(location, material) {
		let element = this.elementAt(location);

		// set element's material
		//
		if (element) {
			element.set('material', material);
		}
	},

	//
	// selecting methods
	//

	select: function() {
		let viewport = this.getParentView('app').getActiveViewport();

		// call superclass method
		//
		MouseModeButtonView.prototype.select.call(this);

		// set cursor
		//
		viewport.$el.addClass('sampleable');
	},

	deselect: function() {
		let viewport = this.getParentView('app').getActiveViewport();

		// call superclass method
		//
		MouseModeButtonView.prototype.deselect.call(this);

		// unset cursor
		//
		viewport.$el.removeClass('sampleable');
	},

	//
	// activating methods
	//

	onActivate: function() {
		let viewport = this.getParentView('app').getActiveViewport();
		
		// create behaviors
		//
		this.behaviors = [
			new MouseBehavior(viewport.el, {
				on: false,
				blocking: true,

				// callbacks
				//
				onclick: (event) => {
					let position = this.behaviors[0].getEventOffset(event);
					let location = viewport.toPoint(position.left, position.top);
					let material = this.getCurrentMaterial();
					this.setMaterialAt(location, material);
				}
			})
		];
	}
});