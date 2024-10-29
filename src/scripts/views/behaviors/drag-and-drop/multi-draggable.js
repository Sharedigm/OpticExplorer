/******************************************************************************\
|                                                                              |
|                              multi-draggable.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for items that can be dragged as a group.     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// dragging methods
	//

	enableDragging: function() {
		this.$el.attr('draggable', true);
		this.$el.attr('data-drag-effect', 'move');
	},

	disableDragging: function() {
		this.$el.removeAttr('draggable');
		this.$el.removeAttr('data-drag-effect');
	},

	getDragImage: function() {
		/*
		if (this.parent.numSelectedElements() <= 1 && !Browser.is_chrome) {
			return;
		}
		*/

		let elements = this.parent.cloneSelectedElements({
			position: true
		});

		// create new drag image
		//
		let dragImage = $('<div class="drag-image"></div>');

		// add selected elements
		//
		dragImage.append(elements);
		
		// set class and add count for multiple items
		//
		if (elements.length > 1) {
			dragImage.addClass('multiple');
			dragImage.append('<div class="warning count badge">' + this.parent.numSelectedElements() + '</div>');
		}

		// set drag image bounds
		//
		dragImage.css(this.parent.getSelectedElementRect());

		// convert to inline svg
		//
		//Svg.inline(dragImage.find('img.svg'));

		return dragImage;
	}
};