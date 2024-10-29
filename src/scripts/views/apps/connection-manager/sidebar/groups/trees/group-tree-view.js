/******************************************************************************\
|                                                                              |
|                              group-tree-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an item tree view of a connections group.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import User from '../../../../../../models/users/user.js';
import Group from '../../../../../../models/users/connections/group.js';
import TreeView from '../../../../../../views/items/trees/tree-view.js';
import ItemDroppable from '../../../../../../views/behaviors/drag-and-drop/item-droppable.js';
import GroupMemberView from '../../../../../../views/apps/connection-manager/sidebar/groups/trees/group-member-view.js';

export default TreeView.extend(_.extend({}, ItemDroppable, {

	//
	// attributes
	//

	events: _.extend({}, TreeView.prototype.events, ItemDroppable.events),
	
	//
	// icon attributes
	//

	folderIcon: 'fa fa-user-friends',
	folderOpenIcon: 'fa fa-user-friends',
	emptyFolderIcon: 'far fa-user-friends',
	emptyFolderOpenIcon: 'far fa-user-friends',

	//
	// constructor
	//

	initialize: function() {
		
		// set optional parameter defaults
		//
		if (this.options.editable == undefined) {
			this.options.editable = false;
		}
		if (this.options.draggable == undefined) {
			this.options.draggable = false;
		}
		if (this.options.droppable == undefined) {
			this.options.droppable = true;
		}

		// call superclass constructor
		//
		TreeView.prototype.initialize.call(this);

		// set attributes
		//
		this.collection = this.model.get('members');
	},

	//
	// querying methods
	//

	isTop: function() {
		return false;
	},

	hasTop: function() {
		return false;
	},

	hasParent: function() {
		return false;
	},

	//
	// getting methods
	//
	
	getTop: function() {
		return this.parent;
	},

	getName: function() {
		return this.model.get('name');
	},

	getUsersNames: function(users) {
		let names = [];
		for (let i = 0; i < users.length; i++) {
			names.push(users[i].getName());
		}
		return names;
	},

	getThumbnailUrl: function() {
		return this.model.getThumbnailUrl({
			min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
	},

	getIcon: function() {
		if (this.model.hasThumbnail()) {
			return '<div class="thumbnail" style="background-image:url(' + this.getThumbnailUrl() + ')"></div>';
		} else {
			let className;

			// use standard icons
			//
			if (this.model.isEmpty()) {
				className = this.isCollapsed()? this.emptyFolderIcon : this.emptyFolderOpenIcon;
			} else {
				className = this.isCollapsed()? this.folderIcon : this.folderOpenIcon;
			}

			return '<i class="' + className + '"></i>';
		}
	},

	//
	// setting methods
	//

	setName: function(name) {

		// check if name has changed
		//
		if (name != this.model.get('name')) {

			// rename file
			//
			this.model.save({
				name: name
			}, {

				// callbacks
				//
				error: (model, response) => {

					// revert name to previous value
					//
					this.revertName();

					// show error message
					//
					application.error({
						message: "Could not rename this group.",
						response: response
					});
				}
			});
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.getIcon(),
			name: this.getName(),
			details: null
		};
	},

	childView: function(item) {
		if (item instanceof User) {
			return GroupMemberView;
		} else if (item instanceof Group) {
			return this.constructor;
		}
	},

	//
	// drag and drop event handling methods
	//

	onDropOn: function(items) {

		// expand sub tree
		//
		this.unhighlight();
		this.expand();

		// perform callback
		//
		if (this.options.ondropon) {
			this.options.ondropon(items, this);
		}
	}
}));