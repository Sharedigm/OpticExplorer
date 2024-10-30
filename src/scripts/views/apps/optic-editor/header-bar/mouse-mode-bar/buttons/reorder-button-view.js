/******************************************************************************\
|                                                                              |
|                              reorder-button-view.js                          |
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

import MouseModeButtonView from '../../../../../../views/apps/common/toolbars/buttons/mouse-mode-button-view.js';
import MouseDragPanBehavior from '../../../../../../views/svg/viewports/behaviors/navigation/mouse-drag-pan-behavior.js';
import MouseWheelZoomBehavior from '../../../../../../views/svg/viewports/behaviors/navigation/mouse-wheel-zoom-behavior.js';

export default MouseModeButtonView.extend({

	//
	// attributes
	//

	template: `
		<svg width="512" height="512" version="1.1" viewBox="180 180 384 384" xmlns="http://www.w3.org/2000/svg">
			<path d="m371.27 224.45c-19.508 0-35.438 13.641-40.402 31.672-5.0547-2.1367-10.637-3.2578-16.426-3.2578-20.812 0-37.555 15.52-41.141 35.371-9.7344 2.0898-19.109 5.5078-27.23 11.543-11.648 8.6562-21.609 21.891-21.609 38.332v37.887c0 26.648 16.652 50.473 34.629 71.926 16.336 19.492 34.098 36.109 45.879 47.652v22.496c0 7.8477 6.3594 14.207 14.207 14.211h161.02c7.8477-0.003906 14.207-6.3633 14.211-14.211v-47.211c20.461-22.688 33.152-52.461 33.152-85.391v-71.039c0-23.367-19.254-42.621-42.621-42.621-5.793 0-11.371 1.1211-16.426 3.2578-4.9648-18.031-20.895-31.672-40.402-31.672-6.9141 0-13.289 1.9023-19.09 4.8828-7.0391-13.973-21.172-23.824-37.746-23.824 z m0 28.414c8.1172 0 14.207 6.0898 14.207 14.207v18.941c0 7.8477 6.3594 14.207 14.207 14.207 7.8477 0 14.207-6.3594 14.207-14.207 0-8.1172 6.0898-14.207 14.207-14.207s14.207 6.0898 14.207 14.207v28.414c0 7.8477 6.3594 14.207 14.207 14.207 7.8477 0 14.207-6.3594 14.207-14.207 0-8.1172 6.0898-14.207 14.207-14.207s14.207 6.0898 14.207 14.207v71.039c0 27.691-11.051 52.488-29.008 70.445l0.003906 0.003907c-2.6602 2.6719-4.1523 6.293-4.1445 10.062v37.887h-132.6v-14.207c0.007813-3.7734-1.4805-7.3906-4.1445-10.062-12.309-12.305-31.891-30.355-48.246-49.875-16.355-19.52-28.117-40.613-28.117-53.723v-37.887c0-4.5469 3.2773-10.496 10.062-15.539 2.6562-1.9727 5.7031-3.5742 8.8789-4.8828v48.84c-0.050781 3.8008 1.4219 7.4688 4.0898 10.176 2.6719 2.707 6.3164 4.2344 10.117 4.2344 3.8047 0 7.4492-1.5273 10.121-4.2344 2.668-2.707 4.1406-6.375 4.0859-10.176v-65.266c0.015626-0.34766 0.015626-0.69141 0-1.0391 0.023438-0.44141 0.023438-0.88672 0-1.332v-3.4023c0-8.1172 6.0898-14.207 14.207-14.207 8.1172 0 14.207 6.0898 14.207 14.207 0 7.8477 6.3594 14.207 14.207 14.207s14.207-6.3594 14.207-14.207v-28.414c0-8.1172 6.0898-14.207 14.207-14.207 z"/>
		</svg>
	`,

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
			new MouseDragPanBehavior(viewport, {
				button: 1,
				on: false
			}),
			new MouseWheelZoomBehavior(viewport, {
				on: false
			})
		];
	},

	//
	// methods
	//

	select: function() {
		let viewport = this.getParentView('app').getActiveViewport();

		// call superclass method
		//
		MouseModeButtonView.prototype.select.call(this);

		// set draggable mode
		//
		viewport.setCursor('grab');
		this.getParentView('app').draggable = true;
	},

	deselect: function() {
		let viewport = this.getParentView('app').getActiveViewport();

		// call superclass method
		//
		MouseModeButtonView.prototype.deselect.call(this);

		// reset draggable mode
		//
		viewport.resetCursor();
		this.getParentView('app').draggable = false;
	},

	//
	// event handling methods
	//

	onActivate: function() {
		this.activate();
	}
});
