/******************************************************************************\
|                                                                              |
|                                 tab-view.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a single tab.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TabView from '../../../../../../views/apps/common/mainbar/tabbed-content/tabs/tab-view.js';

export default TabView.extend({

	//
	// getting methods
	//

	getIcon: function() {
		return '<i class="fa fa-folder"></i>';
	},

	getName: function() {
		return this.model.getName() || 'Home';
	},

	//
	// setting methods
	//

	setModel: function(model) {
		this.model = model;
		this.update();
	}
});