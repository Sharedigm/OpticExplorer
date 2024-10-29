/******************************************************************************\
|                                                                              |
|                              list-item-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base class for a single generic list item.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ItemView from '../../../views/items/item-view.js';
import MultiDraggable from '../../../views/behaviors/drag-and-drop/multi-draggable.js';

export default ItemView.extend(_.extend({}, MultiDraggable, {

	//
	// attributes
	//

	nameSelector: '> .info .name',

	template: template(`
		<div class="info">
		
			<div class="icon">
				<%= icon %>
			</div>
		
			<div class="name" spellcheck="false"><%= name %></div>
		
			<% if (typeof details != 'undefined') { %>
			<div class="specifics">
				<span class="details"><%= details %></span>
			</div>
			<% } %>
		</div>
	`),

	tooltips: {
		placement: 'left'
	},
	
	// image attributes
	//
	thumbnailSize: 25,

	//
	// getting methods
	//

	getName: function() {
		return this.model.getName() || 'Home';
	},

	getBoundingElement: function() {
		return this.$el.find('.info')[0];
	},

	//
	// selecting methods
	//

	select: function(options) {

		// call superclass method
		//
		ItemView.prototype.select.call(this, options);

		// make list item draggable
		//
		if (this.options.draggable) {
			this.enableDragging();
		}
	},

	deselect: function(options) {

		// call superclass method
		//
		ItemView.prototype.deselect.call(this, options);

		// make list item non draggable
		//
		if (this.options.draggable) {
			this.disableDragging();
		}
		
		// free drag selected behavior
		//
		if (this.dragSelectedBehavior) {
			this.dragSelectedBehavior.off();
			this.dragSelectedBehavior = null;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.getIcon(),
			name: this.getName(),
			details: this.getDetails()
		};
	},

	//
	// dragging methods
	//

	getDragImage: function() {
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
		let selected = this.parent.getVisibleElements('.selected');
		let left = 0;
		let right = 0;
		for (let i = 0; i < selected.length; i++) {
			let item = $(selected[i]);
			let name = $(item).find('.name');
			let itemLeft = name.position().left;
			let itemWidth = name.outerWidth();
			let itemRight = itemLeft + itemWidth;

			if (i == 0) {
				left = itemLeft;
				right = itemRight;
			} else {
				if (itemLeft < left) {
					left = itemLeft;
				}
				if (itemRight > right) {
					right = itemRight;
				}
			}
		}
		
		let rect = this.parent.getSelectedElementRect();
		dragImage.css({
			top: rect.top,
			left: rect.left,
			width: right - rect.left + 5,
			height: rect.height
		});

		return dragImage;
	},

	//
	// mouse event handling methods
	//

	onMouseDownEditableName: function(event) {

		// block event from parent
		//
		this.block(event);
	},

	//
	// drag and drop event handling methods
	//

	onDragStart: function(event) {

		// cancel name editing
		//
		this.clearEditNameDelay();

		// call superclass method
		//
		ItemView.prototype.onDragStart.call(this, event);

		// store handle to dragged items
		//
		this.setDragged(this.parent.getSelected());
	}
}));