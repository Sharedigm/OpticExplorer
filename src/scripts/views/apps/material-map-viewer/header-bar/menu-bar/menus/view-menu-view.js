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
		'click .color-scheme > a': 'onClickScheme',
		'click .next-scheme': 'onClickNextScheme',
		'click .theme-kind > a': 'onClickThemeKind',
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
		'click .show-toolbar > a': 'onClickShowToolbar',

		// sidebar options
		//
		'click .show-sidebar': 'onClickShowSidebar',
		'click .show-sidebar-panel > a': 'onClickShowSideBarPanel',
		'click .sidebar-view-kind > a': 'onClickSideBarViewKind',

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

			// sidebar item options
			//
			'view-sidebar-icons': sidebarViewKind == 'icons',
			'view-sidebar-lists': sidebarViewKind == 'lists',
			'view-sidebar-trees': sidebarViewKind == 'trees',
			'view-sidebar-cards': sidebarViewKind == 'cards',
			'view-sidebar-tiles': sidebarViewKind == 'tiles'
		};
	},

	//
	// getting methodss
	//

	getSchemes: function() {
		let schemes = [];
		this.$el.find('.color-scheme > a').each((i, element) => {
			schemes.push($(element).attr('class').replace('-scheme', ''));
		});
		return schemes.slice(0, schemes.length);
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
				return this.$el.find('.color-scheme.selected > a').attr('class').replace('-scheme', '');
		}
	},

	getThemes: function() {
		let themes = [];
		this.$el.find('.theme-kind > a').each((i, element) => {
			themes.push($(element).attr('class').replace('theme-kind', '').replace('-theme', ''));
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
				let theme = this.$el.find('.theme-kind.selected > a').attr('class').replace('theme-kind', '').replace('-theme', '');
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
		this.$el.find('.color-scheme').removeClass('selected');
		this.$el.find('.' + scheme + '-scheme').closest('li').addClass('selected');
	},

	setTheme: function(theme) {
		this.$el.find('.theme-kind').removeClass('selected');
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

	onClickScheme: function(event) {
		let scheme = $(event.currentTarget).attr('class').replace('-scheme', '');
		this.setScheme(scheme);
		this.parent.app.setOption('scheme', scheme);
	},

	onClickNextScheme: function() {
		let scheme = this.getScheme('next');
		this.setScheme(scheme);
		this.parent.app.setOption('scheme', scheme);
	},

	//
	// theme mouse event handling methods
	//

	onClickThemeKind: function(event) {
		let theme = $(event.currentTarget).attr('class').replace('theme-kind', '').replace('-theme', '');
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