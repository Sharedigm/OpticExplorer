/******************************************************************************\
|                                                                              |
|                            materials-list-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a list of materials.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SortableTableListView from '../../../../../../views/collections/tables/sortable-table-list-view.js';
import MaterialsListItemView from '../../../../../../views/apps/material-map-viewer/mainbar/data-editor/materials-list/materials-list-item-view.js';
import BaseView from '../../../../../../views/base-view.js';

export default SortableTableListView.extend({

	//
	// attributes
	//

	template: template(`
		<thead>
			<tr>
				<th class="name">
					<span>Name</span>
				</th>

				<th class="catalog">
					<span>Catalog</span>
				</th>
	
				<th class="index-of-refractioin">
					<span>Index (n)</span>
				</th>

				<th class="abbe-number">
					<span>Abbe (v)</span>
				</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	`),

	childView: MaterialsListItemView,

	emptyView: BaseView.extend({
		className: 'empty',
		template: template('No materials.')
	}),

	//
	// table attributes
	//

	show_numbering: true,

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			collection: this.collection
		};
	},

	childViewOptions: function(model) {
		return {

			// options
			//
			index: this.collection.indexOf(model),
			parent: this,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		}
	}
});