/******************************************************************************\
|                                                                              |
|                              volume-tree-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a recursive volume tree.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../../../../models/storage/files/file.js';
import Directory from '../../../../../../models/storage/directories/directory.js';
import Volume from '../../../../../../models/storage/directories/volume.js';
import TreeView from '../../../../../../views/items/trees/tree-view.js';
import DirectoryTreeViewable from '../../../../../../views/apps/file-browser/mainbar/files/trees/directory-tree-viewable.js';
import FileLeafView from '../../../../../../views/apps/file-browser/mainbar/files/trees/file-leaf-view.js';
import VolumeTreeView from '../../../../../../views/apps/file-browser/mainbar/files/trees/volume-tree-view.js';

export default TreeView.extend(_.extend({}, DirectoryTreeViewable, {

	//
	// attributes
	//

	template: template(`
		<div class="info">
			
			<span class="expander">
				<button type="button" class="expand btn-sm">
					<i class="fa fa-caret-right"></i>	
				</button>
				<button type="button" class="collapse btn-sm">
					<i class="fa fa-caret-down"></i>
				</button>
			</span>
		
			<div class="icon">
				<%= icon %>
			</div>
			
			<div class="name" spellcheck="false"><%= name %></div>
			
			<div class="specifics">
				<div class="badges"></div>
				<div class="details"><%= details %></div>

				<% if (owner) { %>
				<div class="owner small tile" data-toggle="tooltip" data-html="true" title="shared by <%= owner.getName() %>">
					<% if (owner.hasProfilePhoto()) { %>
					<div class="thumbnail" style="background-image:url(<%= owner_thumbnail_url %>)">
						<img style="display:none" src="<%= owner_thumbnail_url %>" onerror="this.classList.add('lost')" />
						<i class="placeholder far fa-user"></i>
					</div>
					<% } else { %>
					<div class="thumbnail">
						<i class="fa fa-user"></i>
					</div>
					<% } %>
				</div>
				<% } %>
			</div>
		</div>
		
		<ul class="hideable item-list"></ul>
	`),

	events: _.extend({}, TreeView.prototype.events, DirectoryTreeViewable.events),

	//
	// constructor
	//

	initialize: function(options) {

		// set attributes
		//
		this.collection = this.model.contents;

		// call superclass method
		//
		TreeView.prototype.initialize.call(this, options);
	},

	//
	// querying methods
	//

	isTop: function() {
		return !(this.parent instanceof this.constructor);
	},

	//
	// getting methods
	//

	getName: function() {
		if (this.options.preferences.get('show_file_extensions')) {
			return this.model.getName();
		} else {
			return this.model.getBaseName();	
		}
	},
	
	className: function() {
		return 'volume ' + TreeView.prototype.className;
	},

	getOwnerThumbnailUrl: function() {
		let owner = this.getOwner();
		return owner && owner.hasProfilePhoto()? owner.getProfilePhotoUrl({
			min_size: Math.floor(this.ownerThumbnailSize * (window.devicePixelRatio || 1))
		}) : undefined;
	},

	//
	// filtering methods
	//

	viewFilter: function (child) {
		if (child.isHidden()) {
			let preferences = child.parent.options.preferences;
			return preferences? preferences.get('show_hidden_files') : false;
		} else {
			return true;
		}
	},
	
	//
	// rendering methods
	//

	getIcon: function() {
		return '<i class="fa fa-database"></i>';
	},

	templateContext: function() {		
		return {
			icon: this.getIcon(),
			name: this.getName(),
			owner_thumbnail_url: this.getOwnerThumbnailUrl(),
			details: this.getDetails(),
		};
	},

	childView: function(item) {
		if (item instanceof Volume) {
			return VolumeTreeView;
		} else if (item instanceof File) {
			return FileLeafView;
		} else if (item instanceof Directory) {
			return this.constructor;
		}
	},

	//
	// expand / collapse methods
	//

	expand: function() {
		if (this.isCollapsed()) {

			// call superclass method
			//
			TreeView.prototype.expand.call(this);

			if (!this.model.loaded && !this.model.loading) {

				// load contents
				//
				this.model.load({
					
					// callbacks
					//
					success: () => this.expand()
				});
			}
		}
	},

	//
	// drag and drop event handling methods
	//

	onDropOn: function(items) {

		// handle parent's drop on child callback
		//
		if (this.hasParentView('items') && this.getParentView('items').onDropOnChild) {
			this.getParentView('items').onDropOnChild(items, this, {

				// callbacks
				//
				success: () => {

					// expand sub tree
					//
					this.unhighlight();
					this.expand();
				}
			});
		} else {
			this.unhighlight();
		}
	}
}));