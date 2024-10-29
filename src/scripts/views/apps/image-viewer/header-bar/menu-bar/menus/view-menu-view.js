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
			<a class="fit dropdown-toggle"><i class="fa fa-expand"></i>Fit<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="fit-size"><i class="fa fa-expand"></i>Fit Size<span class="shift command shortcut">F</span></a>
				</li>
		
				<li role="presentation">
					<a class="fit-width"><i class="fa fa-arrows-left-right-to-line"></i>Fit Width<span class="shift command shortcut">D</span></a>
				</li>
		
				<li role="presentation">
					<a class="fit-height"><i class="fa fa-arrows-left-right-to-line rotated"></i>Fit Height<span class="shift command shortcut">H</span></a>
				</li>
			</ul>
		</li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="zoom dropdown-toggle"><i class="fa fa-search"></i>Zoom<i class="fa fa-caret-left"></i><i class="fa fa-caret-right">
			</i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
				<li role="presentation">
					<a class="zoom-in"><i class="fa fa-search-plus"></i>Zoom In<span class="shortcut">=</span></a>
				</li>
		
				<li role="presentation">
					<a class="zoom-out"><i class="fa fa-search-minus"></i>Zoom Out<span class="shortcut">-</span></a>
				</li>
		
				<li role="presentation">
					<a class="zoom-to-actual"><i>1:1</i>Zoom to Actual Size<span class="command shortcut">1</span></a>
				</li>
			</ul>
		</li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="rotate dropdown-toggle"><i class="fa fa-redo"></i>Rotate<i class="fa fa-caret-left"></i><i class="fa fa-caret-right">
			</i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
				<li role="presentation">
					<a class="rotate-left"><i class="fa fa-undo"></i>Rotate Left<span class="command shortcut">8</span></a>
				</li>
		
				<li role="presentation">
					<a class="rotate-right"><i class="fa fa-redo"></i>Rotate Right<span class="command shortcut">9</span></a>
				</li>
		
				<li role="presentation">
					<a class="rotate-reset"><i class="fa fa-undo"></i>Rotate Reset<span class="command shortcut">0</span></a>
				</li>
			</ul>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="view-slide-show"><i class="fa fa-check"></i><i class="fa fa-play"></i>Slide Show<span class="command shortcut">S</span></a>
		</li>
		
		<li role="presentation">
			<a class="show-smoothing"><i class="fa fa-check"></i><i class="fa fa-wave-square"></i>Smoothing<span class="command shortcut">M</span></a>
		</li>
		
		<li role="separator" class="divider"></li>

		<li role="presentation" class="show-toolbars dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-wrench"></i>Toolbars<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="show-toolbar dropdown-menu" data-toggle="dropdown">

				<li role="presentation" class="option">
					<a class="show-mouse-mode-bar"><i class="fa fa-check"></i><i class="fa fa-mouse-pointer"></i>Mouse Mode</a>
				</li>

				<li role="presentation" class="option">
					<a class="show-zoom-mode-bar"><i class="fa fa-check"></i><i class="fa fa-expand"></i>Zoom Mode</a>
				</li>

				<li role="presentation" class="option">
					<a class="show-zoom-bar"><i class="fa fa-check"></i><i class="fa fa-search"></i>Zoom</a>
				</li>

				<li role="presentation" class="option">
					<a class="show-rotate-bar"><i class="fa fa-check"></i><i class="fa fa-rotate-right"></i>Rotate</a>
				</li>

				<li role="presentation" class="option">
					<a class="show-image-bar"><i class="fa fa-check"></i><i class="fa fa-play"></i>Image</a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="hidden-xs dropdown dropdown-submenu">
			<a class="show-sidebar dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-pause"></i>Sidebar<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="show-sidebar-panels dropdown-menu" data-toggle="dropdown">
				
				<li role="presentation">
					<a class="show-images-panel"><i class="fa fa-check"></i><i class="fa fa-image"></i>Images</a>
				</li>

				<li role="presentation">
					<a class="show-files-panel"><i class="fa fa-check"></i><i class="fa fa-folder"></i>Files</a>
				</li>
			</ul>
		</li>
		
		<li role="presentation" class="sidebar-view-kind dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-th"></i>Sidebar Items<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="view-sidebar-icons"><i class="fa fa-check"></i><i class="fa fa-th"></i>Icons</a>
				</li>
				
				<li role="presentation">
					<a class="view-sidebar-lists"><i class="fa fa-check"></i><i class="fa fa-list"></i>Lists</a>
				</li>
		
				<li role="presentation">
					<a class="view-sidebar-cards"><i class="fa fa-check"></i><i class="fa fa-id-card"></i>Cards</a>
				</li>
				
				<li role="presentation">
					<a class="view-sidebar-tiles"><i class="fa fa-check"></i><i class="fa fa-th-large"></i>Tiles</a>
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
		
		<li role="presentation">
			<a class="show-image-info"><i class="fa fa-check"></i><i class="fa fa-table"></i>Image Info</a>
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

		// view options
		//
		'click .fit-size': 'onClickFitSize',
		'click .fit-width': 'onClickFitWidth',
		'click .fit-height': 'onClickFitHeight',

		'click .zoom-in': 'onClickZoomIn',
		'click .zoom-out': 'onClickZoomOut',
		'click .zoom-to-actual': 'onClickZoomToActual',

		'click .rotate-left': 'onClickRotateLeft',
		'click .rotate-right': 'onClickRotateRight',
		'click .rotate-reset': 'onClickRotateReset',

		'click .show-smoothing': 'onClickShowSmoothing',
		'click .view-slide-show': 'onClickSlideShow',

		// toolbar options
		//
		'click .show-toolbars > a': 'onClickShowToolbars',
		'click .show-toolbar > li > a': 'onClickShowToolbar',

		// mainbar options
		//
		'click .show-image-info': 'onClickOption',

		// sidebar options
		//
		'click .show-sidebar': 'onClickOption',
		'click .show-sidebar-panels a': 'onClickShowSideBarPanel',
		'click .sidebar-view-kind a': 'onClickSideBarViewKind',
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

	//
	// querying methods
	//

	selected: function() {
		let preferences = this.parent.app.preferences;
		let toolbars = preferences.get('toolbars') || [];
		let sidebarPanels = preferences.get('sidebar_panels') || [];
		let sidebarViewKind = preferences.get('sidebar_view_kind');
		let sidebarTileSize = preferences.get('sidebar_tile_size');

		return {

			// viewing options
			//
			'fit-size': this.parent.app.zoom == 'fit_size',
			'fit-width': this.parent.app.zoom == 'fit_width',
			'fit-height': this.parent.app.zoom == 'fit_height',
			'show-smoothing': preferences.get('show_smoothing'),

			// toolbar options
			//
			'show-toolbars': toolbars.length > 0,
			'show-nav-bar': toolbars.includes('nav'),
			'show-mouse-mode-bar': toolbars.includes('mouse_mode'),
			'show-zoom-mode-bar': toolbars.includes('zoom_mode'),
			'show-zoom-bar': toolbars.includes('zoom'),
			'show-rotate-bar': toolbars.includes('rotate'),
			'show-image-bar': toolbars.includes('image'),

			// sidebar options
			//
			'show-sidebar': preferences.get('show_sidebar'),
			'show-images-panel': sidebarPanels.includes('images'),
			'show-files-panel': sidebarPanels.includes('files'),
			'show-image-info': preferences.get('show_image_info'),

			// sidebar item options
			//
			'view-sidebar-icons': sidebarViewKind == 'icons',
			'view-sidebar-lists': sidebarViewKind == 'lists',
			'view-sidebar-cards': sidebarViewKind == 'cards',
			'view-sidebar-tiles': sidebarViewKind == 'tiles',

			// sidebar tile sizes
			//
			'small-tile-size': sidebarTileSize == 'small',
			'medium-tile-size': sidebarTileSize == 'medium',
			'large-tile-size': sidebarTileSize == 'large'
		};
	},

	disabled: function() {
		if (!this.parent.app.model) {
			return {
				'fit': true,
				'zoom': true,
				'rotate': true,
				'show-smoothing': true,
				'view-slide-show': true
			};
		} else {
			return false;
		}
	},

	//
	// setting methods
	//

	setSmoothing: function(smoothing) {
		this.parent.app.options.smoothing = smoothing;
		this.setItemSelected('show-smoothing', smoothing);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			zoom: this.parent.app.zoom,
			zoomLevels: this.parent.app.zoomLevels,
		};
	},
	
	//
	// fit mouse event handling methods
	//

	onClickFitSize: function() {
		this.parent.app.getChildView('header zoom').zoomTo('fit_size');
	},

	onClickFitWidth: function() {
		this.parent.app.getChildView('header zoom').zoomTo('fit_width');
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
	},

	//
	// rotate mouse event handling methods
	//

	onClickRotateLeft: function() {
		this.parent.app.rotateTo(this.parent.app.getRotation() - 90);
	},

	onClickRotateRight: function() {
		this.parent.app.rotateTo(this.parent.app.getRotation() + 90);
	},

	onClickRotateReset: function() {
		this.parent.app.rotateTo(0);
	},

	//
	// preferences mouse event handling methods
	//
	
	onClickShowSmoothing: function() {
		this.toggleMenuItem('show-smoothing');
		this.parent.app.setOption('show_smoothing', this.isItemSelected('show-smoothing'));
	},

	onClickSlideShow: function() {
		this.toggleMenuItem('view-slide-show');
		this.parent.app.toggleSlideShow();
	}
});