/******************************************************************************\
|                                                                              |
|                            droppable-uploadable.js                           |
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

import Highlightable from '../../../../../views/behaviors/selection/highlightable.js';
import FileDroppable from '../../../../../views/apps/file-browser/mainbar/behaviors/file-droppable.js';

export default _.extend({}, Highlightable, FileDroppable, {

	//
	// attributes
	//

	uploadable: true,

	//
	// rendering methods
	//

	showDropzone: function() {
		this.$el.addClass('dropzone');

		// perform callback
		//
		if (this.options.onshowdropzone) {
			this.options.onshowdropzone();
		}
	},

	hideDropzone: function() {
		this.$el.removeClass('dropzone');

		// perform callback
		//
		if (this.options.onhidedropzone) {
			this.options.onhidedropzone();
		}
	},

	//
	// drag and drop event handling methods
	//

	onDragEnter: function(event) {
		if (!this.droppable) {
			return;
		}

		// update view
		//
		if (this.containsFiles(event)) {
			if (this.uploadable) {
				this.showDropzone();
				event.originalEvent.dataTransfer.dropEffect = 'copy';
			}
		} else {
			this.highlight();
		}

		// prevent default drop behavior
		//
		this.block(event);
	},

	onDragOver: function(event) {
		if (!this.droppable) {
			return;
		}

		// update view
		//
		if (this.containsFiles(event)) {
			if (this.uploadable) {
				this.showDropzone();
			}
		} else {
			this.highlight();	
		}

		// prevent default drop behavior
		//
		this.block(event);
	},

	onDragLeave: function(event) {
		if (!this.droppable) {
			return;
		}

		// update view
		//
		if (this.containsFiles(event)) {
			this.hideDropzone();
		} else {
			this.unhighlight();	
		}

		// prevent default drop behavior
		//
		this.block(event);
	},

	onDrop: function(event) {
		if (!this.droppable) {
			return;
		}

		// call mixin method
		//
		FileDroppable.onDrop.call(this, event);

		// update view
		//
		if (this.containsFiles(event)) {
			this.hideDropzone();
		} else {
			this.unhighlight();
		}
	},

	//
	// drag and drop item event handling methods
	//

	onDropOnChild: function(items, item, options) {

		// perform callback
		//
		if (this.options.ondroponchild) {
			this.options.ondroponchild(items, item, options);
		}
	},
});