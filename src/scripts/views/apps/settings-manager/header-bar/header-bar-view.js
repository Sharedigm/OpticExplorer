/******************************************************************************\
|                                                                              |
|                              header-bar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used to display an app's header bar.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import HeaderBarView from '../../../../views/apps/common/header-bar/header-bar-view.js';
import MenuBarView from '../../../../views/apps/settings-manager/header-bar/menu-bar/menu-bar-view.js';

export default HeaderBarView.extend({

	//
	// attributes
	//

	toolbars: ['menu'],

	//
	// rendering methods
	//

	showToolbar: function(kind) {
		switch (kind) {
			case 'menu':
				this.showMenuBar();
				break;
		}
	},

	showMenuBar: function() {
		this.showChildView('menu', new MenuBarView());
	}
});