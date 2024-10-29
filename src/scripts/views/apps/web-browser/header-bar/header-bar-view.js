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
import NavBarView from '../../../../views/apps/web-browser/header-bar/nav-bar/nav-bar-view.js';
import AddressBarView from '../../../../views/apps/web-browser/header-bar/address-bar/address-bar-view.js';
import MenuBarView from '../../../../views/apps/web-browser/header-bar/menu-bar/menu-bar-view.js';

export default HeaderBarView.extend({

	//
	// attributes
	//

	toolbars: ['nav', 'address', 'menu'],

	//
	// rendering methods
	//

	showToolbar: function(kind) {
		switch (kind) {
			case 'nav':
				this.showNavBar();
				break;
			case 'address':
				this.showAddressBar();
				break;
			case 'menu':
				this.showMenuBar();
				break;
		}
	},

	showNavBar: function() {
		this.showChildView('nav', new NavBarView());	
	},

	showAddressBar: function() {
		this.showChildView('address', new AddressBarView({
			url: this.parent.url,

			// callbacks
			//
			onchange: (address) => this.parent.setAddress(address),
			onReload: (address) => this.parent.setAddress(address)
		}));
	},

	showMenuBar: function() {
		this.showChildView('menu', new MenuBarView());
	}
});