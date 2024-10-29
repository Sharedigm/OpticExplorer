/******************************************************************************\
|                                                                              |
|                                containable.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of behavior for containers.                       |
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
	// attributes
	//

	filters: {
		selected: (child) => child.isSelected(),
		highlighted: (child) => child.isHighlighted()
	},

	actions: {
		select: function(child) {
			return child.select();
		},

		deselect: function(child) {
			return child.deselect();
		},

		toggleSelect: function(child) {
			return child.toggleSelect();
		},

		highlight: function(child) {
			return child.highlight();
		},

		unhighlight: function(child) {
			return child.unhighlight();
		}
	},

	//
	// querying methods
	//

	hasChildren: function(filter) {

		// check for iterator
		//
		if (this.each) {

			// iterate over children
			//
			let found = false;
			this.each(() => {
				found = true;
				return false;
			}, filter);
			return found;
		} else if (this.children) {
			return this.children.length > 0;
		} else {
			return false;
		}
	},

	indexOf: function(item, filter) {

		// check for iterator
		//
		if (this.each) {

			// iterate over children
			//
			let index;
			let count = 0;
			this.each((child) => {
				if (!filter || filter(child)) {
					if (child == item) {
						index = count;
						return false;
					}
					count++;
				}
			}, filter);
			return index;
		} else if (this.children) {

			// loop over children
			//
			let count = 0;
			for (let i = 0; i < this.children.length; i++) {
				let child = this.children.findByIndex(i);
				if (!filter || filter(child)) {
					if (child == item) {
						return count;
					}
					count++;
				}
			}		
		}
	},

	//
	// counting methods
	//

	numChildren: function(filter) {

		// check for iterator
		//
		if (this.each) {

			// iterate over children
			//
			let num = 0;
			this.each(() => {
				num++;
			}, filter);
			return num;
		} else if (this.children) {
			return this.children.length;
		} else {
			return 0;
		}
	},

	//
	// getting methods
	//

	getLength: function(filter, options) {

		// check for iterator
		//
		if (this.each) {

			// iterate over children
			//
			let count = 0;
			this.each(() => {
				count++;
			}, filter, options);
			return count;
		} else if (this.children) {

			// loop over children
			//
			let length = 0;
			for (let i = 0; i < this.children.length; i++) {
				let child = this.children.findByIndex(i);
				if (!filter || filter(child)) {
					length++;
				}	
			}
			return length;
		}
	},

	getChildren: function(filter) {

		// check for iterator
		//
		if (this.each) {

			// iterate over children
			//
			let children = [];
			this.each((child) => {
				children.push(child);
			}, filter);
			return children;
		} else {
			return this.children;
		}
	},

	getChildModels: function(filter) {

		// check for iterator
		//
		if (this.each) {

			// iterate over children
			//
			let models = [];
			this.each((child) => {
				models.push(child.model);
			}, filter);
			return models;
		} else if (this.children) {

			// loop over children
			//
			let models = [];
			for (let i = 0; i < this.children.length; i++) {
				let child = this.children.findByIndex(i);
				if (!filter || filter(child)) {
					models.push(child.model);
				}	
			}
			return models;
		} else {
			return [];
		}
	},

	//
	// finding methods
	//

	findByModel: function(model, filter) {

		// check for iterator
		//
		if (this.each) {

			// iterate over children
			//
			let item;
			this.each((child) => {
				if (!filter || filter(child)) {
					if (child.model == model) {
						item = child;
						return false;
					}
				}
			}, filter);
			return item;
		} else if (this.children) {

			// loop over children
			//
			for (let i = 0; i < this.children.length; i++) {
				let child = this.children.findByIndex(i);
				if (!filter || filter(child)) {
					if (child.model == model) {
						return child;
					}
				}	
			}
		}
	},

	findByIndex: function(index, filter) {

		// check for iterator
		//
		if (this.each) {

			// iterate over children
			//
			let count = 0;
			let item;
			this.each((child) => {
				if (!filter || filter(child)) {
					if (index == count) {
						item = child;
						return false;
					}
					count++;
				}
			}, filter);
			return item;
		} else if (this.children) {

			// loop over children
			//
			for (let i = 0; i < this.children.length; i++) {
				let child = this.children.findByIndex(i);
				if (!filter || filter(child)) {
					if (i == index) {
						return child;
					}
				}	
			}
		}
	}
};