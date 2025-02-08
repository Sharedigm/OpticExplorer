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
		'click .map-view-kind > a': 'onClickMapViewKind',

		// toolbar options
		//
		'click .show-toolbars': 'onClickShowToolbars',
		'click .show-toolbar > a': 'onClickShowToolbar',

		// item options
		//
		'click .show-hidden-files': 'onClickShowHiddenFiles',
		'click .show-thumbnails': 'onClickOption',
		'click .show-image-names': 'onClickOption',
		'click .show-file-extensions': 'onClickOption',

		// property options
		//
		'click li.show-properties > a': 'onClickShowProperties',
		'click li.show-property > a': 'onClickShowProperty',

		// details options
		//
		'click .view-details': 'onClickViewDetails',
		'click .detail-kind > a': 'onClickDetailKind',
		'click .date-format > a': 'onClickDateFormat',

		// map options
		//
		'click .map-mode > a': 'onClickMapMode',
		'click .pan-north': 'onClickPanNorth',
		'click .pan-south': 'onClickPanSouth',
		'click .pan-east': 'onClickPanEast',
		'click .pan-west': 'onClickPanWest',
		'click .zoom-in': 'onClickZoomIn',
		'click .zoom-out': 'onClickZoomOut',
		'click .reset-view': 'onClickResetView',
		'click .map-item-kind > a': 'onClickMapItemKind',
		'click .show-item-names': 'onClickOption',
		'click .show-geo-orientations': 'onClickOption',

		// sidebar options
		//
		'click .show-sidebar': 'onClickShowSidebar',
		'click .show-sidebar-panel > a': 'onClickShowSideBarPanel',
		'click .sidebar-view-kind > a': 'onClickSideBarViewKind',

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

	visible: function() {
		let isDesktop = this.parent.app.isDesktop();
		let hasSpaces = isDesktop && this.parent.app.hasSpaces();
		let numFiles = this.parent.app.model.get('num_files');
		let isWindowed = !isDesktop;
		let hasMapViewer = application.hasApp('map_viewer');

		return _.extend({}, ViewMenuView.prototype.visible.call(this), {
			'view-gallery': numFiles && numFiles.image > 0,
			'view-audio': numFiles && numFiles.audio > 0,
			'view-photo': numFiles && numFiles.image > 0,
			'view-video': numFiles && numFiles.video > 0,
			'view-maps': hasMapViewer,
			'map-items': hasMapViewer,
			'toolbars': true,

			// window items
			//
			'window-size': isWindowed,
			'spaces': hasSpaces,
			'windows': isDesktop,
			'view-full-screen': isDesktop
		});
	},

	enabled: function() {
		let preferences = this.parent.app.preferences;
		let showingMap = preferences.get('view_kind') == 'maps';

		return {
			'pan-to': showingMap,
			'pan-north': showingMap,
			'pan-south': showingMap,
			'pan-east': showingMap,
			'pan-west': showingMap,
			'zoom-to': showingMap,
			'zoom-in': showingMap,
			'zoom-out': showingMap,
			'reset-view': showingMap
		};
	},

	selected: function() {
		let preferences = this.parent.app.preferences;
		let isDesktop = this.parent.app.isDesktop();
		let viewKind = preferences.get('view_kind');
		let mapMode = preferences.get('map_mode');
		let toolbars = preferences.get('toolbars') || [];
		let properties = preferences.get('properties') || [];
		let detailKind = preferences.get('detail_kind');
		let dateFormat = preferences.get('date_format');
		let mapViewKind = preferences.get('map_view_kind');
		let sidebarPanels = preferences.get('sidebar_panels') || [];
		let sidebarViewKind = preferences.get('sidebar_view_kind');

		return {

			// view options
			//
			'view-icons': viewKind == 'icons',
			'view-names': viewKind == 'names',
			'view-lists': viewKind == 'lists',
			'view-trees': viewKind == 'trees',
			'view-cards': viewKind == 'cards',
			'view-tiles': viewKind == 'tiles',
			'view-pages': viewKind == 'pages',
			'view-gallery': viewKind == 'gallery',
			'view-maps': viewKind == 'maps',

			// map options
			//
			'view-map': mapMode == 'map',
			'view-aerial': mapMode == 'aerial',
			'view-satellite': mapMode == 'satellite',
			'view-hybrid': mapMode == 'hybrid',
			'view-streets': mapMode == 'streets',
			'view-transportation': mapMode == 'transportation',
			'view-sectional': mapMode == 'sectional',
			'view-ifrlo': mapMode == 'ifrlo',
			'view-ifrhi': mapMode == 'ifrhi',

			// toolbar options
			//
			'show-toolbars': toolbars.length > 0,
			'show-nav-bar': toolbars.includes('nav'),
			'show-sharing-bar': toolbars.includes('sharing'),
			'show-indexing-bar': toolbars.includes('indexing'),

			// item attributes
			//
			'show-hidden-files': preferences.get('show_hidden_files') == true,
			'show-file-extensions': preferences.get('show_file_extensions') == true,
			'show-thumbnails': preferences.get('show_thumbnails') == true,
			'show-image-names': preferences.get('show_image_names') == true,

			// item properties
			//
			'show-properties': properties.length > 0,
			'show-places': properties.includes('places'),
			'show-links': properties.includes('links'),
			'show-shares': properties.includes('shares'),
			'show-owners': properties.includes('owners'),
			'show-indices': properties.includes('indices'),

			// map item options
			//
			'view-map-icons': mapViewKind == 'icons',
			'view-map-lists': mapViewKind == 'lists',
			'view-map-cards': mapViewKind == 'cards',
			'view-map-tiles': mapViewKind == 'tiles',
			'view-map-pages': mapViewKind == 'pages',
			'show-item-names': preferences.get('show_item_names'),
			'show-geo-orientations': preferences.get('show_geo_orientations'),

			// detail options
			//
			'view-details': typeof detailKind == 'string' && detailKind != '',
			'view-size': detailKind == 'size',
			'view-create-date': detailKind == 'create_date',
			'view-modify-date': detailKind == 'modify_date',
			'view-access-date': detailKind == 'access_date',
			'view-date-only': dateFormat == 'date_only',
			'view-day-date': dateFormat == 'day_date',
			'view-time-only': dateFormat == 'time_only',
			'view-date-time': dateFormat == 'date_time',
			'view-day-date-time': dateFormat == 'day_date_time' || !dateFormat,
			'view-resolution': detailKind == 'resolution',
			'view-make-model': detailKind == 'make_model',
			'view-focal-length': detailKind == 'focal_length',
			'view-exposure': detailKind == 'exposure',
			'view-aperture': detailKind == 'aperture',
			'view-iso': detailKind == 'iso',
			'view-capture-date': detailKind == 'capture_date',

			// sidebar options
			//
			'show-sidebar': isDesktop? preferences.get('show_desktop_sidebar') : preferences.get('show_sidebar'),
			'show-clipboard-panel': sidebarPanels.includes('clipboard'),
			'show-favorites-panel': sidebarPanels.includes('favorites'),
			'show-files-panel': sidebarPanels.includes('files'),
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
	// getting methods
	//

	getProperties: function() {
		return this.getElementAttributes('.show-properties li a', 'class', (value) => {
			return value.replace('show-', '').replace(/-/g, '_');
		});
	},

	getSelectedProperties: function() {
		return this.getElementAttributes('.show-properties li.selected a', 'class', (value) => {
			return value.replace('show-', '').replace('-bar', '').replace(/-/g, '_');
		});
	},

	//
	// setting methods
	//

	setOption: function(className, value) {
		let option = className.replace(/-/g, '_');

		// call superclass method
		//
		this.setItemSelected(className, value);

		// update parent
		//
		this.parent.app.setOption(option, value);
	},

	toggleOption: function(className) {
		let option = className.replace(/-/g, '_');

		// call superclass method
		//
		this.toggleMenuItem(className);

		// update parent
		//
		this.parent.app.setOption(option, this.isItemSelected(className));
	},

	toggleProperty: function(property) {

		// call superclass method
		//
		this.toggleMenuItem('show-' + property);

		// update parent
		//
		this.parent.app.setOption('properties', this.getSelectedProperties());
	},

	setMapMode: function(mapMode) {
		this.$el.find('li.map-mode').removeClass('selected');
		this.$el.find('li .view-' + mapMode).closest('li').addClass('selected');
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ViewMenuView.prototype.onRender.call(this);

		// listen for changes in full screen status
		//
		if (this.parent.app.isDesktop()) {
			$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', () => {
				this.setItemSelected('view-full-screen', application.isFullScreen());						
			});
		}
	},

	//
	// map event handling methods
	//

	onClickMapMode: function(event) {
		let className = $(event.currentTarget).attr('class').split(' ')[0];
		let mapMode = className.replace('view-', '').replace(/-/g, '_');

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
		this.parent.app.getActiveView().getChildView('items').resetView();
	},

	//
	// pan event handling methods
	//

	onClickPanNorth: function() {
		let itemsView = this.parent.app.getActiveView().getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').panToDirection('north', {
				duration: 1000
			});
		}
	},

	onClickPanSouth: function() {
		let itemsView = this.parent.app.getActiveView().getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').panToDirection('south', {
				duration: 1000
			});
		}
	},

	onClickPanEast: function() {
		let itemsView = this.parent.app.getActiveView().getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').panToDirection('east', {
				duration: 1000
			});
		}
	},
	
	onClickPanWest: function() {
		let itemsView = this.parent.app.getActiveView().getChildView('items');
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
		let itemsView = this.parent.app.getActiveView().getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').zoomIn({
				duration: 1000
			});
		}
	},

	onClickZoomOut: function() {
		let itemsView = this.parent.app.getActiveView().getChildView('items');
		if (itemsView && itemsView.hasChildView('map')) {
			itemsView.getChildView('map').zoomOut({
				duration: 1000
			});
		}
	},

	//
	// view option event handling methods
	//

	onClickShowProperties: function() {
		let showProperties = this.isItemSelected('show-properties');

		// update menu
		//
		this.toggleMenuItem('show-properties');
		if (!showProperties) {
			this.$el.find('.show-properties li').addClass('selected');
		} else {
			this.$el.find('.show-properties li').removeClass('selected');
		}

		// update view
		//
		this.parent.app.setOption('properties', showProperties? [] : this.getProperties());
	},

	onClickShowProperty: function(event) {
		let className = $(event.currentTarget).attr('class');

		// update menu
		//
		this.toggleMenuItem(className);

		// update view
		//
		this.parent.app.setOption('properties', this.getSelectedProperties());
	},

	onClickShowHiddenFiles: function() {
		this.toggleOption('show-hidden-files');
	},

	onClickShowMagnified: function() {
		this.setOption('view-magnified', true);
	},

	onClickShowUnmagnified: function() {
		this.setOption('view-magnified', false);
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		$(document).off('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange');
	}
});