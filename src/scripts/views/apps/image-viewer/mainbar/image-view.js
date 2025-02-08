/******************************************************************************\
|                                                                              |
|                                  image-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for viewing image files.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';
import ScrollableContainable from '../../../../views/behaviors/containers/scrollable-containable.js';
import FullScreenable from '../../../../views/behaviors/layout/full-screenable.js';
import Timeable from '../../../../views/behaviors/effects/timeable.js';

export default BaseView.extend(_.extend({}, ScrollableContainable, FullScreenable, Timeable, {

	//
	// attributes
	//

	className: 'image',

	template: template(``),

	// default width and height for vector 
	// images with unspecified dimensions
	//
	defaultSize: 512,

	// add a slight delay to let images finish loading
	// - this is required for Safari
	//
	image_load_delay: 100,

	events: {
		'mousedown': 'onMouseDown',
		'scroll': 'onScroll'
	},

	//
	// constructor
	//

	initialize: function() {
		this.loaded = false;

		// set optional parameter defaults
		//
		if (this.options.smoothing == undefined) {
			this.options.smoothing = true;
		}
	},

	//
	// getting methods
	//

	getDiagonal: function() {
		return Math.sqrt(this.getWidth() ** 2 + this.getHeight() ** 2);
	},

	getAspectRatio: function() {
		return this.getHeight() / this.getWidth();	
	},

	getImageWidth: function() {
		return this.$el.find('img').width();
	},

	getImageHeight: function() {
		return this.$el.find('img').height();
	},

	getImageDiagonal: function() {
		return Math.sqrt(this.getImageWidth() ** 2 + this.getImageHeight() ** 2);
	},

	getImageAspectRatio: function() {
		let image = this.$el.find('img')[0];
		return image.naturalHeight / image.naturalWidth;
	},

	getDefaultWidth: function() {
		if (this.aspectRatio < 1) {
			return this.defaultSize;
		} else {
			return this.defaultSize / this.aspectRatio;
		}
	},

	getDefaultHeight: function() {
		if (this.aspectRatio > 1) {
			return this.defaultSize;
		} else {
			return this.defaultSize * this.aspectRatio;
		}
	},

	getOriginalImageWidth: function() {

		// check for model
		//
		if (!this.model) {
			return;
		}

		// get raster width
		//
		if (this.model.has('resolution')) {
			let resolution = this.model.get('resolution');
			return resolution[0];

		// get vector width
		//
		} else if (this.model.has('dimensions')) {
			let dimensions = this.model.get('dimensions');
			return typeof dimensions[0] == 'number'? dimensions[0] : this.getDefaultWidth();

		// get default width
		//
		} else {
			return this.getDefaultWidth();
		}
	},

	getOriginalImageHeight: function() {

		// check for model
		//
		if (!this.model) {
			return;
		}

		// get raster height
		//
		if (this.model.has('resolution')) {
			let resolution = this.model.get('resolution');
			return resolution[1];

		// get vector height
		//
		} else if (this.model.has('dimensions')) {
			let dimensions = this.model.get('dimensions');
			return typeof dimensions[1] == 'number'? dimensions[1] : this.getDefaultHeight();

		// get default height
		//
		} else {
			return this.getDefaultHeight();
		}
	},

	//
	// zoom querying methods
	//

	getScale: function() {
		if (this.model) {
			if (this.aspectRatio < this.getAspectRatio()) {
				let imageWidth = this.getImageWidth();
				let originalImageWidth = this.getOriginalImageWidth();
				return imageWidth / originalImageWidth;
			} else {
				let imageHeight = this.getImageHeight();
				let originalImageHeight = this.getOriginalImageHeight();
				return imageHeight / originalImageHeight;
			}
		}		
	},

	getZoom: function(zoomMode) {

		// return zoom of a particular zoom mode
		//
		if (zoomMode) {
			switch (zoomMode) {
				case 'fit_width':
					return this.getWidth() / this.getOriginalImageWidth() * 100;
				case 'fit_height':
					return this.getHeight() / this.getOriginalImageHeight() * 100;
				case 'fit_size':
					return Math.min(this.getZoom('fit_width'), this.getZoom('fit_height'));
				case 'actual_size':
					return 100;
			}		
		}
		
		// return current zoom
		//
		return this.getScale() * 100;
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {
			case 'background_color':
				this.$el.css('background-color', value || '');
				break;
			case 'show_smoothing':
				this.setSmoothing(value);
				break;
		}
	},

	setSmoothing: function(smoothing) {			
		if (smoothing) {
			this.$el.removeClass('pixelated');
		} else {
			this.$el.addClass('pixelated');
		}
	},

	//
	// loading methods
	//

	loadFile: function(model, options) {
		this.clear();

		// set attributes
		//
		this.model = model;
		this.loaded = false;

		// remove any previous image
		//
		this.$el.find('img').remove();

		// remove any previous message
		//
		this.hideMessage();

		// create new image
		//
		let image = $('<img class="loading spinner">').attr({
			'src': this.model.getUrl(),
		});

		// create image loading callback
		//
		image.on('load', () => {

			// check if view still exists
			//
			if (this.isDestroyed()) {
				return;
			}

			this.setTimeout(() => {

				// remove spinner styles
				//
				image.removeAttr('class');
				this.loaded = true;
				this.offsetHeight = 0;

				// force edge browser to stop animation
				//
				image.css({
					'animation': 'none'
				});

				// perform action
				//
				this.onLoad(image[0]);

				// perform callback
				//
				if (options && options.success) {
					options.success(image);
				}
			}, this.image_load_delay);
		});

		// set error handler
		//
		image.on('error', (event) => {
			$(event.target).remove();
			this.onError("404 - Image Not Found");

			// perform callback
			//
			if (options && options.error) {
				options.error();
			}
		});

		// load image into DOM
		//
		this.$el.append(image);
	},

	reload: function() {
		if (this.model) {
			this.loadFile(this.model);
		}
	},

	clear: function() {
		this.model = null;
		this.loaded = false;

		// remove any previous image
		//
		this.$el.find('img').remove();

		// remove any previous message
		//
		this.hideMessage();
	},

	//
	// zooming methods
	//

	setScale: function(scale) {

		// set scale of image element
		//
		if (this.model) {
			let image = this.$el.find('img');
			let position = this.getScrollPosition();

			// find zoomed image dimensions
			//
			let width = this.getOriginalImageWidth() * scale;
			let height = this.getOriginalImageHeight() * scale;

			image.attr({
				width: width,
				height: height
			});
			this.$el.find('img').removeClass('fit width height size');

			// reset scroll
			//
			this.setScrollPosition(position);
		}
	},

	setZoom: function(zoom) {
		if (typeof zoom == 'string') {
			switch (zoom) {
				case 'fit_width':
					this.fitWidth();
					break;
				case 'fit_height':
					this.fitHeight();
					break;
				case 'fit_size':
					this.fitSize();
					break;
				case 'actual_size':
					this.setZoom(100);
					break;
			}
		} else if (zoom) {
			this.zoom = zoom;
			this.setScale(zoom / 100);
		}
	},

	setRotation: function(rotation) {
		if (rotation % 360 == 0) {
			this.$el.find('img').css('transform', '');
		} else {
			this.$el.find('img').css('transform', 'rotate(' + rotation + 'deg)');
		}
	},

	//
	// fitting methods
	//

	fitWidth: function() {

		// set attribute
		//
		this.zoom = 'fit_width';

		// set scale of image element
		//
		this.$el.find('img').attr('class', 'fit width');
	},

	fitHeight: function() {

		// set attribute
		//
		this.zoom = 'fit_height';

		// remove vertical centering
		//
		this.$el.find('img').attr('class', 'fit height');
	},

	fitSize: function() {

		// set attribute
		//
		this.zoom = 'fit_size';

		// set scale of image element
		//
		this.$el.find('img').attr('class', 'fit size');
	},

	//
	// rendering methods
	//

	onRender: function() {

		// apply preferences
		//
		if (this.options.preferences) {
			this.options.preferences.applyTo(this);
		}

		// load initial image file
		//
		if (this.model) {
			this.loadFile(this.model);
		}
	},

	showMessage: function(message) {
		this.$el.append($('<div class="message">' + message + '</div>'));
	},

	hideMessage: function() {
		this.$el.find('.message').remove();
	},

	//
	// event handling methods
	//

	onLoad: function(image) {
		this.aspectRatio = this.getImageAspectRatio();

		// set zoom
		//
		switch (this.zoom || 'fit_size') {
			case 'fit_width':
				this.fitWidth();
				break;
			case 'fit_height':
				this.fitHeight();
				break;
			case 'fit_size':
				this.fitSize();				
				break;
		}

		// set scroll bars to center
		//
		this.setScrollPosition({
			left: 0.5,
			top: 0.5
		});

		// set smoothing
		//
		if (this.options.preferences.has('show_smoothing')) {
			this.setSmoothing(this.options.preferences.get('show_smoothing'));
		}

		// perform callback
		//
		if (this.options.onload) {
			this.options.onload(image);
		}
	},

	onError: function(message) {

		// perform callback
		//
		if (this.options.onerror) {
			this.options.onerror(message);
		}
	},

	//
	// mouse event handling methods
	//

	onMouseDown: function(event) {

		// prevent selection / dragging of image
		//
		event.preventDefault();
	},

	//
	// window event handling methods
	//

	onScroll: function() {

		// save scroll position
		//
		this.position = this.getScrollPosition();
	},

	onResize: function() {
		if (this.zoom == 'fit_size') {
			this.fitSize();
		}

		// reset scroll bars
		//
		this.setScrollPosition(this.position);
	}
}));