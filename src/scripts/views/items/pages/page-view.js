/******************************************************************************\
|                                                                              |
|                                 page-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base view of a single generic page.                    |
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
import Browser from '../../../utilities/web/browser.js';

export default ItemView.extend({

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
		
			<% if (typeof details != 'undefined') { %>
			<div class="specifics"><span class="details"><%= details %></span></div>
			<% } %>	
		</div>
	`),

	events: {

		// mouse events
		//
		'mouseup .icon': 'onMouseUpIcon',
		'mousedown .name': 'onMouseDownName',
		'click': 'onClick',
		'click .name:not([contenteditable="true"])': 'onClickNonEditableName',
		'dblclick .icon': 'onDoubleClick',

		// touch events
		//
		'tap': 'onTap',
		'tap .name:not([contenteditable="true"])': 'onTapNonEditableName',
		'doubletap .icon': 'onDoubleTap',

		// keyboard events
		//
		'keypress .name[contenteditable="true"]': 'onKeyPressEditableName'
	},

	// image attributes
	//
	multi_selectable: true,
	thumbnailSize: 512,

	//
	// selecting methods
	//

	multiSelect: function() {
		this.toggleSelect();
		/*
		if (!this.isSelected()) {
			this.select();
		} else {
			this.open();
		}
		*/
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

		// set initial visibility
		//
		if (this.options.current) {
			this.$el.addClass('current');
		}

		// convert to inline svg
		//
		// Svg.inline(this.$el.find('img.svg'));
	},

	//
	// mouse event event handling methods
	//

	onMouseUpIcon: function(event) {

		// skip mouse events if touch enabled
		//
		if (Browser.is_touch_enabled) {
			return;
		}

		if (!this.parent.dragged) {
			ItemView.prototype.handleClick.call(this, event);
		}
	},

	onMouseDownName: function(event) {

		// skip mouse events if touch enabled
		//
		if (Browser.is_touch_enabled) {
			return;
		}
		
		// handle content editing
		//
		if (event.target.isContentEditable) {
			ItemView.prototype.onMouseDown.call(this, event);
		}
	},

	onClick: function(event) {

		// skip mouse events if touch enabled
		//
		if (Browser.is_touch_enabled) {
			return;
		}

		if (event.target.isContentEditable) {
			return;
		}

		if (!this.parent.dragged) {
			this.select();
		}
	},

	onClickNonEditableName: function(event) {

		// skip mouse events if touch enabled
		//
		if (Browser.is_touch_enabled) {
			return;
		}

		if (this.isSelected() && this.editable) {

			// make name editable after delay
			//
			this.editNameAfterDelay();

			// block event
			//
			event.stopPropagation();
		}
	},

	//
	// touch event handling methods
	//

	onTapNonEditableName: function() {

		// skip mouse events if touch enabled
		//
		if (!Browser.is_touch_enabled) {
			return;
		}
		
		if (this.isSelected() && this.editable) {

			// make name editable after delay
			//
			this.editNameAfterDelay();
		}
	}
});