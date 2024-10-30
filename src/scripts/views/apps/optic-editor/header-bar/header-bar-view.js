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
import NavBarView from '../../../../views/apps/optic-editor/header-bar/nav-bar/nav-bar-view.js';
import MenuBarView from '../../../../views/apps/optic-editor/header-bar/menu-bar/menu-bar-view.js';
import NavModeBarView from '../../../../views/apps/optic-editor/header-bar/nav-mode-bar/nav-mode-bar-view.js';
import MouseModeBarView from '../../../../views/apps/optic-editor/header-bar/mouse-mode-bar/mouse-mode-bar-view.js';
import ZoomModeBarView from '../../../../views/apps/optic-editor/header-bar/zoom-mode-bar/zoom-mode-bar-view.js';
import ZoomBarView from '../../../../views/apps/optic-editor/header-bar/zoom-bar/zoom-bar-view.js';

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
			onchange: (directory, options) => this.app.setDirectory(directory, options)
		}));
	},

	showMenuBar: function() {
		this.showChildView('menu', new MenuBarView());
	},

	showNavModeBar: function() {
		this.showChildView('nav_mode', new NavModeBarView());
	},

	showMouseModeBar: function() {
		this.showChildView('mouse_mode', new MouseModeBarView());
	},

	showZoomModeBar: function() {
		this.showChildView('zoom_mode', new ZoomModeBarView());
	},

	showZoomBar: function() {
		this.showChildView('zoom', new ZoomBarView({

			// options
			//
			preferences: this.app.preferences,

			// callbacks
			//
			onzoom: (zoom) => {

				// set viewport zoom level
				//
				this.app.getActiveView().setZoom(zoom);
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
					this.getChildView('zoom').setZoom(this.app.getActiveView().getZoom(), {
						silent: true
					});
				}
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