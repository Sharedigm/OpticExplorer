/******************************************************************************\
|                                                                              |
|                         mouse-drag-measure-behavior.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a viewport's mouse interaction behavior.      |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MouseDragMeasureBehavior from '../../../../../../views/behaviors/mouse/mouse-drag-measure-behavior.js';

export default class MouseDragMeasureImageBehavior extends MouseDragMeasureBehavior {

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
		this.cursor = 'pointer';
		this.blocking = true;
	}

	//
	// getting methods
	//

	getText() {
		let rect = this.getRect(this.start, this.current);
		let scale = this.viewer.getImageView().getScale();
		return Math.round(rect.width / scale) + ' x ' + Math.round(rect.height / scale);
	}
}