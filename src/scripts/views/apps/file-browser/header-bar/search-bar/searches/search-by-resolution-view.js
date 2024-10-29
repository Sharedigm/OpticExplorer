/******************************************************************************\
|                                                                              |
|                         search-by-resolution-view.js                         |
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
				<i class="fa fa-arrows-alt"></i>
			</div>
		
			<div class="dimension input-group-addon select">
				<select>
					<option value="width">w</option>
					<option value="height">h</option>
					<option value="resolution">r</option>
				</select>
			</div>
		
			<div class="operator input-group-addon select">
				<select>
					<option value="greater-than">&gt;</option>
					<option value="equal">=</option>
					<option value="less-than">&lt;</option>
				</select>
			</div>
		
			<input type="number" class="form-control" placeholder="Search by resolution">
		
			<div class="close-btn input-group-addon btn">
				<i class="fa fa-xmark"></i>
			</div>
			<div class="search-btn input-group-addon btn">
				<i class="fa fa-search"></i>
			</div>
		</div>
	`),

	//
	// querying methods
	//

	quantity: function() {
		return this.$el.find('.dimension select').val();
	}
});