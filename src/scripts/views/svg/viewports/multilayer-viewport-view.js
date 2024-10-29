/******************************************************************************\
|                                                                              |
|                          multilayer-viewport-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a zoomable, panable drawing canvas.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SVGViewportView from '../../../views/svg/viewports/svg-viewport-view.js';

export default SVGViewportView.extend({

	//
	// layer attributes
	//

	layers: [],

	//
	// getting methods
	//

	getLayer: function(layer) {
		return this.$el.find('.layer[name="' + layer + '"]');
	},

	//
	// setting methods
	//

	setElementClass(element, className, selected) {
		if (selected) {
			$(element).addClass(className);
		} else {
			$(element).removeClass(className);		
		}
	},

	setLayerClass: function(layer, className, selected) {
		this.setElementClass(this.getLayer(layer), className, selected);
	},

	setLayerVisibility: function(layer, visible) {
		let $layer = this.getLayer(layer);
		if (visible) {
			$layer.show();
		} else {
			$layer.hide();
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// create layers 
		//
		this.addLayers(this.layers);
	},

	addLayerElement: function(name) {
		let layer = this.createElement('g', {
			name: name,
			class: 'layer'
		});

		// add to scene graph
		//
		this.addElement(layer);

		return layer;
	},

	addLayer: function(name) {
		let layer = this.addLayerElement(name);

		// add to list of layers
		//
		this.layers.push(layer);
		this.layers[name] = layer;

		return layer;
	},

	addLayers: function(layers) {
		if (layers && layers.length > 0) {
			for (let i = 0; i < layers.length; i++) {
				this.addLayerElement(layers[i]);
			}
		}
	},

	addElement: function(element, layer) {
		if (layer && this.layers.includes(layer)) {

			// add to layer
			//
			let group = this.getLayer(layer);
			if (group) {
				group.append(element);
			}
		} else {

			// add to viewport
			//
			this.$el.append(element);
		}

		return element;
	}
});