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
		<li role="presentation" class="map-mode">
			<a class="show-map"><i class="fa fa-check"></i><i class="fa fa-map"></i>Map</a>
		</li>

		<li role="presentation" class="map-mode">
			<a class="show-satellite"><i class="fa fa-check"></i><i class="fa fa-satellite"></i>Satellite</a>
		</li>

		<li role="presentation" class="map-mode">
			<a class="show-hybrid"><i class="fa fa-check"></i><i class="fa fa-map-marked-alt"></i>Hybrid</a>
		</li>

		<li role="presentation" class="map-mode">
			<a class="show-streets"><i class="fa fa-check"></i><i class="fa fa-road"></i>Streets</a>
		</li>

		<li role="presentation" class="map-mode">
			<a class="show-transportation"><i class="fa fa-check"></i><i class="fa fa-bus"></i>Transportation</a>
		</li>

		<li role="presentation" class="map-mode">
			<a class="show-elevation"><i class="fa fa-check"></i><i class="fa fa-mountain"></i>Elevation</a>
		</li>

		<li role="presentation" class="map-mode dropdown dropdown-submenu">
			<a class="show-aeronautical dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-plane"></i>Aeronautical<i class="fa fa-caret-left"></i><i class="fa fa-caret-right">
			</i></a>

			<ul class="dropdown-menu" data-toggle="dropdown">

				<li role="presentation" class="aero-mode">
					<a class="show-vfr"><i class="fa fa-check"></i><i class="fa fa-eye"></i>VFR (Sectional)</a>
				</li>

				<li role="presentation" class="aero-mode">
					<a class="show-ifrlo"><i class="fa fa-check"></i><i class="fa fa-arrow-up"></i>IFR / Low</a>
				</li>

				<li role="presentation" class="aero-mode">
					<a class="show-ifrhi"><i class="fa fa-check"></i><i class="fa fa-arrow-down"></i>IFR / High</a>
				</li>
			</ul>
		</li>
		
		<li role="separator" class="divider"></li>

		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="navigation dropdown-toggle"><i class="fa fa-arrows-alt"></i>Navigation<i class="fa fa-caret-left"></i><i class="fa fa-caret-right">
			</i></a>

			<ul class="dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="zoom-to-location"><i class="fa fa-crosshairs"></i>Current Location<span class="command shortcut">H</span></a>
				</li>

				<li role="separator" class="divider"></li>

				<li role="presentation">
					<a class="zoom-to"><i class="fa fa-search"></i>Zoom To<span class="command shortcut">Z</span></a>
				</li>

				<li role="presentation">
					<a class="zoom-in"><i class="fa fa-search-plus"></i>Zoom In<span class="shortcut">=</span></a>
				</li>

				<li role="presentation">
					<a class="zoom-out"><i class="fa fa-search-minus"></i>Zoom Out<span class="shortcut">-</span></a>
				</li>

				<li role="separator" class="divider"></li>

				<li role="presentation">
					<a class="pan-north"><i class="fa fa-arrow-up"></i>North<span class="shortcut">up arrow</span></a>
				</li>

				<li role="presentation">
					<a class="pan-south"><i class="fa fa-arrow-down"></i>South<span class="shortcut">down arrow</span></a>
				</li>

				<li role="presentation">
					<a class="pan-east"><i class="fa fa-arrow-right"></i>East<span class="shortcut">right arrow</span></a>
				</li>
				
				<li role="presentation">
					<a class="pan-west"><i class="fa fa-arrow-left"></i>West<span class="shortcut">left arrow</span></a>
				</li>
				
				<li role="separator" class="divider"></li>

				<li role="presentation">
					<a class="reset-view"><i class="fa fa-undo"></i>Reset<span class="shift command shortcut">R</span></a>
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

				<li role="presentation" class="option" style="display:none">
					<a class="show-annotations-bar"><i class="fa fa-check"></i><i class="fa fa-pencil"></i>Annotations</a>
				</li>

				<li role="presentation" class="option">
					<a class="show-zoom-bar"><i class="fa fa-check"></i><i class="fa fa-search"></i>Zoom</a>
				</li>

				<li role="presentation" class="option">
					<a class="show-map-bar"><i class="fa fa-check"></i><i class="fa fa-map"></i>Map</a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="desktop-only layers dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-layer-group"></i>Layers<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="show-layers dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="show-crosshairs-layer"><i class="fa fa-check"></i><i class="fa fa-crosshairs"></i>Crosshairs</a>
				</li>

				<li role="presentation">
					<a class="show-photos-layer"><i class="fa fa-check"></i><i class="fa fa-camera"></i>Photos</a>
				</li>

				<li role="presentation">
					<a class="show-videos-layer"><i class="fa fa-check"></i><i class="fa fa-camera"></i>Videos</a>
				</li>

				<li role="presentation">
					<a class="show-overlays-layer"><i class="fa fa-check"></i><i class="fa fa-grip-lines"></i>Overlays</a>
				</li>

				<li role="presentation">
					<a class="show-people-layer"><i class="fa fa-check"></i><i class="fa fa-user-friends"></i>People</a>
				</li>

				<li role="presentation">
					<a class="show-places-layer"><i class="fa fa-check"></i><i class="fa fa-map-marker-alt"></i>Places</a>
				</li>

				<li role="presentation">
					<a class="show-favorites-layer"><i class="fa fa-check"></i><i class="fa fa-map-pin"></i>Favorites</a>
				</li>

				<li role="presentation" style="display:none">
					<a class="show-annotations-layer"><i class="fa fa-check"></i><i class="fa fa-pencil-alt-square"></i>Annotations</a>
				</li>

				<li role="presentation">
					<a class="show-weather-layer"><i class="fa fa-check"></i><i class="fa fa-cloud-sun-rain"></i>Weather</a>
				</li>

				<li role="separator" class="divider"></li>

				<li role="presentation">
					<a class="show-all-layers"><i class="fa fa-plus"></i>All</a>
				</li>

				<li role="presentation">
					<a class="show-no-layers"><i class="fa fa-minus"></i>None</a>
				</li>
			</ul>
		</li>

		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-map"></i>Map<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="show-grid"><i class="fa fa-check"></i><i class="fa fa-border-none"></i>Grid</a>
				</li>

				<li role="presentation">
					<a class="show-smoothing"><i class="fa fa-check"></i><i class="fa fa-wave-square"></i>Smoothing</a>
				</li>
			</ul>
		</li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-map-location"></i>Map Items<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="map-view-kind dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="view-map-icons"><i class="fa fa-check"></i><i class="fa fa-th"></i>Icons</a>
				</li>
				
				<li role="presentation">
					<a class="view-map-lists"><i class="fa fa-check"></i><i class="fa fa-list"></i>Lists</a>
				</li>

				<li role="presentation">
					<a class="view-map-cards"><i class="fa fa-check"></i><i class="fa fa-id-card"></i>Cards</a>
				</li>

				<li role="presentation">
					<a class="view-map-tiles"><i class="fa fa-check"></i><i class="fa fa-th-large"></i>Tiles</a>
				</li>

				<li role="separator" class="divider"></li>

				<li role="presentation" class="option">
					<a class="show-item-names"><i class="fa fa-check"></i><i class="fa fa-font"></i>Names</a>
				</li>

				<li role="presentation" class="option">
					<a class="show-geo-orientations"><i class="fa fa-check"></i><i class="fa fa-location-arrow"></i>Orientations</a>
				</li>
			</ul>
		</li>
		
		<li role="presentation" class="hidden-xs dropdown dropdown-submenu">
			<a class="show-sidebar dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-pause"></i>Sidebar<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="show-sidebar-panels dropdown-menu" data-toggle="dropdown">
				
				<li role="presentation">
					<a class="show-maps-panel"><i class="fa fa-check"></i><i class="fa fa-map"></i>Maps</a>
				</li>

				<li role="presentation">
					<a class="show-photos-panel"><i class="fa fa-check"></i><i class="fa fa-camera"></i>Photos</a>
				</li>
				
				<li role="presentation">
					<a class="show-videos-panel"><i class="fa fa-check"></i><i class="fa fa-video"></i>Videos</a>
				</li>

				<li role="presentation">
					<a class="show-overlays-panel"><i class="fa fa-check"></i><i class="fa fa-grip-lines"></i>Overlays</a>
				</li>

				<li role="presentation">
					<a class="show-people-panel"><i class="fa fa-check"></i><i class="fa fa-user-friends"></i>People</a>
				</li>
				
				<li role="presentation">
					<a class="show-places-panel"><i class="fa fa-check"></i><i class="fa fa-map-marker-alt"></i>Places</a>
				</li>

				<li role="presentation">
					<a class="show-favorites-panel"><i class="fa fa-check"></i><i class="fa fa-map-pin"></i>Favorites</a>
				</li>

				<li role="presentation">
					<a class="show-shared-panel"><i class="fa fa-check"></i><i class="fa fa-share"></i>Shared</a>
				</li>
			</ul>
		</li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-th"></i>Sidebar Items<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="sidebar-view-kind dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="view-sidebar-icons"><i class="fa fa-check"></i><i class="fa fa-th"></i>Icons</a>
				</li>
				
				<li role="presentation">
					<a class="view-sidebar-lists"><i class="fa fa-check"></i><i class="fa fa-list"></i>Lists</a>
				</li>

				<li role="presentation">
					<a class="view-sidebar-trees"><i class="fa fa-check"></i><i class="fa fa-tree"></i>Trees</a>
				</li>

				<li role="presentation">
					<a class="view-sidebar-cards"><i class="fa fa-check"></i><i class="fa fa-id-card"></i>Cards</a>
				</li>

				<li role="presentation">
					<a class="view-sidebar-tiles"><i class="fa fa-check"></i><i class="fa fa-th-large"></i>Tiles</a>
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
		'click .show-toolbars > a': 'onClickShowToolbars',
		'click .show-toolbar > li > a': 'onClickShowToolbar',

		// layer options
		//
		'click .show-layers a': 'onClickShowLayer',
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
		'click .show-sidebar': 'onClickOption',
		'click .show-image-info': 'onClickOption',
		'click .show-sidebar-panels a': 'onClickShowSideBarPanel',
		'click .sidebar-view-kind a': 'onClickSideBarViewKind',

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
		this.parent.app.setOption('layers', true);
		this.$el.find('.show-layers li').addClass('selected');
	},

	onClickShowNoLayers: function() {
		this.parent.app.setOption('layers', false);
		this.$el.find('.show-layers li').removeClass('selected');
	}
});