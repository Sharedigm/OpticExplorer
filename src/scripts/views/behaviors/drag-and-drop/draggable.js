/******************************************************************************\
|                                                                              |
|                                 draggable.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a drag and drop behavior for draggable items.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Browser from '../../../utilities/web/browser.js';

// currently dragged items
//
let dragged = null;

export default {

	events: {
		'dragstart': 'onDragStart',
		'dragend': 'onDragEnd'
	},

	//
	// querying methods
	//

	hasDragged: function() {
		return dragged != null;
	},

	//
	// getting methods
	//

	getDragged: function() {
		return dragged;
	},

	//
	// setting methods
	//

	setDragged: function(items) {
		dragged = items;
	},

	setDragImage: function(event, dragImage) {

		// prepend new drag image
		//
		this.$el.append(dragImage);

		// compute drag image offset
		//
		let dragImagePosition = dragImage.position();
		let elementPosition = this.$el.position();
		let offset = {
			x: elementPosition.left - dragImagePosition.left + event.offsetX,
			y: elementPosition.top - dragImagePosition.top + event.offsetY
		};

		// set drag image
		//
		if (event.originalEvent.dataTransfer.setDragImage) {
			event.originalEvent.dataTransfer.setDragImage(dragImage[0], offset.x, offset.y);
		}
	},

	//
	// event handling methods
	//

	onDragStart: function(event) {

		// update element
		//
		this.$el.addClass('dragged');

		// set custom drag image
		//
		if (this.getDragImage) {
			this.dragImage = this.getDragImage();
			if (this.dragImage) {
				this.setDragImage(event, this.dragImage);
			}
		}

		// specify allowed effects
		//
		event.originalEvent.dataTransfer.effectAllowed = 'move';
		event.originalEvent.dataTransfer.dropEffect = 'move';

		// coax Firefox into firing events
		//
		if (Browser.is_firefox) {
			event.originalEvent.dataTransfer.setData('text', '');
		}

		// Safari shadows fix - add any class
		//
		this.parent.$el.addClass('dragging');

		// finish handling event
		//
		event.stopPropagation();
	},
	
	onDragEnd: function() {

		// update element
		//
		this.$el.removeClass('dragged');

		// destroy drag image
		//
		if (this.dragImage) {
			this.dragImage.remove();
			this.dragImage = null;
		}

		// Safari shadows fix - add any class
		//
		this.parent.$el.removeClass('dragging');

		// handle drop out
		//
		if (this.onDropOut && !this.windowContainsEvent(event)) {
			this.onDropOut(event);
		}

		// clear dragged items
		//
		this.setDragged(null);
		
		// finish handling event
		//
		event.stopPropagation();
	},

	onDropOut: function(event) {
		
		// perform callback
		//
		if (this.options.ondropout) {
			this.options.ondropout(event);
		}
	}
};