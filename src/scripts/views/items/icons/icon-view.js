/******************************************************************************\
|                                                                              |
|                                 icon-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base view of a single generic icon.                    |
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
	

	template: template(`
		<div class="row">
			<div class="icon">
				<%= icon %>
			</div>
		</div>
		
		<div class="row">
			<div class="name" spellcheck="false"><%= name %></div>
		</div>
		
		<% if (typeof details != 'undefined') { %>
		<div class="specifics row">
			<div><span class="details"><%= details %></span></div>
		</div>
		<% } %>
	`),

	// image attributes
	//
	thumbnailSize: 50,

	//
	// setting methods
	//

	setDetailLevel: function(detailLevel) {

		// allow extra space for details
		//
		switch (detailLevel) {
			case 1:
				this.$el.addClass('detailed');
				break;
			case 2:
				this.$el.addClass('detailed2');
				break;
			case 3:
				this.$el.addClass('detailed3');
				break;	
		}
	},

	//
	// selecting methods
	//

	select: function(options) {

		// call superclass method
		//
		ItemView.prototype.select.call(this, options);

		// make icon draggable
		//
		if (this.options.draggable) {
			this.enableDragging();
		}
	},

	deselect: function(options) {

		// call superclass method
		//
		ItemView.prototype.deselect.call(this, options);

		// make icon non draggable
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

	onRender: function() {

		// call superclass method
		//
		ItemView.prototype.onRender.call(this);

		// set detail level, if applicable
		//
		if (this.getDetailLevel) {
			this.setDetailLevel(this.getDetailLevel());
		}
	},
	
	update: function() {

		// call superclass method
		//
		ItemView.prototype.update.call(this);

		// update detail level
		//
		if (this.getDetailLevel) {
			this.updateDetailLevel(this.getDetailLevel());
		}
	},

	updateDetailLevel: function(detailLevel) {

		// allow extra space for details
		//
		switch (detailLevel) {
			case 1:
				this.$el.addClass('detailed');
				this.$el.removeClass('detailed2');
				this.$el.removeClass('detailed3');
				break;
			case 2:
				this.$el.removeClass('detailed');
				this.$el.addClass('detailed2');
				this.$el.removeClass('detailed3');
				break;
			case 3:
				this.$el.removeClass('detailed');
				this.$el.removeClass('detailed2');
				this.$el.addClass('detailed3');
				break;
			default:
				this.$el.removeClass('detailed');
				this.$el.removeClass('detailed2');
				this.$el.removeClass('detailed3');		
		}
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