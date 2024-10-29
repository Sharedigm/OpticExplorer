/******************************************************************************\
|                                                                              |
|                                  nestable.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for reading the contents of an item.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Directory from '../../../models/storage/directories/directory.js';
import FileUtils from '../../../utilities/files/file-utils.js';

export default {

	//
	// querying methods
	//

	isRoot: function() {
		return !this.has('path') || this.has('link');
	},

	//
	// getting methods
	//

	getRoot: function() {
		if (this.isRoot()) {
			return this;
		} else {
			if (!Directory.root) {

				// use home directory
				//
				Directory.root = application.getDirectory();
			}
			return Directory.root;
		}
	},

	getTop: function() {
		let node = this;
		while (node instanceof Directory && node.parent) {
			node = node.parent;
		}
		return node;
	},

	getParent: function() {
		if (this.parent) {
			return this.parent;
		} else {
			let path = this.get('path');
			if (path && path.contains('/') && path != '/') {
				return new Directory({
					path: FileUtils.getDirectoryPath(path)
				});
			}
		}
	},

	getRelated: function(name) {

		// get attribute from item or item's ancestor
		//
		return this.get(name) || (this.parent? this.parent.getRelated(name) : null);
	}
};