/******************************************************************************\
|                                                                              |
|                                 card-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base view of a single generic card.                    |
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
		<div class="card">
			<div class="icon">
				<%= icon %>
			</div>
		
			<div class="info">
				<div class="name" spellcheck="false"><%= name %></div>
		
				<% if (typeof details != 'undefined') { %>
				<div class="row">
					<span class="details"><%= details %></span>
				</div>
				<% } %>
			</div>
		</div>
	`),

	// image attributes
	//
	thumbnailSize: 50,

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