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
		'click .color-scheme > a': 'onClickScheme',
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
		'click .show-toolbar > a': 'onClickShowToolbar',

		// sidebar options
		//
		'click .show-sidebar': 'onClickShowSidebar',
		'click .show-sidebar-panel > a': 'onClickShowSideBarPanel',
		'click .sidebar-view-kind > a': 'onClickSideBarViewKind',
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
			'show-data-editor': preferences.get('show_data_editor'),

			// sidebar item options
			//
			'view-sidebar-icons': sidebarViewKind == 'icons',
			'view-sidebar-lists': sidebarViewKind == 'lists',
			'view-sidebar-trees': sidebarViewKind == 'trees',
			'view-sidebar-cards': sidebarViewKind == 'cards',
			'view-sidebar-tiles': sidebarViewKind == 'tiles',

			// viewing options
			//
			'view-full-screen': false,
		}
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
				let index = schemes.indexOf(this.getSelectedScheme());
				if (index == 0) {
					return schemes[schemes.length - 1];
				} else {
					return schemes[index - 1];
				}
			}
			case 'next': {
				let index = schemes.indexOf(this.getSelectedScheme());
				if (index == schemes.length - 1) {
					return schemes[0];
				} else {
					return schemes[index + 1];
				}
			}
			case 'last':
				return schemes[schemes.length - 1];
			default:
				return this.getSelectedScheme();
		}
	},

	getSelectedScheme: function() {
		return this.$el.find('.color-scheme.selected > a').attr('class').replace('color-scheme', '').replace('-scheme', '');
	},

	getThemes: function() {
		let themes = [];
		this.$el.find('.theme-kind li a').each((i, element) => { 
			themes.push($(element).attr('class').replace('-theme', '')); 
		});
		return themes.slice(0, themes.length);
	},

	getTheme: function(which) {
		let themes = this.getThemes();

		switch (which) {
			case 'first':
				return themes[0];
			case 'prev': {
				let index = themes.indexOf(this.getSelectedTheme());
				if (index == 0) {
					return themes[themes.length];
				} else {
					return themes[index - 1];
				}
			}
			case 'next': {
				let index = themes.indexOf(this.getSelectedTheme());
				if (index == themes.length) {
					return themes[0];
				} else {
					return themes[index + 1];
				}
			}
			case 'last':
				return themes[themes.length - 1];
			default: {
				return this.getSelectedTheme();
			}
		}
	},

	getSelectedTheme: function() {
		let theme = this.$el.find('.theme-kind li.selected a').attr('class').replace('-theme', '');
		if (theme == 'auto') {
			theme = 'medium';
		}
		return theme;
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