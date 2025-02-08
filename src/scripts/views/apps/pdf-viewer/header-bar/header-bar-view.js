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
import MenuBarView from '../../../../views/apps/pdf-viewer/header-bar/menu-bar/menu-bar-view.js';
import ZoomModeBarView from '../../../../views/apps/pdf-viewer/header-bar/zoom-mode-bar/zoom-mode-bar-view.js';
import ZoomBarView from '../../../../views/apps/pdf-viewer/header-bar/zoom-bar/zoom-bar-view.js';
import PageBarView from '../../../../views/apps/pdf-viewer/header-bar/page-bar/page-bar-view.js';

export default HeaderBarView.extend({

	//
	// attributes
	//

	toolbars: ['menu', 'zoom_mode', 'zoom', 'page'],

	//
	// rendering methods
	//

	showToolbar: function(kind) {
		switch (kind) {
			case 'menu':
				this.showMenuBar();
				break;
			case 'zoom_mode':
				this.showZoomModeBar();
				break;
			case 'zoom':
				this.showZoomBar();
				break;
			case 'page':
				this.showPageBar();
				break;
		}
	},

	showMenuBar: function() {
		this.showChildView('menu', new MenuBarView());
	},

	showZoomModeBar: function() {
		this.showChildView('zoom_mode', new ZoomModeBarView());
	},

	showZoomBar: function() {
		this.showChildView('zoom', new ZoomBarView({

			// options
			//
			preferences: this.parent.preferences,

			// callbacks
			//
			onzoom: (zoom) => {

				// set zoom of image element
				//
				this.parent.getPdfView().setZoom(zoom);
			}
		}));
	},

	showPageBar: function() {
		this.showChildView('page', new PageBarView());
		this.getChildView('page').$el.addClass('desktop-app-only');
	}
});