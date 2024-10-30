/******************************************************************************\
|                                                                              |
|                             objects-list-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a list of objects.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SceneObject from '../../../../../../models/optics/objects/scene-object.js';
import DistantObject from '../../../../../../models/optics/objects/distant-object.js';
import TableListView from '../../../../../../views/collections/tables/table-list-view.js';
import SceneObjectListItemView from '../../../../../../views/apps/optic-editor/mainbar/data-editor/objects-list/scene-object-list-item-view.js';
import DistantObjectListItemView from '../../../../../../views/apps/optic-editor/mainbar/data-editor/objects-list/distant-object-list-item-view.js';
import BaseView from '../../../../../../views/base-view.js';

export default TableListView.extend({

	//
	// attributes
	//

	template: template(`
		<thead>
			<tr>
				<th class="kind">
					<span>Kind</span>
				</th>

				<th class="distance">
					<span>Distance</span>
				</th>

				<th class="offset">
					<span>Offset</span>
				</th>

				<th class="angle">
					<span>Angle</span>
				</th>

				<th class="height">
					<span>Height</span>
				</th>

				<th class="is-hidden th-sm hidden-xs">
					<span>Hidden</span>
				</th>

				<th class="color hidden-xs">
					<span>Color</span>
				</th>
			</tr>
		</thead>
		<tbody class="sortable">
		</tbody>
	`),

	emptyView: BaseView.extend({
		className: 'empty',
		template: template('No objects.')
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

	childView: function(item) {
		if (item instanceof SceneObject) {
			return SceneObjectListItemView;
		} else if (item instanceof DistantObject) {
			return DistantObjectListItemView;
		}
	},

	childViewOptions: function(model) {
		return {
			model: model,

			// options
			//
			viewport: this.options.viewport,
			parent: this,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		}
	}
});