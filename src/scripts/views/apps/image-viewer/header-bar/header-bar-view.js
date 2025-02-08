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
import MenuBarView from '../../../../views/apps/image-viewer/header-bar/menu-bar/menu-bar-view.js';
import MouseModeBarView from '../../../../views/apps/image-viewer/header-bar/mouse-mode-bar/mouse-mode-bar-view.js';
import ZoomModeBarView from '../../../../views/apps/image-viewer/header-bar/zoom-mode-bar/zoom-mode-bar-view.js';
import ZoomBarView from '../../../../views/apps/image-viewer/header-bar/zoom-bar/zoom-bar-view.js';
import RotateBarView from '../../../../views/apps/image-viewer/header-bar/rotate-bar/rotate-bar-view.js';
import ImageBarView from '../../../../views/apps/image-viewer/header-bar/image-bar/image-bar-view.js';

export default HeaderBarView.extend({

	//
	// attributes
	//

	toolbars: ['menu', 'mouse_mode', 'zoom_mode', 'image', 'zoom', 'rotate'],

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		HeaderBarView.prototype.onRender.call(this);

		// hide items for mobile
		//
		this.$el.find('.mouse-mode-bar').addClass('desktop-only');
		this.$el.find('.image-bar').addClass('desktop-app-only');
	},

	showToolbar: function(kind) {
		switch (kind) {
			case 'menu':
				this.showMenuBar();
				break;
			case 'mouse_mode':
				this.showMouseModeBar();
				break;
			case 'zoom_mode':
				this.showZoomModeBar();
				break;
			case 'image':
				this.showImageBar();
				break;
			case 'zoom':
				this.showZoomBar();
				break;
			case 'rotate':
				this.showRotateBar();
				break;
		}
	},

	showMenuBar: function() {
		this.showChildView('menu', new MenuBarView({
			preferences: this.app.preferences
		}));
	},

	showMouseModeBar: function() {
		this.showChildView('mouse_mode', new MouseModeBarView());
	},

	showZoomModeBar: function() {
		this.showChildView('zoom_mode', new ZoomModeBarView());
	},

	showZoomBar: function() {
		this.showChildView('zoom', new ZoomBarView({
			preferences: this.app.preferences,

			// callbacks
			//
			onzoom: (zoom) => {

				// set zoom of image element
				//
				this.app.getImageView().setZoom(zoom);
			}
		}));
	},

	showRotateBar: function() {
		this.showChildView('rotate', new RotateBarView({
			rotation: this.app.options.rotation
		}));
	},

	showImageBar: function() {
		this.showChildView('image', new ImageBarView({
			imageNumber: this.collection? this.collection.indexOf(this.model) + 1 : undefined,
			numImages: 	this.collection? this.collection.length : undefined
		}));
	}
});