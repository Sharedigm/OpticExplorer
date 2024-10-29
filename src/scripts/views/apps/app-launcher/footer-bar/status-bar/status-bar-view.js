/******************************************************************************\
|                                                                              |
|                               status-bar-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of an application's status information.           |
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

	className: 'status',

	template: template(`
		<div class="info-bar">
			<i class="fa fa-rocket"></i><span class="num-apps"><%= num_apps %></span> apps
		</div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		let collection = this.parent.app.collection;
		return {
			num_apps: collection? collection.length : 0
		};
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.update();
	}
});