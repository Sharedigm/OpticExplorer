/******************************************************************************\
|                                                                              |
|                           search-by-number-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching by number.                     |
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
	placeholder: "Search by Number",

	template: template(`
		<div class="input-group">
			<div class="input-group-addon select">
				<select class="kind">
					<% let keys = Object.keys(kinds); %>
					<% for (let i = 0; i < keys.length; i++) { %>
					<% let key = keys[i]; %>
					<% let kind = kinds[key]; %>
					<option value="<%= key %>"><%= kind.label %></option>
					<% } %>
				</select>
			</div>

			<div class="input-group-addon select">
				<select class="operator">
					<% let keys2 = Object.keys(operators); %>
					<% for (let i = 0; i < keys2.length; i++) { %>
					<% let key = keys2[i]; %>
					<% let operator = operators[key]; %>
					<option value="<%= key %>"><%= operator %></option>
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

			<div class="close-btn input-group-addon btn">
				<i class="fa fa-xmark"></i>
			</div>
			<div class="search-btn input-group-addon btn">
				<i class="fa fa-search"></i>
			</div>
		</div>
	`),

	events: _.extend({}, SearchByNumberView.prototype.events, {
		'change select.kind': 'onChangeKind'
	}),

	//
	// querying methods
	//

	key: function() {
		return this.$el.find('.kind').val();
	},

	//
	// setting methods
	//

	setPlaceholder: function(placeholder) {
		this.$el.find('input').attr('placeholder', placeholder);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let firstKey = Object.keys(this.kinds)[0];

		return {
			kinds: this.kinds,
			value: this.value,
			values: this.values,
			operators: this.operators,
			placeholder: this.kinds[firstKey].placeholder
		};
	},

	//
	// mouse event handling methods
	//

	onChangeKind: function() {
		let key = this.key();

		// update placeholder
		//
		if (this.kinds[key].placeholder) {
			this.setPlaceholder(this.kinds[key].placeholder);
		}
	}
});