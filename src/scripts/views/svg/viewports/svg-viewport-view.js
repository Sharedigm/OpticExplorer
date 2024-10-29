/******************************************************************************\
|                                                                              |
|                              svg-viewport-view.js                            |
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

import BaseModel from '../../../models/base-model.js';
import CollectionView from '../../../views/collections/collection-view.js';
import SVGCollectionRenderable from '../../../views/svg/behaviors/svg-collection-renderable.js';
import MultiGridView from '../../../views/svg/viewports/grids/multi-grid-view.js';
import AxisView from '../../../views/svg/shapes/axis-view.js';
import Vector2 from '../../../utilities/math/vector2.js';
import Bounds from '../../../utilities/bounds/bounds.js';
import Bounds2 from '../../../utilities/bounds/bounds2.js';
import Browser from '../../../utilities/web/browser.js';

export default CollectionView.extend(_.extend({}, SVGCollectionRenderable, {

	//
	// attributes
	//

	tagName: 'svg',
	className: 'viewport',

	template: template(`
		<defs>
			<%= filters %>
			<%= markers %>
			<%= gradients %>
		</defs>
	`),

	// viewport attributes
	//
	layers: ['background'],

	// viewport attributes
	//
	scale: 1,
	offset: new Vector2(0, 0),
	aspectRatio: 1,
	pixelsPerInch: 96,
	pixelsPerMillimeter: 96 / 25.4,

	//
	// constructor
	//

	initialize: function(options) {

		// call superclass constructor
		//
		CollectionView.prototype.initialize.call(this, options);

		// set transformation attributes
		//
		if (this.options.scale) {
			this.scale = this.options.scale;
		}
		if (this.options.offset) {
			this.offset = this.options.offset;
		}
		if (this.options.aspectRatio) {
			this.aspectRatio = this.options.aspectRatio;
		}

		// set viewport options
		//
		if (this.options.show_grid) {
			this.show_grid = this.options.show_grid;
		}
		if (this.options.show_x_axis) {
			this.show_x_axis = this.options.show_x_axis;
		}
		if (this.options.show_y_axis) {
			this.show_y_axis = this.options.show_y_axis;
		}
	},

	//
	// iterating methods
	//

	each: function(callback, filter) {
		this.children.each((childView) => {
			if (!filter || filter(childView)) {
				callback(childView);
			}
		});
	},

	//
	// getting methods
	//

	getBounds: function() {
		if (!this.width || !this.height) {
			return;
		}

		return new Bounds2(
			new Bounds(
				(-this.width / 2 / this.scale - this.offset.x),
				(this.width / 2 / this.scale - this.offset.x)
			),

			new Bounds(
				(-this.height / 2 / this.scale - this.offset.y),
				(this.height / 2 / this.scale - this.offset.y)
			)
		);
	},

	getDiagonal: function() {
		return new Vector2(this.width, this.height).length();
	},

	getFieldOfView: function() {
		return this.toPoint(this.width, this.height).length();
	},

	getChildren: function(filter) {
		let children = [];

		this.each((childView) => {
			children.push(childView);
		}, filter);

		return children;
	},

	//
	// setting methods
	//

	setOption: function(kind, value, options) {
		switch (kind) {
			case 'scale':
				this.setScale(value, options);
				break;
			case 'offset':
				this.setOfset(value, options);
				break;
			case 'show_grid':
				this.setShowGrid(value);
				break;
			case 'show_x_axis':
				this.setShowXAxis(value);
				break;
			case 'show_y_axis':
				this.setShowYAxis(value);
				break;
		}
	},

	setScale: function(scale, options) {
		if (scale == this.scale) {
			return;
		}

		// set attributes
		//
		this.scale = scale;

		// update view
		//
		this.update();

		// update
		//
		if (!options || !options.silent) {

			// trigger change
			//
			this.trigger('change:scale');

			// perform callback
			//
			this.onChange('scale');
		}
	},

	setOffset: function(offset, options) {

		// set attributes
		//
		this.offset = offset;

		// update view
		//
		this.update();

		// update
		//
		if (!options || !options.silent) {

			// trigger change
			//	
			this.trigger('change:offset');

			// perform callback
			//
			this.onChange('offset');
		}
	},

	setShowGrid: function(visible) {

		// set attributes
		//
		this.show_grid = visible;

		// add grid view to viewport
		//
		if (visible) {
			this.showGrid();
		} else if (this.gridView) {

			// destroy grid view
			//
			if (this.gridView) {
				this.gridView.destroy();
				this.gridView = null;
			}
		}
	},

	setShowXAxis: function(visible) {

		// set attributes
		//
		this.show_x_axis = visible;

		// add x axis to viewport
		//
		if (visible) {
			this.showXAxis();
		} else {

			// destroy x-axis view
			//
			if (this.xAxisView) {
				this.xAxisView.destroy();
				this.xAxisView = null;
			}
		}
	},

	setShowYAxis: function(visible) {

		// set attributes
		//
		this.show_y_axis = visible;

		// add y axis to viewport
		//
		if (visible) {
			this.showYAxis();
		} else {

			// destroy y-axis view
			//
			if (this.yAxisView) {
				this.yAxisView.destroy();
				this.yAxisView = null;
			}
		}
	},

	setBounds: function(bounds) {

		// set attributes
		//
		this.bounds = bounds;

		// set element attributes
		//
		if (bounds) {
			this.el.setAttribute('viewBox', bounds.left + ' ' + bounds.bottom + ' ' + bounds.width() + ' ' + bounds.height()); 
			this.el.setAttribute('preserveAspectRatio', 'none');
		}
	},

	setActive: function(active) {

		// update markers
		//
		if (active) {
			this.updateSize();
		}

		// add / remove defs
		//
		/*
		if (active) {

			// restore defs
			//
			if (this.$el.find('defs').length == 0 && this.defs) {
				this.$el.prepend(this.defs);
			}
		} else {

			// save defs
			//
			if (this.$el.find('defs').length > 0) {
				this.defs = this.$el.find('defs').remove();
			}
		}
		*/
	},

	//
	// converting methods
	//

	toPoint: function(h, v) {
		let x = (h - this.width / 2) / this.pixelsPerMillimeter / this.scale - this.offset.x / this.pixelsPerMillimeter;
		let y = (v - this.height / 2) / this.pixelsPerMillimeter / this.scale * this.aspectRatio - this.offset.y / this.pixelsPerMillimeter;	
		return new Vector2(x, y);
	},

	toVector2: function(point) {
		let h = (this.width / 2) + (point.x + this.offset.x / this.pixelsPerMillimeter) * this.pixelsPerMillimeter * this.scale;
		let v = (this.width / 2) + (point.y + this.offset.y / this.pixelsPerMillimeter) * this.pixelsPerMillimeter * this.scale / this.aspectRatio;
		return new Vector2(h, v);
	},

	toLocation: function(point) {
		let left = (this.width / 2) + (point.x + this.offset.x / this.pixelsPerMillimeter) * this.pixelsPerMillimeter * this.scale;
		let top = (this.width / 2) + (point.y + this.offset.y / this.pixelsPerMillimeter) * this.pixelsPerMillimeter * this.scale / this.aspectRatio;
		return {
			left: left,
			top: top
		};
	},

	toPixel: function(point) {
		let h = (this.width / 2) + (point.x + this.offset.x / this.pixelsPerMillimeter) * this.pixelsPerMillimeter * this.scale;
		let v = (this.width / 2) + (point.y + this.offset.y / this.pixelsPerMillimeter) * this.pixelsPerMillimeter * this.scale / this.aspectRatio;
		return [h, v];
	},

	//
	// animating methods
	//

	panTo: function(offset, options) {
		let start = this.offset;
		let finish = offset;
		let direction = finish.minus(start);

		// check if we are still animating
		//
		if (this.animation) {
			this.animation.stop();
		}

		this.animation = $({t: 0}).animate({t: 1}, {
			duration: options && options.duration? options.duration : 0,

			// callbacks
			//
			step: (t) => {

				// interpolate
				//
				this.setOffset(start.plus(direction.scaledBy(t)));
			},

			complete: () => {
				this.animation = null;
				
				// perform callback
				//
				if (options && options.onfinish) {
					options.onfinish();
				}
			}
		});
	},

	panToOffset: function(offset, options) {
		let start = this.offset;
		let finish = offset;
		let direction = finish.minus(start);

		// check if we are still animating
		//
		if (this.animation) {
			this.animation.stop();
		}

		this.animation = $({t: 0}).animate({t: 1}, {
			duration: options && options.duration? options.duration : 0,

			// callbacks
			//
			step: (t) => {

				// interpolate
				//
				this.setOffset(start.plus(direction.scaledBy(t)));
			},

			complete: () => {
				this.animation = null;
				
				// perform callback
				//
				if (options && options.finish) {
					options.finish();
				}
			}
		});
	},

	panToDirection: function(direction, options) {
		let offset;
		let amount = options && options.amount? options.amount : 0.5;

		switch (direction) {
			case 'up':
				offset = new Vector2(0, this.height * amount / this.scale);
				break;
			case 'down':
				offset = new Vector2(0, -this.height * amount / this.scale);
				break;
			case 'left':
				offset = new Vector2(this.width * amount / this.scale, 0);
				break;
			case 'right':
				offset = new Vector2(-this.width * amount / this.scale, 0);
				break;
		}
		this.panToOffset(this.offset.plus(offset), options);
	},

	scaleTo: function(scale, options) {
		let start = 1 / this.scale;
		let finish = 1 / scale;
		let delta = finish - start;

		// animate zoom
		//
		this.animation = $({t: 0}).animate({t: 1}, {
			duration: options && options.duration? options.duration : 0,

			// callbacks
			//
			step: (t) => {

				// interpolate scale
				//
				this.setScale(1 / (start + delta * t));
			},

			complete: () => {
				this.animation = null;

				// perform callback
				//
				if (options && options.onfinish) {
					options.onfinish();
				}
			}
		});
	},

	transformTo: function(offset, scale, options) {

		// compute zoom parameters
		//
		let startOffset = this.offset;
		let deltaOffset = offset.minus(startOffset);
		let startScale = 1 / this.scale;
		let finishScale = 1 / scale;
		let deltaScale = finishScale - startScale;

		// animate zoom
		//
		this.animation = $({t: 0}).animate({t: 1}, {
			duration: options && options.duration? options.duration : 0,

			// callbacks
			//
			step: (t) => {

				// interpolate scale and offset
				//
				this.setScale(1 / (startScale + deltaScale * t));
				this.setOffset(startOffset.plus(deltaOffset.scaledBy(t)));
			},

			complete: () => {
				this.animation = null;

				// perform callback
				//
				if (options && options.onfinish) {
					options.onfinish();
				}
			}
		});
	},

	//
	// rendering methods
	//

	_createElement: function() {
		return this.createElement(this.tagName, this.attributes);
	},

	templateContext: function() {
		return {
			filters: this.filters,
			markers: this.markers,
			gradients: this.gradients
		};
	},

	onAttach: function() {

		// set rendering attributes
		//
		this.width = this.$el.width();
		this.height = this.$el.height();

		// fix position for increased performance
		//
		this.fixPosition();

		// set bounding region
		//
		this.setBounds(this.getBounds());

		// show initial viewport
		//
		this.showViewport();
	},

	fixPosition: function() {

		// set to absolute positioning for 
		// increased performance / no reflows
		//
		this.$el.css({
			position: 'absolute',
			width: this.width,
			height: this.height,
			top: 0,
			left: 0,
			overflow: 'hidden'
		});	
	},

	unfixPosition: function() {
		this.$el.css({
			position: 'relative',
			width: '100%',
			height: '100%'
		});
		this.width = this.$el.width();
		this.height = this.$el.height();
	},

	showViewport: function() {
		this.setShowGrid(this.show_grid);
		this.setShowXAxis(this.show_x_axis);
		this.setShowYAxis(this.show_y_axis);
	},

	createElement: function(type, attributes) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', type);

		// set attributes
		//
		for (let name in attributes) {
			$(element).attr(name, attributes[name]);
		}

		return element;
	},

	addElement: function(element) {

		// add to viewport
		//
		this.$el.append(element);

		return element;
	},

	addChildView: function(view) {
		this.children._add(view);

		// render view
		//
		view.options.viewport = this;
		let element = view.render();

		// add element
		//
		this.addElement(element, view.layer);
		if (view.onAttach) {
			view.onAttach();
		}

		return element;
	},

	removeChildView: function(view) {
		this.children._remove(view);
		view.$el.remove();
	},

	show: function(view) {
		
		// add item to collection view's children
		//
		let element = this.addChildView(view);

		// perform callback
		//
		if (view.onShow) {
			view.onShow();
		}

		return element;
	},

	showGrid: function() {

		// create grid view
		//
		if (!this.gridView) {
			this.gridView = new MultiGridView({
				viewport: this,
				permanant: true
			});
			this.show(this.gridView);
		}
	},

	showXAxis: function() {

		// create x-axis view
		//
		if (!this.xAxisView) {
			this.xAxisView = new AxisView({
				model: new BaseModel({
					location: new Vector2(0, 0)
				}),
				orientation: 'horizontal',
				className: 'horizontal axis',
				viewport: this,
				permanant: true
			});
			this.show(this.xAxisView);
		}
	},

	showYAxis: function() {

		// create y-axis view
		//
		if (!this.yAxisView) {
			this.yAxisView = new AxisView({
				model: new BaseModel({
					location: new Vector2(0, 0)
				}),
				orientation: 'vertical',
				className: 'vertical axis',
				viewport: this,
				permanant: true
			});
			this.show(this.yAxisView);
		}
	},

	update: function() {

		// update bounds
		//
		this.setBounds(this.getBounds());

		// accelerate for chrome when finished updating.
		//
		if (Browser.is_chrome) {
			this.$el.find('.layer').removeClass('accelerated');
			if (this.acceltimeout) {
				window.clearTimeout(this.acceltimeout);
			}
			this.acceltimeout = window.setTimeout(() => {
				if (this.scale < 5) {
					this.$el.find('.layer').addClass('accelerated');
				}
				this.acceltimeout = null;
			}, 100);
		}
	},

	updateSize: function() {
		if (this.isVisible()) {
			this.width = this.$el.width() || this.$el.parent().width();
			this.height = this.$el.height() || this.$el.parent().height();
			this.update();
		}
	},

	clear: function() {

		// clear viewport
		//
		for (let i = 0; i < this.children.length; i++) {
			let childView = this.children.findByIndex(i);
			childView.destroy();
		}
		this.gridView = null;
		this.xAxisView = null;
		this.yAxisView = null;

		// redraw viewport
		//
		this.showViewport();
	},

	//
	// event handling methods
	//

	onChange: function(attribute) {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(attribute);
		}
	},

	//
	// window event handling methods
	//

	onResize: function() {

		// update rendering attributes
		//
		this.unfixPosition();
		this.updateSize();
		this.fixPosition();

		// notify of update
		//
		this.trigger('change:scale');
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		this.children.each((childView) => {
			childView.destroy();
		});

		if (this.animation) {
			this.animation.stop();
		}
	}
}));