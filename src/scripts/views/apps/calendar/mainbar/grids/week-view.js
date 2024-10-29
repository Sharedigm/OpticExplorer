/******************************************************************************\
|                                                                              |
|                                week-view.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a calendar grid.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'week',

	template: template(`
		<table class="outlined">
			<thead>
				<tr><th>Day</th></tr>
			</thead>
			<tbody>
				<tr><th><label>Sun</label></th></tr>
				<tr><th><label>Mon</label></th></tr>
				<tr><th><label>Tue</label></th></tr>
				<tr><th><label>Wed</label></th></tr>
				<tr><th><label>Thu</label></th></tr>
				<tr><th><label>Fri</label></th></tr>
				<tr><th><label>Sat</label></th></tr>
			</tbody>
		</table>`)
});