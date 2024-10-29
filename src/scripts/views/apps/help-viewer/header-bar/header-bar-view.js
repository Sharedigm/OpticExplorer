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
import NavBarView from '../../../../views/apps/help-viewer/header-bar/nav-bar/nav-bar-view.js';
import MenuBarView from '../../../../views/apps/help-viewer/header-bar/menu-bar/menu-bar-view.js';
import PageBarView from '../../../../views/apps/help-viewer/header-bar/page-bar/page-bar-view.js';

export default HeaderBarView.extend({

	//
	// attributes
	//

	toolbars: ['nav', 'menu', 'page'],

	//
	// rendering methods
	//

	showToolbar: function(kind) {
		switch (kind) {
			case 'nav':
				this.showNavBar();
				break;
			case 'menu':
				this.showMenuBar();
				break;
			case 'page':
				this.showPageBar();
				break;
		}
	},

	showNavBar: function() {
		this.showChildView('nav', new NavBarView());	
	},

	showMenuBar: function() {
		this.showChildView('menu', new MenuBarView());
	},

	showPageBar: function() {
		this.showChildView('page', new PageBarView());
		this.getChildView('page').$el.addClass('desktop-app-only');
	}
});