/******************************************************************************\
|                                                                              |
|                            search-by-units-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching by number with units.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SearchByNumberView from '../../../../../../views/apps/common/header-bar/search-bar/searches/search-by-number-view.js';

export default SearchByNumberView.extend({

	//
	// attributes
	//

	icon: 'fa fa-hashtag',
	placeholder: "Search by Units",

	template: template(`
		<div class="input-group">
			<div class="input-group-addon">
				<i class="<%= icon %>"></i>
			</div>

			<div class="input-group-addon select">
				<select class="operator">
					<% let keys = Object.keys(operators); %>
					<% for (let i = 0; i < keys.length; i++) { %>
					<% let key = keys[i]; %>
					<option value="<%= key %>"><%= operators[key] %></option>
					<% } %>
				</select>
			</div>

			<input type="number" class="spinnable form-control" placeholder="<%= placeholder %>" min="0" value="<%= value %>">

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

			<% if (units) { %>
			<div class="input-group-addon select">
				<select class="units">
					<% let keys = Object.keys(units); %>
					<% for (let i = 0; i < keys.length; i++) { %>
					<% let key = keys[i]; %>
					<% let value = units[key]; %>
					<option value="<%= key %>"<% if (key == selected_units) { %> selected<% } %>><%= value %></option>
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

	focusable: 'input[type="number"]',

	events: _.extend({}, SearchByNumberView.prototype.events, {
		'change .units': 'onChangeUnits'
	}),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.getIcon? this.getIcon() : this.icon,
			value: this.value,
			values: this.values,
			operators: this.operators,
			units: this.units,
			selected_units: this.selected_units,
			placeholder: this.placeholder
		};
	}
});