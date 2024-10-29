/******************************************************************************\
|                                                                              |
|                          search-by-quantity-view.js                          |
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

import SearchByView from '../../../../../../views/apps/common/header-bar/search-bar/searches/search-by-view.js';

export default SearchByView.extend({

	//
	// attributes
	//

	focusable: 'input[type="number"], input[type="search"]',

	events: _.extend({}, SearchByView.prototype.events, {
		'change select.other': 'onChangeSelect'
	}),

	//
	// getting methods
	//
	
	getOperator: function() {
		return this.$el.find('.operator select').val();
	},

	getKey: function() {
		let quantity = _.result(this, 'quantity');

		// replace underscores with dashes
		//
		quantity = quantity.replace(/_/g, '-');

		switch (this.getOperator()) {
			case 'less-than':
				return 'max-' + quantity;
			case 'equal':
				return quantity;
			case 'greater-than':
				return 'min-' + quantity;
		}
	},

	//
	// event handling methods
	//

	onChangeSelect: function() {
		let option = this.$el.find('select.other option:selected').val();
		this.$el.find('select.other').val('...');
		this.$el.find('select.other').blur();
		this.setValue(option);
	}
});