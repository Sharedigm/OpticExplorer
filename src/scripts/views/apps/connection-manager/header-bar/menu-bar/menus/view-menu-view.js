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
		'click .view-kind > a': 'onClickViewKind',
		'click .map-mode > a': 'onClickMapMode',

		// toolbar options
		//
		'click .show-toolbars': 'onClickShowToolbars',
		'click .show-toolbar > a': 'onClickShowToolbar',

		// details options
		//
		'click .view-details': 'onClickViewDetails',
		'click .detail-kind > a': 'onClickDetailKind',
		'click .date-format > a': 'onClickDateFormat',

		// map options
		//
		'click .map-view-kind > a': 'onClickMapViewKind',
		'click .show-item-names': 'onClickOption',
		'click .pan-north': 'onClickPanNorth',
		'click .pan-south': 'onClickPanSouth',
		'click .pan-east': 'onClickPanEast',
		'click .pan-west': 'onClickPanWest',
		'click .zoom-in': 'onClickZoomIn',
		'click .zoom-out': 'onClickZoomOut',
		'click .reset-view': 'onClickResetView',

		// sidebar options
		//
		'click .show-sidebar': 'onClickShowSidebar',
		'click .show-sidebar-panel > a': 'onClickShowSideBarPanel',
		'click .sidebar-view-kind > a': 'onClickSideBarViewKind',
		'click .sidebar-tile-size > a': 'onClickSideBarTileSize',

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

	hidden: function() {
		return {
			'view-maps': !this.parent.app.collection.hasGeolocation()
		};
	},

	disabled: function() {
		let preferences = this.parent.app.preferences;
		let showingMap = preferences.get('view_kind') == 'maps';

		return {
			'pan-to': !showingMap,
			'pan-north': !showingMap,
			'pan-south': !showingMap,
			'pan-east': !showingMap,
			'pan-west': !showingMap,
			'zoom-to': !showingMap,
			'zoom-in': !showingMap,
			'zoom-out': !showingMap,
			'reset-view': !showingMap
		};
	},

	selected: function() {
		let preferences = this.parent.app.preferences;
		let mapMode = preferences.get('map_mode');
		let viewKind = preferences.get('view_kind');
		let toolbars = preferences.get('toolbars') || [];
		let detailKind = preferences.get('detail_kind');
		let dateFormat = preferences.get('date_format');
		let mapViewKind = preferences.get('map_view_kind');
		let sidebarPanels = preferences.get('sidebar_panels') || [];
		let sidebarViewKind = preferences.get('sidebar_view_kind');

		return {

			// view options
			//
			'view-icons': !viewKind || viewKind == 'icons',
			'view-names': viewKind == 'names',
			'view-lists': viewKind == 'lists',
			'view-trees': viewKind == 'trees',
			'view-cards': viewKind == 'cards',
			'view-tiles': viewKind == 'tiles',
			'view-maps': viewKind == 'maps',

			// map options
			//
			'show-map': mapMode == 'map',
			'show-satellite': mapMode == 'satellite',
			'show-hybrid': mapMode == 'hybrid',
			'show-streets': mapMode == 'streets',
			'show-transportation': mapMode == 'transportation',
			'show-sectional': mapMode == 'sectional',
			'show-ifrlo': mapMode == 'ifrlo',
			'show-ifrhi': mapMode == 'ifrhi',

			// toolbar options
			//
			'show-toolbars': toolbars.length > 0,
			'show-nav-bar': toolbars.includes('nav'),

			// detail options
			//
			'view-details': typeof detailKind == 'string' && detailKind != '',
			'view-location': detailKind == 'location',
			'view-occupation': detailKind == 'occupation',
			'view-age': detailKind == 'age',
			'view-gender': detailKind == 'gender',
			'view-birth-date': detailKind == 'birth_date',
			'view-join-date': detailKind == 'join_date',
			'view-connect-date': detailKind == 'connect_date',

			// date options
			//
			'view-date-only': dateFormat == 'date_only',
			'view-day-date': dateFormat == 'day_date',
			'view-time-only': dateFormat == 'time_only',
			'view-date-time': dateFormat == 'date_time',
			'view-day-date-time': dateFormat == 'day_date_time' || !dateFormat,

			// map item options
			//
			'view-map-icons': mapViewKind == 'icons',
			'view-map-lists': mapViewKind == 'lists',
			'view-map-cards': mapViewKind == 'cards',
			'view-map-tiles': mapViewKind == 'tiles',
			'view-map-pages': mapViewKind == 'pages',
			'show-item-names': preferences.get('show_item_names'),

			// sidebar options
			//
			'show-sidebar': preferences.get('show_sidebar'),
			'show-actions-panel': sidebarPanels.includes('actions'),
			'show-groups-panel': sidebarPanels.includes('groups'),

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

	setMapMode: function(mapMode) {
		this.$el.find('li.map-mode').removeClass('selected');
		this.$el.find('li .show-' + mapMode).closest('li').addClass('selected');
	},

	//
	// map event handling methods
	//

	onClickMapMode: function(event) {
		let className = $(event.currentTarget).attr('class').split(' ')[0];
		let mapMode = className.replace('show-', '').replace(/-/g, '_');

		// update menu
		//
		this.setMapMode(mapMode);
		if (!this.isItemSelected('view-maps')) {
			this.setViewKind('maps');
		}
		
		// update parent
		//
		this.parent.app.setOption('map_mode', mapMode);
	},

	onClickResetView: function() {
		this.parent.app.getChildView('content').getChildView('items').resetView();
	},
	
	//
	// pan event handling methods
	//

	onClickPanNorth: function() {
		let itemsView = this.parent.app.getChildView('content').getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').panToDirection('north', {
				duration: 1000
			});
		}
	},

	onClickPanSouth: function() {
		let itemsView = this.parent.app.getChildView('content').getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').panToDirection('south', {
				duration: 1000
			});
		}
	},

	onClickPanEast: function() {
		let itemsView = this.parent.app.getChildView('content').getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').panToDirection('east', {
				duration: 1000
			});
		}
	},
	
	onClickPanWest: function() {
		let itemsView = this.parent.app.getChildView('content').getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').panToDirection('west', {
				duration: 1000
			});
		}
	},

	//
	// zoom event handling methods
	//

	onClickZoomIn: function() {
		let itemsView = this.parent.app.getChildView('content').getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').zoomIn({
				duration: 1000
			});
		}
	},

	onClickZoomOut: function() {
		let itemsView = this.parent.app.getChildView('content').getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').zoomOut({
				duration: 1000
			});
		}
	}
});