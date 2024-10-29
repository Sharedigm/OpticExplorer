/******************************************************************************\
|                                                                              |
|                             mouse-drag-pan-behavior.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a viewer's mouse interaction behavior.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MouseDragBehavior from '../../../../../../views/behaviors/mouse/mouse-drag-behavior.js';

export default class MouseDragPanBehavior extends MouseDragBehavior {

	//
	// constructor
	//

	constructor(viewer, options) {

		// call superclass constructor
		//
		super(viewer.$el.find('.image'), options);

		// set attributes
		//
		this.viewer = viewer;
		this.cursor = 'grabbing';
		this.blocking = false;
	}

	//
	// mouse event handling methods
	//

	onMouseDown() {

		// get initial scroll position
		//
		this.scroll = this.viewer.getImageView().getScroll();
	}

	onMouseDrag() {

		// apply new viewer offset
		//
		let drag = this.getOffset(this.start, this.current);
		this.viewer.getImageView().scrollTo({
			left: this.scroll.left - drag.left,
			top: this.scroll.top - drag.top
		});
	}
}