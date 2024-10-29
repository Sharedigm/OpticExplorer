/******************************************************************************\
|                                                                              |
|                            table-list-item-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract view that shows a single list item.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ListItemView from '../../../views/collections/lists/list-item-view.js';

export default ListItemView.extend({

	//
	// attributes
	//

	tagName: 'tr',

	// prepended and appended columns
	//
	prepended: ['select-group', 'select'],
	appended: [],

	//
	// rendering methods
	//

	onRender: function() {

		// mark index of row before reorder / sort
		//
		this.markRowIndex();

		// mark non-shaded table cells
		//
		this.markPrependedTableCells(this.$el.find('th, td'));
		this.markAppendedTableCells(this.$el.find('th, td'));

		// mark first and last table cells (for rounded corners)
		//
		this.markFirstTableCells();
		this.markLastTableCells();
	},

	markRowIndex: function() {
		this.$el.attr('index', this.model.collection.indexOf(this.model));
	},

	markPrependedTableCells: function(elements) {
		for (let i = 0; i < elements.length; i++) {
			let element = $(elements[i]);

			loop2:
				for (let i = 0; i < this.prepended.length; i++) {
					let className = this.prepended[i];

					if (element.hasClass(className)) {
						element.addClass('prepend');
						break loop2;
					}
				}
		}
	},

	markAppendedTableCells: function(elements) {
		for (let i = 0; i < elements.length; i++) {
			let element = $(elements[i]);

			loop2:
				for (let i = 0; i < this.appended.length; i++) {
					let className = this.appended[i];

					if (element.hasClass(className)) {
						element.addClass('append');
						break loop2;
					}
				}
		}
	},
	
	markFirstTableCells: function() {
		let index;

		// find first non prepended column
		//
		let cells = this.$el.find('td');
		for (let i = 0; i < cells.length; i++) {
			let cell = cells[i];
			let className = $(cell).attr('class');
			if (className && !className.contains('prepend')) {
				index = i;
				break;
			}
		}
		$(cells[index]).addClass('first');
	},

	markLastTableCells: function() {
		let index;

		// find last non appended column
		//
		let cells = this.$el.find('td');
		for (let i = 0; i < cells.length; i++) {
			let cell = cells[i];
			let className = $(cell).attr('class');
			if (className && !className.contains('append')) {
				index = i;
			}
		}
		$(cells[index]).addClass('last');
	}
});