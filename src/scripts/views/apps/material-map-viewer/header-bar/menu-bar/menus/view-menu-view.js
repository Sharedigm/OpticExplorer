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
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ViewMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/view-menu-view.js';

export default ViewMenuView.extend({

	//
	// attributes
	//

	template: template(`		
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
			<a class="dropdown-toggle"><i class="fa fa-paint-brush"></i>Colors<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="monochrome-scheme"><i class="fa fa-check"></i><i class="fa fa-paint-brush"></i>Monochrome</a>
				</li>
		
				<li role="presentation">
					<a class="standard-scheme"><i class="fa fa-check"></i><i class="fa fa-paint-brush"></i>Standard</a>
				</li>
		
				<li role="presentation">
					<a class="colorful-scheme"><i class="fa fa-check"></i><i class="fa fa-paint-brush"></i>Colorful</a>
				</li>

				<li role="presentation">
					<a class="vibrant-scheme"><i class="fa fa-check"></i><i class="fa fa-paint-brush"></i>Vibrant</a>
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

				<li role="presentation">
					<a class="auto-theme"><i class="fa fa-check"></i><i class="fa fa-adjust"></i>Auto</a>
				</li>

				<li role="separator" class="divider"></li>

				<li role="presentation">
					<a class="next-theme"><i class="fa fa-chevron-right"></i>Next<span class="command shortcut">B</span></a>
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
					<a class="show-abbe-axis"><i class="fa fa-check"></i><i class="fa fa-arrows-left-right"></i>Abbe Axis</a>
				</li>
		
				<li role="presentation">
					<a class="show-index-axis"><i class="fa fa-check"></i><i class="fa fa-arrows-up-down"></i>Index Axis</a>
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
			</ul>
		</li>

		<li role="presentation" class="view-kind dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-chart-line"></i>Diagram<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="show-regions"><i class="fa fa-check"></i><i class="fa fa-square"></i>Regions</a>
				</li>

				<li role="presentation">
					<a class="show-edges"><i class="fa fa-check"></i><i class="fa fa-code-merge"></i>Edges</a>
				</li>

				<li role="presentation">
					<a class="show-vertices"><i class="fa fa-check"></i><i class="fa fa-code-commit"></i>Vertices</a>
				</li>

				<li role="presentation">
					<a class="show-labels"><i class="fa fa-check"></i><i class="fa fa-font"></i>Labels</a>
				</li>

				<li role="separator" class="divider"></li>

				<li role="presentation">
					<a class="show-shading"><i class="fa fa-check"></i><i class="fa fa-lightbulb"></i>Shading</a>
				</li>

				<li role="presentation">
					<a class="show-shadows"><i class="fa fa-check"></i><i class="fa fa-sun"></i>Shadows</a>
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
					<a class="show-map-bar"><i class="fa fa-check"></i><i class="fa fa-map"></i>Map</a>
				</li>
			</ul>
		</li>
		
		<li role="presentation" class="hidden-xs dropdown dropdown-submenu">
			<a class="show-sidebar dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-pause"></i>Sidebar<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="show-sidebar-panels dropdown-menu" data-toggle="dropdown">
				
				<li role="presentation">
					<a class="show-maps-panel"><i class="fa fa-check"></i><i class="fa fa-map"></i>Material Maps</a>
				</li>
		
				<li role="presentation">
					<a class="show-shared-panel"><i class="fa fa-check"></i><i class="fa fa-book"></i>Material Maps Library</a>
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
		
				<li role="presentation" class="view-kind">
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
		'click .zoom-in': 'onClickZoomIn',
		'click .zoom-out': 'onClickZoomOut',
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
		'click .show-abbe-axis': 'onClickShowAbbeAxis',
		'click .show-index-axis': 'onClickShowIndexAxis',
		'click .show-colored-viewport': 'onClickShowColoredViewport',
		'click .show-axes': 'onClickShowAxes',
		'click .hide-axes': 'onClickHideAxes',

		// diagram options
		//
		'click .show-regions': 'onClickShowRegions',
		'click .show-edges': 'onClickShowEdges',
		'click .show-vertices': 'onClickShowVertices',
		'click .show-labels': 'onClickShowLabels',
		'click .show-shading': 'onClickShowShading',
		'click .show-shadows': 'onClickShowShadows',

		// toolbar options
		//
		'click .show-toolbars > a': 'onClickShowToolbars',
		'click .show-toolbar > li > a': 'onClickShowToolbar',

		// sidebar options
		//
		'click .show-sidebar': 'onClickOption',
		'click .show-sidebar-panels a': 'onClickShowSideBarPanel',
		'click .show-sidebar-items a': 'onClickSideBarViewKind',

		// view options
		//
		'click .shrink-window': 'onClickShrinkWindow',
		'click .grow-window': 'onClickGrowWindow',
		'click .expand-window': 'onClickExpandWindow',
		'click .prev-space': 'onClickPrevSpace',
		'click .next-space': 'onClickNextSpace',
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
		let scheme = preferences.get('scheme');
		let theme = preferences.get('theme');
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
			'show-abbe-axis': preferences.get('show_abbe_axis'),
			'show-index-axis': preferences.get('show_index_axis'),
			'show-colored-viewport': preferences.get('show_colored_viewport'),

			// diagram options
			//
			'show-regions': preferences.get('show_regions'),
			'show-edges': preferences.get('show_edges'),
			'show-vertices': preferences.get('show_vertices'),
			'show-labels': preferences.get('show_labels'),
			'show-shading': preferences.get('show_shading'),
			'show-shadows': preferences.get('show_shadows'),

			// toolbar options
			//
			'show-toolbars': toolbars.length > 0,
			'show-nav-bar': toolbars.includes('nav'),
			'show-mouse-mode-bar': toolbars.includes('mouse_mode'),
			'show-nav-mode-bar': toolbars.includes('nav_mode'),
			'show-zoom-mode-bar': toolbars.includes('zoom_mode'),
			'show-zoom-bar': toolbars.includes('zoom'),
			'show-map-bar': toolbars.includes('map'),

			// sidebar options
			//
			'show-sidebar': preferences.get('show_sidebar'),
			'show-maps-panel': sidebarPanels.includes('maps'),
			'show-shared-panel': sidebarPanels.includes('shared'),	
			'show-sidebar-icons': sidebarViewKind == 'icons',
			'show-sidebar-lists': sidebarViewKind == 'lists',
			'show-sidebar-trees': sidebarViewKind == 'trees',
			'show-sidebar-cards': sidebarViewKind == 'cards',
			'show-sidebar-tiles': sidebarViewKind == 'tiles'
		};
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
		return themes.slice(0, themes.length - 2);
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

	//
	// zoom mouse event handling methods
	//

	onClickZoomIn: function() {
		this.parent.app.zoomIn();
	},

	onClickZoomOut: function() {
		this.parent.app.zoomOut();
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
		}
	},

	onClickNextTheme: function() {
		let theme = this.getTheme('next');
		this.setTheme(theme);
		this.parent.app.setOption('theme', theme);
	},

	//
	// viewport mouse event handling methods
	//

	onClickShowGrid: function() {
		this.toggleOption('show-grid');
	},

	onClickShowAbbeAxis: function() {
		this.toggleOption('show-abbe-axis');
	},

	onClickShowIndexAxis: function() {
		this.toggleOption('show-index-axis');
	},

	onClickShowColoredViewport: function() {
		this.toggleOption('show-colored-viewport');
	},

	onClickShowAxes: function() {
		this.setOptionSelected('show-abbe-axis', true);
		this.setOptionSelected('show-index-axis', true);
	},

	onClickHideAxes: function() {
		this.setOptionSelected('show-abbe-axis', false);
		this.setOptionSelected('show-index-axis', false);
	},

	//
	// diagram mouse event handling methods
	//

	onClickShowRegions: function() {
		this.toggleOption('show-regions');
	},

	onClickShowEdges: function() {
		this.toggleOption('show-edges');
	},

	onClickShowVertices: function() {
		this.toggleOption('show-vertices');
	},

	onClickShowLabels: function() {
		this.toggleOption('show-labels');
	},

	onClickShowShading: function() {
		this.toggleOption('show-shading');
	},

	onClickShowShadows: function() {
		this.toggleOption('show-shadows');
	},

	//
	// toolbar mouse event handling methods
	//

	onClickShowToolbar: function(event) {
		this.toggleToolbar($(event.target).closest('a').attr('class'));
	},

	onClickShowAllToolbars: function() {
		this.parent.app.setOption('toolbars', true);
		this.$el.find('.toolbars li').addClass('selected');
	},

	onClickShowNoToolbars: function() {
		this.parent.app.setOption('toolbars', false);
		this.$el.find('.toolbars li').removeClass('selected');
	}
});