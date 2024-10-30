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
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import HeaderBarView from '../../../../views/apps/common/header-bar/header-bar-view.js';
import NavBarView from '../../../../views/apps/material-map-viewer/header-bar/nav-bar/nav-bar-view.js';
import MenuBarView from '../../../../views/apps/material-map-viewer/header-bar/menu-bar/menu-bar-view.js';
import NavModeBarView from '../../../../views/apps/material-map-viewer/header-bar/nav-mode-bar/nav-mode-bar-view.js';
import MouseModeBarView from '../../../../views/apps/material-map-viewer/header-bar/mouse-mode-bar/mouse-mode-bar-view.js';
import ZoomModeBarView from '../../../../views/apps/material-map-viewer/header-bar/zoom-mode-bar/zoom-mode-bar-view.js';
import ZoomBarView from '../../../../views/apps/material-map-viewer/header-bar/zoom-bar/zoom-bar-view.js';
import Browser from '../../../../utilities/web/browser.js';

export default HeaderBarView.extend({

	//
	// attributes
	//

	toolbars: ['nav', 'menu', 'nav_mode', 'mouse_mode', 'zoom_mode', 'zoom'],

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
			case 'nav_mode':
				this.showNavModeBar();
				break;
			case 'mouse_mode':
				this.showMouseModeBar();
				break;
			case 'zoom_mode':
				this.showZoomModeBar();
				break;
			case 'zoom':
				this.showZoomBar();
				break;
		}
	},

	showNavBar: function() {
		this.showChildView('nav', new NavBarView({

			// callbacks
			//
			onchange: (option) => this.app.setOption(option)
		}));
	},

	showMenuBar: function() {
		this.showChildView('menu', new MenuBarView({
			preferences: this.app.preferences
		}));
	},

	showNavModeBar: function() {
		this.showChildView('nav_mode', new NavModeBarView({
			preferences: this.preferences,
			hidden: Browser.is_mobile
		}));
	},

	showMouseModeBar: function() {
		this.showChildView('mouse_mode', new MouseModeBarView({
			preferences: this.preferences,
			hidden: Browser.is_mobile
		}));
	},

	showZoomModeBar: function() {
		this.showChildView('zoom_mode', new ZoomModeBarView({
			preferences: this.preferences,
			hidden: Browser.is_mobile
		}));
	},

	showZoomBar: function() {
		this.showChildView('zoom', new ZoomBarView({

			// options
			//
			zoom: 1,
			preferences: this.app.preferences,

			// callbacks
			//
			onzoom: (zoom) => {

				// set viewport zoom level
				//
				if (this.app.hasActiveView()) {
					this.app.getActiveView().setScale(zoom / 100);
				}
			}
		}));
	},

	//
	// event handling methods
	//

	onChange: function(attribute) {
		switch (attribute) {

			case 'offset':
				break;

			case 'scale':

				// update zoom bar
				//
				if (this.hasChildView('zoom')) {
					this.getChildView('zoom').setZoom(this.app.getActiveViewport().scale * 100, {
						silent: true
					});
				}
				break;

			case 'size':
				break;

			default:

				// update menu and layers bars
				//
				if (this.hasChildView('menu')) {
					this.getChildView('menu').onChange();
				}
				break;
		}

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(attribute);
		}
	}
});