/******************************************************************************\
|                                                                              |
|                                items-view.js                                 |
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

import BaseView from '../../views/base-view.js';
import SelectableContainable from '../../views/behaviors/containers/selectable-containable.js';
import Scrollable from '../../views/behaviors/layout/scrollable.js';
import MouseDragSelectBehavior from '../../views/behaviors/mouse/mouse-drag-select-behavior.js';
import IconsView from '../../views/items/icons/icons-view.js';
import ListView from '../../views/items/lists/list-view.js';
import TreeView from '../../views/items/trees/tree-view.js';
import TilesView from '../../views/items/tiles/tiles-view.js';
import CardsView from '../../views/items/cards/cards-view.js';
import PagerView from '../../views/items/pages/pager-view.js';
import ItemsGalleryView from '../../views/items/galleries/items-gallery-view.js';
import Browser from '../../utilities/web/browser.js';

export default BaseView.extend(_.extend({}, SelectableContainable, Scrollable, {

	//
	// attributes
	//

	className: 'items',

	template: template(`<div class="items"></div>
	`),

	regions: {
		items: {
			el: '.items',
			replaceElement: true
		}
	},

	empty: 'No items',

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.droppable == undefined) {
			this.options.droppable = true;
		}
		if (this.options.uploadable == undefined) {
			this.options.uploadable = true;
		}

		// set attributes
		//
		if (this.options.emptyView) {
			this.emptyView = this.options.emptyView;
		}
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('items')) {
			this.getChildView('items').each(callback, filter, options);
		}
	},

	//
	// querying methods
	//

	indexOf: function(item) {
		if (this.hasChildView('items')) {
			return this.getChildView('items').indexOf(item);
		}
	},

	findByIndex: function(index) {
		if (this.hasChildView('items')) {
			return this.getChildView('items').findByIndex(index);
		}
	},

	//
	// getting methods
	//

	getViewKind: function() {
		if (this.options.view_kind) {
			return this.options.view_kind;
		} else if (this.options.preferences) {
			return this.options.preferences.get('view_kind');
		}
	},

	getItemView: function(model) {
		if (this.hasChildView('items')) {
			return this.getChildView('items').getItemView(model);
		}
	},

	//
	// setting methods
	//

	setOption: function(key, value) {

		// change copy of current preferences
		//
		if (this.options.preferences) {
			this.options.preferences.set(key, value);
		}

		// set map options
		//
		if (this.view_kind == 'maps' && key != 'view_kind') {
			this.getChildView('items').setOption(key, value);
			return;
		}

		// update view
		//
		switch (key) {

			case 'view_kind':
				this.setViewKind(value);
				break;

			case 'tile_size':
				this.setTileSize(value);
				break;

			case 'show_image_names':
				if (value) {
					this.$el.removeClass('hide-image-names');
				} else {
					this.$el.addClass('hide-image-names');
				}
				break;

			case 'map_mode':
				if (this.hasChildView('items') && this.getChildView('items').setMapMode) {
					this.getChildView('items').setMapMode(value);
				}
				break;

			default:
				this.update();
		}
	},

	setViewKind: function(viewKind) {
		if (this.options.view_kind != viewKind) {
			this.options.view_kind = viewKind;
			this.update();
		}
	},

	setTileSize: function(tileSize) {
		if (this.options.tile_size != tileSize) {
			this.options.tile_size = tileSize;

			// update child view
			//
			if (this.getChildView('items').setTileSize) {
				this.getChildView('items').setTileSize(tileSize);
			}
		}
	},

	//
	// behavior setting methods
	//

	addBehaviors: function() {

		// add behaviors
		//
		if (this.options.selectable && this.options.deselectable !== false) {

			// add drag behavior
			//
			if (!this.dragSelectBehavior) {
				this.addDragSelectBehavior();
			} else {
				this.dragSelectBehavior.on();
			}

			// add class
			//
			this.$el.addClass('drag-selectable');
		}
	},

	removeBehaviors: function() {
		if (this.dragSelectBehavior) {

			// deactivate behavior
			//
			this.dragSelectBehavior.off();

			// remove class
			//
			this.$el.removeClass('drag-selectable');
		}
	},

	addDragSelectBehavior: function() {
		let numSelected = 0;

		// add drag select behavior
		//
		this.dragSelectBehavior = new MouseDragSelectBehavior(this, {
			on: true,

			// callbacks
			//
			onmousedown: (event) => {

				// allows cursor to be set
				//
				event.preventDefault();
			},

			onchange: () => {

				// notify if num selected changes
				//
				if (this.numSelected() != numSelected) {
					numSelected = this.numSelected();
					if (numSelected > 0) {
						this.onSelect(this.getSelected());
					}
				}
			},

			onmouseup: (event) => {

				// perform callback
				//
				if (this.options.ondragend) {
					this.options.ondragend(event);
				}
			}
		});
	},

	//
	// sorting methods
	//

	sortItemsBy: function(sortKind, sortOrder) {

		function reverseSortBy(sortByFunction) {
			return function(left, right) {
				let l = sortByFunction(left);
				let r = sortByFunction(right);

				if (l === void 0) return -1;
				if (r === void 0) return 1;

				return l < r ? 1 : l > r ? -1 : 0;
			};
		}

		// set sort kind
		//
		this.collection.comparator = function(item) {
			return item.getSortableAttribute(sortKind);
		};

		// set sort order
		//
		if (sortOrder == 'decreasing') {
			this.collection.comparator = reverseSortBy(this.collection.comparator);
		}

		this.collection.sort();
	},

	sortItems: function() {
		if (this.options.preferences) {
			let sortKind = this.options.preferences.get('sort_kind');
			let sortOrder = this.options.preferences.get('sort_order');
			if (sortKind) {
				this.sortItemsBy(sortKind, sortOrder);
			}
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show directory contents
		//
		this.sortItems();
		this.showItems();

		// show / hide image names
		//
		if (this.options.preferences && !this.options.preferences.get('show_image_names')) {
			this.$el.addClass('hide-image-names');
		}
	},

	showItems: function() {
		this.view_kind = this.getViewKind();

		if (!this.view_kind && Browser.is_mobile) {
			this.view_kind = 'cards';
		}

		// show files and directories
		//
		switch (this.view_kind || 'icons') {
			case 'icons':
				this.showIcons();
				break;
			case 'names':
			case 'lists':
				this.showLists(this.view_kind == 'names');
				break;
			case 'trees':
				this.showTrees();
				break;
			case 'tiles':
				this.showTiles();
				break;
			case 'cards':
				this.showCards();
				break;
			case 'pages':
				this.showPages();
				break;
			case 'gallery':
				this.showGallery();
				break;
			case 'maps':
				this.showMap();
				break;
		}

		// set drag behaviors
		//
		if (!Browser.is_touch_enabled) {
			if (this.view_kind != 'pages' && this.view_kind != 'gallery' && this.view_kind != 'maps') {
				this.addBehaviors();
			} else {
				this.removeBehaviors();
			}
		}
	},

	showIcons: function() {
		this.showChildView('items', new IconsView(_.extend({
			collection: this.collection
		}, this.options)));
	},

	showLists: function(inline) {
		this.showChildView('items', new ListView(_.extend({
			collection: this.collection,
			inline: inline
		}, this.options)));
	},

	showTrees: function() {
		this.showChildView('items', new TreeView(_.extend({
			collection: this.collection
		}, this.options)));
	},

	showTiles: function() {
		this.showChildView('items', new TilesView(_.extend({
			collection: this.collection
		}, this.options)));
	},

	showCards: function() {
		this.showChildView('items', new CardsView(_.extend({
			collection: this.collection
		}, this.options)));
	},

	showPages: function() {
		this.showChildView('items', new PagerView(_.extend({
			collection: this.collection
		}, this.options)));
	},

	showGallery: function() {
		this.showChildView('items', new ItemsGalleryView(_.extend({
			collection: this.collection
		}, this.options)));
	},

	showMap: function() {
		application.loadAppView('map_viewer', {

			// callbacks
			//
			success: (MapViewerView) => {
				this.showChildView('items', MapViewerView.getItemsMapView(_.extend({
					collection: this.collection
				}, this.options)));
			}
		});
	},

	update: function() {
		this.options.view_kind = this.getViewKind();

		this.sortItems();

		// redraw or update items
		//
		if (this.options.view_kind != this.view_kind) {

			// set selected items
			//
			this.options.selected = this.getChildView('items').getSelectedModels();

			// redraw items
			//
			this.showItems();
		} else {

			// update items
			//
			this.getChildView('items').update();
		}
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.update();
	},
	
	//
	// selection event handling methods
	//

	onSelect: function(item) {

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect(item);
		}
	},

	onDeselect: function(item) {

		// perform callback
		//
		if (this.options.ondeselect) {
			this.options.ondeselect(item);
		}
	},

	//
	// file event handling methods
	//

	onOpen: function(item) {

		// perform callback
		//
		if (this.options.onopen) {
			this.options.onopen(item);
		}
	},
	
	//
	// drag and drop event handling methods
	//

	onDropOut: function(items) {

		// perform callback
		//
		if (this.options.ondropout) {
			this.options.ondropout(items);
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		if (this.getChildView('items').onKeyDown) {
			this.getChildView('items').onKeyDown(event);
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		if (this.dragSelectBehavior) {
			this.dragSelectBehavior.off();
		}
	}
}));