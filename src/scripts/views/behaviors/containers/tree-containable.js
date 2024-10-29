/******************************************************************************\
|                                                                              |
|                             tree-containable.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of behavior for recursive containers.             |
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
	// iterator
	//

	each: function(callback, filter, options) {

		// iterate over children
		//
		for (let i = 0; i < this.children.length; i++) {
			let child = this.children.findByIndex(i);

			// perform callback if not filtered out
			//
			if (!filter || filter(child)) {
				if (callback(child, options) == false) {
					return false;
				}
			}

			// check if we should skip child's children
			//
			if (child.isCollapsed && child.isCollapsed()) {
				continue;
			}

			// iterate over child's children
			//
			if (child.each) {
				if (child.each(callback, filter, options) == false) {
					return false;
				}
			}
		}
	},
	
	//
	// querying methods
	//

	hasChildren: function(filter) {
		for (let i = 0; i < this.children.length; i++) {
			let child = this.children.findByIndex(i);
			if (!filter || filter(child)) {
				return true;
			} else if (child.hasChildren) {
				if (child.hasChildren(filter)) {
					return true;
				}
			}
		}
		return false;
	},

	//
	// counting methods
	//

	numChildren: function(filter) {
		let num = 0;
		for (let i = 0; i < this.children.length; i++) {
			let child = this.children.findByIndex(i);
			if (!filter || filter(child)) {
				num++;
			}
			if (child.numChildren) {
				num += child.numChildren(filter);
			}
		}
		return num;
	},

	//
	// getting methods
	//

	getChildren: function(filter) {
		let children = [];
		for (let i = 0; i < this.children.length; i++) {
			let child = this.children.findByIndex(i);
			if (!filter || filter(child)) {
				children.push(child);
			}
			if (child.getChildren) {
				let grandChildren = child.getChildren(filter);
				for (let i = 0; i < grandChildren.length; i++) {
					children.push(grandChildren[i]);
				}
			}
		}
		return children;
	},

	getChildModels: function(filter) {
		let models = [];
		for (let i = 0; i < this.children.length; i++) {
			let child = this.children.findByIndex(i);
			if (!filter || filter(child)) {
				models.push(child.model);
			}
			if (child.getChildModels) {
				let grandChildModels = child.getChildModels(filter);
				for (let i = 0; i < grandChildModels.length; i++) {
					models.push(grandChildModels[i]);
				}
			}
		}
		return models;
	}
};