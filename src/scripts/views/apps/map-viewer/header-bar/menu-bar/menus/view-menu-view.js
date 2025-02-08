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

		// view options
		//
		'click li.map-mode a': 'onClickMapMode',
		'click li.aero-mode a': 'onClickAeroMode',

		// navigation options
		//
		'click .zoom-to-location': 'onClickZoomToLocation',
		'click .zoom-to': 'onClickZoomTo',
		'click .pan-north': 'onClickPanNorth',
		'click .pan-south': 'onClickPanSouth',
		'click .pan-east': 'onClickPanEast',
		'click .pan-west': 'onClickPanWest',
		'click .zoom-in': 'onClickZoomIn',
		'click .zoom-out': 'onClickZoomOut',
		'click .reset-view': 'onClickResetView',

		// toolbar options
		//
		'click .show-toolbars': 'onClickShowToolbars',
		'click .show-toolbar > a': 'onClickShowToolbar',

		// layer options
		//
		'click .show-layer > a': 'onClickShowLayer',
		'click .show-all-layers': 'onClickShowAllLayers',
		'click .show-no-layers': 'onClickShowNoLayers',
		
		// map options
		//
		'click .show-grid': 'onClickOption',
		'click .show-smoothing': 'onClickOption',
		'click .map-view-kind a': 'onClickMapViewKind',
		'click .show-item-names': 'onClickOption',
		'click .show-geo-orientations': 'onClickOption',

		// sidebar options
		//
		'click .show-sidebar': 'onClickShowSidebar',
		'click .show-sidebar-panel > a': 'onClickShowSideBarPanel',
		'click .sidebar-view-kind > a': 'onClickSideBarViewKind',
		'click .sidebar-tile-size > a': 'onClickSideBarTileSize',
		'click .show-image-info': 'onClickOption',

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

	enabled: function() {
		let hasPhotos = this.parent.app.hasItems('photos');
		let hasVideos = this.parent.app.hasItems('videos');
		let hasOverlays = this.parent.app.hasItems('overlays');
		let hasPeople = this.parent.app.hasItems('people');
		let hasPlaces = this.parent.app.hasItems('places');
		let hasFavorites = this.parent.app.hasItems('favorites');
		let hasAnnotations = this.parent.app.hasItems('annotations');
		let hasSelectedPhotos = this.parent.app.hasSelectedLayerItems('photos');
		let hasSelectedVideos = this.parent.app.hasSelectedLayerItems('videos');
		let hasSelectedPeople = this.parent.app.hasSelectedLayerItems('people');
		let hasSelectedPlaces = this.parent.app.hasSelectedLayerItems('places');		
		let hasSelectedFavorites = this.parent.app.hasSelectedLayerItems('favorites');
		let hasSelectedItems = hasSelectedFavorites || hasSelectedPlaces || hasSelectedPhotos || hasSelectedVideos || hasSelectedPeople;

		return {
			'zoom-to': hasSelectedItems,
			'show-crosshairs-layer': true,
			'show-favorites-layer': hasFavorites,
			'show-photos-layer': hasPhotos,
			'show-videos-layer': hasVideos,
			'show-overlays-layer': hasOverlays,
			'show-people-layer': hasPeople,
			'show-places-layer': hasPlaces,
			'show-annotations-layer': hasAnnotations,
			'show-weather-layer': true,
			'show_small_icons': true,
			'show_medium_icons': true,
			'show_large_icons': true,
			'show_icon_names': true,
			'show_smoothing': true
		};	
	},

	selected: function() {
		let preferences = this.parent.app.preferences;
		let mapLayers = preferences.get('map_layers') || [];
		let toolbars = preferences.get('toolbars') || [];
		let mapMode = this.parent.app.getMapMode() || preferences.get('map_mode');
		let aeroMode = this.parent.app.getAeroMode() || preferences.get('aero_mode');
		let mapViewKind = preferences.get('map_view_kind');
		let sidebarPanels = preferences.get('sidebar_panels') || [];
		let sidebarViewKind = preferences.get('sidebar_view_kind');

		return {

			// map options
			//
			'show-map': mapMode == 'map',
			'show-satellite': mapMode == 'satellite',
			'show-hybrid': mapMode == 'hybrid',
			'show-streets': mapMode == 'streets',
			'show-transportation': mapMode == 'transportation',
			'show-elevation': mapMode == 'elevation',
			'show-aeronautical': mapMode == 'aeronautical',
			'show-vfr': aeroMode == 'vfr',
			'show-ifrlo': aeroMode == 'ifrlo',
			'show-ifrhi': aeroMode == 'ifrhi',

			// toolbar options
			//
			'show-toolbars': toolbars.length > 0,
			'show-nav-bar': toolbars.includes('nav'),
			'show-mouse-mode-bar': toolbars.includes('mouse_mode'),
			'show-nav-mode-bar': toolbars.includes('nav_mode'),
			'show-zoom-bar': toolbars.includes('zoom'),
			'show-annotations-bar': toolbars.includes('annotations'),
			'show-map-bar': toolbars.includes('map'),

			// layer options
			//
			'show-crosshairs-layer': mapLayers.includes('crosshairs'),
			'show-photos-layer': mapLayers.includes('photos'),
			'show-videos-layer': mapLayers.includes('videos'),
			'show-overlays-layer': mapLayers.includes('overlays'),
			'show-people-layer': mapLayers.includes('people'),
			'show-places-layer': mapLayers.includes('places'),
			'show-favorites-layer': mapLayers.includes('favorites'),
			'show-annotations-layer': mapLayers.includes('annotations'),
			'show-weather-layer': mapLayers.includes('weather'),

			// viewing options
			//
			'show-grid': preferences.get('show_grid'),
			'show-smoothing': preferences.get('show_smoothing'),

			// map item options
			//
			'view-map-icons': mapViewKind == 'icons',
			'view-map-lists': mapViewKind == 'lists',
			'view-map-cards': mapViewKind == 'cards',
			'view-map-tiles': mapViewKind == 'tiles',
			'show-item-names': preferences.get('show_item_names'),
			'show-geo-orientations': preferences.get('show_geo_orientations'),

			// sidebar options
			//
			'show-sidebar': preferences.get('show_sidebar'),
			'show-maps-panel': sidebarPanels.includes('maps'),
			'show-photos-panel': sidebarPanels.includes('photos'),
			'show-videos-panel': sidebarPanels.includes('videos'),
			'show-overlays-panel': sidebarPanels.includes('overlays'),
			'show-people-panel': sidebarPanels.includes('people'),
			'show-places-panel': sidebarPanels.includes('places'),
			'show-favorites-panel': sidebarPanels.includes('favorites'),
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
	// setting methods
	//

	setSmoothing: function(smoothing) {
		this.parent.app.options.smoothing = smoothing;
		this.setItemSelected('toggle-smoothing', smoothing);
	},

	setMapMode: function(mapMode) {
		this.$el.find('li.map-mode').removeClass('selected');
		this.$el.find('li .show-' + mapMode).closest('li').addClass('selected');
	},

	setAeroMode: function(aeroMode) {
		this.$el.find('li.aero-mode').removeClass('selected');
		this.$el.find('li .show-' + aeroMode).closest('li').addClass('selected');
	},

	toggleToolbar: function(className) {

		// call superclass method
		//
		this.toggleMenuItem(className);

		// update parent
		//
		this.parent.app.setOption('toolbars', this.getSelectedToolbars());
	},

	toggleLayer: function(className) {

		// call superclass method
		//
		this.toggleMenuItem(className);

		// update parent
		//
		this.parent.app.setOption('layers', this.getSelectedLayers());
	},

	//
	// map mouse event handling methods
	//

	onClickMapMode: function(event) {
		let className = $(event.currentTarget).attr('class').split(' ')[0];
		let mapMode = className.replace('show-', '');

		// update menu
		//
		this.setMapMode(mapMode);

		// update parent
		//
		this.parent.app.setOption('map_mode', mapMode);
	},

	onClickAeroMode: function(event) {
		let className = $(event.currentTarget).attr('class');
		let aeroMode = className.replace('show-', '');

		// update menu
		//
		this.setAeroMode(aeroMode);

		// update parent
		//
		this.parent.app.setOption('aero_mode', aeroMode);
	},

	onClickResetView: function() {
		this.parent.app.resetView();
	},
	
	//
	// pan mouse event handling methods
	//

	onClickPanNorth: function() {
		this.parent.app.panToDirection('north');
	},

	onClickPanSouth: function() {
		this.parent.app.panToDirection('south');
	},

	onClickPanEast: function() {
		this.parent.app.panToDirection('east');
	},

	onClickPanWest: function() {
		this.parent.app.panToDirection('west');
	},

	//
	// zoom mouse event handling methods
	//

	onClickZoomToLocation: function() {
		this.parent.app.zoomToLocation();
	},

	onClickZoomTo: function() {
		this.parent.app.zoomToItem(this.parent.app.getSelectedItem());
	},

	onClickZoomIn: function() {
		this.parent.parent.getChildView('zoom').zoomIn();
	},

	onClickZoomOut: function() {
		this.parent.parent.getChildView('zoom').zoomOut();
	},

	//
	// layer mouse event handling methods
	//

	onClickShowLayer: function(event) {
		let className = $(event.target).closest('a').attr('class');	

		// update menu and app
		//
		this.toggleLayer(className);
	},

	onClickShowAllLayers: function() {

		// update menu
		//
		this.$el.find('.show-layer').addClass('selected');

		// update map
		//
		this.parent.app.setOption('layers', true);
	},

	onClickShowNoLayers: function() {

		// update menu
		//
		this.$el.find('.show-layer').removeClass('selected');

		// update map
		//
		this.parent.app.setOption('layers', false);
	}
});