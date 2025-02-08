/******************************************************************************\
|                                                                              |
|                              map-viewer-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for viewing image maps.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Place from '../../../models/places/place.js';
import Item from '../../../models/storage/item.js';
import File from '../../../models/storage/files/file.js';
import MapFile from '../../../models/storage/files/map-file.js';
import ImageFile from '../../../models/storage/media/image-file.js';
import VideoFile from '../../../models/storage/media/video-file.js';
import Directory from '../../../models/storage/directories/directory.js';
import User from '../../../models/users/user.js';
import Places from '../../../collections/places/places.js';
import Items from '../../../collections/storage/items.js';
import USCensusGeocoding from '../../../views/apps/map-viewer/mainbar/maps/behaviors/geocoding/us-census-geocoding.js';
import GoogleGeocoding from '../../../views/apps/map-viewer/mainbar/maps/behaviors/geocoding/google-geocoding.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import Multifile from '../../../views/apps/common/behaviors/tabbing/multifile.js';
import ItemOpenable from '../../../views/apps/common/behaviors/opening/item-openable.js';
import SelectableContainable from '../../../views/behaviors/containers/selectable-containable.js';
import MultiSelectable from '../../../views/behaviors/selection/multi-selectable.js';
import ItemShareable from '../../../views/apps/common/behaviors/sharing/item-shareable.js';
import ItemInfoShowable from '../../../views/apps/file-browser/dialogs/info/behaviors/item-info-showable.js';
import ConnectionInfoShowable from '../../../views/apps/connection-manager/dialogs/info/behaviors/connection-info-showable.js';
import FileDownloadable from '../../../views/apps/file-browser/mainbar/behaviors/file-downloadable.js';
import FileUploadable from '../../../views/apps/file-browser/mainbar/behaviors/file-uploadable.js';
import FileDisposable from '../../../views/apps/file-browser/mainbar/behaviors/file-disposable.js';
import DropboxUploadable from '../../../views/apps/file-browser/mainbar/behaviors/dropbox-uploadable.js';
import GDriveUploadable from '../../../views/apps/file-browser/mainbar/behaviors/gdrive-uploadable.js';
import PhotoMappable from '../../../views/apps/map-viewer/behaviors/photo-mappable.js';
import VideoMappable from '../../../views/apps/map-viewer/behaviors/video-mappable.js';
import OverlayMappable from '../../../views/apps/map-viewer/behaviors/overlay-mappable.js';
import PlaceMappable from '../../../views/apps/map-viewer/behaviors/place-mappable.js';
import FavoriteMappable from '../../../views/apps/map-viewer/behaviors/favorite-mappable.js';
import PersonMappable from '../../../views/apps/map-viewer/behaviors/person-mappable.js';
import HeaderBarView from '../../../views/apps/map-viewer/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/map-viewer/sidebar/sidebar-view.js';
import TabbedContentView from '../../../views/apps/map-viewer/mainbar/tabbed-content/tabbed-content-view.js';
import FooterBarView from '../../../views/apps/map-viewer/footer-bar/footer-bar-view.js';
import ContextMenuView from '../../../views/apps/map-viewer/context-menus/context-menu-view.js';
import ItemsMapView from '../../../views/apps/map-viewer/mainbar/maps/items-map-view.js';
import DirectoryMapView from '../../../views/apps/map-viewer/mainbar/maps/directory-map-view.js';
import SelectPlaceDialogView from '../../../views/apps/map-viewer/dialogs/places/select-place-dialog-view.js';
import CheckInDialogView from '../../../views/apps/map-viewer/dialogs/places/check-in-dialog-view.js';
import PreferencesFormView from '../../../views/apps/map-viewer/forms/preferences/preferences-form-view.js'

export default AppSplitView.extend(_.extend({}, FileDownloadable, FileUploadable, FileDisposable, ItemOpenable, Multifile, SelectableContainable, MultiSelectable, ItemShareable, ItemInfoShowable, ConnectionInfoShowable, PhotoMappable, VideoMappable, OverlayMappable, PersonMappable, PlaceMappable, FavoriteMappable, DropboxUploadable, GDriveUploadable, {

	//
	// attributes
	//
	
	name: 'map_viewer',

	events: {
		'click > .body': 'onClick',
		'change > .body input[type="file"]': 'onChangeFile',
		'contextmenu > .body': 'onContextMenu'
	},

	minZoom: 1,
	maxZoom: 10,
	changed: false,
	default_zoom_level: 9,
	layers: ['photos', 'videos', 'overlays', 'people', 'places', 'favorites'],

	//
	// dialog attributes
	//

	highlightable: false,

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);

		// set model
		//
		this.setItem();
		if (this.options.items) {
			this.setItems(this.options.items);
		}
		if (this.collection && !this.model) {
			this.model = this.collection.at(0);
		}
		if (!this.model) {
			this.model = new MapFile();
		}

		// create collections
		//
		if (!this.collection) {
			this.collection = new Items([this.model]);
		}

		// create favorites collection
		//
		this.favorites = new Places();

		// disable sorting of tabs
		//
		this.collection.comparator = null;

		// set attributes
		//
		this.directory = this.model.parent || new Directory({
			path: this.preferences.get('home_directory')
		});
	},


	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasActiveView()) {
			let activeView = this.getActiveView();
			if (activeView.each) {
				activeView.each(callback, filter, options);
			}
		}
	},

	//
	// attribute methods
	//

	title: function() {
		return this.directory? (this.directory.getName() || 'Maps'): config.apps[this.name].name;	
	},
	
	//
	// querying methods
	//

	canFindCurrentLocation: function() {
		return navigator.geolocation && window.location.protocol == 'https:';
	},

	hasChanged: function() {
		return this.hasActiveModel() && !this.getActiveModel().isNew();
	},

	hasItems: function(kind) {
		return this.hasActivePaneView() && this.getActivePaneView().hasItems(kind);
	},

	hasMapView: function() {
		return this.hasActivePaneView();
	},

	hasSelected: function() {
		return this.hasSelectedItems() || this.hasActiveSelected();
	},

	hasSelectedItems: function(kind) {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').hasSelectedItems(kind);
		}
	},

	hasSelectedMapItems: function(kind) {
		return (this.hasActivePaneView() && this.getActivePaneView().hasSelectedItems(kind));
	},

	hasActiveSelected: function() {
		return (this.hasActivePaneView() && this.getActivePaneView().hasSelected());
	},

	hasLayerView: function(layer) {
		return this.hasActivePaneView() && this.getActivePaneView().hasLayerView(layer);
	},

	hasSelectedLayerItems: function(layer) {
		return this.hasLayerView(layer) && this.getLayerView(layer).hasSelected();
	},

	//
	// counting methods
	//

	numSelectedLayerItems: function(layer) {
		return this.hasLayerView(layer) && this.getLayerView(layer).numSelected();
	},

	//
	// getting methods
	//

	getModel: function() {
		return this.model;
	},

	getValue: function() {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().toKML();
		}
	},

	getActiveViewport: function() {
		return this.getActivePaneView().getChildView('content map');
	},

	getLatLon: function() {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().getLatLon();
		}
	},

	getZoomLevel: function() {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().getZoomLevel();
		}
	},

	getMapBounds: function() {
		if (this.hasActivePaneView()) {
			return this.getActiveViewport().getMapBounds();
		}
	},

	getMapMode: function() {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().getMapMode();
		}
	},

	getAeroMode: function() {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().getAeroMode();
		}
	},

	getMapView: function() {
		return this.getActivePaneView();
	},

	getItemView: function(model) {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().getItemView(model);
		}
	},

	getSelectedItem: function(layers) {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().getSelectedItem(layers);
		}
	},

	getSelectedItemModels: function() {
		return this.getChildView('sidebar').getSelectedModels();
	},

	getSelectedModels: function() {

		// get selected from mainbar
		//
		if (this.hasActivePaneView() && this.getActivePaneView().hasSelected()) {
			return this.getActivePaneView().getSelectedModels();

		// get selected from sidebar
		//
		} else if (this.hasSelectedItems()) {
			return this.getSelectedMapModels();

		// return current active model
		//
		} else if (this.hasActiveModel() && this.getActiveModel().isSaved()) {
			return [this.getActiveModel()];
		}

		return [];
	},

	getSideBarItemView: function(model) {
		return this.getChildView('sidebar').getItemView(model);
	},

	getSelectedMapModels: function() {
		return this.getChildView('sidebar').getChildView('maps').getChildView('items').getSelectedModels();
	},

	//
	// layer getting methods
	//

	getLayerView: function(layer) {
		if (this.hasLayerView(layer)) {
			return this.getActivePaneView().getLayerView(layer);
		}
	},

	getLayerItemView: function(layer, model) {
		if (this.hasLayerView(layer)) {
			return this.getLayerView(layer).getItemView(model);
		} else {
			return this.getMapItemView(model);
		}
	},
	
	getSelectedLayerItems: function(layer) {
		if (this.hasLayerView(layer)) {
			return this.getLayerView(layer).getSelected();
		}
	},

	getSelectedLayerModels: function(layer) {
		if (this.hasLayerView(layer)) {
			return this.getLayerView(layer).getSelectedModels();
		} else if (layer == 'overlays') {
			return this.getActiveView().getSelectedModels();
		}
	},

	//
	// overlay getting methods
	//

	getMapItemView: function(model) {
		return this.getActiveView().getLayerView('map').getItemView(model);
	},

	//
	// file getting methods
	//

	getHomeDirectory: function() {
		if (application.isSignedIn()) {

			// use directory from preferences
			//
			return application.getDirectory(this.preferences.get('home_directory'));
		} else if (this.model && this.model.parent) {

			// use directory from current file
			//
			return this.model.parent;
		} else {

			// use home directory
			//
			return application.getDirectory();
		}
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// setting methods
	//

	setItem: function() {
		if (this.model instanceof ImageFile && !this.model.hasGeoposition()) {
			this.options.photos = [this.model];
			this.model = null;
		}
		if (this.model instanceof VideoFile) {
			this.options.videos = [this.model];
			this.model = null;
		}
		if (this.model instanceof ImageFile && this.model.hasGeoposition()) {
			this.options.overlays = [this.model];
			this.model = null;
		}
		if (this.model && !(this.model instanceof MapFile)) {
			this.options.items = [this.model];
			this.model = null;
		}
	},

	setItems: function(items) {
		if (!items) {
			return;
		}
		this.options.items = [];
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			if (item instanceof ImageFile) {
				if (!this.options.photos) {
					this.options.photos = [];
				}
				this.options.photos.push(item);
			} else if (item instanceof VideoFile) {
				if (!this.options.photos) {
					this.options.photos = [];
				}
				this.options.videos.push(item);
			} else {
				this.options.items.push(item);
			}
		}
	},

	setPreferences: function(preferences) {

		// set rendering preferences
		//
		this.options.icon_size = preferences.get('icon_size');
		this.options.map_view_kind = preferences.get('map_view_kind');
		this.options.sidebar_view_kind = preferences.get('sidebar_view_kind');

		// create uploads directory from preferences
		//
		this.uploadsDirectory = new Directory({
			path: this.preferences.get('uploads_directory')
		});

		// set uploading attributes
		//
		this.dropBoxDirectory = new Directory({
			path: this.preferences.get('dropbox_directory')
		});
		this.googleDirectory = new Directory({
			path: this.preferences.get('google_directory')
		});

		// make sure that uploads directory exists
		//
		if (application.isSignedIn()) {
			this.uploadsDirectory.create();
		}
	},

	setCurrentLocation: function() {
		navigator.geolocation.getCurrentPosition((position) => {
			this.setLocation(position.coords.latitude, -position.coords.longitude);
		}, () => {

			// show notification
			//
			application.notify({
				icon: '<i class="fa fa-compass"></i>',
				title: 'Geolocation Error',
				message: "Unable to get current location."
			});
		});
	},

	setOption: function(key, value) {
		switch (key) {

			// map mode options
			//
			case 'map_mode':
				this.setMapMode(value);
				this.preferences.set(key, value);
				break;

			case 'map_view_kind':
				this.setViewKind(value);
				this.preferences.set(key, value);
				break;

			// layer options
			//
			case "layers":
				this.setLayersVisible(value);
				this.preferences.set(key, value);
				break;

			// map options
			//
			case 'show_grid':
			case 'show_smoothing':
			case 'show_item_names':
			case 'show_geo_orientations':
				this.getActivePaneView().getChildView('content').setOption(key, value);
				this.preferences.set(key, value);
				break;

			// other options
			//
			default:

				// call superclass method
				//
				AppSplitView.prototype.setOption.call(this, key, value);
				break;
		}
	},

	setDirectory: function(directory) {

		// set attributes
		//
		this.directory = directory;

		// set sidebar
		//
		this.getChildView('sidebar maps').setDirectory(directory);
	},

	//
	// toolbar setting methods
	//

	setToolbarsVisible: function(visible) {

		// call superclass method
		//
		AppSplitView.prototype.setToolbarsVisible.call(this, visible);

		// show / hide main toolbar
		//
		if (visible == true) {
			this.setMainToolbarVisible(true);
		} else if (visible == false) {
			this.setMainToolbarVisible(false);
		} else if (visible.includes('map')) {
			this.setMainToolbarVisible(true);
		} else {
			this.setMainToolbarVisible(false);
		}
	},

	//
	// layer option setting methods
	//

	setLayersVisible: function(layers) {
		this.preferences.set('map_layers', layers);

		if (layers.length == 0) {
			this.setAllLayersVisibility(false);
			return;
		}

		// update content
		//
		let visible = layers.length > 0? layers.includes('crosshairs') : layers;
		this.getActivePaneView().setShowCrosshairs(visible);
		this.getActivePaneView().setLayersVisible(layers);

		// update layers toolbar
		//
		if (this.hasChildView('header layers')) {
			this.getChildView('header layers').setLayersSelected(layers);
		}
	},

	setLayerVisibility: function(layer, visible) {

		// update content
		//
		if (layer == 'crosshairs') {
			this.getActivePaneView().setShowCrosshairs(visible);
		} else if (layer == 'all') {
			this.getActivePaneView().setShowCrosshairs(visible);
			this.getActivePaneView().getChildView('content').setAllLayersVisibility(visible);
		} else {
			this.getActivePaneView().getChildView('content').setLayerVisibility(layer, visible);
		}

		// update layers toolbar
		//
		if (this.hasChildView('header layers')) {
			this.getChildView('header layers').setLayerSelected(layer, visible);
		}
	},

	setAllLayersVisibility: function(visible) {
		this.setLayerVisibility('all', visible);
	},

	//
	// full screen methods
	//

	toggleFullScreen: function() {
		if (this.hasMapView()) {
			this.getMapView().toggleFullScreen();
		}
	},

	//
	// map option setting methods
	//

	setShowSmoothing: function(smoothing) {
		this.getLayerView('map').setSmoothing(smoothing);
	},

	setShowGrid: function(showGrid) {
		this.getLayerView('map').setShowGrid(showGrid);
	},

	setMapMode: function(mapMode) {

		// set active pane's map mode
		//
		if (this.getActivePaneView()) {
			this.getActivePaneView().setOption('map_mode', mapMode);
		}

		// update toolbar
		//
		this.getToolbarView().setMapMode(mapMode);
	},

	setViewKind: function(viewKind) {

		// set active pane's view kind
		//
		if (this.getActivePaneView()) {
			this.getActivePaneView().setOption('map_view_kind', viewKind);
		}

		// update toolbar
		//
		this.getToolbarView().setViewKind(viewKind);
	},

	setPlace: function(place) {
		let latitude = place.get('latitude');
		let longitude = place.get('longitude');
		this.setLocation({
			latitude: latitude, 
			longitude: longitude
		});
		this.setZoomLevel(place.get('zoom_level'));
	},

	setLocation: function(latitude, longitude) {
		this.getLayerView('map').setLocation(latitude, longitude);
	},

	setZoomLevel: function(zoomLevel) {
		this.getChildView('header zoom').setZoom(zoomLevel);
	},

	setOffset: function(offset) {
		this.getLayerView('map').setOffset(offset);
	},

	setItemSelected: function(name, selected) {
		this.getChildView('content').setItemSelected(name, selected);
	},

	resetView: function() {
		this.zoomToPlace(this.getActivePaneView().place, {
			duration: this.preferences.get('zoom_to_duration') * 1000
		});
	},

	//
	// navigating methods
	//

	pushDirectory: function(directory) {
		this.getChildView('header nav').pushDirectory(directory);
	},

	//
	// map creating methods
	//

	newTab: function() {
		this.newFile();
	},

	newFile: function() {

		// open new file
		//
		this.loadFile(new MapFile());
	},

	newFolder: function() {
		this.directory.newDirectory({

			// callbacks
			//
			success: (model) => {
			
				// play new sound
				//
				application.play('new');

				// add grow effect
				//
				let itemView = this.getSideBarItemView(model);
				if (itemView.grow) {

					// edit directory name after grow
					//
					itemView.grow(() => itemView.setEditable());
				} else {

					// edit directory name
					//
					itemView.setEditable();
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not create new directory.",
					response: response
				});
			}
		});
	},

	//
	// map opening methods
	//

	openMap: function(file, options) {

		// check if item is already open
		//
		if (this.isAlreadyOpen(file)) {

			// activate existing tab
			//
			this.setActiveModel(file);

		// load new map
		//
		} else {

			// open map
			//
			this.loadFile(file);
		}

		// perform callback
		//
		if (options && options.success) {
			options.success(file);
		}
	},

	//
	// file opening methods
	//

	openFile: function(file, options) {
		if (file instanceof MapFile) {

			// open map
			//
			this.openMap(file, options);
		} else {

			// open file
			//
			ItemOpenable.openFile.call(this, file, options);
		}
	},

	openItem: function(item, options) {

		// open map
		//
		if (item instanceof MapFile) {
			this.openMap(item, options);

		// show image
		//
		} else if (item instanceof File) {
			this.openFile(item, options);

		// show person
		//
		} else if (item instanceof User) {
			application.showUser(item, options);

		// show files, directories
		//
		} else {
			ItemOpenable.openItem(item, options);
		}
	},

	openSelected: function() {

		// if no selected items, show open dialog
		//
		if (!this.hasSelected()) {
			this.showOpenDialog();
		} else {
			let selected = this.getSelectedModels();
			let item = selected[0];
			this.openItem(item);
		}
	},

	//
	// file downloading methods
	//

	downloadSelected: function() {
		let selected = this.getSelectedModels();
		if (selected && selected.length > 0) {

			// download selected items
			//
			this.download(selected);

			// play download sound
			//
			application.play('download');
		} else {

			// show notification dialog
			//
			application.notify({
				message: "You must first save this map in order for it to be downloadable."
			});
		}
	},

	//
	// file deleting methods
	//

	deleteItems: function(items, options) {

		// check if there are items to delete
		//
		if (items.length == 0) {

			// show notification
			//
			application.notify({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete Error",
				message: "No items selected."
			});

			return;
		}

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete",
				message: "Are you sure you want to delete " + (items.length == 1? '"' + items[0].getName() + '"' : "these " + items.length + " items") + "?",

				// callbacks
				//
				accept: () => {
					this.deleteItems(items, _.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {
			this.getChildView('sidebar maps items').deleteItems(items, {

				// callbacks
				//
				success: () => {

					// play delete sound
					//
					application.play('delete');
				}
			});
		}
	},

	//
	// navigating methods
	//

	zoomToLocation: function(options) {
		navigator.geolocation.getCurrentPosition((position) => {
			this.zoomToPlace(new Place({
				latitude: position.coords.latitude,
				longitude: -position.coords.longitude,
				zoom_level: 9.5
			}), options);
		}, () => {

			// show notification
			//
			application.notify({
				icon: '<i class="fa fa-compass"></i>',
				title: 'Geolocation Error',
				message: "Unable to get current location."
			});
		});
	},

	zoomTo: function(zoomLevel) {
		this.getLayerView('map').zoomTo(zoomLevel, {
			duration: this.preferences.get('zoom_duration')
		});
	},

	zoomToItem: function(item) {
		let latLon = item.getLatLon();

		// zoom to item location
		//
		this.zoomToPlace(new Place({
			latitude: latLon.latitude,
			longitude: latLon.longitude,
			zoom_level: 9
		}));
	},

	panToDirection: function(direction) {
		this.getLayerView('map').panToDirection(direction, {
			duration: this.preferences.get('pan_duration')
		});
	},

	//
	// animating methods
	//

	panToPlace: function(place, options) {
		let mapView = this.getLayerView('map');
		let map = mapView.map;
		let mapSize = mapView.getMapSize();
		let start = mapView.getMapCoords().plus(mapView.offset);
		let finish = map.projection.latLonToVector2({
			latitude: place.get('latitude'),
			longitude: place.get('longitude')
		}).plus(mapView.offset);
		let direction = start.minus(finish);
		let distance = direction.length();
		let duration = 0;

		// find zoom duration
		//
		if (this.preferences && this.preferences.has('zoom_to_duration')) {
			duration = this.preferences.get('zoom_to_duration') * 1000;
		}
		if (options && options.duration != undefined) {
			duration = options.duration;
		}

		// check if we are zooming to a different place
		//
		if (distance > Math.epsilon) {

			// pan to place
			//
			this.animation = $({t: 0}).animate({t: 1}, {
				duration: duration / 3,

				// callbacks
				//
				step: (t) => {
					mapView.setOffset(start.plus(direction.scaledBy(t * mapSize)));
				},

				complete: () => {
					this.animation = null;
					
					// perform callback
					//
					if (options && options.finish) {
						options.finish();
					}
				}
			});
		}
	},

	zoomToPlace: function(place, options) {
		let mapView = this.getLayerView('map');
		let map = mapView.map;
		let mapSize = mapView.getMapSize();
		let start = mapView.getMapCoords().plus(mapView.offset);
		let finish = map.projection.latLonToVector2({
			latitude: place.get('latitude'),
			longitude: place.get('longitude')
		}).plus(mapView.offset);
		let startZoomLevel = mapView.getZoomLevel();
		let endZoomLevel = place.get('zoom_level') || this.getZoomLevel();
		let direction = start.minus(finish);
		let distance = direction.length();
		let duration = 0;

		// find zoom duration
		//
		if (this.preferences && this.preferences.has('zoom_to_duration')) {
			duration = this.preferences.get('zoom_to_duration') * 1000;
		}
		if (options && options.duration != undefined) {
			duration = options.duration;
		}

		// check if we are zooming to a different place
		//
		if (distance > Math.epsilon) {
			let midZoomLevel = (20 - Math.log(10 + distance ** 1.5 * 5.0e7)) / 2;

			// check if we are still animating
			//
			if (this.animation) {
				this.animation.stop();
			}

			this.animation = $({t: 0}).animate({t: 1}, {
				duration: duration,

				// callbacks
				//
				step: (t) => {

					// interpolate
					//
					// mapView.setOffset(start.plus(direction.scaledBy(t * mapSize)));
					// mapView.setZoomLevel(startZoomLevel + (endZoomLevel - startZoomLevel) * t);

					let t1 = 0.25;
					let t2 = 0.75;
					let t3, t4, t5;

					// zoom out
					//
					if (t < t1) {
						t3 = t / t1;
						mapView.setOffset(start);
						mapView.setZoomLevel(startZoomLevel + (midZoomLevel - startZoomLevel) * t3);

					// pan to place
					//
					} else if (t < t2) {
						t3 = (t - t1) / (t2 - t1);
						t4 = t3 * 2 - 1;
						t5 = (1 + Math.sign(t4) * Math.abs(t4) ** 0.75) / 2;
						mapView.setOffset(start.plus(direction.scaledBy(t5 * mapSize)));
						mapView.setZoomLevel(midZoomLevel);

					// zoom in
					//
					} else {
						t3 = (t - t2) / (1 - t2);
						mapView.setOffset(start.plus(direction.scaledBy(mapSize)));
						mapView.setZoomLevel(midZoomLevel + (endZoomLevel - midZoomLevel) * t3);
					}
				},

				complete: () => {
					this.animation = null;
					
					// perform callback
					//
					if (options && options.finish) {
						options.finish();
					}
				}
			});
		}
	},

	//
	// item adding methods
	//

	addItem: function(item, options) {

		// open new map
		//
		if (item instanceof MapFile) {
			this.openItem(item, options);

		// add photo to map
		//
		} else if (item instanceof ImageFile && !item.hasGeoposition()) {
			this.addPhoto(item, options);

		// add video to map
		//
		} else if (item instanceof VideoFile) {
			this.addVideo(item, options);

		// add overlay to map
		//
		} else if (item instanceof ImageFile && item.hasGeoposition()) {
			this.addOverlay(item, options);

		// add person to map
		//
		} else if (item instanceof User) {
			this.addPerson(item, options);

		// recursively add directory items to map
		//
		} else if (item instanceof Directory && !item.isHidden()) {
			this.addDirectory(item, {
				recursive: true
			});
		}
	},

	addItems: function(items) {
		for (let i = 0; i < items.length; i++) {
			this.addItem(items[i], {
				zoomTo: i == 0
			});
		}
	},

	addDirectory: function(directory, options) {
		if (directory.loaded) {
			this.addItems(directory.contents.models, options);
		} else {
			directory.load({

				// callbacks
				//
				success: () => {
					this.addDirectory(directory, options);
				}
			});
		}
	},

	//
	// item editing methods
	//

	editSelected: function() {
		if (this.hasSelectedLayerItems('places')) {
			this.editPlace(this.getSelectedLayerModels('places')[0]);
		} else if (this.hasSelectedLayerItems('favorites')) {
			this.editFavorite(this.getSelectedLayerModels('favorites')[0]);
		}
	},

	//
	// item deleting methods
	//

	deleteSelected: function() {
		let sidebarView = this.getChildView('sidebar');
		for (let i = 0; i < sidebarView.panels.length; i++) {
			let panel = sidebarView.panels[i];
			if (sidebarView.hasSelectedItems(panel)) {
				this.deleteSelectedKind(panel);
			}
		}
	},

	deleteSelectedKind: function(kind) {
		switch (kind) {
			case 'photos':
				this.removeSelectedPhotos();
				break;
			case 'videos':
				this.removeSelectedVideos();
				break;
			case 'overlays':
				this.removeSelectedOverlays();
				break;
			case 'people':
				this.removeSelectedPeople();
				break;
			case 'places':
				this.removeSelectedPlaces();
				break;
			case 'favorites':
				this.deleteSelectedFavorites();
				break;
			default:
				this.deleteSelectedItems();
		}
	},

	deleteSelectedItems: function(options) {
		this.deleteItems(this.getSelectedItemModels(), options);
	},
	
	//
	// uploading methods
	//

	triggerUpload: function() {

		// trigger file input
		//
		this.$el.find('> .body > input[type="file"]').click();
	},

	uploadCloudItems: function(files, directory) {
		this.uploadFiles(files, directory, {
			show_progress: true,
			overwrite: true,

			// callbacks
			//
			success: (items) => {

				// add uploads to photos
				//
				this.addItems(items);

				// play upload sound
				//
				application.play('upload');
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					title: "Upload Error",
					message: "Could not upload '" + model.get('name') + "'. ",
					response: response
				});
			}
		});
	},

	//
	// uploading methods
	//

	uploadMaps: function(items, options) {

		// upload items to current directory
		//
		this.uploadItems(items, this.directory, {
			show_progress: true,
			overwrite: true,

			// callbacks
			//
			success: (items) => {

				// perform callback
				//
				if (options && options.success) {
					options.success(items);
				}
			}
		});
	},

	uploadMapItems: function(items, options) {

		// upload items to app's uploads directory
		//
		this.uploadItems(items, this.uploadsDirectory, {
			show_progress: true,
			overwrite: true,

			// callbacks
			//
			success: (items) => {

				// perform callback
				//
				if (options && options.success) {
					options.success(items);
				}
			}
		});
	},

	uploadMapFiles: function(files, options) {

		// upload files to app's uploads directory
		//
		this.uploadFiles(files, this.uploadsDirectory, {
			show_progress: true,
			overwrite: true,

			// callbacks
			//
			success: (files) => {

				// perform callback
				//
				if (options && options.success) {
					options.success(files);
				}
			}
		});
	},

	//
	// selecting methods
	//

	selectAll: function(filter) {
		this.getActivePaneView().selectAll(filter);
	},

	selectInvert: function(filter) {
		this.getActivePaneView().selectInvert(filter);
	},

	selectLayer: function(layer, filter) {
		this.getActivePaneView().selectLayer(layer, filter);
	},

	deselectAll: function(filter) {
		this.getActivePaneView().deselectAll(filter);
	},

	//
	// layer selection methods
	//

	selectLayerItem: function(layer, item) {
		let itemView = this.getLayerItemView(layer, item.model);
		if (itemView) {
			itemView.select({
				silent: true
			});
		}
		this.onSelect(item);
	},

	selectLayerItems: function(layer, items) {
		for (let i = 0; i < items.length; i++) {
			this.selectLayerItem(layer, items[i]);
		}
	},

	deselectLayerItem: function(layer, item) {
		let itemView = this.getLayerItemView('places', item.model);
		if (itemView) {
			itemView.deselect({
				silent: true
			});
		}
		this.onDeselect(item);
	},

	deselectLayerItems: function(layer, items) {
		for (let i = 0; i < items.length; i++) {
			this.deselectLayerItem(layer, items[i]);
		}
	},

	//
	// searching methods
	//

	searchForCoordinates: function(coords, options) {
		let latitude = parseFloat(coords.latitude);
		let longitude = parseFloat(coords.longitude);
		let digits = coords.latitude.length + coords.longitude.length;

		// zoom to coordinates
		//
		this.zoomToPlace(new Place({
			latitude: latitude, 
			longitude: longitude, 
			zoom_level: Math.min(5 + digits, this.maxZoom - 1)
		}), options);
	},

	searchForAddress: function(address, options) {

		// select geocoder
		//
		let Geocoding = config.geocoding.google? GoogleGeocoding : USCensusGeocoding;

		// convert address to latlon coordinates
		//
		Geocoding.fetchByAddress(address, {

			// callbacks
			//
			success: (latLon) => {
				if (latLon) {
					this.zoomToPlace(new Place({
						latitude: latLon.latitude, 
						longitude: latLon.longitude,
						zoom_level: this.maxZoom - 1
					}), options);
				} else {

					// show error message
					//
					application.error({
						message: 'This address could not be found.'
					});
				}
			},

			error: () => {

				// show error message
				//
				application.error({
					message: 'Could not geocode this address.'
				});
			}
		});
	},

	searchFor: function(search) {

		// search for particular type of data
		//
		if (search.latitude) {
			this.searchForCoordinates(search);
		} else if (search.address) {
			this.searchForAddress(search.address);
		}
	},

	showPlaceByTopic: function(place) {

		// show default topic
		//
		application.launch('topic_viewer', {
			check_in: place
		});
	},

	showPlaceByChat: function(place, chat) {
		application.launch('chat_viewer', {
			model: chat,
			check_in: place
		});
	},

	showPlaceByMessage: function(place) {
		import(
			'../../../collections/chats/chats.js'
		).then((Chats) => {
			new Chats.default().fetch({

				// callbacks
				//
				success: (collection) => {

					// show first chat
					//
					this.showPlaceByChat(place, collection.at(0));
				}
			});
		});
	},
	
	//
	// place sharing methods
	//

	sharePlaceByTopic: function() {
		let latLon = this.getLatLon();
		let zoomLevel = this.getZoomLevel();

		this.showPlaceNameDialog({
			model: new Place({
				latitude: latLon.latitude,
				longitude: latLon.longitude,
				zoom_level: zoomLevel
			}),

			// callbacks
			//
			onSubmit: function(place) {
				this.showPlaceByTopic(place);
			}
		});
	},

	sharePlaceByMessage: function() {
		let latLon = this.getLatLon();
		let zoomLevel = this.getZoomLevel();

		this.showPlaceNameDialog({
			model: new Place({
				latitude: latLon.latitude,
				longitude: latLon.longitude,
				zoom_level: zoomLevel
			}),

			// callbacks
			//
			onSubmit: function(place) {
				this.showPlaceByMessage(place);
			}
		});
	},

	//
	// loading methods
	//

	loadFavorites: function(options) {
		if (application.isSignedIn()) {
			this.favorites.fetchByCurrentUser({

				// callbacks
				//
				success: () => {
					if (options && options.success) {
						options.success(this.favorites);
					}
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not fetch current user's favorite places.",
						response: response
					});
				}
			});
		} else {
			if (options && options.success) {
				options.success(this.favorites);
			}			
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// set state based on preferences
		//
		this.setPreferences(this.preferences);

		// show header / footer
		//
		this.showAppBars();

		// make sure that favorites are loaded
		//
		if (!this.favorites.loaded) {

			// load user favorites
			//
			this.loadFavorites({

				// callbacks
				//
				success: () => {
					this.favorites.loaded = true;
					this.showContents();
				}
			});
		}

		// find search address
		//
		let address;
		if (this.options.search && this.options.search.address) {
			address = this.options.search.address;
		}

		// show search bar
		//
		if (address || this.preferences.get('search_kind') == "address") {
			this.getChildView('header').showSearchBar('address', address);

			// search by address
			//
			if (address) {
				this.searchForAddress(address, {
					duration: 0
				});
			}
		}

		// add tooltip triggers
		//
		this.addTooltips();
	},

	update: function() {

		// set zoom
		//
		if (this.hasChildView('zoom')) {
			let zoom = this.parent.getZoom();
			if (zoom) {
				this.getChildView('zoom').setZoom(Math.round(zoom));
			}
		}
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView();
	},

	//
	// contents rendering methods
	//

	getSideBarView: function() {
		return new SideBarView({

			// map items
			//
			photos: this.hasActivePaneView()? this.getActivePaneView().photos : null,
			videos: this.hasActivePaneView()? this.getActivePaneView().videos : null,
			overlays: this.hasActivePaneView()? this.getActivePaneView().overlays : null,
			people: this.hasActivePaneView()? this.getActivePaneView().people : null,
			places: this.hasActivePaneView()? this.getActivePaneView().places : null,
			favorites: this.favorites,

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item)
		});
	},

	getContentView: function() {
		return new TabbedContentView({
			collection: this.collection,

			// map items
			//
			items: this.options.items,
			photos: this.options.photos,
			videos: this.options.videos,
			overlays: this.options.overlays,
			people: this.options.people,
			places: this.options.places,
			favorites: this.favorites,

			// options
			//
			preferences: this.preferences,
			place: this.options.place,
			currentPlace: this.options.currentPlace,

			// callbacks
			//
			onload: () => this.onLoad(),
			onactivate: () => this.onActivate(),
			onchange: (attribute) => this.onChange(attribute),
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropin: (items) => this.onDropIn(items),
			onchangetab: () => this.onChange(),
			onclose: (index) => this.closeTab(index)
		});
	},
	
	getContextMenuView: function() {
		return new ContextMenuView();
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView();
	},

	//
	// message rendering methods
	//

	showHelpMessage: function() {
		this.showMessage("No maps.", {
			icon: '<i class="far fa-map"></i>',

			// callbacks
			//
			onclick: () => this.showOpenDialog()
		});
	},

	//
	// dialog rendering methods
	//

	showOpenDialog: function(directory) {
		import(
			'../../../views/apps/map-viewer/dialogs/maps/open-map-file-dialog-view.js'
		).then((OpenMapFileDialogView) => {
			
			// show open dialog
			//
			this.show(new OpenMapFileDialogView.default({

				// start with home directory
				//
				model: directory || this.getHomeDirectory(),

				// options
				//
				title: "Open Map",

				// callbacks
				//
				onopen: (items) => this.openItems(items)
			}));
		});
	},
	
	showPlaceInfoDialog: function(place, options) {
		import(
			'../../../views/apps/map-viewer/dialogs/places/place-info-dialog-view.js'
		).then((PlaceInfoDialogView) => {

			// show place info dialog
			//
			this.show(new PlaceInfoDialogView.default(_.extend({
				model: place
			}, options)));				
		});	
	},

	showPlacesInfoDialog: function(places, options) {
		for (let i = 0; i < places.length; i++) {
			this.showPlaceInfoDialog(places[i], options);
		}
	},

	showPersonOrPeopleInfoDialog: function(options) {
		let people = this.getSelectedLayerModels('people');

		if (people.length == 1) {
			this.showConnectionInfoDialog(people[0], options);
		} else if (people.length > 1) {
			this.showConnectionsInfoDialog(people, options);
		} else {

			// show notification
			//
			application.notify({
				icon: '<i class="fa fa-info-circle"></i>',
				title: "Show Info",
				message: "No people selected."
			});
		}
	},

	showMapItemsInfoDialog: function(mapItems, options) {

		// divide selected items by type
		//
		let items = [], places = [], people = [];
		for (let i = 0; i < mapItems.length; i++) {
			let model = mapItems[i];
			if (model instanceof Item) {
				items.push(model);
			} else if (model instanceof Place) {
				places.push(model);
			} else if (model instanceof User) {
				people.push(model);
			}
		}

		if (items.length > 0) {
			this.showItemsInfoDialog(items, options);
		}
		if (places.length > 0) {
			this.showPlacesInfoDialog(places, options);	
		}
		if (people.length > 0) {
			this.showPersonOrPeopleInfoDialog(people, options);
		}
	},

	showInfoDialog: function(options) {

		// find selected items
		//
		let selected = this.getSelectedModels();
		if (!selected) {
			selected = this.model;
		}

		this.showMapItemsInfoDialog(selected, options);
	},

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/map-viewer/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	showPlaceNameDialog: function(options) {
		import(
			'../../../views/apps/map-viewer/dialogs/places/place-name-dialog-view.js'
		).then((PlaceNameDialogView) => {

			// show place name dialog
			//
			this.show(new PlaceNameDialogView.default(options));
		});
	},

	showAddPeopleDialog: function() {
		import(
			'../../../views/apps/connection-manager/dialogs/connections/select-connections-dialog-view.js'
		).then((SelectConnectionsDialogView) => {

			// show open dialog
			//
			this.show(new SelectConnectionsDialogView.default({

				// options
				//
				title: "Add People",

				// callbacks
				//
				select: (people) => {
					this.addPeople(people);

					// play add sound
					//
					application.play('add');
				}
			}));
		});
	},

	//
	// event handing methods
	//

	onLoad: function() {

		// call superclass method
		//
		AppSplitView.prototype.onLoad.call(this);

		// load toolbar
		//
		this.getToolbarView().onLoad();
	},

	onActivate: function() {

		// update sidebar
		//
		if (this.hasChildView('sidebar')) {
			this.getChildView('sidebar').setActiveView(this.getActivePaneView());
			this.getChildView('sidebar').onActivate();
		}

		// show footer bar
		//
		if (!application.isEmbedded()) {
			if (!this.options.hidden || !this.options.hidden['footer-bar']) {
				this.showFooterBar();
			}
		}

		// activate toolbar views
		//
		this.getChildView('header').onActivate();
		this.getChildView('mainbar panes toolbar').onActivate();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange('tab');
		}
	},

	onChange: function(attribute) {

		// update child views
		//
		switch (attribute) {
			case 'offset':
				if (this.hasStatusBar()) {
					this.getStatusBar().onChange(attribute);
				}
				break;
			case 'scale':
				this.getChildView('header').onChange(attribute);
				break;
			case 'size':
				break;
			default:
				this.getChildView('header').onChange(attribute);
				break;
		}
		
		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(attribute);
		}
	},

	//
	// keyboard event handling methods
	//

	/*
	onKeyDown: function(event) {

		// check for command-R
		//
		if (event.metaKey || event.ctrlKey) {
			if (event.keyCode == Keyboard.keyCodes.R) {
				this.onBeforeUnload();
			}
		}

		// call superclass method
		//
		AppSplitView.prototype.onKeyDown.call(this, event);
	},
	*/

	//
	// selection event handling methods
	//

	onSelect: function(item) {

		// update sidebar
		//
		if (this.hasChildView('sidebar')) {

			// select item
			//
			let sidebarView = this.getChildView('sidebar').getItemView(item.model);
			if (sidebarView && sidebarView != item) {
				sidebarView.select({
					silent: true
				});
			}
		}
		
		// update
		//
		this.onChangeSelection();

		// callbacks
		//
		if (this.options.onselect) {
			this.options.onselect(item);
		}
	},

	onDeselect: function(item) {

		// update sidebar
		//
		if (this.hasChildView('sidebar') && item) {

			// deselect item
			//
			let sidebarView = this.getChildView('sidebar').getItemView(item.model);
			if (sidebarView && sidebarView != item) {
				sidebarView.deselect({
					silent: true
				});
			}
		}

		// update
		//
		this.onChangeSelection();

		// callbacks
		//
		if (this.options.ondeselect) {
			this.options.ondeselect();
		}
	},
	
	//
	// file event handling methods
	//

	onOpen: function(item) {
		let editItems = false;

		if (item.model instanceof Place) {

			// open place markers
			//
			if (editItems) {
				this.editPlace(item);
			} else {
				this.showPlacesInfoDialog([item.model]);
			}
		} else if (item.model instanceof Item) {

			// open files and directories
			//
			ItemOpenable.onOpen.call(this, item);
		} else if (item.model instanceof User) {

			// show user's profile info
			//
			application.showUser(item.model);
		}
	},

	onChangeFile: function(event) {
		let path = $(event.target).val();
		
		if (path) {
			this.uploadFiles(event.target.files, this.uploadsDirectory, {
				show_progress: true,
				overwrite: true,

				// callbacks
				//
				success: (items) => {

					// add uploads to map
					//
					this.addItems(items);

					// play upload sound
					//
					application.play('upload');
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						title: "Upload Error",
						message: "Could not upload '" + model.get('name') + "'. ",
						response: response
					});
				}
			});
		}
	},

	hidePopovers: function() {
		$('.popover').popover('hide');
	},

	//
	// drag and drop event handling methods
	//

	onDropIn: function(items) {

		// play upload sound
		//
		application.play('upload');
		
		// check if we are uploading a new map
		//
		if (items[0] instanceof MapFile) {
			this.openItem(items[0], {

				// callbacks
				//
				success: () => this.getChildView('sidebar maps items').deselectAll()
			});

		// upload photos to existing map
		//
		} else {
			this.addItems(items, {
				recursive: true
			});
		}
	},

	//
	// drag and drop event handling methods
	//

	onDropOut: function(items) {

		// download dropped item
		//
		this.getActivePaneView().download(items);

		// play download sound
		//
		application.play('download');
	},

	//
	// file event handling methods
	//

	onSave: function(model) {

		// reset changed flag
		//
		this.getActivePaneView().setDirty(false);

		// update sidebar
		//
		if (model) {
			this.getChildView('sidebar').onSave();
		}

		// update views
		//
		this.getChildView('header menu').onSave();
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// stop any zoom animations
		//
		if (this.animation) {
			this.animation.stop();
		}
	}
}), {

	//
	// static attributes
	//

	defaultName: 'Untitled.kml',

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	},

	getItemsMapView: function(options) {
		return new ItemsMapView(options);
	},

	getDirectoryMapView: function(options) {
		return new DirectoryMapView(options);
	},

	//
	// static dialog rendering methods
	//

	showSelectPlaceDialog: function(options) {
		application.show(new SelectPlaceDialogView(options));
	},

	showCheckInDialog: function(options) {
		application.show(new CheckInDialogView(options));
	}
});