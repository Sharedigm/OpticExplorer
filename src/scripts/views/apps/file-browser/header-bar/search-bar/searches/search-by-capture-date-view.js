/******************************************************************************\
|                                                                              |
|                        search-by-capture-date-view.js                        |
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

import SearchByDateView from '../../../../../../views/apps/common/header-bar/search-bar/searches/search-by-date-view.js';

export default SearchByDateView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="input-group">
			<div class="date-kind input-group-addon">
				<i class="fa fa-calendar-alt"></i>
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
	quantity: 'capture_date'
});