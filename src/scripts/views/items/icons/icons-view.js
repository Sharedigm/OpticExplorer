/******************************************************************************\
|                                                                              |
|                                 icons-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base view of a set of generic icons.                   |
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
import IconView from '../../../views/items/icons/icon-view.js';

export default SelectableCollectionView.extend({

	//
	// attributes
	//

	className: 'icon-grid',

	template: template(`
		<svg class="defs">
			<defs></defs>
		</svg>
		<div class="icons"></div>
	`),

	childView: IconView,
	childViewContainer: '.icons',

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			// filters: ShadowFilters,
			// gradients: LinearGradients
		};
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