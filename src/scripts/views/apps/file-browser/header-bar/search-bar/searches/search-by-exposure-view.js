/******************************************************************************\
|                                                                              |
|                          search-by-exposure-view.js                          |
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
				<i class="fa fa-clock"></i>
			</div>
		
			<div class="operator input-group-addon select">
				<select>
					<option value="greater-than">&gt;</option>
					<option value="equal">=</option>
					<option value="less-than">&lt;</option>
				</select>
			</div>
		
			<input type="search" class="form-control" placeholder="Search by exposure">
		
			<div class="operator input-group-addon select">
				<select class="other">
					<option value="...">...</option>
					<option value="8">8</option>
					<option value="4">4</option>
					<option value="2">2</option>
					<option value="1">1</option>
					<option value="1/4">1/2</option>
					<option value="1/4">1/4</option>
					<option value="1/8">1/8</option>
					<option value="1/15">1/15</option>
					<option value="1/30">1/30</option>
					<option value="1/60">1/60</option>
					<option value="1/125">1/125</option>
					<option value="1/250">1/250</option>
					<option value="1/500">1/500</option>
					<option value="1/1000">1/1000</option>
					<option value="1/2000">1/2000</option>
					<option value="1/4000">1/4000</option>
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
	quantity: 'exposure'
});