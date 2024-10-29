/******************************************************************************\
|                                                                              |
|                                layers-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract class of a view with multiple layers.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'layers',
	layers: [],
	visibility: {},

	//
	// constructor
	//

	initialize: function(options) {

		// set attributes
		//
		this.options = options;

		// set layer visibility
		//
		if (this.options.visibility) {
			this.visibility = this.options.visibility;
		}
	},

	//
	// querying methods
	//

	isLayerVisible: function(name) {
		return this.visibility[name] != false;
	},

	hasLayerView: function(layer) {
		return this.hasChildView(layer);
	},

	//
	// getting methods
	//

	getLayers: function() {
		return Object.keys(this.regions);
	},

	getLayerViews: function() {
		let layerViews = [];
		let layers = this.getLayers();
		for (let i = 0; i < layers.length; i++) {
			let layerView = this.getLayerView(layers[i]);
			if (layerView) {
				layerViews.push(layerView);
			}
		}
		return layerViews;
	},

	getLayerView: function(layer) {
		return this.getChildView(layer);
	},

	getLayerItemView: function(layer, model) {
		return this.getLayerView(layer).getItemView(model);
	},

	getLayerVisibility: function(layer) {
		return this.getRegion(layer).$el.is(':visible');
	},

	//
	// visibility setting methods
	//

	setLayerVisibility: function(layer, visible) {
		if (visible) {
			if (this.hasChildView(layer)) {
				this.getChildView(layer).setVisible(true);
			} else {
				this.showLayer(layer);
			}	
		} else {
			if (this.hasChildView(layer)) {
				this.getChildView(layer).setVisible(false);
			}
		}
	},

	setLayersVisibility: function(visibility) {
		let layers = Object.keys(visibility);
		for (let i = 0; i < layers.length; i++) {
			let layer = layers[i];
			let value = visibility[layer]; 
			this.setLayerVisibility(layer, value);
		}
	},

	setLayersVisible: function(layers) {
		let keys = this.getLayers();
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			this.setLayerVisibility(key, layers.includes(key));
		}
	},

	setAllLayersVisibility: function(visibility) {
		let layers = this.getLayers();
		for (let i = 0; i < layers.length; i++) {
			this.setLayerVisibility(layers[i], visibility);
		}
	},

	//
	// selection setting methods
	//

	setLayerItemsSelected: function(layer, selected, filter, options) {
		if (selected) {
			if (this.hasLayerView(layer) && 
				this.getLayerView(layer).selectAll) {
				this.getLayerView(layer).selectAll(filter, options);
			}
		} else {
			if (this.hasLayerView(layer) && 
				this.getLayerView(layer).deselectAll) {
				this.getLayerView(layer).deselectAll(filter, options);
			}
		}
	},

	setItemsSelected: function(selected, filter, options) {
		let layers = this.getLayers();
		for (let i = 0; i < layers.length; i++) {
			let layer = layers[i];
			this.setLayerItemsSelected(layer, selected, filter, options);
		}
	},

	//
	// rendering methods
	//

	regions: function() {
		let regions = {};
		for (let i = 0; i < this.layers.length; i++) {
			let layer = this.layers[i];
			regions[layer] = {
				el: '.' + layer.replace(/_/g, '-'),
				replaceElement: false
			};
		}
		return regions;
	},

	getTemplate: function() {
		let html = '';
		let keys = Object.keys(this.regions);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let className = key.replace(/_/g, '-');
			/*
			if (i == 0) {
				className = 'base ' + className;
			} else {
				className = className + ' overlay';
			}
			*/
			html += '<div class="' + className + ' layer"></div>';
		}
		return template(html);	
	},

	onRender: function() {
		this.showLayers();
	},

	showLayers: function() {
		for (let i = 0; i < this.layers.length; i++) {
			let layer = this.layers[i];
			if (this.isLayerVisible(layer)) {
				this.showLayer(layer);
			}
		}
	},

	showLayer: function(layer) {
		let layerView = this.getNewLayerView(layer);
		if (layerView) {
			this.showChildView(layer, layerView);
		}
	},

	//
	// geolocating methods
	//

	placeOn: function(mapView) {
		for (let i = 0; i < this.layers.length; i++) {
			let layer = this.layers[i];
			let layerView = this.getLayerView(layer);
			if (layerView && layerView.placeOn) {
				layerView.placeOn(mapView);
			}
		}
	},

	onChange: function(attribute) {
		for (let i = 0; i < this.layers.length; i++) {
			let layer = this.layers[i];
			let layerView = this.getLayerView(layer);
			if (layerView && layerView.onChange) {
				layerView.onChange(attribute);
			}
		}
	},

	onResize: function(event) {
		for (let i = 0; i < this.layers.length; i++) {
			let layer = this.layers[i];
			let layerView = this.getLayerView(layer);
			if (layerView && layerView.onResize) {
				layerView.onResize(event);
			}
		}	
	}
});