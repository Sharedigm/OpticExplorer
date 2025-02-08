/******************************************************************************\
|                                                                              |
|                                tiles-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base view of a set of generic tiles.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SelectableCollectionView from '../../../views/collections/selectable-collection-view.js';
import TileView from '../../../views/items/tiles/tile-view.js';

export default SelectableCollectionView.extend({

	//
	// attributes
	//

	className: 'tile-grid',

	template: template(`
		<svg class="defs">
			<defs></defs>
		</svg>
		<div class="tiles"></div>
	`),

	childView: TileView,
	childViewContainer: '.tiles',

	//
	// getting methods
	//

	getSelectedElementBounds: function() {
		let bounds = {};
		let selected = this.getVisibleElements('.selected');

		// found bounds of selected items
		//
		for (let i = 0; i < selected.length; i++) {
			let item = $(selected[i]);

			// get bounding rect
			//
			let position = item.position();
			let rect = {
				left: position.left,
				right: position.left + item[0].scrollWidth,
				top: position.top,
				bottom: position.top + item[0].scrollHeight
			};

			// add margins
			//
			let margin = {
				left: parseInt(item.css('margin-left').replace('px', '')),
				right: parseInt(item.css('margin-right').replace('px', '')),
				top: parseInt(item.css('margin-top').replace('px', '')),
				bottom: parseInt(item.css('margin-bottom').replace('px', '')),
			};
			rect.left -= margin.left;
			rect.right += margin.right - 10;
			rect.top -= margin.top;
			rect.bottom += margin.bottom - 10;

			// update bounds
			//
			if (bounds.left == undefined || rect.left < bounds.left) {
				bounds.left = rect.left;
			}
			if (bounds.right == undefined || rect.right > bounds.right) {
				bounds.right = rect.right;
			}
			if (bounds.top == undefined || rect.top < bounds.top) {
				bounds.top = rect.top;
			}
			if (bounds.bottom == undefined || rect.bottom > bounds.bottom) {
				bounds.bottom = rect.bottom;
			}
		}
		
		return bounds;
	},

	//
	// setting methods
	//

	setTileSize: function(tileSize) {
		switch (tileSize) {
			case 'small':
				this.$el.addClass('little');
				this.$el.removeClass('medium');
				this.$el.removeClass('large');
				this.$el.removeClass('extra-large');
				break;
			case 'medium':
				this.$el.removeClass('little');
				this.$el.addClass('medium');
				this.$el.removeClass('large');
				this.$el.removeClass('extra-large');
				break;
			case 'large':
				this.$el.removeClass('little');
				this.$el.removeClass('medium');
				this.$el.addClass('large');
				this.$el.removeClass('extra-large');
				break;
			case 'extra_large':
				this.$el.removeClass('little');
				this.$el.removeClass('medium');
				this.$el.removeClass('large');
				this.$el.addClass('extra-large');
				break;
		}
	},

	//
	// cloning methods
	//

	cloneElements: function(selected, offset, options) {
		let elements = [];
		for (let i = 0; i < selected.length; i++) {
			let item = $(selected[i]);

			// create element
			//
			let element = item.clone();

			// position element
			//
			if (options && options.position) {
				if (selected.length > 1) {
					let position = item.position();
					element.css({
						position: 'absolute',
						left: position.left - offset.left - 5,
						top: position.top - offset.top - 5
					});
				} else {
					element.css({
						position: 'absolute',
						left: 0,
						top: 0
					});
				}
			}

			// add element
			//
			elements.push(element);
		}

		return elements;
	},

	cloneSelectedElements: function(options) {
		let selected = this.getVisibleElements('.selected');
		let offset;

		// find offset relative to top left element
		//
		if (selected.length > 1 && options && options.position) {
			offset = {
				left: null,
				top: null
			};
			for (let i = 0; i < selected.length; i++) {
				let item = $(selected[i]);
				let position = item.position();
				if (!offset.left || position.left < offset.left) {
					offset.left = position.left;
				}
				if (!offset.top || position.top < offset.top) {
					offset.top = position.top;
				}
			}
		}

		// clone selected elements
		//
		return this.cloneElements(selected, offset, options);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			// filters: ShadowFilters,
			// gradients: LinearGradients
		};
	},

	onRender: function() {

		// set styles
		//
		if (this.options.letterboxed) {
			this.$el.addClass('letterboxed');
		}

		// set tile size
		//
		if (this.options.tile_size || this.options.preferences) {
			this.setTileSize(this.options.tile_size || this.options.preferences.get('tile_size'));
		}
	},

	childViewOptions: function(model) {
		return _.extend({}, this.options, {
			model: model,

			// state
			//
			selected: this.options.selected && this.options.selected.length > 0 && this.options.selected.contains(model)
		});
	},

	update: function() {

		// call superclass method
		//
		SelectableCollectionView.prototype.update.call(this);

		// update tile size
		//
		if (this.options.tile_size || this.options.preferences) {
			this.setTileSize(this.options.tile_size || this.options.preferences.get('tile_size'));
		}
	}
});