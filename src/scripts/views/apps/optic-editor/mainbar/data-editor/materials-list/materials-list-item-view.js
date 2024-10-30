/******************************************************************************\
|                                                                              |
|                          materials-list-item-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a materials list item.             |
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
		<td class="kind">
			<div class="tile hidden-xs" style="background-color: <%= color %>"></div><%= name %>
		</td>

		<td class="catalog hidden-xs">
			<%= catalog %>
		</td>

		<td class="index-of-refraction">
			<%= index_of_refraction %>
		</td>

		<td class="abbe-number">
			<%= abbe_number %>
		</td>

		<td class="model">
			<%= kind.toTitleCase() %>
		</td>

		<td class="elements">
			<%= elements.join(', ') %>
		</td>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			name: this.model.get('name') || 'Untitled',
			kind: this.model.get('kind') || 'abbe',
			color: this.model.getColor(),
			catalog: this.model.get('catalog') || 'none',
			index_of_refraction: this.model.get('index_of_refraction'),
			abbe_number: this.model.get('abbe_number'),
			elements: this.options.elements.getMaterialLensIndices(this.model)
		};
	}
});
