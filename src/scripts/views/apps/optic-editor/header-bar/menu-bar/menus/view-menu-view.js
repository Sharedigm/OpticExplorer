/******************************************************************************\
|                                                                              |
|                               view-menu-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying file dropdown menus.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
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
					<a class="fit-all"><i class="fa fa-expand"></i>Fit All</a>
				</li>
		
				<li role="presentation">
					<a class="fit-optics"><i class="fa fa-database rotated flipped"></i>Fit Optics</a>
				</li>
		
				<li role="presentation">
					<a class="fit-track"><i class="fa fa-arrows-left-right"></i>Fit Track</a>
				</li>

				<li role="presentation">
					<a class="fit-images"><i class="fa fa-image"></i>Fit Images</a>
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
			<a class="pan dropdown-toggle"><i class="fa fa-arrows"></i>Pan<i class="fa fa-caret-left"></i><i class="fa fa-caret-right">
			</i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
				<li role="presentation">
					<a class="pan-up"><i class="fa fa-arrow-up"></i>Up<span class="shortcut">up arrow</span></a>
				</li>
		
				<li role="presentation">
					<a class="pan-down"><i class="fa fa-arrow-down"></i>Down<span class="shortcut">down arrow</span></a>
				</li>
		
				<li role="presentation">
					<a class="pan-left"><i class="fa fa-arrow-left"></i>Left<span class="shortcut">left arrow</span></a>
				</li>
				
				<li role="presentation">
					<a class="pan-right"><i class="fa fa-arrow-right"></i>Right<span class="shortcut">right arrow</span></a>
				</li>
			</ul>
		</li>

		<li role="separator" class="divider"></li>

		<li role="presentation" class="scheme-kind dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-palette"></i>Colors<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="monochrome-scheme"><i class="fa fa-check"></i><i class="fa fa-palette"></i>Monochrome</a>
				</li>
		
				<li role="presentation">
					<a class="standard-scheme"><i class="fa fa-check"></i><i class="fa fa-palette"></i>Standard</a>
				</li>
		
				<li role="presentation">
					<a class="colorful-scheme"><i class="fa fa-check"></i><i class="fa fa-palette"></i>Colorful</a>
				</li>

				<li role="presentation">
					<a class="vibrant-scheme"><i class="fa fa-check"></i><i class="fa fa-palette"></i>Vibrant</a>
				</li>

				<li role="separator" class="divider"></li>

				<li role="presentation">
					<a class="next-scheme"><i class="fa fa-check"></i><i class="fa fa-chevron-right"></i>Next<span class="shift command option shortcut">C</span></a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="theme-kind dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-adjust"></i>Brightness<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="light-theme"><i class="fa fa-check"></i><i class="far fa-sun"></i>Light</a>
				</li>
		
				<li role="presentation">
					<a class="medium-theme"><i class="fa fa-check"></i><i class="fa fa-sun"></i>Medium</a>
				</li>
		
				<li role="presentation">
					<a class="dark-theme"><i class="fa fa-check"></i><i class="fa fa-moon"></i>Dark</a>
				</li>

				<li role="separator" class="divider"></li>

				<li role="presentation">
					<a class="auto-theme"><i class="fa fa-check"></i><i class="fa fa-adjust"></i>Auto</a>
				</li>
			</ul>
		</li>
		
		<li role="presentation" class="view-kind dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-eye"></i>Viewport<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="show-grid"><i class="fa fa-check"></i><i class="fa fa-border-none"></i>Grid<span class="command shortcut">G</span></a>
				</li>
		
				<li role="presentation">
					<a class="show-optical-axis"><i class="fa fa-check"></i><i class="fa fa-arrows-left-right"></i>Optical Axis</a>
				</li>
		
				<li role="presentation">
					<a class="show-perpendicular-axis"><i class="fa fa-check"></i><i class="fa fa-arrows-up-down"></i>Perpendicular Axis</a>
				</li>

				<li role="presentation">
					<a class="show-colored-viewport"><i class="fa fa-check"></i><i class="fa fa-paint-brush"></i>Colored</a>
				</li>

				<li role="separator" class="divider"></li>

				<li role="presentation">
					<a class="show-axes"><i class="fa fa-plus"></i>Show Axes</a>
				</li>

				<li role="presentation">
					<a class="hide-axes"><i class="fa fa-minus"></i>Hide Axes</a>
				</li>

				<li role="presentation">
					<a class="show-all"><i class="fa fa-plus"></i>Show All</a>
				</li>

				<li role="presentation">
					<a class="hide-all"><i class="fa fa-minus"></i>Hide All</a>
				</li>
			</ul>
		</li>

		<li role="separator" class="divider"></li>

		<li role="presentation" class="view-elements dropdown dropdown-submenu">
			<a class="show-elements dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-database rotated flipped"></i>Elements<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="show-filled-elements"><i class="fa fa-check"></i><i class="fa fa-fill"></i>Filled</a>
				</li>
		
				<li role="presentation">
					<a class="show-stroked-elements"><i class="fa fa-check"></i><i class="fa fa-pen"></i>Stroked</a>
				</li>
		
				<li role="separator" class="divider"></li>
		
				<li role="presentation">
					<a class="show-shaded-elements"><i class="fa fa-check"></i><i class="fa fa-lightbulb"></i>Shaded</a>
				</li>

				<li role="presentation">
					<a class="show-illustrated-elements"><i class="fa fa-check"></i><i class="fa fa-brush"></i>illustrated</a>
				</li>

				<li role="presentation">
					<a class="show-shadowed-elements"><i class="fa fa-check"></i><i class="fa fa-sun"></i>Shadowed</a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="view-light-beams dropdown dropdown-submenu">
			<a class="show-lights dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-lightbulb"></i>Lights<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="show-filled-lights"><i class="fa fa-check"></i><i class="fa fa-fill"></i>Filled</a>
				</li>

				<li role="presentation">
					<a class="show-stroked-lights"><i class="fa fa-check"></i><i class="fa fa-pen"></i>Stroked</a>
				</li>

				<li role="separator" class="divider"></li>

				<li role="presentation">
					<a class="show-transmitted-lights"><i class="fa fa-check"></i><i class="fa fa-arrow-right"></i>Transmitted</a>
				</li>

				<li role="presentation">
					<a class="show-obstructed-lights"><i class="fa fa-check"></i><i class="fa fa-arrows-down-to-line flipped rotated"></i>Obstructed</a>
				</li>

				<li role="presentation">
					<a class="show-reflected-lights"><i class="fa fa-check"></i><i class="fa fa-arrow-right-arrow-left"></i>Reflected</a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="view-object-beams dropdown dropdown-submenu">
			<a class="show-objects dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-arrow-up-long"></i>Objects<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="show-filled-objects"><i class="fa fa-check"></i><i class="fa fa-fill"></i>Filled</a>
				</li>

				<li role="presentation">
					<a class="show-stroked-objects"><i class="fa fa-check"></i><i class="fa fa-pen"></i>Stroked</a>
				</li>

				<li role="separator" class="divider"></li>

				<li role="presentation">
					<a class="show-transmitted-objects"><i class="fa fa-check"></i><i class="fa fa-arrow-right"></i>Transmitted</a>
				</li>

				<li role="presentation">
					<a class="show-obstructed-objects"><i class="fa fa-check"></i><i class="fa fa-arrows-down-to-line flipped rotated"></i>Obstructed</a>
				</li>

				<li role="presentation">
					<a class="show-reflected-objects"><i class="fa fa-check"></i><i class="fa fa-arrow-right-arrow-left"></i>Reflected</a>
				</li>
			</ul>
		</li>

		<li role="separator" class="divider"></li>

		<li role="presentation" class="view-annotations dropdown dropdown-submenu">
			<a class="show-annotations dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-font"></i>Annotations<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="show-thickness"><i class="fa fa-check"></i><i class="fa fa-arrows-left-right-to-line"></i>Thickness</a>
				</li>
		
				<li role="presentation">
					<a class="show-spacing"><i class="fa fa-check"></i><i class="fa fa-arrow-right-arrow-left"></i>Spacing</a>
				</li>

				<li role="presentation">
					<a class="show-focal-points"><i class="fa fa-check"></i><i class="fa fa-map-pin"></i>Focal Points</a>
				</li>

				<li role="presentation">
					<a class="show-principal-planes"><i class="fa fa-check"></i><i class="fa fa-arrows-up-down"></i>Principal Planes</a>
				</li>

				<li role="separator" class="divider"></li>

				<li role="presentation">
					<a class="show-filled-arrows"><i class="fa fa-check"></i><i class="fa fa-fill"></i>Filled</a>
				</li>
		
				<li role="presentation">
					<a class="show-stroked-arrows"><i class="fa fa-check"></i><i class="fa fa-pen"></i>Stroked</a>
				</li>

				<li role="separator" class="divider"></li>

				<li role="presentation">
					<a class="show-diagonal-labels"><i class="fa fa-check"></i><i class="fa fa-expand-alt"></i>Diagonal</a>
				</li>
		
				<li role="presentation">
					<a class="show-horizontal-labels"><i class="fa fa-check"></i><i class="fa fa-arrows-alt-h"></i>Horizontal</a>
				</li>
			</ul>
		</li>

		<li role="separator" class="divider"></li>

		<li role="presentation" class="show-toolbars dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-wrench"></i>Toolbars<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="show-toolbar dropdown-menu" data-toggle="dropdown">

				<li role="presentation" class="option">
					<a class="show-nav-bar"><i class="fa fa-check"></i><i class="fa fa-sitemap"></i>Nav</a>
				</li>

				<li role="presentation" class="option">
					<a class="show-mouse-mode-bar"><i class="fa fa-check"></i><i class="fa fa-mouse-pointer"></i>Mouse Mode</a>
				</li>

				<li role="presentation" class="option">
					<a class="show-nav-mode-bar"><i class="fa fa-check"></i><i class="fa fa-arrows-alt"></i>Nav Mode</a>
				</li>

				<li role="presentation" class="option">
					<a class="show-zoom-mode-bar"><i class="fa fa-check"></i><i class="fa fa-expand"></i>Zoom Mode</a>
				</li>

				<li role="presentation" class="option">
					<a class="show-zoom-bar"><i class="fa fa-check"></i><i class="fa fa-search"></i>Zoom</a>
				</li>

				<li role="presentation" class="option">
					<a class="show-optics-bar"><i class="fa fa-check"></i><i class="fa fa-database rotated flipped"></i>Optics</a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="show-sidebar dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-pause"></i>Sidebar<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="show-sidebar-panels dropdown-menu" data-toggle="dropdown">
				<li role="presentation">
					<a class="show-optics-panel"><i class="fa fa-check"></i><i class="fa fa-database rotated flipped"></i>Optics</a>
				</li>
		
				<li role="presentation">
					<a class="show-shared-panel"><i class="fa fa-check"></i><i class="fa fa-book"></i>Optics Library</a>
				</li>			
			</ul>
		</li>

		<li role="presentation" class="sidebar-view-kind dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-th"></i>Sidebar Items<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="show-sidebar-items dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="show-sidebar-icons"><i class="fa fa-check"></i><i class="fa fa-th"></i>Icons</a>
				</li>
				
				<li role="presentation">
					<a class="show-sidebar-lists"><i class="fa fa-check"></i><i class="fa fa-list"></i>Lists</a>
				</li>

				<li role="presentation">
					<a class="show-sidebar-trees"><i class="fa fa-check"></i><i class="fa fa-tree"></i>Trees</a>
				</li>

				<li role="presentation">
					<a class="show-sidebar-cards"><i class="fa fa-check"></i><i class="fa fa-id-card"></i>Cards</a>
				</li>
				
				<li role="presentation">
					<a class="show-sidebar-tiles"><i class="fa fa-check"></i><i class="fa fa-th-large"></i>Tiles</a>
				</li>
			</ul>
		</li>

		<li role="presentation">
			<a class="show-data-editor"><i class="fa fa-check"></i><i class="fa fa-table"></i>Data Editor<span class="command shortcut">D</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
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
		'click .fit-all': 'onClickFitAll',
		'click .fit-optics': 'onClickFitOptics',
		'click .fit-track': 'onClickFitTrack',
		'click .fit-images': 'onClickFitImages',
		'click .actual-size': 'onClickActualSize',

		'click .zoom-in': 'onClickZoomIn',
		'click .zoom-out': 'onClickZoomOut',
		'click .zoom-to-actual': 'onClickZoomToActual',

		'click .pan-up': 'onClickPanUp',
		'click .pan-down': 'onClickPanDown',
		'click .pan-left': 'onClickPanLeft',
		'click .pan-right': 'onClickPanRight',

		// viewport options
		//
		'click .scheme-kind li a': 'onClickShowScheme',
		'click .next-scheme': 'onClickNextScheme',
		'click .theme-kind li a': 'onClickShowTheme',
		'click .next-theme': 'onClickNextTheme',
		'click .show-grid': 'onClickShowGrid',
		'click .show-optical-axis': 'onClickShowOpticalAxis',
		'click .show-perpendicular-axis': 'onClickShowPerpendicularAxis',
		'click .show-colored-viewport': 'onClickShowColoredViewport',
		'click .show-axes': 'onClickShowAxes',
		'click .hide-axes': 'onClickHideAxes',
		'click .show-all': 'onClickShowAll',
		'click .hide-all': 'onClickHideAll',

		// element options
		//
		'click .show-elements': 'onClickShowElements',
		'click .show-filled-elements': 'onClickShowFilledElements',
		'click .show-stroked-elements': 'onClickShowStrokedElements',
		'click .show-shaded-elements': 'onClickShowShadedElements',
		'click .show-illustrated-elements': 'onClickShowIllustratedElements',
		'click .show-shadowed-elements': 'onClickShowShadowedElements',

		// light options
		//
		'click .show-lights': 'onClickShowLights',
		'click .show-filled-lights': 'onClickShowFilledLights',
		'click .show-stroked-lights': 'onClickShowStrokedLights',
		'click .show-transmitted-lights': 'onClickShowTransmittedLights',
		'click .show-obstructed-lights': 'onClickShowObstructedLights',
		'click .show-reflected-lights': 'onClickShowReflectedLights',

		// object options
		//
		'click .show-objects': 'onClickShowObjects',
		'click .show-filled-objects': 'onClickShowFilledObjects',
		'click .show-stroked-objects': 'onClickShowStrokedObjects',
		'click .show-transmitted-objects': 'onClickShowTransmittedObjects',
		'click .show-obstructed-objects': 'onClickShowObstructedObjects',
		'click .show-reflected-objects': 'onClickShowReflectedObjects',

		// annotation options
		//
		'click .show-annotations': 'onClickShowAnnotations',
		'click .show-filled-arrows': 'onClickShowFilledArrows',
		'click .show-stroked-arrows': 'onClickShowStrokedArrows',
		'click .show-diagonal-labels': 'onClickShowDiagonalLabels',
		'click .show-horizontal-labels': 'onClickShowHorizontalLabels',

		// optic annotation options
		//
		'click .show-thickness': 'onClickShowThickness',
		'click .show-spacing': 'onClickShowSpacing',
		'click .show-focal-points': 'onClickShowFocalPoints',
		'click .show-principal-planes': 'onClickShowPrincipalPlanes',

		// toolbar options
		//
		'click .show-toolbars > a': 'onClickShowToolbars',
		'click .show-toolbar > li > a': 'onClickShowToolbar',

		// sidebar options
		//
		'click .show-sidebar': 'onClickOption',
		'click .show-sidebar-panels a': 'onClickShowSideBarPanel',
		'click .show-sidebar-items a': 'onClickSideBarViewKind',
		'click .show-data-editor': 'onClickShowDataEditor',

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
		'click .view-preferences': 'onClickViewPreferences',
	},

	//
	// querying methods
	//

	selected: function() {
		let preferences = this.parent.app.preferences;
		let scheme = preferences.get('scheme');
		let theme = preferences.get('theme');
		let arrowStyle = preferences.get('arrow_style');
		let labelStyle = preferences.get('label_style');
		let toolbars = preferences.get('toolbars') || [];
		let sidebarPanels = preferences.get('sidebar_panels') || [];
		let sidebarViewKind = preferences.get('sidebar_view_kind');

		return {

			// scheme options
			//
			'monochrome-scheme': scheme == 'monochrome',
			'standard-scheme': scheme == 'standard',
			'colorful-scheme': scheme == 'colorful',
			'vibrant-scheme': scheme == 'vibrant',

			// theme options
			//
			'light-theme': theme == 'light',
			'medium-theme': theme == 'medium',
			'dark-theme': theme == 'dark',
			'auto-theme': theme == 'auto',

			// viewport options
			//
			'show-grid': preferences.get('show_grid'),
			'show-optical-axis': preferences.get('show_optical_axis'),
			'show-perpendicular-axis': preferences.get('show_perpendicular_axis'),
			'show-colored-viewport': preferences.get('show_colored_viewport'),

			// element options
			//
			'show-elements':  preferences.get('show_elements'),
			'show-filled-elements': preferences.get('show_filled_elements'),
			'show-stroked-elements': preferences.get('show_stroked_elements'),
			'show-shaded-elements': preferences.get('show_shaded_elements'),
			'show-illustrated-elements': preferences.get('show_illustrated_elements'),
			'show-shadowed-elements': preferences.get('show_shadowed_elements'),

			// light options
			//
			'show-lights':  preferences.get('show_lights'),
			'show-filled-lights': preferences.get('show_filled_lights'),
			'show-stroked-lights': preferences.get('show_stroked_lights'),
			'show-transmitted-lights': preferences.get('show_transmitted_lights'),
			'show-obstructed-lights': preferences.get('show_obstructed_lights'),
			'show-reflected-lights': preferences.get('show_reflected_lights'),

			// object options
			//
			'show-objects':  preferences.get('show_objects'),
			'show-filled-objects': preferences.get('show_filled_objects'),
			'show-stroked-objects': preferences.get('show_stroked_objects'),
			'show-transmitted-objects': preferences.get('show_transmitted_objects'),
			'show-obstructed-objects': preferences.get('show_obstructed_objects'),
			'show-reflected-objects': preferences.get('show_reflected_objects'),

			// annotation options
			//
			'show-annotations': preferences.get('show_annotations'),
			'show-filled-arrows': arrowStyle == 'filled',
			'show-stroked-arrows': arrowStyle == 'stroked',
			'show-diagonal-labels': labelStyle == 'diagonal',
			'show-horizontal-labels': labelStyle == 'horizontal',

			// optic annotation options
			//
			'show-thickness': preferences.get('show_thickness'),
			'show-spacing': preferences.get('show_spacing'),
			'show-focal-points': preferences.get('show_focal_points'),
			'show-principal-planes': preferences.get('show_principal_planes'),

			// toolbar options
			//
			'show-toolbars': toolbars.length > 0,
			'show-nav-bar': toolbars.includes('nav'),
			'show-mouse-mode-bar': toolbars.includes('mouse_mode'),
			'show-nav-mode-bar': toolbars.includes('nav_mode'),
			'show-zoom-mode-bar': toolbars.includes('zoom_mode'),
			'show-zoom-bar': toolbars.includes('zoom'),
			'show-optics-bar': toolbars.includes('optics'),

			// sidebar options
			//
			'show-sidebar': preferences.get('show_sidebar'),
			'show-optics-panel': sidebarPanels.includes('optics'),
			'show-shared-panel': sidebarPanels.includes('shared'),
			'show-sidebar-icons': sidebarViewKind == 'icons',
			'show-sidebar-lists': sidebarViewKind == 'lists',
			'show-sidebar-trees': sidebarViewKind == 'trees',
			'show-sidebar-cards': sidebarViewKind == 'cards',
			'show-sidebar-tiles': sidebarViewKind == 'tiles',
			'show-data-editor': preferences.get('show_data_editor'),

			// viewing options
			//
			'view-full-screen': true,
		}
	},

	//
	// getting methodss
	//

	getSchemes: function() {
		let schemes = [];
		this.$el.find('.scheme-kind li a').each((i, element) => { 
			schemes.push($(element).attr('class').replace('-scheme', '')); 
		});
		return schemes.slice(0, schemes.length - 1);
	},

	getScheme: function(which) {
		let schemes = this.getSchemes();

		switch (which) {
			case 'first':
				return schemes[0];
			case 'prev': {
				let index = schemes.indexOf(this.getScheme());
				if (index == 0) {
					return schemes[schemes.length - 1];
				} else {
					return schemes[index - 1];
				}
			}
			case 'next': {
				let index = schemes.indexOf(this.getScheme());
				if (index == schemes.length - 1) {
					return schemes[0];
				} else {
					return schemes[index + 1];
				}
			}
			case 'last':
				return schemes[schemes.length - 1];
			default:
				return this.$el.find('.scheme-kind li.selected a').attr('class').replace('-scheme', '');
		}
	},

	getThemes: function() {
		let themes = [];
		this.$el.find('.theme-kind li a').each((i, element) => { 
			themes.push($(element).attr('class').replace('-theme', '')); 
		});
		return themes.slice(0, themes.length - 1);
	},

	getTheme: function(which) {
		let themes = this.getThemes();

		switch (which) {
			case 'first':
				return themes[0];
			case 'prev': {
				let index = themes.indexOf(this.getTheme());
				if (index == 0) {
					return themes[themes.length - 1];
				} else {
					return themes[index - 1];
				}
			}
			case 'next': {
				let index = themes.indexOf(this.getTheme());
				if (index == themes.length - 1) {
					return themes[0];
				} else {
					return themes[index + 1];
				}
			}
			case 'last':
				return themes[themes.length - 1];
			default: {
				let theme = this.$el.find('.theme-kind li.selected a').attr('class').replace('-theme', '');
				if (theme == 'auto') {
					theme = 'medium';
				}
				return theme;
			}
		}
	},

	//
	// setting methods
	//

	setScheme: function(scheme) {
		this.$el.find('.scheme-kind li').removeClass('selected');
		this.$el.find('.' + scheme + '-scheme').closest('li').addClass('selected');
	},

	setTheme: function(theme) {
		this.$el.find('.theme-kind li').removeClass('selected');
		this.$el.find('.' + theme + '-theme').closest('li').addClass('selected');
	},

	setShowAxes: function(visible) {
		this.setOptionSelected('show-optical-axis', visible);
		this.setOptionSelected('show-perpendicular-axis', visible);
	},

	setShowAll: function(visible) {
		this.setShowAxes(visible);
		this.setOptionSelected('show-grid', visible);
	},

	//
	// fit mouse event handling methods
	//

	onClickFitAll: function() {
		this.parent.app.getChildView('header zoom zoom_mode').setZoomMode('fit_all');
	},

	onClickFitOptics: function() {
		this.parent.app.getChildView('header zoom zoom_mode').setZoomMode('fit_optics');
	},

	onClickFitTrack: function() {
		this.parent.app.getChildView('header zoom zoom_mode').setZoomMode('fit_track');
	},

	onClickFitImages: function() {
		this.parent.app.getChildView('header zoom zoom_mode').setZoomMode('fit_images');
	},

	onClickActualSize: function() {
		this.parent.app.getChildView('header zoom zoom_mode').setZoomMode('actual_size');
	},

	//
	// zoom mouse event handling methods
	//

	onClickZoomIn: function() {
		this.parent.app.zoomIn();
	},

	onClickZoomOut: function() {
		this.parent.app.zoomOut();
	},

	onClickZoomToActual: function() {
		this.parent.app.getChildView('header zoom zoom_mode').setZoomMode('actual_size');
	},

	//
	// pan event handling methods
	//

	onClickPanUp: function() {
		this.parent.app.panToDirection('up');
	},

	onClickPanDown: function() {
		this.parent.app.panToDirection('down');
	},

	onClickPanLeft: function() {
		this.parent.app.panToDirection('left');
	},

	onClickPanRight: function() {
		this.parent.app.panToDirection('right');
	},

	//
	// color scheme mouse event handling methods
	//

	onClickShowScheme: function(event) {
		let scheme = $(event.currentTarget).attr('class').replace('-scheme', '');
		if (scheme != 'next') {
			this.setScheme(scheme);
			this.parent.app.setOption('scheme', scheme);
		}
	},

	onClickNextScheme: function() {
		let scheme = this.getScheme('next');
		this.setScheme(scheme);
		this.parent.app.setOption('scheme', scheme);
	},

	//
	// theme mouse event handling methods
	//

	onClickShowTheme: function(event) {
		let theme = $(event.currentTarget).attr('class').replace('-theme', '');
		if (theme != 'next') {
			this.setTheme(theme);
			this.parent.app.setOption('theme', theme);
			// application.settings.theme.setCurrentTheme(theme);
		}
	},

	onClickNextTheme: function() {
		let theme = this.getTheme('next');
		this.setTheme(theme);
		this.parent.app.setOption('theme', theme);
		// application.settings.theme.setCurrentTheme(theme);
	},

	//
	// viewport mouse event handling methods
	//

	onClickShowGrid: function() {
		this.toggleOption('show-grid');
	},

	onClickShowOpticalAxis: function() {
		this.toggleOption('show-optical-axis');
	},

	onClickShowPerpendicularAxis: function() {
		this.toggleOption('show-perpendicular-axis');
	},

	onClickShowColoredViewport: function() {
		this.toggleOption('show-colored-viewport');
	},

	onClickShowAxes: function() {
		this.setShowAxes(true);
	},

	onClickHideAxes: function() {
		this.setShowAxes(false);
	},

	onClickShowAll: function() {
		this.setShowAll(true);
	},

	onClickHideAll: function() {
		this.setShowAll(false);
	},

	//
	// element mouse event handling methods
	//

	onClickShowElements: function() {
		this.toggleOption('show-elements');
	},

	onClickShowFilledElements: function() {
		this.toggleOption('show-filled-elements');
	},

	onClickShowStrokedElements: function() {
		this.toggleOption('show-stroked-elements');
	},

	onClickShowShadedElements: function() {
		this.toggleOption('show-shaded-elements');
	},

	onClickShowIllustratedElements: function() {
		this.toggleOption('show-illustrated-elements');
	},

	onClickShowShadowedElements: function() {
		this.toggleOption('show-shadowed-elements');
	},

	//
	// light mouse event handling methods
	//

	onClickShowLights: function() {
		this.toggleOption('show-lights');
	},

	onClickShowFilledLights: function() {
		this.toggleOption('show-filled-lights');
	},

	onClickShowStrokedLights: function() {
		this.toggleOption('show-stroked-lights');
	},

	onClickShowTransmittedLights: function() {
		this.toggleOption('show-transmitted-lights');
	},

	onClickShowObstructedLights: function() {
		this.toggleOption('show-obstructed-lights');
	},

	onClickShowReflectedLights: function() {
		this.toggleOption('show-reflected-lights');
	},

	//
	// object mouse event handling methods
	//

	onClickShowObjects: function() {
		this.toggleOption('show-objects');
	},

	onClickShowFilledObjects: function() {
		this.toggleOption('show-filled-objects');
	},

	onClickShowStrokedObjects: function() {
		this.toggleOption('show-stroked-objects');
	},

	onClickShowTransmittedObjects: function() {
		this.toggleOption('show-transmitted-objects');
	},

	onClickShowObstructedObjects: function() {
		this.toggleOption('show-obstructed-objects');
	},

	onClickShowReflectedObjects: function() {
		this.toggleOption('show-reflected-objects');
	},

	//
	// annotation mouse event handling methods
	//

	onClickShowAnnotations: function() {
		this.toggleOption('show-annotations');
	},

	onClickShowFilledArrows: function() {
		this.$el.find('.show-filled-arrows').closest('li').addClass('selected');
		this.$el.find('.show-stroked-arrows').closest('li').removeClass('selected');
		this.parent.app.setOption('arrow_style', 'filled');
	},

	onClickShowStrokedArrows: function() {
		this.$el.find('.show-filled-arrows').closest('li').removeClass('selected');
		this.$el.find('.show-stroked-arrows').closest('li').addClass('selected');
		this.parent.app.setOption('arrow_style', 'stroked');
	},

	onClickShowDiagonalLabels: function() {
		this.$el.find('.show-diagonal-labels').closest('li').addClass('selected');
		this.$el.find('.show-horizontal-labels').closest('li').removeClass('selected');
		this.parent.app.setOption('label_style', 'diagonal');
	},

	onClickShowHorizontalLabels: function() {
		this.$el.find('.show-diagonal-labels').closest('li').removeClass('selected');
		this.$el.find('.show-horizontal-labels').closest('li').addClass('selected');
		this.parent.app.setOption('label_style', 'horizontal');
	},

	//
	// optic annotation mouse event handling methods
	//

	onClickShowThickness: function() {
		this.toggleOption('show-thickness');
	},

	onClickShowSpacing: function() {
		this.toggleOption('show-spacing');
	},

	onClickShowFocalPoints: function() {
		this.toggleOption('show-focal-points');
	},

	onClickShowPrincipalPlanes: function() {
		this.toggleOption('show-principal-planes');
	},

	//
	// mouse event handling methods
	//

	onClickShowDataEditor: function() {
		this.toggleMenuItem('show-data-editor');
		this.parent.app.setOption('show_data_editor', this.isItemSelected('show-data-editor'));
	}
});