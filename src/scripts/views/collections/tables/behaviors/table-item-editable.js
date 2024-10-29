/******************************************************************************\
|                                                                              |
|                            table-item-editable.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an editable behavior for table items.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Timeable from '../../../../views/behaviors/effects/timeable.js';
import Keyboard from '../../../../views/keyboard/keyboard.js';

export default _.extend({}, Timeable, {

	//
	// attributes
	//

	events: {
		'mousedown [contenteditable="true"]': 'onMouseDownContentEditable',
		'mousedown input[type="checkbox"]': 'onMouseDownCheckbox',
		'dblclick': 'onDoubleClick',
		'keydown': 'onKeyDown'
	},

	// editable attributes
	//
	editingDelay: 500,

	//
	// setting methods
	//

	setValue: function(key, value) {
		if (this.isValid()) {
			this.model.set(key, value);
		}
	},

	//
	// rendering methods
	//

	showValue: function(key, value) {
		return this.$el.find('.' + key).text(value);
	},

	showError: function(key, value) {
		return this.$el.find('.' + key).text(value).addClass('error');
	},

	hideErrors: function() {
		return this.$el.find('.error').removeClass('error');
	},

	//
	// editing methods
	//

	editElementAfterDelay: function(element) {
		if (!this.timeout) {

			// make name editable after slight delay
			//
			this.setTimeout(() => {
				this.timeout = null;

				// make name editable
				//
				$(element).focus();
			}, this.editingDelay);
		}
	},

	//
	// validation methods
	//

	isValid: function() {

		// revalidate the table item
		//
		return this.validate() == true;
	},

	//
	// updating methods
	//

	updateValue: function(kind) {
		this.setValue(kind, this.getValue(kind));
	},

	//
	// mouse event handling methods
	//

	onMouseDownContentEditable: function (event) {
		if (this.isSelected()) {
			this.editElementAfterDelay(event.target);
					
			// prevent focusing until after delay
			//
			if (this.$el.find('td:focus').length == 0) {
				event.preventDefault();
			}

			// block from parent to prevent dragging
			//
			if ($(event.target).is(":focus")) {
				event.stopPropagation();
			}
		} else {

			// select table cell
			//
			this.options.parent.deselectAll();
			this.select();

			// prevent focus
			//
			event.preventDefault();
		}
	},

	onMouseDownCheckbox: function(event) {

		// prevent deselect
		//
		event.stopPropagation();
	},

	onDoubleClick: function(event) {
		if (!event.target.isContentEditable) {
			if (this.edit) {
				this.edit();
			}
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		if (event.keyCode == Keyboard.keyCodes['enter']) {

			// blur focused element
			//
			this.$el.find('td:focus').blur();

			// block
			//
			event.stopPropagation();
			event.preventDefault();
		}
	}
});