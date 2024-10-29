/******************************************************************************\
|                                                                              |
|                                renamable.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for renamable items.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Timeable from '../../../views/behaviors/effects/timeable.js';
import Browser from '../../../utilities/web/browser.js';

export default _.extend({}, Timeable, {

	//
	// attributes
	//

	nameSelector: '.name',

	events: {

		// mouse events
		//
		'mousedown .name:not([contenteditable="true"])': 'onMouseDownNonEditableName',
		
		// keyboard events
		//
		'keypress .name[contenteditable="true"]': 'onKeyPressEditableName'
	},

	// editable attributes
	//
	editingDelay: 500,

	//
	// querying methods
	//

	isEditable: function() {
		return this.parent.isEditable && this.parent.isEditable();
	},

	isEditing: function() {
		return this.$el.find(this.nameSelector).attr('contenteditable') == 'true';
	},

	isUniqueName: function(name) {
		let item = this.collection? this.collection.findWhere({ 
			name: name
		}) : true;
		return !item || item == this.model;
	},

	isValidName: function(name) {
		return name != '' && name != '<br>' && this.isUniqueName(name);
	},

	//
	// getting methods
	//

	getCurrentName: function() {
		return this.$el.find(this.nameSelector).text();
	},

	//
	// setting methods
	//

	setName: function(name) {
		this.model.set({
			name: name
		});
	},

	setNameEditable: function(editable) {
		if (editable) {
			this.$el.find(this.nameSelector).attr('contenteditable', true).focus();
		} else {
			this.$el.find(this.nameSelector).removeAttr('contenteditable');
		}
	},

	//
	// highlighting methods
	//

	highlightName: function(options) {
		let element = this.$el.find(this.nameSelector)[0];
		if (element) {
			let range = document.createRange();
			if (range) {
				range.selectNodeContents(element);

				// select range without extension
				//
				if (!options || !options.extension) {
					let text = $(element).text();
					let child = element.childNodes[0];
					let offset = text.lastIndexOf('.');

					if (offset != -1) {
						range.setEnd(child, offset);
					}
				}
				
				let selection = document.getSelection();  
				if (selection) {
					selection.removeAllRanges();
					selection.addRange(range);
				}
			}
		}
	},

	//
	// editing methods
	//

	editName: function() {

		// unhighlight all selected elements
		//
		this.unhighlightSelection();

		// save name in case it needs to be reverted
		//
		this.name = this.getCurrentName();

		// make name editable
		//
		this.setNameEditable(true);

		// highlight name
		//
		this.highlightName();

		// make item non draggable (allows selection in Firefox)
		//
		this.$el.removeAttr('draggable');

		// focus name
		//
		this.$el.find(this.nameSelector).focus();
	},

	revertName: function() {

		// revert name to value before editing
		//
		this.$el.find(this.nameSelector).html(this.name);
	},

	//
	// delayed named editing methods
	//

	editNameAfterDelay: function() {
		if (!this.timeout) {

			// make name editable after slight delay
			//
			this.setTimeout(() => {

				// make name editable
				//
				this.editName();
			}, this.editingDelay);
		}
	},

	clearEditNameDelay: function() {

		// clear name editing timeout
		//
		this.clearTimeout();
	},

	//
	// deselecting methods
	//

	deselectName: function() {
		let name = this.getCurrentName();

		// attempt to change name
		//
		if (this.isValidName(name)) {

			// change name
			//
			if (name != this.name) {
				this.setName(name);
			}

			// make name uneditable
			//
			this.setNameEditable(false);

			// unhighlight all selected elements
			//
			this.unhighlightSelection();

			// unfocus name
			//
			this.$el.find(this.nameSelector).blur();

			// return success
			//
			return true;
		} else {

			// select for editing
			//
			this.select();

			// revert name to previous value
			//
			this.revertName();

			// highlight reverted name
			//
			this.highlightName();

			// focus reverted name
			//
			this.$el.find(this.nameSelector).focus();

			// return failure
			//
			return false;
		}
	},

	//
	// mouse event event handling methods
	//

	onMouseDownNonEditableName: function(event) {

		// skip mouse events if touch enabled
		//
		if (Browser.is_touch_enabled) {
			return;
		}
		
		if (this.isSelected() && this.isEditable() && !event.shiftKey && !event.metaKey) {

			// make name editable after delay
			//
			this.editNameAfterDelay();

			// prevent further handling of event
			//
			event.stopPropagation();
		} else {

			// handle selection
			//
			this.onMouseDown(event);
		}
	},
	
	//
	// keyboard event handling methods
	//

	onKeyPressEditableName: function(event) {

		// upon return key press
		//
		if (event.which === 13) {

			// end editing and deselect
			//
			this.deselect();

			// prevent default return key behavior
			//
			event.preventDefault();
		}
	}
});