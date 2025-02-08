/******************************************************************************\
|                                                                              |
|                            containable-selectable.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of behavior for a container of selectable         |
|        items.                                                                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Containable from '../../../views/behaviors/containers/containable.js';

export default _.extend({}, Containable, {

	//
	// querying methods
	//

	hasSelected: function() {
		return this.hasChildren((child) => child.isSelected && child.isSelected());
	},

	hasSelectedGeolocated: function() {
		return this.hasChildren((child) => {
			return child.isSelected && child.isSelected() &&
				child.model.hasGeolocation && child.model.hasGeolocation();
		});
	},

	allSelected: function() {
		return this.numSelected() == this.numChildren();
	},

	//
	// counting methods
	//

	numSelected: function() {
		return this.numChildren((child) => child.isSelected && child.isSelected());
	},

	numSelectedElements: function() {
		return this.$el.find('.selected').length;
	},

	//
	// getting methods
	//

	getSelected: function() {
		return this.getChildren((child) => child.isSelected && child.isSelected());
	},

	getFirstSelected: function() {
		return this.getSelected()[0];
	},

	getSelectedModel: function() {
		return this.hasSelected()? this.getSelectedModels()[0] : [];
	},

	getSelectedModels: function() {
		return this.getChildModels((child) => child.isSelected && child.isSelected());
	},
	
	getSelectedGeolocatedModels: function() {
		return this.getChildModels((child) => {
			return child.isSelected() && child.model.hasGeolocation && child.model.hasGeolocation();
		});
	},

	getVisibleElements: function(selector) {
		let selected = this.$el.find(selector);
		let visible = [];
		for (let i = 0; i < selected.length; i++) {
			let item = selected[i];
			if (this.parent.overlapsElement(item)) {
				visible.push(item);
			}
		}
		return visible;
	},

	getSelectedElementBounds: function() {
		let bounds = {};
		let selected = this.getVisibleElements('.selected');

		// found bounds of selected items
		//
		for (let i = 0; i < selected.length; i++) {
			let item = $(selected[i]);

			// get bounding rect
			//
			let position = item.position();
			let rect = {
				left: position.left,
				right: position.left + item[0].scrollWidth,
				top: position.top,
				bottom: position.top + item[0].scrollHeight
			};

			// add margins
			//
			let margin = {
				left: parseInt(item.css('margin-left').replace('px', '')),
				right: parseInt(item.css('margin-right').replace('px', '')),
				top: parseInt(item.css('margin-top').replace('px', '')),
				bottom: parseInt(item.css('margin-bottom').replace('px', '')),
			};
			rect.left -= margin.left;
			rect.right += margin.right;
			rect.top -= margin.top;
			rect.bottom += margin.bottom;

			// update bounds
			//
			if (bounds.left == undefined || rect.left < bounds.left) {
				bounds.left = rect.left;
			}
			if (bounds.right == undefined || rect.right > bounds.right) {
				bounds.right = rect.right;
			}
			if (bounds.top == undefined || rect.top < bounds.top) {
				bounds.top = rect.top;
			}
			if (bounds.bottom == undefined || rect.bottom > bounds.bottom) {
				bounds.bottom = rect.bottom;
			}
		}
		
		return bounds;
	},

	getSelectedElementRect: function(options) {
		let bounds = this.getSelectedElementBounds(options);
		return {
			left: bounds.left,
			width: bounds.right - bounds.left,
			top: bounds.top,
			height: bounds.bottom - bounds.top
		};
	},

	getSelectedChildView: function(which) {
		switch (which) {
			case 'first':
				return this.getFirst();
			case 'prev':
				if (this.hasSelected()) {
					return this.getPrev(this.getFirstSelected());
				} else {
					return this.getFirst();
				}
			case 'next':
				if (this.hasSelected()) {
					return this.getNext(this.getFirstSelected());
				} else {
					return this.getLast();
				}
			case 'last':
				return this.getLast();
		}		
	},

	getFirst: function() {
		return this.findByIndex(0);
	},

	getPrev: function(selected) {
		if (selected) {
			let index = this.indexOf(selected);

			// check for wraparound
			//
			if (index > 0) {

				// return prev
				//
				return this.findByIndex(index - 1);
			} else {

				// return last
				//
				return this.findByIndex(this.getLength() - 1);
			}
		}
	},

	getNext: function(selected) {
		if (selected) {
			let index = this.indexOf(selected);
			let count = this.getLength();

			// check for wraparound
			//
			if (index + 1 < count) {

				// return next
				//
				return this.findByIndex(index + 1);
			} else {

				// return first
				//
				return this.findByIndex(0);
			}
		}
	},

	getLast: function() {
		return this.findByIndex(this.getLength() - 1);
	},

	//
	// setting methods
	//

	setSelected: function(selected, options) {
		this.each((child) => {
			if (selected && selected.contains && selected.contains(child)) {
				child.select(options);
			} else {
				child.deselect(options);
			}
		});
	},

	setSelectedModel: function(model, options) {
		this.setSelectedModels([model], options);
	},

	setSelectedModels: function(models, options) {
		this.each((child) => {
			if (models && models.contains && models.contains(child.model)) {
				child.select(options);
			} else {
				child.deselect(options);
			}
		});
	},

	//
	// selecting methods
	//

	select: function(which, options) {
		switch (which) {
			case 'all':
				this.selectAll();
				break;
			case 'none':
				this.deselectAll();
				break;
			case 'before':
				this.selectBefore();
				break;
			case 'after':
				this.selectAfter();
				break;
			default:
				return this.selectItem(this.getSelectedChildView(which), options);
		}
	},

	selectItem: function(item, options) {

		// select item
		//
		if (item) {
			this.deselectAll();
			item.select(options);

			// scroll to item
			//
			if (this.scrollToView) {
				this.scrollToView(item);
			}
		}

		return item;
	},

	selectAll: function(filter, options) {
		this.each((child) => {
			if (child.select) {
				child.select(options);
			}
		}, filter);
	},

	deselectAll: function(filter, options) {
		this.each((child) => {
			if (child.deselect) {
				child.deselect(options);
			}
		}, filter);
	},

	selectInvert: function(filter, options) {
		this.each((child) => {
			if (child.toggleSelect) {
				child.toggleSelect(options);
			}
		}, filter);
	},

	selectBefore: function(filter, options) {
		let found = false;
		let selected = this.getFirstSelected();
		this.each((child) => {
			if (child == selected) {
				found = true;
			}
			if (!found) {
				child.select(options);
			}
		}, filter);
	},

	selectAfter: function(filter, options) {
		let found = false;
		let selected = this.getFirstSelected();
		this.each((child) => {
			if (child == selected) {
				found = true;
			}
			if (found) {
				child.select(options);
			}
		}, filter);
	},

	selectRange: function(from, to, bidirectional) {
		let found = false, done = false, selected = false;

		// set optional parameter defaults
		//
		if (bidirectional == undefined) {
			bidirectional = true;
		}

		// select in forward direction
		//
		this.each((child) => {
			if (child == from) {
				found = true;
			}
			if (found && !done) {
				child.select();
				selected = true;
			}
			if (child == to) {
				done = true;
			}
		});

		// if no items selected, select in reverse direction
		//
		if (!selected && bidirectional) {
			this.selectRange(to, from, false);
		}
	},

	//
	// rendering methods
	//

	showSelectedGeolocatedModels: function() {
		application.launch('map_viewer', {
			items: this.getSelectedGeolocatedModels()
		});
	}
});