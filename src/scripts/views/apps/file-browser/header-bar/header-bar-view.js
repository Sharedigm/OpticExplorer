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
import NavBarView from '../../../../views/apps/file-browser/header-bar/nav-bar/nav-bar-view.js';
import MenuBarView from '../../../../views/apps/file-browser/header-bar/menu-bar/menu-bar-view.js';
import SharingBarView from '../../../../views/apps/file-browser/header-bar/sharing-bar/sharing-bar-view.js';
import SearchBarView from '../../../../views/apps/file-browser/header-bar/search-bar/search-bar-view.js';

export default HeaderBarView.extend({

	//
	// attributes
	//

	toolbars: ['nav', 'menu', 'sharing', 'search'],

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
			case 'sharing':
				this.showSharingBar();
				break;
			case 'search':
				this.showSearchBar();
				break;
		}
	},

	showNavBar: function() {
		this.showChildView('nav', new NavBarView({
			model: this.model,

			// callbacks
			//
			onchange: (directory, options) => {
				this.app.setDirectory(directory, options);
			}
		}));
	},

	showMenuBar: function() {
		this.showChildView('menu', new MenuBarView());
	},

	showSharingBar: function() {
		this.showChildView('sharing', new SharingBarView());
	},

	showSearchBar: function(kind, value) {
		this.showChildView('search', new SearchBarView({

			// options
			//
			kind: kind,

			// callbacks
			//
			onshow: () => {
				if (value != undefined) {
					this.getChildView('search_bar').setValue(value);
				}
				this.app.onResize();
			},
			onSearch: function(search) {
				this.setSearch(search);
			}
		}));
	}
});