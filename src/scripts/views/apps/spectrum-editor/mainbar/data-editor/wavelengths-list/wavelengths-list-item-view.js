/******************************************************************************\
|                                                                              |
|                         wavelengths-list-item-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a wavelengths list item.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TableListItemView from '../../../../../../views/collections/tables/table-list-item-view.js';

export default TableListItemView.extend({

	//
	// attributes
	//

	template: _.template(`
		<td class="wavelength">
			<%= wavelength %>
		</td>

		<td class="weight">
			<%= weight %>
		</td>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			wavelength: this.model.get('wavelength'),
			weight: this.model.get('weight') || 1
		};
	}
});
