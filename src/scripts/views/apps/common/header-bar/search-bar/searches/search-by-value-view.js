/******************************************************************************\
|                                                                              |
|                           search-by-value-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching by an enumerated value.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SearchByView from '../../../../../../views/apps/common/header-bar/search-bar/searches/search-by-view.js';

export default SearchByView.extend({

	//
	// attributes
	//

	icon: 'fa fa-list',

	template: template(`
		<div class="input-group">
			<div class="input-group-addon">
				<i class="<%= icon %>"></i>
			</div>

			<div class="input-group-addon select">
				<select>
					<% let keys = Object.keys(values); %>
					<% for (let i = 0; i < keys.length; i++) { %>
					<% let key = keys[i]; %>
					<% let value = values[key]; %>
					<option value="<%= key %>"><i class="<%= value.icon %>"></i><%= value.text %></option>
					<% } %>
				</select>
			</div>

			<div class="close-btn input-group-addon btn">
				<i class="fa fa-xmark"></i>
			</div>
			<div class="search-btn input-group-addon btn">
				<i class="fa fa-search"></i>
			</div>
		</div>
	`),

	//
	// search attributes
	//

	key: 'value',

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
			icon: this.getIcon? this.getIcon() : this.icon,
			values: this.values
		};
	}
});