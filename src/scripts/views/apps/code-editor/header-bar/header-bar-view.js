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
import NavBarView from '../../../../views/apps/code-editor/header-bar/nav-bar/nav-bar-view.js';
import MenuBarView from '../../../../views/apps/code-editor/header-bar/menu-bar/menu-bar-view.js';
import RunBarView from '../../../../views/apps/code-editor/header-bar/run-bar/run-bar-view.js';

export default HeaderBarView.extend({

	//
	// attributes
	//

	toolbars: ['nav', 'menu', 'run'],

	//
	// attribute methods
	//

	visible: function() {
		let isSignedIn = application.isSignedIn();

		return {
			'nav': isSignedIn,
			'menu': true,
			'run': true
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
			case 'run':
				this.showRunBar();
				break;
		}
	},

	showNavBar: function() {
		this.showChildView('nav', new NavBarView({
			model: this.app.directory,

			// callbacks
			//
			onchange: (directory, options) => {
				this.app.setDirectory(directory, options);
			}
		}));
	},

	showMenuBar: function() {
		this.showChildView('menu', new MenuBarView({
			preferences: this.app.preferences
		}));
	},

	showRunBar: function() {
		this.showChildView('run', new RunBarView({
			preferences: this.app.preferences
		}));
	}
});