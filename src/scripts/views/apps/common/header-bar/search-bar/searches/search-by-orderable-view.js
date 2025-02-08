/******************************************************************************\
|                                                                              |
|                         search-by-orderable-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching by an orderable string.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SearchByTextView from '../../../../../../views/apps/common/header-bar/search-bar/searches/search-by-text-view.js';

export default SearchByTextView.extend({

	//
	// attributes
	//

	icon: 'fa fa-hashtag',
	placeholder: "Search by Number",

	operators: {
		greater_than: '&gt;',
		equal_to: '=',
		less_than: '&lt;'
	},

	template: template(`
		<div class="input-group">
			<div class="input-group-addon">
				<i class="<%= icon %>"></i>
			</div>

			<% if (operators) { %>
			<div class="input-group-addon select">
				<select class="operator">
					<% let keys = Object.keys(operators); %>
					<% for (let i = 0; i < keys.length; i++) { %>
					<% let key = keys[i]; %>
					<option value="<%= key %>"><%= operators[key] %></option>
					<% } %>
				</select>
			</div>
			<% } %>

			<input type="search" class="form-control" placeholder="<%= placeholder %>" spellcheck="false" value="<%= value %>">

			<% if (values) { %>
			<div class="input-group-addon select">
				<select class="other">
					<option value="...">...</option>
					<% if (Array.isArray(values)) { %>
					<% for (let i = 0; i < values.length; i++) { %>
					<option value="<%= values[i] %>"><%= values[i] %></option>
					<% } %>
					<% } else { %>
					<% let keys = Object.keys(values); %>
					<% for (let i = 0; i < keys.length; i++) { %>
					<% let key = keys[i]; %>
					<% let value = values[key]; %>
					<option value="<%= key %>"><%= value %></option>
					<% } %>
					<% } %>
				</select>
			</div>
			<% } %>

			<div class="close-btn input-group-addon btn">
				<i class="fa fa-xmark"></i>
			</div>
			<div class="search-btn input-group-addon btn">
				<i class="fa fa-search"></i>
			</div>
		</div>
	`),

	//
	// getting methods
	//

	getOperator: function() {
		return this.$el.find('.operator').val();
	},

	getKey: function() {
		let key = _.result(this, 'key');

		switch (this.getOperator()) {
			case 'greater_than':
				return 'min_' + key;
			case 'less_than':
				return 'max_' + key;
			default:
				return key;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.getIcon? this.getIcon() : this.icon,
			value: this.value,
			values: this.values,
			operators: this.operators,
			placeholder: this.placeholder
		};
	}
});