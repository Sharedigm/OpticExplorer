/******************************************************************************\
|                                                                              |
|                            search-by-size-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching files by size.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SearchByUnitsView from '../../../../../../views/apps/common/header-bar/search-bar/searches/search-by-units-view.js';

export default SearchByUnitsView.extend({

	//
	// attributes
	//

	icon: 'fa fa-download',
	placeholder: "Search by Size",

	units: {
		bytes: 'b',
		kilobytes: 'kb',
		megabytes: 'mb',
		gigabytes: 'gb'
	},

	selected_units: 'kilobytes',

	//
	// search attributes
	//

	key: 'size',

	//
	// getting methods
	//

	getUnits: function() {
		return this.$el.find('.units').val();
	},

	getMultiplier: function() {
		switch (this.getUnits()) {
			case 'bytes':
				return 1;
			case 'kilobytes':
				return 1000;
			case 'megabytes':
				return 1000000;
			case 'gigabytes':
				return 1000000000;
		}
	},

	getValue: function() {

		// call superclass method
		//
		let value = SearchByUnitsView.prototype.getValue.call(this);

		// multiply by units
		//
		return parseFloat(value) * this.getMultiplier();
	}
});