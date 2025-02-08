/******************************************************************************\
|                                                                              |
|                            search-by-date-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching by date.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SearchByOrderableView from '../../../../../../views/apps/common/header-bar/search-bar/searches/search-by-orderable-view.js';

export default SearchByOrderableView.extend({

	//
	// attributes
	//

	icon: 'fa fa-calendar',

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
		
			<input type="date" class="form-control" value="<%= value %>">
		
			<div class="close-btn input-group-addon btn">
				<i class="fa fa-xmark"></i>
			</div>
			<div class="search-btn input-group-addon btn">
				<i class="fa fa-search"></i>
			</div>
		</div>
	`),

	focusable: 'input[type="date"]',

	//
	// getting methods
	//

	getRelation: function() {
		let operator = this.getOperator();
		switch (operator) {
			case 'greater_than':
				return 'after';
			case 'less_than':
				return 'before';
			default:
				return 'at';
		}
	},

	getKey: function() {
		let key = _.result(this, 'key');

		switch (this.getOperator()) {
			case 'greater_than':
				return 'after' + (key? '_' + key : '');
			case 'less_than':
				return 'before' + (key? '_' + key : '');
			default:
				return key? key : 'date'
		}
	}
});