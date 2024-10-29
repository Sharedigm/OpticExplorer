/******************************************************************************\
|                                                                              |
|                                 list-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base view of a set of generic list items.              |
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
import ListItemView from '../../../views/items/lists/list-item-view.js';

export default SelectableCollectionView.extend({


	//
	// attributes
	//

	tagName: 'ul',
	className: 'item-list',
	childView: ListItemView,

	//
	// rendering methods
	//

	onRender: function() {

		// style as an inline list
		//
		if (this.options.inline) {
			this.$el.addClass('inline');
		}
	},
	
	childViewOptions: function(model) {
		return _.extend({}, this.options, {
			model: model,

			// options
			//
			selected: this.options.selected && this.options.selected.length > 0 && this.options.selected.contains(model)
		});
	}
});