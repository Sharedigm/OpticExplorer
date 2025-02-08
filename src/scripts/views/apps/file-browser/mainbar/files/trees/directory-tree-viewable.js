/******************************************************************************\
|                                                                              |
|                          directory-tree-viewable.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a mixin for a single directory tree item.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TreeViewable from '../../../../../../views/items/trees/tree-viewable.js';
import FileUtils from '../../../../../../utilities/files/file-utils.js';

export default _.extend({}, TreeViewable, {

	//
	// attributes
	//

	ownerThumbnailSize: 25,

	regions: {
		badges: {
			el: '.badges',
			replaceElement: true
		}
	},

	//
	// querying methods
	//

	isUniqueName: function(name) {
		let item = this.model.collection.directory.getItemNamed(name);
		return !item || item == this.model;
	},

	hasOwner: function() {
		return this.model? this.model.has('owner') : false;
	},

	//
	// getting methods
	//

	getName: function() {
		return this.model.getName();
	},

	getOwner: function() {
		return this.model? this.model.get('owner') : undefined;
	},

	getOwnerThumbnailUrl: function() {
		if (!this.hasOwner()) {
			return false;
		}
		let owner = this.getOwner()
		return owner.hasProfilePhoto()? owner.getProfilePhotoUrl({
			min_size: Math.floor(this.ownerThumbnailSize * (window.devicePixelRatio || 1))
		}) : undefined;
	},

	getGeoOrientation: function() {
		return this.model.getGeoOrientation? this.model.getGeoOrientation() : undefined;
	},

	getDetails: function() {
		let kind = this.options.preferences? this.options.preferences.get('detail_kind') : undefined;
		if (!this.isTop() && kind) {
			return this.model.getAttribute(kind, this.options.preferences);
		}
	},

	//
	// setting methods
	//

	setName: function(name) {
		
		// check if name has changed
		//
		if (name != FileUtils.getItemName(this.model.get('path'))) {
			let path = FileUtils.getDirectoryPath(this.model.get('path'));

			// rename file
			//
			this.model.moveTo(path? path + name : name, {

				// callbacks
				//
				error: (model, response) => {

					// revert name to previous value
					//
					this.revertName();

					// show error message
					//
					application.error({
						message: "Could not rename this item.",
						response: response
					});
				}
			});
		}
	},

	//
	// drag event handling methods
	//
	
	onDropOut: function() {
		
		// perform callback
		//
		if (this.options.ondropout) {
			this.options.ondropout(this.parent.getSelectedModels());
		}
	}
});