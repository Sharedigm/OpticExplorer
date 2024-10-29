/******************************************************************************\
|                                                                              |
|                            search-by-iso-view.js                             |
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
				<i class="fa fa-film"></i>
			</div>
		
			<div class="operator input-group-addon select">
				<select>
					<option value="greater-than">&gt;</option>
					<option value="equal">=</option>
					<option value="less-than">&lt;</option>
				</select>
			</div>
		
			<input type="search" class="form-control" placeholder="Search by ISO">
		
			<div class="operator input-group-addon select">
				<select class="other">
					<option value="...">...</option>
					<option value="25">25</option>
					<option value="50">50</option>
					<option value="64">64</option>
					<option value="100">100</option>
					<option value="200">200</option>
					<option value="400">400</option>
					<option value="800">800</option>
					<option value="1000">1000</option>
					<option value="1600">1600</option>
					<option value="3200">3200</option>
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
	quantity: 'iso'
});