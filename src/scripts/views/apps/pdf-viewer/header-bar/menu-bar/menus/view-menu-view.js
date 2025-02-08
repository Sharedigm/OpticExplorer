/******************************************************************************\
|                                                                              |
|                               view-menu-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying view dropdown menus.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ViewMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/view-menu-view.js';

export default ViewMenuView.extend({

	//
	// attributes
	//

	events: {

		// navigation options
		//
		'click .view-first': 'onClickFirst',
		'click .view-prev': 'onClickPrev',
		'click .view-next': 'onClickNext',
		'click .view-last': 'onClickLast',

		// view options
		//
		'click .view-text': 'onClickViewText',
		'click .fit-width': 'onClickFitWidth',
		'click .fit-height': 'onClickFitHeight',
		'click .fit-size': 'onClickFitSize',

		'click .zoom-in': 'onClickZoomIn',
		'click .zoom-out': 'onClickZoomOut',
		'click .zoom-to-actual': 'onClickZoomToActual',

		// toolbar options
		//
		'click .show-toolbars': 'onClickShowToolbars',
		'click .show-toolbar > a': 'onClickShowToolbar',

		// sidebar options
		//
		'click .show-sidebar': 'onClickShowSidebar',
		'click .show-sidebar-panel > a': 'onClickShowSideBarPanel',
		'click .sidebar-view-kind > a': 'onClickSideBarViewKind',
		'click .sidebar-tile-size > a': 'onClickSideBarTileSize',

		// mainbar options
		//
		'click .show-exif-info': 'onClickOption',

		// window options
		//
		'click .shrink-window': 'onClickShrinkWindow',
		'click .grow-window': 'onClickGrowWindow',
		'click .expand-window': 'onClickExpandWindow',

		// desktop options
		//
		'click .prev-space': 'onClickPrevSpace',
		'click .next-space': 'onClickNextSpace',
		'click .minimize-all': 'onClickMinimizeAll',
		'click .unminimize-all': 'onClickUnminimizeAll',
		'click .view-full-screen': 'onClickViewFullScreen',

		// preferences options
		//
		'click .view-preferences': 'onClickViewPreferences'
	},

	selected: function() {
		let preferences = this.parent.app.preferences;
		let toolbars = preferences.get('toolbars') || [];
		let sidebarPanels = preferences.get('sidebar_panels') || [];
		let sidebarTileSize = preferences.get('sidebar_tile_size');

		return {

			// toolbar options
			//
			'show-toolbars': toolbars.length > 0,
			'show-zoom-mode-bar': toolbars.includes('zoom_mode'),
			'show-zoom-bar': toolbars.includes('zoom'),

			// sidebar options
			//
			'show-sidebar': preferences.get('show_sidebar'),
			'show-pages-panel': sidebarPanels.includes('pages'),

			// sidebar tile sizes
			//
			'small-tile-size': sidebarTileSize == 'small',
			'medium-tile-size': sidebarTileSize == 'medium',
			'large-tile-size': sidebarTileSize == 'large',

			// info bar options
			//
			'show-exif-info': preferences.get('show_exif_info')
		};
	},

	//
	// navigation mouse event handling methods
	//
	
	onClickFirst: function() {
		let pageNumber = this.parent.app.getPageNumber('first');
		this.parent.app.setPageNumber(pageNumber);
	},

	onClickPrev: function() {
		let pageNumber = this.parent.app.getPageNumber('prev');
		this.parent.app.setPageNumber(pageNumber);
	},

	onClickNext: function() {
		let pageNumber = this.parent.app.getPageNumber('next');
		this.parent.app.setPageNumber(pageNumber);
	},

	onClickLast: function() {
		let pageNumber = this.parent.app.getPageNumber('last');
		this.parent.app.setPageNumber(pageNumber);
	},

	//
	// view mouse event handling methods
	//

	onClickViewText: function() {
		this.parent.app.showText();
	},

	//
	// fit mouse event handling methods
	//

	onClickFitWidth: function() {
		this.parent.app.getChildView('header zoom').zoomTo('fit_width');
	},

	onClickFitSize: function() {
		this.parent.app.getChildView('header zoom').zoomTo('fit_size');
	},

	onClickFitHeight: function() {
		this.parent.app.getChildView('header zoom').zoomTo('fit_height');
	},

	//
	// zoom mouse event handling methods
	//

	onClickZoomIn: function() {
		this.parent.app.getChildView('header zoom').zoomIn();
	},

	onClickZoomOut: function() {
		this.parent.app.getChildView('header zoom').zoomOut();
	},

	onClickZoomToActual: function() {
		this.parent.app.getChildView('header zoom').zoomTo(100);
	}
});