/******************************************************************************\
|                                                                              |
|                                  resizable.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is defines a behavior for resizing dialogs.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import '../../../../vendor/jquery/jquery-ui/js/plugins/resizable.js';

export default {

	//
	// attributes
	//

	resizable: true,
	minSize: 'small',
	maxSize: 'large',

	//
	// getting methods
	//

	getSizeUpTo: function(sizes, max) {

		// find sizes
		//
		let minSize = _.result(this, 'minSize');
		let maxSize = _.result(this, 'maxSize');
		let keys = Object.keys(sizes);
		let minIndex = 0, maxIndex = keys.length;
		let size;

		// find min and max indices
		//
		if (minSize) {
			for (let i = 0; i < keys.length; i++) {
				if (keys[i] == minSize) {
					minIndex = i;
					break;
				}
			}
		}
		if (maxSize) {
			for (let i = 0; i < keys.length; i++) {
				if (keys[i] == maxSize) {
					maxIndex = i + 1;
					break;
				}
			}		
		}

		// find size that fits window
		//
		for (let i = minIndex; i < maxIndex; i++) {
			size = sizes[keys[i]];

			if (i < keys.length - 1) {
				let nextSize = sizes[keys[i + 1]];

				// if next size is too big, then found
				//
				if (nextSize[0] > max[0] || nextSize[1] > max[1]) {
					break;
				}
			}	
		}

		return size;
	},

	getMaxWidth: function() {
		let width = $(window).width() - config.defaults.dialogs.margin[0];
		return width * config.defaults.dialogs.scale[0];
	},

	getMaxHeight: function() {
		let height = $(window).height() - config.defaults.dialogs.margin[1];
		return height * config.defaults.dialogs.scale[1];
	},

	getDefaultSize: function(sizes) {
		let maxWidth = this.getMaxWidth();
		let maxHeight = this.getMaxHeight();

		// find candidate default sizes
		//
		if (!sizes) {
			sizes = config.defaults.dialogs.sizes;
		}

		return this.getSizeUpTo(sizes, [maxWidth, maxHeight]);
	},

	getWidth: function() {
		return this.$el.find('.modal-dialog')[0].offsetWidth;
	},

	getHeight: function() {
		return this.$el.find('.modal-dialog')[0].offsetHeight;
	},

	//
	// setting methods
	//

	setWidth: function(width) {
		this.$el.find('.modal-dialog').css({
			width: width
		});

		this.$el.find('.modal-dialog').prop('style').setProperty('width', width);

		// respond to resize
		//
		this.onResize();
	},

	setHeight: function(height) {
		this.$el.find('.modal-dialog').css({
			height: height
		});

		this.$el.find('.modal-dialog').prop('style').setProperty('width', height);

		// respond to resize
		//
		this.onResize();
	},

	setSize: function(size) {

		this.$el.find('.modal-dialog').css({
			width: size? size[0] : '',
			height: size? size[1] : ''
		});

		this.$el.find('.modal-dialog').prop('style').setProperty('width', size[0] || '');
		this.$el.find('.modal-dialog').prop('style').setProperty('height', size[1] || '');

		// respond to resize
		//
		this.onResize();
	},

	shrink: function() {
		let width = this.$el.find('.body').width();
		let index = 0;
		let keys = Object.keys(config.defaults.dialogs.sizes);
		while (width > config.defaults.dialogs.sizes[keys[index]][0]) {
			index++;
		}
		if (index > 0) {
			index--;
		}
		if (this.isFullScreen()) {
			this.exitFullScreen();
		}
		this.setSize(config.defaults.dialogs.sizes[keys[index]]);
	},

	grow: function() {
		let width = this.$el.find('.body').width();
		let index = 0;
		let keys = Object.keys(config.defaults.dialogs.sizes);
		while (width > config.defaults.dialogs.sizes[keys[index]][0]) {
			index++;
		}
		if (index < keys.length - 1) {
			index++;
		}
		if (this.isFullScreen()) {
			this.exitFullScreen();
		}
		this.setSize(config.defaults.dialogs.sizes[keys[index]]);
	},

	resetSize: function() {
		this.setSize(this.size || this.getDefaultSize());
	},

	//
	// enabling methods
	//

	enableResize: function() {

		// make modal resizable
		//
		this.$el.find('.modal-dialog').resizable({
			handles: "all",

			// callbacks
			//
			start: (event) => {
				this.onResizeStart(event);
			},
			resize: (event) => {
				this.onResize(event);
			},
			stop: (event) => {
				this.onResizeStop(event);
			}
		});
	},

	//
	// saving methods
	//

	saveSize: function() {

		// save size, including borders
		//
		let width = this.getWidth() || this.options.width;
		let height = this.getHeight() || this.options.height;
		this.options.size = [width, height];
	},

	restoreSize: function() {
		if (this.options.size || this.size) {
			this.setSize(this.options.size || this.size);
		}
	},

	//
	// window event handling methods
	//

	onResizeStart: function(event) {
		this.fixPosition();
		this.$el.find('.modal-dialog').addClass('resized');

		// perform callback
		//
		if (this.options.onResizeStart) {
			this.options.onResizeStart(event);
		}
	},

	onResize: function() {
		let width = this.getWidth();
		let height = this.getHeight();

		// check for min sizes
		//
		if (this.min_size && this.min_size[0] && width < this.min_size[0]) {
			this.setWidth(this.min_size[0]);
		}
		if (this.min_size && this.min_size[1] && height < this.min_size[1]) {
			this.setHeight(this.min_size[1]);
		}
	},

	onResizeStop: function(event) {

		// perform callback
		//
		if (this.options.onResizeStop) {
			this.options.onResizeStop(event);
		}
	}
};