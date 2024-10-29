/******************************************************************************\
|                                                                              |
|                                selectable.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of selecting behavior.                            |
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

export default {

	//
	// attributes
	//

	blocking: true,

	events: {
	
		// mouse events
		//
		'mousedown': 'onMouseDown',
		'dblclick': 'onDoubleClick',

		// selection events
		//
		'select': 'onSelect',
		'deselect': 'onDeselect',

		// touch events
		//
		'tap': 'onTap'
	},

	//
	// querying methods
	//

	isSelected: function() {
		return this.$el && this.$el.hasClass('selected');
	},

	//
	// selecting methods
	//

	select: function(options) {
		if (!this.isSelected()) {
			this.$el.addClass('selected');

			// handle event
			//
			if (!options || !options.silent) {
				this.onSelect(this);
			}
		}
	},

	deselect: function(options) {
		if (this.isSelected()) {
			this.$el.removeClass('selected');

			// also unhighlight, if possible
			//
			if (this.isHighlighted && this.isHighlighted()) {
				this.unhighlight();
			}

			// handle event
			//
			if (!options || !options.silent) {
				this.onDeselect(this);
			}
		}
	},

	toggleSelect: function(options) {
		if (this.isSelected()) {
			this.deselect(options);
		} else {
			this.select(options);
		}
	},

	//
	// mouse event handling methods
	//

	handleClick: function(event) {
		if (this.selectable == false || event.target.isContentEditable) {
			return;
		}

		// perform selection
		//
		if (this.selectable != false) {

			// check for shift clicking or multi-select
			//
			if (!event.shiftKey && !event.metaKey && !this.multi_selectable) {

				// perform selection
				//
				if (!this.isSelected()) {
					let top = this.getTop? this.getTop() : this.parent;

					// deselect previously selected items
					//
					if (top) {
						if (top.deselect) {
							top.deselect();
						}
						if (top.deselectAll) {
							top.deselectAll();
						}
					} else if (this.deselectAll) {
						this.deselectAll();
					}

					// select this item
					//
					this.select();
				} else if ((Browser.is_touch_enabled || this.double_clickable) && (!this.isEditing || !this.isEditing())) {

					// open this item
					//
					if (this.open) {
						this.open();
					}
				}

				// enable text selection
				//
				this.$el.removeClass('unselectable');
			} else if (event.metaKey) {

				// select range
				//
				if (this.parent.selectRange) {
					let from = this.parent.getSelected()[0];
					let to = this;
					this.parent.selectRange(from, to);
				}

				// disable text selection
				//
				this.$el.addClass('unselectable');
			} else if (!event.target.isContentEditable) {

				// handle multiple selection
				//
				this.toggleSelect();

				// disable text selection
				//
				this.$el.addClass('unselectable');
			}
		}
	},

	onMouseDown: function(event) {

		// skip mouse events if touch enabled
		//
		if (Browser.is_touch_enabled) {
			return;
		}

		// skip clicks on selectable item buttons
		//
		if (event.target.type == 'button' || event.target.type == 'submit') {
			return;
		}

		// handle as click
		//
		this.handleClick(event);

		// prevent further handling of event
		//
		if (this.blocking) {
			event.stopPropagation();
		}

		// perform callback
		//
		if (this.options.onmousedown) {
			this.options.onmousedown(event);
		}
	},

	onDoubleClick: function(event) {

		// skip mouse events if touch enabled
		//
		if (Browser.is_touch_enabled) {
			return;
		}
		
		if (!this.isEditing || !this.isEditing()) {
			if (this.open) {
				this.open();
			}

			// block event from parent
			//
			this.block(event);
		}
	},

	//
	// selection event handling methods
	//

	onSelect: function(item) {

		// trigger listeners
		//
		if (this.model) {
			this.model.trigger('select');
		}

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect(item);
		}
	},

	onDeselect: function(item) {

		// trigger listeners
		//
		if (this.model) {
			this.model.trigger('deselect');
		}

		// perform callback
		//
		if (this.options.ondeselect) {
			this.options.ondeselect(item);
		}
	},

	//
	// touch event handling methods
	//

	onTap: function(event) {
		
		// skip touch events if not touch enabled
		//
		if (!Browser.is_touch_enabled) {
			return;
		}

		// play tap sound
		//
		application.play('tap');

		// skip clicks on selectable item buttons
		//
		if (event.target.type == 'button' || event.target.type == 'submit') {
			return;
		}

		if (this.isSelected()) {

			// handle as double tap
			//
			this.onDoubleTap(event);
		} else {

			// handle as click
			//
			this.handleClick(event);
		}

		// prevent further handling of event
		//
		if (this.blocking) {
			event.stopPropagation();
		}

		// perform callback
		//
		if (this.options.ontap) {
			this.options.ontap(event);
		}		
	},

	onDoubleTap: function(event) {

		// skip touch events if not touch enabled
		//
		if (!Browser.is_touch_enabled) {
			return;
		}
		
		if (!this.isEditing || !this.isEditing()) {
			if (this.open) {
				this.open();
			}

			// block event from parent
			//
			this.block(event);
		}
	}
};