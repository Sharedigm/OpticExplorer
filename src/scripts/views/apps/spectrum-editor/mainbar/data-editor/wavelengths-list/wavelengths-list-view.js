/******************************************************************************\
|                                                                              |
|                           wavelengths-list-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a list of wavelengths.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../../views/base-view.js';
import SortableTableListView from '../../../../../../views/collections/tables/sortable-table-list-view.js';
import WavelengthsListItemView from '../../../../../../views/apps/spectrum-editor/mainbar/data-editor/wavelengths-list/wavelengths-list-item-view.js';

export default SortableTableListView.extend({

	//
	// attributes
	//

	template: template(`
		<thead>
			<tr>
				<th class="wavelength">
					<span>Wavelength</span>
				</th>

				<th class="weight">
					<span>Weight</span>
				</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	`),

	childView: WavelengthsListItemView,

	emptyView: BaseView.extend({
		className: 'empty',
		template: template('No wavelengths.')
	}),

	//
	// table attributes
	//

	show_numbering: true,
	flush: true,

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			collection: this.collection
		};
	},

	childViewOptions: function() {
		return {

			// options
			//
			elements: this.options.elements,
			parent: this,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		}
	}
});