/******************************************************************************\
|                                                                              |
|                         materials-list-item-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a single material list item.       |
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
		<td class="name">
			<div class="tile" style="background: <%= color %>"></div>
			<%= name %>
		</td>

		<td class="catalog">
			<%= catalog %>
		</td>

		<td class="index-of-refraction">
			<%= index_of_refraction %>
		</td>

		<td class="abbe-number">
			<%= abbe_number %>
		</td>
	`),

	//
	// constructor
	//

	initialize: function() {

		// listen to model
		//
		this.listenTo(this.model, 'change', () => this.render());
		this.listenTo(this.model, 'select', () => this.select());
		this.listenTo(this.model, 'deselect', () => this.deselect());
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			name: this.model.get('name') || 'Untitled',
			color: this.model.getColor(),
			catalog: this.model.get('catalog') || 'none',
			index_of_refraction: this.model.get('index_of_refraction'),
			abbe_number: this.model.get('abbe_number'),
			model: this.model.get('kind') || 'Abbe'
		};
	},

	//
	// opening methods
	//

	open: function() {
		this.getParentView('app').openMaterial(this.model);
	}
});