/******************************************************************************\
|                                                                              |
|                               search-by-date-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching files.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SearchByQuantityView from '../../../../../../views/apps/common/header-bar/search-bar/searches/search-by-quantity-view.js';

export default SearchByQuantityView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="input-group">
			<div class="date-kind input-group-addon">
				<% if (kind == 'create_date') { %>
				<i class="fa fa-magic"></i>
				<% } else if (kind == 'modify_date') { %>
				<i class="fa fa-edit"></i>
				<% } else if (kind == 'access_date') { %>
				<i class="fa fa-eye"></i>
				<% } %>
			</div>
		
			<div class="operator input-group-addon select">
				<select>
					<option value="greater-than">&gt;</option>
					<option value="equals">=</option>
					<option value="less-than">&lt;</option>
				</select>
			</div>
		
			<input type="date" class="form-control">
		
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
	// querying methods
	//

	quantity: function() {
		return this.options.kind;
	},

	//
	// getting methods
	//

	getKey: function() {
		let quantity = _.result(this, 'quantity');

		// replace underscores with dashes
		//
		quantity = quantity.replace(/_/g, '-');

		switch (this.getOperator()) {
			case 'less-than':
				return 'before-' + quantity;
			case 'equal':
				return quantity;
			case 'greater-than':
				return 'after-' + quantity;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			kind: this.options.kind
		};
	}
});