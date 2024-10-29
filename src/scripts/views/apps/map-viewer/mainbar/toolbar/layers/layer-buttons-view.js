/******************************************************************************\
|                                                                              |
|                            layer-buttons-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a group of related toolbar buttons.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../../views/base-view.js';
import LayerButtonView from '../../../../../../views/apps/map-viewer/mainbar/toolbar/layers/buttons/layer-button-view.js';

export default BaseView.extend({

	//
	// attributes
	//
	
	className: 'tools',

	template: template(`
		<div class="show-crosshairs" data-toggle="tooltip" title="Crosshairs" data-placement="right"></div>
		<div class="show-photos" data-toggle="tooltip" title="Photos" data-placement="right"></div>
		<div class="show-videos" data-toggle="tooltip" title="Videos" data-placement="right"></div>
		<div class="show-overlays" data-toggle="tooltip" title="Overlays" data-placement="right"></div>
		<div class="show-people" data-toggle="tooltip" title="People" data-placement="right"></div>
		<div class="show-places" data-toggle="tooltip" title="Places" data-placement="right"></div>
		<div class="show-favorites" data-toggle="tooltip" title="Favorites" data-placement="right"></div>
		<div class="show-weather" data-toggle="tooltip" title="Weather" data-placement="right"></div>
		<div class="show-annotations" data-toggle="tooltip" title="Annotations" data-placement="right"></div>
	`),

	regions: {
		crosshairs: '.show-crosshairs',
		photos: '.show-photos',
		videos: '.show-videos',
		overlays: '.show-overlays',
		people: '.show-people',
		places: '.show-places',
		favorites: '.show-favorites',
		annotations: '.show-annotations',
		weather: '.show-weather'
	},

	tooltips: {
		placement: 'top'
	},

	//
	// querying methods
	//

	visible: function() {
		let hasPhotos = this.app.hasItems('photos');
		let hasVideos = this.app.hasItems('videos');
		let hasOverlays = this.app.hasItems('overlays');
		let hasPeople = this.app.hasItems('people');
		let hasPlaces = this.app.hasItems('places');
		let hasFavorites = this.app.hasItems('favorites');
		let hasAnnotations = this.app.hasItems('annotations');

		return {
			'show-crosshairs': true,
			'show-photos': hasPhotos == true,
			'show-videos': hasVideos == true,
			'show-overlays': hasOverlays == true,
			'show-people': hasPeople == true,
			'show-places': hasPlaces == true,
			'show-favorites': hasFavorites == true,
			'show-annotations': hasAnnotations == true,
			'show-weather': true
		};	
	},

	selected: function() {
		let preferences = this.app.preferences;
		let mapLayers = preferences.get('map_layers');

		return {
			'show-crosshairs': mapLayers.includes('crosshairs'),				
			'show-photos': mapLayers.includes('photos'),
			'show-videos': mapLayers.includes('videos'),
			'show-overlays': mapLayers.includes('overlays'),
			'show-people': mapLayers.includes('people'),
			'show-places': mapLayers.includes('places'),
			'show-favorites': mapLayers.includes('favorites'),
			'show-annotations': mapLayers.includes('annotations'),
			'show-weather': mapLayers.includes('weather')
		};
	},

	//
	// setting methods
	//

	setLayersSelected: function(layers) {
		let regions = Object.keys(this.regions);
		for (let i = 0; i < regions.length; i++) {
			let layer = regions[i];
			this.setLayerSelected(layer, layers.includes(layer));
		}
	},

	setLayerSelected: function(layer, selected) {
		if (layer == 'all') {
			let layers = Object.keys(this.regions);
			for (let i = 0; i < layers.length; i++) {
				if (this.hasChildView(layers[i])) {
					this.getChildView(layers[i]).setSelected(selected);
				}
			}
		} else if (typeof layer == 'string') {
			if (this.hasChildView(layer)) {
				this.getChildView(layer).setSelected(selected);
			}
		} else if (typeof layer == 'object') {

			// layer is array
			//
			let keys = Object.keys(layer);
			for (let i = 0; i < keys.length; i++) {
				let key = keys[i];
				let value = layer[key];
				this.getChildView(key).setSelected(value);
			}
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.app = this.getParentView('app');

		// show child views
		//
		this.showChildView('crosshairs', new LayerButtonView({
			name: 'crosshairs',
			icon: '<i class="fa fa-crosshairs"></i>',
		}));
		this.showChildView('photos', new LayerButtonView({
			name: 'photos',
			icon: '<i class="fa fa-camera"></i>',
		}));
		this.showChildView('videos', new LayerButtonView({
			name: 'videos',
			icon: '<i class="fa fa-video"></i>',
		}));
		this.showChildView('overlays', new LayerButtonView({
			name: 'overlays',
			icon: '<i class="fa fa-grip-lines"></i>',
		}));
		this.showChildView('people', new LayerButtonView({
			name: 'people',
			icon: '<i class="fa fa-smile"></i>',
		}));
		this.showChildView('places', new LayerButtonView({
			name: 'places',
			icon: '<i class="fa fa-map-marker-alt"></i>',
		}));
		this.showChildView('favorites', new LayerButtonView({
			name: 'favorites',
			icon: '<i class="fa fa-map-pin"></i>',
		}));
		this.showChildView('annotations', new LayerButtonView({
			name: 'annotations',
			icon: '<i class="fa fa-pencil-alt"></i>',
		}));

		// add tooltip triggers
		//
		this.addTooltips();
	},

	updateVisibility: function() {
		let hasPhotos = this.app.hasItems('photos');
		let hasVideos = this.app.hasItems('videos');
		let hasOverlays = this.app.hasItems('overlays');
		let hasPeople = this.app.hasItems('people');
		let hasPlaces = this.app.hasItems('places');
		let hasFavorites = this.app.hasItems('favorites');
		let hasAnnotations = this.app.hasItems('annotations');

		// update button visibility
		//
		this.getChildView('photos').setVisible(hasPhotos);
		this.getChildView('videos').setVisible(hasVideos);
		this.getChildView('overlays').setVisible(hasOverlays);
		this.getChildView('people').setVisible(hasPeople);
		this.getChildView('places').setVisible(hasPlaces);
		this.getChildView('favorites').setVisible(hasFavorites);
		this.getChildView('annotations').setVisible(hasAnnotations);
	},

	//
	// event handling methods
	//
	
	onLoad: function() {
		this.updateVisibility();
	},

	onActivate: function() {
		this.updateVisibility();
	}
});