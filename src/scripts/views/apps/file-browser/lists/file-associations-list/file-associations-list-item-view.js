/******************************************************************************\
|                                                                              |
|                      file-associations-list-item-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a editable view of file associations list item.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TableListItemView from '../../../../../views/collections/tables/table-list-item-view.js';

export default TableListItemView.extend({

	//
	// attributes
	//

	template: template(`
		<th class="file-extension" style="width:4em">
			<%= extension %>
		</th>
		
		<td class="application">
			<select>
				<% for (let i = 0; i < apps.length; i++) { %>
				<% if (apps.at(i).get('enabled') && apps.at(i).get('args')) { %>
				<option value="<%= apps.at(i).get('id') %>"<% if (application == apps.at(i).get('id')) { %> selected<% } %>><%= apps.at(i).get('name') %></option>
				<% } %>
				<% } %>
			</select>
		</td>
	`),

	events: {
		'change select': 'onChangeSelect',
		'click button': 'onClickButton'
	},

	//
	// getting methods
	//

	getValue: function() {
		return this.$el.find('select').val();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			application: this.model.get('application'),
			extension: this.model.get('extension'),
			apps: application.apps
		};
	},

	//
	// event handling methods
	//

	onChangeSelect: function() {
		let key = this.model.get('sound_name');
		let value = this.getValue();
		this.options.settings.set(key, value);
	},

	onClickButton: function() {
		let value = this.getValue();
		if (value != '') {
			application.play(value);
		}
	}
});