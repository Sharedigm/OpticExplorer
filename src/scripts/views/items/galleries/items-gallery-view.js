/******************************************************************************\
|                                                                              |
|                            items-gallery-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a photo / image gallery.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Items from '../../../collections/storage/items.js';
import SelectableCollectionView from '../../../views/collections/selectable-collection-view.js';
import GalleryItemView from '../../../views/items/galleries/gallery-item-view.js';
import '../../../../vendor/jpictura/js/jpictura.js';

export default SelectableCollectionView.extend({

	//
	// attributes
	//

	className: 'gallery',

	template: template(`
		<div class="images"></div>
		
		<% if (max_images) { %>
		<% if (num_images > max_images) { %>
		<button class="more btn">
			and <%= num_images - max_images %> more!
		</button>
		<% } %>
		<% } %>
	`),
	childView: GalleryItemView,
	childViewContainer: '.images',

	events: _.extend({}, SelectableCollectionView.prototype.events, {
		'click .more': 'onClickMore'
	}),

	defaults: {
		selectors: {
			item: '.item',
			image: 'img'
		},
		layout: {
			rowPadding: 0,
			applyRowPadding: true,
			itemSpacing: 10,
			applyItemSpacing: true,
			idealRowHeight: 256,
			minWidthHeightRatio: 1 / 3,
			maxWidthHeightRatio: 3,
			stretchImages: false,
			allowCropping: false,
			croppingEpsilon: 3,
			centerImages: true,
			justifyLastRow: true
		},
		effects: {
			fadeInItems: true
		},
		responsive: {
			enabled: true,
			onWindowWidthResize: true,
			onContainerWidthResize: true,
			containerResizeInterval: 50,
			debounce: 200
		},
		waitForImages: false,
		// heightCalculator: jpictura.heightCalculator,
		algorithm: {
			epsilon: 0.01,
			maxIterationCount: 50
		},
		debug: false	
	},

	max_images: undefined,

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (this.options.max_images) {
			this.max_images = this.options.max_images;
		}
		if (this.options.defaults != undefined) {
			this.defaults = $.extend({}, this.defaults, this.options.defaults);
		}
	},

	//
	// counting methods
	//

	numItems: function() {
		let count = 0;
		for (let i = 0; i < this.collection.length; i++) {
			if (this.modelFilter(this.collection.at(i))) {
				count++;
			}
		}
		return count;
	},

	//
	// getting methods
	//

	getItemAt: function(index) {
		let view = {};
		let count = 0;
		for (let i = 0; i < this.collection.length; i++) {
			view.model = this.collection.at(i);
			if (this.viewFilter(view, i)) {
				if (count == index) {
					return view.model;
				}
				count++;
			}
		}
	},

	//
	// filtering methods
	//

	modelFilter: function(model) {
		return model.getUrl != null;
	},

	viewFilter: function (child, index) {
		if (index == 0) {
			this.count = 0;
		}
		if (this.modelFilter(child.model)) {
			this.count++;
			if (this.max_images == undefined || this.count <= this.max_images) {
				return true;
			}
		}
		return false;
	},

	//
	// opening methods
	//

	openImage: function(image, options) {
		if (!options) {
			options = {};
		}

		let collection = options.collection || this.collection;
		
		// launch image viewer
		//
		application.launch('image_viewer', {
			model: image,
			collection: new Items(collection.models), 
			defaults: {
				show_sidebar: collection.models.length > 1
			}
		}, _.extend({
			maximized: !application.isSignedIn()
		}, options));
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			num_images: this.numItems(),
			max_images: this.max_images
		};
	},

	childViewOptions: function(model) {
		return _.extend({}, this.options, {
			model: model,
			lightbox: this.options.lightbox,

			// options
			//
			selected: this.options.selected && this.options.selected.length > 0 && this.options.selected.contains(model)
		});
	},

	onAttach: function() {

		if (this.options.lightbox) {

			// add lightbox effect
			//
			if (this.options.lightbox) {
				this.$el.find('.lightbox').attr('rel', 'group1');
				this.getParentView('page').addLightBox();
			}
		}

		// arrange images
		//
		if (this.options.inline) {

			// arrange items in a list
			//
			this.$el.addClass('inline');
		} else {

			// arrange items in a grid
			//
			this.$el.jpictura(this.defaults);
		}
	},

	//
	// mouse event handling methods
	//

	onClickMore: function() {
		this.openImage(this.getItemAt(0));
	},
});