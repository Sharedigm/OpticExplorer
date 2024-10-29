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
import NavBarView from '../../../../views/apps/map-viewer/header-bar/nav-bar/nav-bar-view.js';
import ButtonBarView from '../../../../views/apps/map-viewer/header-bar/button-bar/button-bar-view.js';
import MenuBarView from '../../../../views/apps/map-viewer/header-bar/menu-bar/menu-bar-view.js';
import NavModeBarView from '../../../../views/apps/map-viewer/header-bar/nav-mode-bar/nav-mode-bar-view.js';
import MouseModeBarView from '../../../../views/apps/map-viewer/header-bar/mouse-mode-bar/mouse-mode-bar-view.js';
import AnnotationsBarView from '../../../../views/apps/map-viewer/header-bar/annotations-bar/annotations-bar-view.js';
import ZoomBarView from '../../../../views/apps/map-viewer/header-bar/zoom-bar/zoom-bar-view.js';
import SearchBarView from '../../../../views/apps/map-viewer/header-bar/search-bar/search-bar-view.js';

export default HeaderBarView.extend({

	//
	// attributes
	//

	toolbars: ['nav', 'button', 'menu', 'nav_mode', 'mouse_mode', 'annotations', 'zoom', 'search'],

	//
	// attribute methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();
		let isDesktop = this.app.isDesktop();

		return {
			'nav': isSignedIn,
			'button': isDesktop,
			'menu': true,
			'nav_mode': true,
			'mouse_mode': true,
			'zoom': true,
			'annotations': true,
			'search': true
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
			case 'button':	
				this.showButtonBar();
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
			case 'zoom':
				this.showZoomBar();
				break;
			case 'annotations':
				this.showAnnotationsBar();
				break;
			case 'search':
				this.showSearchBar();
				break;
		}
		if (this.hasChildView(kind)) {
			this.getChildView(kind).onLoad();
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

	showButtonBar: function() {
		this.showChildView('button', new ButtonBarView());
		this.$el.find('.button-bar').addClass('desktop-only hidden-xs hidden-sm hidden-md');
	},

	showMenuBar: function() {
		this.showChildView('menu', new MenuBarView({
			preferences: this.app.preferences
		}));
	},

	showNavModeBar: function() {
		this.showChildView('nav_mode', new NavModeBarView({
			preferences: this.app.preferences,
		}));
	},

	showMouseModeBar: function() {
		this.showChildView('mouse_mode', new MouseModeBarView({
			preferences: this.app.preferences
		}));
	},

	showZoomBar: function() {
		this.showChildView('zoom', new ZoomBarView({

			// options
			//
			zoom: this.app.preferences.get('zoom_level'),
			minZoom: this.app.minZoom,
			maxZoom: this.app.maxZoom,
			preferences: this.app.preferences,

			// callbacks
			//
			onzoom: (zoomLevel) => {

				// set map zoom level
				//
				this.app.getActivePaneView().getChildView('content map').setZoomLevel(zoomLevel);
			}
		}));
	},

	showAnnotationsBar: function() {
		this.showChildView('annotations', new AnnotationsBarView());
	},

	showSearchBar: function(kind, value) {
		this.showChildView('search', new SearchBarView({

			// options
			//
			kind: kind,
			value: value,

			// callbacks
			//
			onshow: () => this.parent.onResize(),
			onsearch: (search) => this.setSearch(search)
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
					this.getChildView('zoom').setZoom(this.app.getActivePaneView().getZoomLevel(), {
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
				if (this.hasChildView('layers')) {
					this.getChildView('layers').onChange();
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