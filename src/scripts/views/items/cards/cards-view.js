/******************************************************************************\
|                                                                              |
|                                cards-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base view of a set of generic cards.                   |
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
import CardView from '../../../views/items/cards/card-view.js';

export default SelectableCollectionView.extend({

	//
	// attributes
	//

	className: 'card-grid',

	template: template(`
		<svg class="defs">
			<defs></defs>
		</svg>
		<div class="cards"></div>
	`),

	childView: CardView,
	childViewContainer: '.cards',

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
						left: position.left - offset.left,
						top: position.top - offset.top,
						width: item.width(),
						height: item.height()
					});
				} else {
					element.css({
						position: 'absolute',
						left: 0,
						top: 0,
						width: item.width(),
						height: item.height()
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
		if (this.options.multicolumn) {
			this.$el.addClass('multi-column');
		}
	},

	childViewOptions: function(model) {
		return _.extend({}, this.options, {
			model: model,

			// state
			//
			selected: this.options.selected && this.options.selected.length > 0 && this.options.selected.contains(model)
		});
	}
});