/******************************************************************************\
|                                                                              |
|                              table-sortable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a sortable behavior for tables.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import '../../../../../vendor/jquery/tablesorter/js/jquery.tablesorter.js';

export default {

	//
	// attributes
	//

	sorting: {
		
		// sort on first column in ascending order 
		//
		sortList: [[0, 0]]
	},

	// by default, disable sorting on selected columns
	//
	unsorted: ['unsorted', 'select-group', 'select', 'delete'],

	//
	// querying methods
	//

	findByRowIndex: function(index) {
		let rows = this.$el.find('tbody tr');
		let childIndex = parseInt($(rows[index]).attr('index'));
		return this.children.findByIndex(childIndex);
	},

	//
	// counting methods
	//

	numRows: function() {
		return this.$el.find('tbody tr').length;
	},

	//
	// getting methods
	//

	getSelectedRow: function(which) {
		switch (which) {
			case 'first':
				return this.getFirstRow();
			case 'prev':
				if (this.hasSelected()) {
					return this.getPrevRow(this.getFirstSelectedRow());
				} else {
					return this.getFirstRow();
				}
			case 'next':
				if (this.hasSelected()) {
					return this.getNextRow(this.getFirstSelectedRow());
				} else {
					return this.getLastRow();
				}
			case 'last':
				return this.getLastRow();
		}		
	},

	getFirstRow: function() {
		return this.findByRowIndex(0);
	},

	getFirstSelectedRow: function() {
		let rows = this.$el.find('tbody tr');
		for (let i = 0; i < rows.length; i++) {
			if ($(rows[i]).hasClass('selected')) {
				return i;
			}
		}
	},

	getPrevRow: function(index) {
		if (index == 0) {
			return this.getLastRow();
		} else {
			return this.findByRowIndex(index - 1);
		}
	},

	getNextRow: function(index) {
		if (index == this.numRows() - 1) {
			return this.getFirstRow();
		} else {
			return this.findByRowIndex(index + 1);
		}
	},

	getLastRow: function() {
		return this.findByRowIndex(this.numRows() - 1);
	},

	getTableColumnIndex: function(className) {
		let tableHeaders = this.$el.find('th');
		for (let i = 0; i < tableHeaders.length; i++) {
			let tableHeader = tableHeaders[i];
			let tableHeaderClass = $(tableHeader).attr('class');
			if (tableHeaderClass) {
				let classNames = tableHeaderClass.split(' ');
				if (classNames.contains(className)) {
					return i; 
				}
			}
		}
	},

	getSorting: function() {

		// get sorting column
		//
		let cell = this.$el.find('th.tablesorter-headerAsc, th.tablesorter-headerDesc')[0];
		if (cell) {
			let cellClass = $(cell).attr('class');
			if (cellClass) {
				let classNames = cellClass.split(' ');
				let className;
				
				for (let i = 0; i < classNames.length; i++) {
					className = classNames[i];
					if (!['first', 'last', 'selected', 'tablesorter-headerAsc', 'tablesorter-headerDesc'].contains(className)) {
						break;
					}
				} 

				// return column ascending or descending
				//
				if (classNames.contains('tablesorter-headerAsc')) {
					return [className, 'ascending'];
				} else {
					return [className, 'descending'];
				}
			}
		}
	},

	getSortList: function() {
		let column;
		let direction;

		// find sorting column and direction
		//
		let index = this.getTableColumnIndex('tablesorter-headerAsc');
		if (index) {
			column = index;
			direction = 1;
		}

		if (index == undefined) {
			index = this.getTableColumnIndex('tablesorter-headerDesc');
			if (index) {
				column = index;
				direction = 0;
			}
		}

		// return sort list array
		//
		if (column != undefined && direction != undefined) {
			return [[column, direction]];
		}
	},

	getSortColumnIndex: function() {
		let headerColumns = this.$el.find('thead th');
		for (let i = 0; i < headerColumns.length; i++) {
			if ($(headerColumns[i]).hasClass('tablesorter-headerAsc') || 
				$(headerColumns[i]).hasClass('tablesorter-headerDesc')) {
				return i;
			}
		}
	},

	//
	// setting methods
	//

	setSortColumn: function(className, direction) {
		let index = this.getTableColumnIndex(className);

		// set sorting on specified column
		//		
		if (index != undefined) {
			if (!this.sorting) {
				this.sorting = {};
			}
			switch (direction) {
				case 'ascending':
					this.sorting.sortList = [[index, 0]];
					break;
				case 'descending':
					this.sorting.sortList = [[index, 1]];
					break;
			}				
		}
	},

	//
	// sorting methods
	//

	sortItems: function(sorting) {

		// if sorting is not specified, then use previous
		//
		if (sorting) {
			this.sorting = sorting;
		}
		
		// apply table sorter plug-in
		//
		this.$el.tablesorter(sorting);

		// finish sorting
		//
		this.onSortEnd();
	},

	disableSortingOnColumn: function(className) {
		let index = this.getTableColumnIndex(className);

		// disable sorting on column[index]
		//
		if (index != undefined) {
			if (!this.sorting) {
				this.sorting = {};
			}
			if (!this.sorting.headers) {
				this.sorting.headers = {};
			}
			if (!this.sorting.headers[index]) {
				this.sorting.headers[index] = {};
			}

			this.sorting.headers[index].sorter = false;
		}
	},

	enableSorting: function() {

		// add specialized sort parsers
		//
		if (this.sortParsers) {
			for (let i = 0; i < this.sortParsers.length; i++) {
				$.tablesorter.addParser(this.sortParsers[i]);
			}
		}

		// find column to sort by
		//
		if (this.sortBy) {
			this.setSortColumn(this.sortBy[0], this.sortBy[1]);
		}

		// find columns to avoid sorting
		//
		if (this.unsorted) {
			for (let i = 0; i < this.unsorted.length; i++) {
				let className = this.unsorted[i];
				this.disableSortingOnColumn(className);
			}
		}

		// set attributes
		//
		if (this.options.sortBy) {
			this.sortBy = this.options.sortBy;
		}

		// apply table sorter tag
		//
		this.$el.addClass('tablesorter');

		// update after a model is deleted
		//
		this.collection.on('destroy', () => {
			this.$el.trigger("update");
		});

		// renumber after sorting
		//
		this.$el.bind('sortStart', () => {
			this.onSortStart();
		});
		this.$el.bind('sortEnd', () => {
			this.onSortEnd();
		});

		// perform initial sort
		//
		if (this.sorting) {
			this.sortItems();
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.enableSorting();
	},

	//
	// event handing methods
	//

	onSortStart: function() {
	},

	onSortEnd: function() {
	}
};