/******************************************************************************\
|                                                                              |
|                              search-by-size-view.js                          |
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
			<div class="input-group-addon">
				<i class="fa fa-download"></i>
			</div>
		
			<div class="operator input-group-addon select">
				<select>
					<option value="greater-than">&gt;</option>
					<option value="equal">=</option>
					<option value="less-than">&lt;</option>
				</select>
			</div>
		
			<input type="number" class="form-control" placeholder="Search by size">
		
			<div class="units input-group-addon select">
				<select>
					<option value="bytes">b</option>
					<option value="kilobytes" selected>kb</option>
					<option value="megabytes">mb</option>
					<option value="gigabytes">gb</option>
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

	quantity: 'size',

	//
	// getting methods
	//

	getUnits: function() {
		return this.$el.find('.units select').val();
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

		// call superclass method and multiply by units multiplier
		//
		return SearchByQuantityView.prototype.getValue.call(this) * this.getMultiplier();
	}
});