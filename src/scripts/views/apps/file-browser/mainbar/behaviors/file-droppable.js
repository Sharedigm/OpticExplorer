/******************************************************************************\
|                                                                              |
|                              file-droppable.js                               |
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

import ItemDroppable from '../../../../../views/behaviors/drag-and-drop/item-droppable.js';

export default _.extend({}, ItemDroppable, {

	//
	// drag event handling methods
	//

	onDragEnter: function(event) {
		if (this.droppable != false) {
			this.highlight();
		}

		// prevent default drag behavior
		//
		event.preventDefault();
	},

	onDragOver: function(event) {
		if (this.droppable != false) {
			this.highlight();
		}

		// prevent default drag behavior
		//
		event.preventDefault();
	},

	onDragLeave: function(event) {
		if (this.droppable != false) {
			this.unhighlight();
		}

		// prevent default drag behavior
		//
		event.preventDefault();
	},

	//
	// drop event handling methods
	//

	onDrop: function(event) {			
		if (this.droppable != false) {
			if (!this.containsFiles(event)) {
					
				// drop dropped on items
				//
				ItemDroppable.onDrop.call(this);
			} else {

				// drop dragged in items
				//
				this.onDropIn(event);
			}
		}

		// unhighlight
		//
		let itemsView = this.getParentView('items');
		if (itemsView && itemsView.unhighlight) {
			itemsView.unhighlight(true);
		}

		// clear dropzone
		//
		let dropzoneView = this.getParentView('dropzone');
		if (dropzoneView) {
			dropzoneView.hideDropzone();
		}

		// prevent default drop behavior
		//
		this.block(event);
	},

	onDropIn: function(event) {
		let dataTransfer = event.originalEvent.dataTransfer;

		// upload dropped items
		//
		if (dataTransfer.items) {
			this.onDropInItems(dataTransfer.items);
		} else {
			this.onDropInFiles(dataTransfer.files);
		}

		// unhighlight contained items
		//
		this.unhighlight(true);
	},

	//
	// file drop event handling methods
	//

	onDropInItems: function(items) {

		// perform callback
		//
		if (this.options.ondropinitems) {
			this.options.ondropinitems(items, this);
		}
	},

	onDropInFiles: function(files) {

		// perform callback
		//
		if (this.options.ondropinfiles) {
			this.options.ondropinfiles(files, this);
		}
	}
});