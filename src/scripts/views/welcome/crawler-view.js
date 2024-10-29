/******************************************************************************\
|                                                                              |
|                               crawler-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the initial scrolling background crawler.                |
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
import Timeable from '../../views/behaviors/effects/timeable.js';
import '../../../vendor/jquery/waitforimages/jquery.waitforimages.js';

export default BaseView.extend(_.extend({}, Timeable, {

	//
	// attributes
	//

	className: 'crawler',

	template: template(`
		<div class="desktop-only tilted3d">
			<% if (images.length) { %>
			<div class="images">
				<% for (let repeat = 0; repeat < repeats; repeat++) { %>
				<div class="rows">
				<% let rows = Math.ceil(images.length / items_per_row); %>
				<% let index = 0; %>
				<% for (let row = 0; row < rows; row++) { %>
				<div class="row">
				<% for (let item = 0; item < items_per_row; item++) { %>
				<% let image = images[index]; %>
					<div class="item">
						<img src="<%= image %>">
					</div>
				<% index++; %>
				<% if (index == images.length) { break; } %>
				<% } %>
				</div>
				<% } %>
				</div>
				<% } %>
			</div>
			<% } else { %>
			<div class="annotated images">
				<% for (let repeat = 0; repeat < repeats; repeat++) { %>
				<div class="rows">
				<% let keys = Object.keys(images); %>
				<% let rows = Math.ceil(keys.length / items_per_row); %>
				<% let index = 0; %>
				<% for (let row = 0; row < rows; row++) { %>
				<div class="row">
				<% for (let item = 0; item < items_per_row; item++) { %>
				<% let key = keys[index]; %>
				<% let image = images[key]; %>
					<div class="item">
						<img src="<%= image %>">
						<div class="caption"><%= key %></div>
					</div>
				<% index++; %>
				<% if (index == keys.length) { break; } %>
				<% } %>
				</div>
				<% } %>
				</div>
				<% } %>
			<% } %>
			</div>
		</div>
	`),

	// 
	// image attributes
	//

	items_per_row: 3,

	//
	// transformation attributes
	//

	scale: 1,
	rotation: 0,
	fov: 100,

	//
	// animation attributes
	//

	step: 5,
	time_step: 50,

	//
	// constructor
	//

	initialize: function() {

		// set optional attributes
		//
		if (this.options.scale != undefined) {
			this.scale = this.options.scale;
		}
		if (this.options.rotation != undefined) {
			this.rotation = this.options.rotation;
		}
		if (this.options.fov != undefined) {
			this.fov = this.options.fov;
		}
		if (this.options.step != undefined) {
			this.step = this.options.step;
		}
		if (this.options.time_step != undefined) {
			this.time_step = this.options.time_step;
		}
		if (this.options.items_per_row != undefined) {
			this.items_per_row = this.options.items_per_row;
		}

		this.resizeHandler = () => {
			this.onResize();
		};

		this.setImages(this.options.images);
	},

	//
	// setting methods
	//

	setImages: function(images) {

		// set image attributes
		//
		this.images = images;
		this.numImages = Object.keys(this.images).length;
		this.numRows = Math.ceil(this.numImages / this.items_per_row);
		this.repeats = 3;
	},

	//
	// getting methods
	//

	getTransform: function() {
		let width = this.$el.width();
		let height = this.$el.height();
		let diagonal = Math.sqrt(width * width + height * height);
		let distance = diagonal / 2 / Math.tan(this.fov * Math.PI / 180 / 2);
		let translation1 = 'translate(0%, 50%)';
		let perspective = 'perspective(' + distance + 'px)';
		let rotation = 'rotateX(' + this.rotation + 'deg)';
		let translation2 = 'translate(0%, -50%)';
		let magnification = diagonal / 900;
		let scale = 'scale(' + (this.scale * magnification) + ')';
		return perspective + ' ' + translation1 + ' ' + rotation + ' ' + scale + ' ' + translation2;
	},

	//
	// rendering methods
	//

	templateContext: function() {		
		return {
			repeats: this.repeats,
			images: this.images,
			items_per_row: this.items_per_row
		};
	},

	onAttach: function() {
		this.transform();

		// wait for images to load
		//
		this.$el.find('.images').waitForImages(() => {
			this.animate();
		});

		// handle resize events
		//
		$(window).on("resize", this.resizeHandler);
	},

	update: function() {
		this.$el.find('.images').css('margin-top', this.offset + 'px');
		this.offset -= this.step;

		// check for repeat
		//
		if (this.step < 0) {
			if (this.offset > this.startHeight) {
				this.offset = this.endHeight;
			}
		} else {
			if (this.offset < this.endHeight) {
				this.offset = this.startHeight;
			}
		}
	},

	transform: function() {
		this.$el.find('.tilted3d').css('transform', this.getTransform());
	},

	//
	// animating methods
	//

	animate: function() {

		// compute rows
		//
		this.rowsHeight = $(this.$el.find('.images')).height() / this.repeats;
		this.startHeight = 0;
		this.endHeight = this.startHeight - this.rowsHeight;

		// start cycle
		//
		this.offset = this.startHeight;
		this.start();
	},

	start: function() {
		this.setInterval(() => {

			// update view
			//
			this.update();
		}, this.time_step);			
	},

	//
	// window event handling methods
	//

	onResize: function() {

		// recompute perspective
		//
		this.transform();
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		$(window).off("resize", this.resizeHandler);
	}
}));