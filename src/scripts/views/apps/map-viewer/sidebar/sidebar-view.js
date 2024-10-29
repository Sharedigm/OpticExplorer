/******************************************************************************\
|                                                                              |
|                               sidebar-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing an app's sidebar.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SideBarView from '../../../../views/apps/common/sidebar/sidebar-view.js';
import MapsPanelView from '../../../../views/apps/map-viewer/sidebar/panels/maps-panel-view.js';
import FavoritesPanelView from '../../../../views/apps/map-viewer/sidebar/panels/favorites-panel-view.js';
import PhotosPanelView from '../../../../views/apps/map-viewer/sidebar/panels/photos-panel-view.js';
import VideosPanelView from '../../../../views/apps/map-viewer/sidebar/panels/videos-panel-view.js';
import OverlaysPanelView from '../../../../views/apps/map-viewer/sidebar/panels/overlays-panel-view.js';
import PlacesPanelView from '../../../../views/apps/map-viewer/sidebar/panels/places-panel-view.js';
import PeoplePanelView from '../../../../views/apps/map-viewer/sidebar/panels/people-panel-view.js';
import SharedPanelView from '../../../../views/apps/map-viewer/sidebar/panels/shared-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['maps', 'photos', 'videos', 'overlays', 'people', 'places', 'favorites', 'shared'],

	//
	// attribute methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();

		return {

			// files
			//
			'maps': isSignedIn,
			'photos': true,
			'videos': true, 
			'overlays': true,
			'people': isSignedIn, 
			'places': isSignedIn, 
			'favorites': isSignedIn,
			'shared': isSignedIn
		};
	},

	//
	// querying methods
	//

	hasSelectedItems: function(panel) {

		// check specific sidebar panel
		//
		if (panel) {
			if (this.hasChildView(panel)) {
				return this.getChildView(panel).hasSelected();
			}

		// check all sidebar panels
		//
		} else {
			for (let i = 0; i < this.panels.length; i++) {
				let panel = this.panels[i];
				if (this.hasChildView(panel)) {
					if (this.getChildView(panel).hasSelected()) {
						return true;
					}
				}
			}
		}

		return false;
	},

	//
	// getting methods
	//

	getPanels: function() {
		return Object.keys(this.regions);
	},

	getPanelItemView: function(panel, model) {
		if (this.hasChildView(panel + ' items')) {
			return this.getChildView(panel + ' items').getItemView(model);
		}
	},

	getItemView: function(model) {
		let panels = this.getPanels();
		for (let i = 0; i < panels.length; i++) {
			let view = this.getPanelItemView(panels[i], model);
			if (view) {
				return view;
			}
		}
	},

	getSelectedModels: function(kind) {
		if (!kind) {
			kind = 'maps';
		}
		if (this.hasChildView(kind)) {
			return this.getChildView(kind).getSelectedModels();
		}
	},

	//
	// setting methods
	//

	setPanelItemsSelected: function(panel, selected, filter, options) {
		if (selected) {
			if (this.hasChildView(panel) &&
				this.getChildView(panel).selectAll) {
				this.getChildView(panel).selectAll(filter, options);
			}
		} else {
			if (this.hasChildView(panel) &&
				this.getChildView(panel).deselectAll) {
				this.getChildView(panel).deselectAll(filter, options);
			}
		}
	},

	setItemsSelected: function(selected, filter, options) {
		let panels = this.getPanels();
		for (let i = 0; i < panels.length; i++) {
			this.setPanelItemsSelected(panels[i], selected, filter, options);
		}
	},

	setActiveView: function(activeView) {
		this.options.photos = activeView? activeView.photos : null;
		this.options.videos = activeView? activeView.videos : null;
		this.options.overlays = activeView? activeView.overlays : null;
		this.options.people = activeView? activeView.people : null;
		this.options.places = activeView? activeView.places : null;
	},

	//
	// panel rendering methods
	//

	showPanel: function(panel) {

		// show specified panel
		//
		switch (panel) {
			case 'maps':
				this.showMapsPanel();
				break;
			case 'photos':
				this.showPhotosPanel();
				break;
			case 'videos':
				this.showVideosPanel();
				break;
			case 'overlays':
				this.showOverlaysPanel();
				break;
			case 'people':
				this.showPeoplePanel();
				break;
			case 'places':
				this.showPlacesPanel();
				break;
			case 'favorites':
				this.showFavoritesPanel();
				break;
			case 'shared':
				this.showSharedPanel();
				break;
		}
	},

	showMapsPanel: function() {	
		this.showChildView('maps', new MapsPanelView({
			directory: this.options.maps,

			// options
			//
			view_kind: this.options.view_kind
		}));
	},

	showPhotosPanel: function() {
		this.showChildView('photos', new PhotosPanelView({
			collection: this.options.photos,

			// options
			//
			view_kind: this.options.view_kind
		}));
	},

	showVideosPanel: function() {
		this.showChildView('videos', new VideosPanelView({
			collection: this.options.videos,

			// options
			//
			view_kind: this.options.view_kind
		}));
	},

	showOverlaysPanel: function() {
		this.showChildView('overlays', new OverlaysPanelView({
			collection: this.options.overlays,

			// options
			//
			view_kind: this.options.view_kind
		}));
	},

	showPeoplePanel: function() {
		this.showChildView('people', new PeoplePanelView({
			collection: this.options.people,

			// options
			//
			view_kind: this.options.view_kind
		}));
	},

	showPlacesPanel: function() {
		this.showChildView('places', new PlacesPanelView({
			collection: this.options.places,

			// options
			//
			view_kind: this.options.view_kind
		}));
	},

	showFavoritesPanel: function() {
		this.showChildView('favorites', new FavoritesPanelView({
			collection: this.options.favorites,

			// options
			//
			view_kind: this.options.view_kind
		}));
	},
	
	showSharedPanel: function() {
		this.showChildView('shared', new SharedPanelView({
			directory: this.options.shared,

			// options
			//
			view_kind: this.options.view_kind
		}));
	},

	//
	// event handling methods
	//

	onActivate() {
		this.showPanels(['photos', 'videos', 'overlays', 'places']);
	},

	onSave: function() {
		this.getChildView('maps').onRender();
	}
});