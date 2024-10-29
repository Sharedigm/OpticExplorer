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
import NavBarView from '../../../../views/apps/contact-editor/header-bar/nav-bar/nav-bar-view.js';
import MenuBarView from '../../../../views/apps/contact-editor/header-bar/menu-bar/menu-bar-view.js';

export default HeaderBarView.extend({

	//
	// attributes
	//

	toolbars: ['nav', 'menu'],

	//
	// attribute methods
	//

	visible: function() {
		let isSignedIn = application.isSignedIn();

		return {
			'nav': isSignedIn,
			'menu': true
		};
	},

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
		}
	},

	showNavBar: function() {
		this.showChildView('nav', new NavBarView({
			model: this.app.directory,

			// callbacks
			//
			onchange: (directory, options) => this.app.setDirectory(directory, options)
		}));
	},

	showMenuBar: function() {
		this.showChildView('menu', new MenuBarView());
	}
});