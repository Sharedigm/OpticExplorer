/******************************************************************************\
|                                                                              |
|                         mouse-drag-measure-behavior.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a selecting mouse interaction behavior.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MouseDragRectBehavior from '../../../views/behaviors/mouse/mouse-drag-rect-behavior.js';

export default class MouseDragMeasureBehavior extends MouseDragRectBehavior {
	
	//
	// getting methods
	//

	getText() {
		let rect = this.getRect(this.start, this.current);
		return rect.width + ' x ' + rect.height;
	}

	//
	// mouse event handling methods
	//

	onMouseDrag(event) {

		// call superclass method
		//
		super.onMouseDrag(event);

		if (!this.$rect) {
			return;
		}

		// append annotation
		//
		if (!this.$annotation) {
			this.$annotation = $('<div>').addClass('annotation').addClass('fineprint');
			this.$rect.append(this.$annotation);
		}
		this.$annotation.html(this.getText());
	}

	onMouseUp(event) {

		// call superclass method
		//
		super.onMouseUp(event);

		// clear annotations
		//
		this.$annotation = null;
	}
}