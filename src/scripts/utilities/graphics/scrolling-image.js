/******************************************************************************\
|                                                                              |
|                              scrolling-image.js                              |         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a scrolling image component that can be             |
|        used for 2D scroller games and parallax scrolling effects.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default class ScrollingImage {

	constructor(src, options) {

		// set attributes
		//
		this.id = options.id;
		this.src = src;
		this.width = options.width;
		this.height = options.height;
		this.skip = options.skip || 0;
		this.top = options.top;
		this.bottom = options.bottom;
		this.left = options.left;

		// set animation attributes
		//
		this.speed = options.speed || 0;
		this.offset = 0;
		this.animation_name = options.animation_name;
		this.animation_duration = options.animation_duration;

		// create container
		//
		this.element = document.createElement('div');
		this.element.className = options.class + ' layer';

		// create array of images
		//
		this.images = [];
		if (options.width == 1 && this.speed == 0 && this.left == 0) {
			this.images.push(this.createImage(options));
		} else {
			let numImages = 1 + Math.trunc(2 / options.width);
			this.levels = options.height? Math.trunc(1 / options.height) : 1;
			for (let level = 0; level < this.levels; level++) {
				for (let i = -1; i < numImages; i++) {
					let image = this.createImage(options);
					this.images.push(image);
					image.index = i;
					image.level = level;
				}
			}
		}

		return this;
	}

	//
	// methods
	//

	createImage(options) {
		let image = new Image();

		// set image attributes
		//
		image.src = options.src;

		return image;
	}

	addImage(index, src, options) {

		// add to list
		//
		this.images[index] = this.createImage(src, options);
	}

	addOffset(offset) {
		this.offset += offset;

		// handle wraparound
		//
		if (this.offset > (this.width + this.skip)) {
			this.offset -= (this.width + this.skip);
		}
		if (this.offset < 0) {
			this.offset += (this.width + this.skip);
		}

		$(this.element).css('left', (this.offset * 100) + '%');
	}

	update(elapsedTime) {
		this.addOffset(this.speed * elapsedTime);
	}

	//
	// disabling methods
	//

	disableSelection(element) {

		// check for Internet Explorer
		//
		if (typeof element.onselectstart!="undefined") {
			element.onselectstart = function() {
				return false;
			};

		// check for Firefox
		//
		} else if (typeof element.style.MozUserSelect != "undefined") {
			element.style.MozUserSelect = "none";

		// check for others (Opera etc.)
		//
		} else {
			element.onmousedown = function() {
				return false;
			};
		}

		element.style.cursor = "default";
	}

	disableDragging(element) {

		// this works for FireFox and WebKit
		//
		element.draggable = false;

		// this works for older web layout engines
		//
		element.onmousedown = function(event) {
			if (event && event.preventDefault)
				event.preventDefault();
			return false;
		};
		element.ondragstart = function() {
			return false;
		};
	}

	//
	// loading methods
	//

	loadImage(image) {

		// set image width and height
		//
		$(image).attr('width', (this.width * 100) + '%');

		// set image horizontal position
		//
		let left = image.index != undefined? ((this.width + this.skip) * (image.index - 1)) - this.skip : 0;
		image.style.left = ((left + this.left) * 100) + '%';

		// set image vertical position
		//
		if (this.top != undefined) {
			let level = image.level || 0;
			let height = this.height || 0;
			image.style.top = ((this.top + (level * height)) * 100) + '%';
		} else if (this.bottom != undefined) {
			image.style.bottom = (this.bottom * 100) + '%';
		}

		// add image to dom
		//
		this.element.appendChild(image);
	}

	onLoad(graphics) {
		this.graphics = graphics;
		this.loaded = true;

		// add div to graphics
		//
		this.graphics.element.appendChild(this.element);

		// load images
		//
		for (let i = 0; i < this.images.length; i++) {
			this.loadImage(this.images[i]);
		}
	}

	onUnload() {

		// remove images
		//
		for (let i = 0; i < this.images.length; i++) {
			this.graphics.removeChild(this.images[i]);
		}

		// reset attributes
		//
		this.images = null;

		// reset reference to canvas
		//
		this.graphics = null;
	}
}