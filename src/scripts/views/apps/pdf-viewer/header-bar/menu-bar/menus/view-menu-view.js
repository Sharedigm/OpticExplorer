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

	template: template(`
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="view-page dropdown-toggle"><i class="fa fa-file"></i>Page<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="view-first"><i class="fa fa-fast-backward"></i>First<span class="shortcut">up arrow</span></a>
				</li>
		
				<li role="presentation">
					<a class="view-prev"><i class="fa fa-backward"></i>Prev<span class="shortcut">left arrow</span></a>
				</li>
		
				<li role="presentation">
					<a class="view-next"><i class="fa fa-forward"></i>Next<span class="shortcut">right arrow</span></a>
				</li>
		
				<li role="presentation">
					<a class="view-last"><i class="fa fa-fast-forward"></i>Last<span class="shortcut">down arrow</span></a>
				</li>
			</ul>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="fit-page dropdown-toggle"><i class="fa fa-expand"></i>Fit<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation" type="zoom">
					<a class="fit-width"><i class="fa fa-arrows-left-right-to-line"></i>Fit Width<span class="shift command shortcut">D</span></a>
				</li>
		
				<li role="presentation" type="zoom">
					<a class="fit-height"><i class="fa fa-arrows-left-right-to-line rotated"></i>Fit Height<span class="shift command shortcut">H</span></a>
				</li>

				<li role="presentation" type="zoom">
					<a class="fit-size"><i class="fa fa-expand"></i>Fit Size<span class="shift command shortcut">F</span></a>
				</li>
			</ul>
		</li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="zoom-page dropdown-toggle"><i class="fa fa-search"></i>Zoom<i class="fa fa-caret-left"></i><i class="fa fa-caret-right">
			</i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
				<li role="presentation">
					<a class="zoom-in"><i class="fa fa-search-plus"></i>Zoom In<span class="shortcut">=</span></a>
				</li>
		
				<li role="presentation">
					<a class="zoom-out"><i class="fa fa-search-minus"></i>Zoom Out<span class="shortcut">-</span></a>
				</li>
		
				<li role="presentation">
					<a class="zoom-to-actual"><i class="fa fa-search"></i>Zoom to Actual Size<span class="command shortcut">1</span></a>
				</li>
			</ul>
		</li>
		
		<li role="separator" class="divider"></li>

		<li role="presentation" class="show-toolbars dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-wrench"></i>Toolbars<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="show-toolbar dropdown-menu" data-toggle="dropdown">

				<li role="presentation" class="option">
					<a class="show-zoom-mode-bar"><i class="fa fa-check"></i><i class="fa fa-expand"></i>Zoom Mode</a>
				</li>

				<li role="presentation" class="option">
					<a class="show-zoom-bar"><i class="fa fa-check"></i><i class="fa fa-search"></i>Zoom</a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="hidden-xs dropdown dropdown-submenu">
			<a class="show-sidebar dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-pause"></i>Sidebar<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="show-sidebar-panels dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="show-pages-panel"><i class="fa fa-check"></i><i class="fa fa-file"></i>Pages</a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="sidebar-tile-size dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-th-large"></i>Sidebar Tile Size<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="sidebar-tile-size dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="small-tile-size"><i class="fa fa-check"></i><i class="fa fa-th"></i>Small</a>
				</li>

				<li role="presentation">
					<a class="medium-tile-size"><i class="fa fa-check"></i><i class="fa fa-th-large"></i>Medium</a>
				</li>

				<li role="presentation">
					<a class="large-tile-size"><i class="fa fa-check"></i><i class="fa fa-image"></i>Large</a>
				</li>
			</ul>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation" class="mobile-only">
			<a class="expand-window"><i class="fa fa-expand"></i>Expand</a>
		</li>
		
		<li role="presentation" class="windowed-app-only window-size dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="far fa-window-maximize"></i>Window Size<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="shrink-window"><i class="fa fa-minus"></i>Shrink<span class="command shortcut">[</span></a>
				</li>
		
				<li role="presentation">
					<a class="grow-window"><i class="fa fa-plus"></i>Grow<span class="command shortcut">]</span></a>
				</li>
		
				<li role="presentation">
					<a class="expand-window"><i class="fa fa-expand"></i>Expand<span class="command shortcut">\\</span></a>
				</li>
			</ul>
		</li>
		
		<li role="presentation" class="desktop-app-only spaces dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="far fa-window-maximize"></i>Spaces<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="prev-space"><i class="fa fa-chevron-left"></i>Prev<span class="command shortcut">left arrow</span></a>
				</li>

				<li role="presentation">
					<a class="next-space"><i class="fa fa-chevron-right"></i>Next<span class="command shortcut">right arrow</span></a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="desktop-app-only windows dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="far fa-window-restore"></i>Windows<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="minimize-all"><i class="fa fa-window-minimize"></i>Minimize All</a>
				</li>

				<li role="presentation">
					<a class="unminimize-all"><i class="fa fa-window-restore"></i>Unminimize All</a>
				</li>
			</ul>
		</li>
		
		<li role="presentation" class="desktop-app-only">
			<a class="view-full-screen"><i class="fa fa-check full-screen-visible"></i><i class="fa fa-desktop"></i>Full Screen<span class="command shortcut">\\</span></a>
		</li>
		
		<% if (application.session.user) { %>
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="view-preferences"><i class="fa fa-snowflake"></i>Preferences</a>
		</li>
		<% } %>
	`),

	events: {

		// navigation options
		//
		'click .view-first': 'onClickFirst',
		'click .view-prev': 'onClickPrev',
		'click .view-next': 'onClickNext',
		'click .view-last': 'onClickLast',

		// view options
		//
		'click .fit-width': 'onClickFitWidth',
		'click .fit-height': 'onClickFitHeight',
		'click .fit-size': 'onClickFitSize',

		'click .zoom-in': 'onClickZoomIn',
		'click .zoom-out': 'onClickZoomOut',
		'click .zoom-to-actual': 'onClickZoomToActual',

		// toolbar options
		//
		'click .show-toolbars > a': 'onClickShowToolbars',
		'click .show-toolbar > li > a': 'onClickShowToolbar',

		// sidebar options
		//
		'click .show-sidebar': 'onClickOption',
		'click .show-sidebar-panels a': 'onClickShowSideBarPanel',
		'click .sidebar-tile-size a': 'onClickSideBarTileSize',

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
			'large-tile-size': sidebarTileSize == 'large'
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