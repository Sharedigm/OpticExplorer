/******************************************************************************\
|                                                                              |
|                        search-by-focal-length-view.js                        |
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
				<i class="fa fa-arrows-alt-h"></i>
			</div>
		
			<div class="operator input-group-addon select">
				<select>
					<option value="greater-than">&gt;</option>
					<option value="equal">=</option>
					<option value="less-than">&lt;</option>
				</select>
			</div>
		
			<input type="number" class="form-control" placeholder="Search by focal length">
		
			<div class="operator input-group-addon select">
				<select class="other">
					<option value="...">...</option>
					<option value="10">10mm</option>
					<option value="12">12mm</option>
					<option value="18">18mm</option>
					<option value="24">24mm</option>
					<option value="35">35mm</option>
					<option value="50">50mm</option>
					<option value="60">60mm</option>
					<option value="70">70mm</option>
					<option value="85">85mm</option>
					<option value="90">90mm</option>
					<option value="105">105mm</option>
					<option value="150">150mm</option>
					<option value="200">200mm</option>
					<option value="300">300mm</option>
					<option value="400">400mm</option>
					<option value="500">500mm</option>
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
	quantity: 'focal_length'
});