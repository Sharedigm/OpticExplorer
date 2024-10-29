/******************************************************************************\
|                                                                              |
|                          search-by-aperture-view.js                          |
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
				<i class="fa fa-dot-circle"></i>
			</div>
		
			<div class="operator input-group-addon select">
				<select>
					<option value="greater-than">&gt;</option>
					<option value="equal">=</option>
					<option value="less-than">&lt;</option>
				</select>
			</div>
		
			<input type="search" class="form-control" placeholder="Search by aperture">
		
			<div class="operator input-group-addon select">
				<select class="other">
					<option value="...">...</option>
					<option value="F1">F1</option>
					<option value="F1.2">F1.2</option>
					<option value="F1.4">F1.4</option>
					<option value="F2">F2</option>
					<option value="F2.8">F2.8</option>
					<option value="F4">F4</option>
					<option value="F5.6">F5.6</option>
					<option value="F8">F8</option>
					<option value="F11">F11</option>
					<option value="F16">F16</option>
					<option value="F22">F22</option>
					<option value="F32">F32</option>
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
	quantity: 'aperture'
});