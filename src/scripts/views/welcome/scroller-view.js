/******************************************************************************\
|                                                                              |
|                               scroller-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a parallax scrolling background element.                 |
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
import Graphics from '../../utilities/graphics/graphics.js';
import ScrollingImage from '../../utilities/graphics/scrolling-image.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'overlay',

	//
	// rendering methods
	//

	onAttach: function() {

		// create new drawing canvas
		//
		this.graphics = new Graphics(this.el);
		this.layers = [];

		// load layers
		//
		let keys = Object.keys(this.options.images);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let object = this.options.images[key];
			let image = new ScrollingImage(object.src, _.extend(object, {
				id: key
			}));
			this.layers.push(image);
			this.graphics.load(image);
		}

		// animate with javascript or css
		//
		this.animate(this.options);
	},

	animate: function(options) {
		window.setTimeout(() => {
			if (this.options.use_javascript) {
				this.start(options);
			} else {
				this.addAnimation(options);
			}
		}, 1000);
	},

	addAnimation: function(options) {
		for (let i = 0; i < this.layers.length; i++) {
			this.addLayerAnimation(options, this.layers[i])
		}
	},

	addCssRule(body) {
		if (!this.dynamicStyles) {
			this.dynamicStyles = document.createElement('style');
			this.dynamicStyles.type = 'text/css';
			document.head.appendChild(this.dynamicStyles);
		}

		this.dynamicStyles.sheet.insertRule(body, this.dynamicStyles.length);
	},

	addLayerAnimation: function(options, layer) {
		if (!layer.speed) {
			return;
		}

		let rule = template(`
			@keyframes <%= id %>-keyframes {
				0% {
					left: <%= start %>%;
				}

				100% {
					left: <%= finish %>%;
				}
			}`
		)({
			id: layer.id,
			start: 0,
			finish: (layer.width + layer.skip) * 100
		});

		// add css rule for element
		//
		this.addCssRule(rule);

		// set css styles of layer
		//
		$(layer.element).css('animation-name',  layer.id + '-keyframes');
		$(layer.element).css('animation-duration', (1 + layer.skip) / options.speed / Math.abs(layer.speed) + 's');
		$(layer.element).css('animation-direction', layer.speed > 0? 'forward' : 'reverse');
	},

	updateLayers: function(options, interval) {
		let speed = options.speed || 1;

		for (let i = 0; i < this.layers.length; i++) {
			this.layers[i].update(interval / 1000 * speed);
		}
	},

	start: function(options) {
		let self = this;
		let interval = options.interval || 30;

		// start scroller animation
		//
		window.interval = setInterval(function() {
			self.updateLayers(options, interval);
		}, interval);
	}
});