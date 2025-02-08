/******************************************************************************\
|                                                                              |
|                            search-by-text-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching by text.                       |
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

	icon: 'fa fa-search',
	placholder: "Search by Text",

	template: template(`
		<div class="input-group">
			<div class="input-group-addon">
				<i class="<%= icon %>"></i>
			</div>

			<input type="search" class="form-control" placeholder="<%= placeholder %>" spellcheck="false" value="<%= value %>"<% if (readonly) { %> readonly<% } %>>

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

			<% if (buttons) { %>
			<% for (let i = 0; i < buttons.length; i++) { %>
			<% let button = buttons[i]; %>
			<div class="<%= button.kind %> input-group-addon btn">
				<i class="<%= button.icon %>"></i>
			</div>
			<% } %>
			<% } %>
			<div class="close-btn input-group-addon btn">
				<i class="fa fa-xmark"></i>
			</div>
			<div class="search-btn input-group-addon btn">
				<i class="fa fa-search"></i>
			</div>
		</div>
	`),

	events: _.extend({}, SearchByView.prototype.events, {
		'change .other': 'onChangeOther'
	}),

	readonly: false,

	//
	// querying methods
	//

	hasValue: function() {
		return this.$el.find('input').val() != '';
	},

	//
	// getting methods
	//

	getValue: function() {
		return this.$el.find('input').val();
	},

	getOtherValue: function() {
		return this.$el.find('.other option:selected').val();
	},

	//
	// setting methods
	//

	setValue: function(value) {
		this.$el.find('input').val(value);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.getIcon? this.getIcon() : this.icon,
			value: this.value,
			values: this.values,
			buttons: this.buttons,
			readonly: this.readonly,
			operators: this.operators,
			placeholder: this.placeholder
		};
	},

	//
	// mouse event handling methods
	//

	onChangeOther: function() {
		let value = this.getOtherValue();
		this.$el.find('select.other').val('...');
		this.$el.find('select.other').blur();
		this.setValue(value);
	}
});