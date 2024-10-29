/******************************************************************************\
|                                                                              |
|                            table-reorderable.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a selectable behavior for tables.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// rendering methods
	//

	makeReorderable: function() {
		let model = null;

		// make list sortable
		//
		this.$el.find('.sortable').sortable({

			// animate!
			//
			revert: true,

			// callbacks
			//
			start: () => {

				// fix table widths for dragging
				//
				// this.fixTableWidths();

				// get index of element
				//
				let element = this.$el.find('tbody tr.selected:not(.ui-sortable-placeholder)')[0];
				let index = this.getTableRowIndex(element);

				// get model from index
				//
				model = this.collection.at(index);
			},

			stop: () => {

				// unfix table widths for dragging
				//
				// this.unfixTableWidths();

				// get index of element
				//
				let row = this.$el.find('tbody tr.selected')[0]
				let index = this.getTableRowIndex(row);
				this.onReorder(model, index);
			}
		});
	},

	fixTableWidths: function() {
		let width = this.$el.width();
		let rows = this.$el.find('tr');
		let firstRow = rows[0];
		let firstCells = $(firstRow).find('th');

		for (let i = 1; i < rows.length; i++) {
			let row = rows[i];

			// fix row width
			//
			$(row).css('width', width + 'px');

			// fix cell widths
			//
			let cells = $(row).find('td');
			for (let j = 0; j < cells.length; j++) {
				$(cells[j]).css('width', $(firstCells[j]).width());
			}
		}
	},

	unfixTableWidths: function() {
		let rows = this.$el.find('tr');

		for (let i = 1; i < rows.length; i++) {
			let row = rows[i];

			// unfix row width
			//
			$(row).css('width', '');

			// unfix cell widths
			//
			let cells = $(row).find('td');
			for (let j = 0; j < cells.length; j++) {
				$(cells[j]).css('width', '');
			}
		}
	},

	//
	// event handling methods
	//

	onReorder: function(model, index) {

		// perform callback
		//
		if (this.options.onreorder) {
			this.options.onreorder(model, index);
		}
	}
};