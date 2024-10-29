/******************************************************************************\
|                                                                              |
|                               map-layers-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying map layers.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import LayersView from '../../../../../views/layout/layers-view.js';

export default LayersView.extend({

	//
	// constructor
	//

	initialize: function(options) {

		// call superclass constructor
		//
		LayersView.prototype.initialize.call(this, options);

		// set optional parameter defaults
		//
		this.options.show_grid = false;

		// set initial layer visibility
		//
		this.visibility = {};
		for (let i = 0; i < this.layers.length; i++) {
			let layer = this.layers[i];
			this.visibility[layer] = this.options.layers? this.options.layers.includes(layer) : true;
		}
	},

	//
	// setting methods
	//

	setVisible: function(visible) {

		// call superclass method
		//
		LayersView.prototype.setVisible.call(this, visible);
		this.setLayersVisible(this.parent.options.weather_layers);

		// update if shown
		//
		if (visible) {
			this.updateLayers();
		}
	},

	setLayersOffset: function(offset) {
		for (let i = 0; i < this.layers.length; i++) {
			let layer = this.getChildView(this.layers[i]);
			if (layer) {
				layer.setOffset(offset);
			}
		}
	},

	setLayersZoomLevel: function(zoomLevel) {
		for (let i = 0; i < this.layers.length; i++) {
			let layer = this.getChildView(this.layers[i]);
			if (layer) {
				layer.setZoomLevel(zoomLevel);
			}
		}
	},

	setLayerVisibility: function(layer, visible) {
		LayersView.prototype.setLayerVisibility.call(this, layer, visible);
		
		// update layer upon becoming visible
		//
		if (visible) {
			this.updateLayer(layer);
		}
	},

	//
	// rendering methods
	//

	onAttach: function() {
		this.showLayers();
		this.onChange('offset');
		this.onChange('scale');
	},

	//
	// updating methods
	//

	updateLayer: function(layer) {
		let layerView = this.getChildView(layer);
		if (layerView) {
			let offset = this.parent.getLayerView('map').offset;
			let zoomLevel = this.parent.getLayerView('map').getZoomLevel();
			layerView.setOffset(offset);
			layerView.setZoomLevel(zoomLevel);
			if (layer == 'metar') {
				layerView.updateMarkers();
			}
		}
	},

	updateLayers: function() {
		for (let i = 0; i < this.layers.length; i++) {
			this.updateLayer(this.layers[i]);
		}
	},

	//
	// event handling methods
	//

	onChange: function(attribute) {
		if (!this.isVisible()) {
			return;
		}

		// update offset
		//
		if (attribute == 'offset') {
			let offset = this.parent.getLayerView('map').offset;
			this.setLayersOffset(offset);
		}

		// update scale
		//
		if (attribute == 'scale' || attribute == 'map_mode') {
			let zoomLevel = this.parent.getLayerView('map').getZoomLevel();
			this.setLayersZoomLevel(zoomLevel);
		}
	}
});