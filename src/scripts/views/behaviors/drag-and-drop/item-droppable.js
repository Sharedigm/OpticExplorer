/******************************************************************************\
|                                                                              |
|                              item-droppable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a drag and drop behavior for drop targets.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Draggable from '../../../views/behaviors/drag-and-drop/draggable.js';
import Droppable from '../../../views/behaviors/drag-and-drop/droppable.js';

export default _.extend({}, Droppable, {

	//
	// drop event handling methods
	//

	onDrop: function() {
		this.unhighlight();

		// drop dragged items
		//
		if (Draggable.hasDragged()) {

			// get dragged views
			//
			let dragged = Draggable.getDragged();

			// deselect dragged views
			//
			/*
			for (let i = 0; i < dragged.length; i++) {
				dragged[i].deselect();
			}
			*/

			// get dragged items
			//
			let items = [];
			for (let i = 0; i < dragged.length; i++) {
				items.push(dragged[i].model);
			}					

			// drop dragged items
			//
			this.onDropOn(items);

			// reset dragged views
			//
			Draggable.setDragged(null);
		}
	},

	onDropOn: function(items) {

		// perform callback
		//
		if (this.options.ondropon) {
			this.options.ondropon(items, this);
		}
	}
});