/******************************************************************************\
|                                                                              |
|                                  files-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying and manipulating files.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../../../models/storage/files/file.js';
import ItemsView from '../../../../../views/items/items-view.js';
import FileCopyable from '../../../../../views/apps/file-browser/mainbar/behaviors/file-copyable.js';
import DirectoryIconsView from '../../../../../views/apps/file-browser/mainbar/files/icons/directory-icons-view.js';
import DirectoryListView from '../../../../../views/apps/file-browser/mainbar/files/lists/directory-list-view.js';
import DirectoryTreeView from '../../../../../views/apps/file-browser/mainbar/files/trees/directory-tree-view.js';
import DirectoryTilesView from '../../../../../views/apps/file-browser/mainbar/files/tiles/directory-tiles-view.js';
import DirectoryCardsView from '../../../../../views/apps/file-browser/mainbar/files/cards/directory-cards-view.js';
import DirectoryPagerView from '../../../../../views/apps/file-browser/mainbar/files/pages/directory-pager-view.js';
import FileUtils from '../../../../../utilities/files/file-utils.js';

export default ItemsView.extend(_.extend({}, FileCopyable, {

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.add_behaviors == undefined) {
			this.options.add_behaviors = true;
		}
		if (this.options.show_controls == undefined) {
			this.options.show_controls = true;
		}
	},

	//
	// getting methods
	//

	getDetails: function() {
		if (!this.options.preferences) {
			return [];
		}

		// get details
		//
		let details = this.options.preferences.get('properties');

		// add detail kind
		//
		if (this.options.preferences.has('detail_kind')) {
			details.push(this.options.preferences.get('detail_kind'))
		}

		return details;
	},

	//
	// setting methods
	//

	setOption: function(key, value) {

		// update view
		//
		switch (key) {
			case 'properties':
			case 'detail_kind':

				// change copy of current preferences
				//
				if (this.options.preferences) {
					this.options.preferences.set(key, value);
				}

				// fetch updates
				//
				if (this.model) {
					this.model.load({
						details: this.getDetails(),

						// callbacks
						//
						success: () => {

							// call superclass method
							//
							ItemsView.prototype.setOption.call(this, key, value);
						}
					});
				} else {

					// call superclass method
					//
					ItemsView.prototype.setOption.call(this, key, value);
				}
				break;

			default:

				// call superclass method
				//
				ItemsView.prototype.setOption.call(this, key, value);
		}
	},

	//
	// filtering methods
	//

	filter: function (child) {
		if (child.isHidden()) {
			let preferences = child.parent.options.preferences;
			return preferences? preferences.get('show_hidden_files') : false;
		} else {
			return true;
		}
	},

	//
	// sorting methods
	//

	sortItemsBy: function(sortKind, sortOrder) {

		function reverseSortBy(sortByFunction) {
			return function(left, right) {
				return sortByFunction(right, left);
			};
		}

		// sort collection
		//
		if (this.collection) {

			// set sort kind
			//
			this.collection.comparator = function(item1, item2) {
				switch (sortKind) {

					case 'name': {
						let name1 = item1.getName();
						let name2 = item2.getName();

						// force home directory to be first
						//
						if (!name1 || name1 == 'Home') {
							return -1;
						}
						if (!name2 || name2 == 'Home') {
							return 1;
						}

						// force trash to be last
						//
						if (name1 == 'Trash') {
							return 1;
						}
						if (name2 == 'Trash') {
							return -1;
						}

						// compare names, taking into account numerical names
						//
						return name1.localeCompare(name2, undefined, {
							numeric: true
						});
					}

					case 'kind': {
						let extension1 = FileUtils.getFileExtension(item1.get('path')).toLowerCase();
						let extension2 = FileUtils.getFileExtension(item2.get('path')).toLowerCase();
						return extension1 < extension2? -1 : 1;
					}

					case 'size': {
						if (item1 instanceof File && item2 instanceof File) {
							let size1 = item1.getSortableAttribute('size');
							let size2 = item2.getSortableAttribute('size');
							return size1 < size2? -1 : 1;
						} else if (item1 instanceof File) {
							return -1;
						} else if (item2 instanceof File) {
							return 1;
						} else {
							let size1 = item1.getSortableAttribute('size');
							let size2 = item2.getSortableAttribute('size');
							return size1 < size2? -1 : 1;
						}
					}

					default: {
						let attribute1 = item1.getSortableAttribute(sortKind);
						let attribute2 = item2.getSortableAttribute(sortKind);
						return attribute1 < attribute2? -1 : 1;
					}
				}
			};
			
			// set sort order
			//
			if (sortOrder == 'decreasing') {
				this.collection.comparator = reverseSortBy(this.collection.comparator);
			}

			this.collection.sort();
		}
	},

	//
	// rendering methods
	//

	showIcons: function() {

		// show directory icons
		//
		this.showChildView('items', new DirectoryIconsView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			filter: this.options.filter || this.filter,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropout: (items) => this.onDropOut(items)
		})));
	},

	showLists: function(inline) {

		// show directory lists
		//
		this.showChildView('items', new DirectoryListView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			inline: inline,
			filter: this.options.filter || this.filter,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropout: (items) => this.onDropOut(items)
		})));
	},

	showTrees: function() {

		// show directory tree
		//
		this.showChildView('items', new DirectoryTreeView(_.extend({}, this.options, {
			model: this.model,
			collection: this.collection,

			// options
			//
			filter: this.options.filter || this.filter,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropout: (items) => this.onDropOut(items)
		})));
	},

	showTiles: function() {

		// show directory tiles
		//
		this.showChildView('items', new DirectoryTilesView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			filter: this.options.filter || this.filter,
			tile_size: this.options.preferences? this.options.preferences.get('tile_size') : undefined,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropout: (items) => this.onDropOut(items)
		})));
	},

	showCards: function() {

		// show directory cards
		//
		this.showChildView('items', new DirectoryCardsView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			filter: this.options.filter || this.filter,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropout: (items) => this.onDropOut(items)
		})));
	},

	showPages: function() {

		// show directory pages
		//
		this.showChildView('items', new DirectoryPagerView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			filter: this.options.filter || this.filter,
			playable: true,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropout: (items) => this.onDropOut(items)
		})));
	},

	showGallery: function() {
		import(
			'../../../../../views/apps/file-browser/mainbar/files/galleries/image-gallery-view.js'
		).then((ImageGalleryView) => {

			// show directory gallery
			//
			this.showChildView('items', new ImageGalleryView.default(_.extend({}, this.options, {
				collection: this.collection,

				// options
				//
				filter: this.options.filter || this.filter,

				// callbacks
				//
				onselect: (item) => this.onSelect(item),
				ondeselect: (item) => this.onDeselect(item),
				onopen: (item) => this.onOpen(item),
				ondropout: (items) => this.onDropOut(items)
			})));
		});
	},

	showMap: function() {
		application.loadAppView('map_viewer', {

			// callbacks
			//
			success: (MapViewer) => {

				// show directory map
				//
				this.showChildView('items', MapViewer.getDirectoryMapView(_.extend({}, this.options, {
					collection: this.collection,

					// options
					//
					filter: this.options.filter || this.filter,
					max_size: 512,

					// callbacks
					//
					onselect: (item) => this.onSelect(item),
					ondeselect: (item) => this.onDeselect(item),
					onopen: (item) => this.onOpen(item),
					ondropout: (items) => this.onDropOut(items)
				})));
			}
		});
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		if (this.getChildView('items').onKeyDown) {
			return this.getChildView('items').onKeyDown(event);
		}
	},

	//
	// window event handling methods
	//

	onResize: function(event) {
		if (this.hasChildView('items') && this.getChildView('items').onResize) {
			this.getChildView('items').onResize(event);
		}
	}
}));