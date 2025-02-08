/******************************************************************************\
|                                                                              |
|                            directory-tree-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a recursive directory tree.                    |
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
import FileDroppable from '../../../../../../views/apps/file-browser/mainbar/behaviors/file-droppable.js';
import FileLeafView from '../../../../../../views/apps/file-browser/mainbar/files/trees/file-leaf-view.js';
import VolumeTreeView from '../../../../../../views/apps/file-browser/mainbar/files/trees/volume-tree-view.js';
import DirectoryListView from '../../../../../../views/apps/file-browser/mainbar/files/lists/directory-list-view.js';
import ItemBadgesView from '../../../../../../views/apps/file-browser/mainbar/files/badges/item-badges-view.js';

export default TreeView.extend(_.extend({}, DirectoryTreeViewable, FileDroppable, {

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

	regions: {
		badges: {
			el: '.badges',
			replaceElement: true
		}
	},

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
		return this.model.getName() || 'Home';
	},

	className: function() {
		let name = '';

		switch (this.model.get('path')) {
			case '/':
				name = 'home';
				break;
			case '.Clipboard/':
				name = 'clipboard';
				break;
			case 'Trash/':
				name = 'trash';
				break;
		}

		// add 'system'
		//
		if (this.isHidden()) {
			if (name != '') {
				name += ' ';
			}
			name += 'system';
		}

		// add 'directory item'
		//
		if (name != '') {
			name += ' ';
		}
		name += 'directory ' + TreeView.prototype.className;

		return name;
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

	getSpecialIcon: function(icons) {
		let className;

		if (typeof icons.font == 'string') {
			className = icons.font;
		} else {

			// select empty or full icon, defaulting to empty
			//
			if (this.model.isEmpty()) {
				className = icons.font[0];
			} else if (this.model.isFull()) {
				className = icons.font[1];
			} else {
				className = icons.font[0];
			}
		}

		return '<i class="' + className + '"></i>';
	},

	getCustomIcon: function(icons) {
		let className;

		if (typeof icons.font == 'string') {
			className = icons.font;
		} else {

			// select empty or full icon, defaulting to full
			//
			if (this.model.isEmpty()) {
				className = icons.font[0];
			} else {
				className = icons.font[1];
			}
		}

		return '<i class="' + className + '"></i>';
	},

	getDefaultIcon: function() {
		let className;

		if (this.model.isAudioAlbum()) {
			className = config.files.folders.albums.audio.font;
		} else if (this.model.isImageAlbum()) {
			className = config.files.folders.albums.image.font;
		} else if (this.model.isVideoAlbum()) {
			className = config.files.folders.albums.video.font;
		} else if (this.model.isEmpty()) {
			className = this.isCollapsed()? this.emptyFolderIcon : this.emptyFolderOpenIcon;
		} else {
			className = this.isCollapsed()? this.folderIcon : this.folderOpenIcon;
		}

		return '<i class="' + className + '"></i>';
	},

	getIcon: function() {
		let name = this.getName().toTitleCase();
		let icons = config.files.folders.names[name];

		// return special, custom or default icon
		//
		if (icons && (name == 'Trash' || name == '.Clipboard')) {
			return this.getSpecialIcon(icons);
		} else if (icons) {
			return this.getCustomIcon(icons);
		} else {
			return this.getDefaultIcon();
		}
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

	showBadges: function() {
		this.showChildView('badges', new ItemBadgesView({
			model: this.model
		}));
	},

	onRender: function() {

		// call superclass method
		//
		TreeView.prototype.onRender.call(this);

		// apply file list icon styles
		//
		DirectoryListView.applyFileStyles(config.files.files.extensions);
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