/******************************************************************************\
|                                                                              |
|                          sample-material-button-view.js                      |
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
		<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 512 512">
			<path d="M 329.025, 238.196 c 0 -8.231, 8.349 -15.038, 26.99 -17.2 c 63.336 -7.334, 88.818 -45.574, 88.818 -83.763
			c 0 -48.047 -36.898 -87.233 -87.443 -87.233 c -41.777, 0 -83.621, 29.304 -82.346, 100.1 c 0.352, 20.042 -6.119, 29.145 -15.172, 29.145 c -5.114, 0 -10.244 -2.909 -15.055 -6.63 c -6.991 -5.415 -16.999 -4.459 -22.851, 2.213 c -6.42, 7.318 -5.649, 18.474, 1.644, 24.853 l 90.176, 78.917 c7.258, 6.371, 18.322, 5.633, 24.677 -1.643 c 5.884 -6.723, 5.499 -16.814 -0.839 -23.092 C 332.864, 249.144, 329.025, 243.888, 329.025, 238.196 z M 284.281, 298.85 l -117.25, 130.46 c -22.48, 25.146 -38.105, 5.432 -67.861, 28.298 C 95.196, 460.658, 90.888, 462, 86.747, 462 c -10.31, 0 -19.581 -8.416 -19.581 -19.748 c 0 -3.756, 1.073 -7.812, 3.37 -12.004 c 16.781 -30.746 -2.213 -45.129, 19.715 -69.555 l 116.512 -129.689 l25.834, 22.607 L 117.744, 381.129 c -5.397, 6.035 -3.269, 22.934 -6.236, 32.455 c 9.12 -4.023, 26.421 -3.52, 31.819 -9.572 l 115.104 -127.794 L 284.281, 298.85 z"/>
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
	// setting methods
	//

	setCurrentMaterial: function(material) {
		let toolbar = this.parent.parent;
		toolbar.getChildView('current_material').setMaterial(material);
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

	sampleMaterialAt: function(location) {
		let element = this.elementAt(location);

		// set current material to element's material
		//
		if (element && element.has('material')) {
			this.setCurrentMaterial(element.get('material'));
		}
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
					this.sampleMaterialAt(location);
				}
			})
		];
	}
});