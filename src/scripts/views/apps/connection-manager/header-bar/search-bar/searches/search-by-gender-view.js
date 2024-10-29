/******************************************************************************\
|                                                                              |
|                           search-by-gender-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching connections.                   |
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

	className: 'search by-gender form-inline',

	template: template(`
		<div class="input-group">
			<div class="input-group-addon">
				<i class="fa fa-transgender"></i>
			</div>

			<div class="input-group-addon select">
				<select>
					<option value="male"><i class="fa fa-male"></i>Male</option>
					<option value="female"><i class="fa fa-female"></i>Female</option>
					<option value="other"><i class="fa fa-transgender"></i>Other</option>
				</select>
			</div>

			<div class="close-btn input-group-addon btn">
				<i class="fa fa-xmark"></i>
			</div>
			<div class="search-btn input-group-addon btn">
				<i class="fa fa-search"></i>
			</div>
		</div>
	`)
});