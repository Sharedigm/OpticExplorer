/******************************************************************************\
|                                                                              |
|                                marker-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a selectable, unscaled marker element.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ShapeView from '../../../views/svg/shapes/shape-view.js';
import Selectable from '../../../views/behaviors/selection/selectable.js';
import MouseDragElementBehavior from '../../../views/svg/viewports/behaviors/manipulation/mouse-drag-element-behavior.js';

export default ShapeView.extend(_.extend({}, Selectable, {

	//
	// attributes
	//

	tagName: 'svg',
	className: 'marker',
	width: 20,
	height: 20,
	layer: 'overlay',
	unscaled: true,
	blocking: true,

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (this.options.icon) {
			this.icon = this.options.icon;
		}
		if (this.options.width) {
			this.width = this.options.width;
		}
		if (this.options.height) {
			this.height = this.options.height;
		}
		if (this.options.layer) {
			this.layer = this.options.layer;
		}
		if (this.options.parent) {
			this.parent = this.options.parent;
		}

		// set options
		//
		if (this.options.blocking) {
			this.blocking = this.options.blocking;
		}
		if (this.options.draggable) {
			this.draggable = this.options.draggable;
		}
		if (this.options.direction) {
			this.direction = this.options.direction;
		}
		if (this.options.constrain) {
			this.constrain = this.options.constrain;
		}

		// listen to model
		//
		this.listenTo(this.model, 'change', this.onChange);
		this.listenTo(this.model, 'destroy', this.destroy);

		// listen to viewport
		//
		if (this.unscaled) {
			this.listenTo(this.options.viewport, 'change:scale', this.onChangeScale);
		}
	},
	
	//
	// attribute methods
	//

	title: function() {
		if (this.options.title) {
			let index = this.model.getIndex();
			return this.options.title + (index != undefined? (index + 1) : '');
		} 
	},

	attributes: function() {
		let location = this.getLocation();

		// convert values to strings
		//
		let x = this.valueToString(location.x);
		let y = this.valueToString(location.y);

		return {
			'x': x + 'mm',
			'y': y + 'mm'
		};
	},

	//
	// querying methods
	//

	hasIcon: function() {
		return this.getIcon() != null;
	},

	//
	// getting methods
	//

	getIcon: function() {
		return this.icon;
	},

	getLocation: function() {
		return this.model.get('location');
	},

	getPosition: function() {
		let location = this.model.get('location');
		if (location) {
			return {
				left: location.x,
				top: location.y
			};
		}
	},

	//
	// setting methods
	//

	setIcon: function(icon) {
		this.icon = $(icon);

		// update and add icon
		//
		this.setIconAttributes(this.icon);
		this.$el.find('.icon').remove();
		this.$el.append(this.icon);

		// set initial scale
		//
		this.setScale(this.options.viewport.scale);
	},

	setScale: function(scale) {

		// set attributes
		//
		if (this.icon) {
			this.icon.attr({
				'width': this.width / scale,
				'height': this.height / scale,
				'x': -this.width / 2 / scale,
				'y': -this.height / 2 / scale
			});
		}
	},

	setRotation: function(rotation) {
		let hOffset = 256;
		let vOffset = 256;

		// set attributes
		//
		this.rotation = rotation;
		this.icon.find('path').attr({
			'transform': 
				'translate(' + (hOffset) + ', ' + (vOffset) + '),' + 
				'rotate(' + Math.round(rotation) + '),' +
				'translate(' + (-hOffset) + ', ' + (-vOffset) + ')'
		});
	},

	setElementColor: function(element, color) {
		if (color) {
			element.addClass('colored');
			element.attr('fill', color);
		} else {
			element.removeClass('colored');
			element.removeAttr('fill');
		}
	},

	setColor: function(color) {
		this.setElementColor(this.$el, color);
	},

	setIconAttributes: function(icon) {
		icon.attr({
			'class': 'unscaled icon',
			'width': this.width,
			'height': this.height,
			'x': -this.width / 2,
			'y': -this.height / 2,
			'data-toggle': 'tooltip',
			'title': _.result(this, 'title')
		});
	},

	setCursor: function() {
		switch (this.direction) {
			case 'horizontal':
				this.options.viewport.$el.css('cursor', 'ew-resize');
				break;
			case 'vertical':
				this.options.viewport.$el.css('cursor', 'ns-resize');
				break;
			default:
				this.options.viewport.$el.css('cursor', 'grab');
				break;
		}
	},

	resetCursor: function() {
		this.options.viewport.$el.css('cursor', '');
	},

	//
	// adding methods
	//

	addIcon: function(svg) {
		if (this.hasIcon()) {
			this.appendIcon(svg, this.getIcon());
		} else {
			this.fetchIcon().then((icon) => {
				this.appendIcon(svg, $(icon));
			});
		}
	},

	addDragBehavior: function() {
		this.dragBehavior = new MouseDragElementBehavior(this.$el, {
			viewport: this.options.viewport,
			on: true,

			// options
			//
			blocking: this.blocking,
			direction: this.direction,
			constrain: this.constrain,

			// callbacks
			//
			onmousedown: () => {
				this.select();
				this.setCursor();
			},
			onmousedrag: () => {
				this.onMouseDrag();
			},
			onmouseup: () => {
				this.select();
				this.resetCursor();
			},
		});
	},

	//
	// svg rendering methods
	//

	onRender: function() {

		// set behaviors
		//
		if (this.draggable) {
			this.addDragBehavior();

			// set marker cursor
			//
			switch (this.direction) {
				case 'horizontal':
					this.$el.addClass('horizontally draggable');
					break;
				case 'vertical':
					this.$el.addClass('vertically draggable');
					break;
				default:
					this.$el.addClass('draggable');
			}
		}

		// set marker attributes
		//
		if (this.rotation) {
			this.setRotation(this.rotation);
		}

		// add tooltip triggers
		//
		if (this.title) {
			this.addTooltips();
		}
	},

	appendIcon: function(svg, icon) {
		this.icon = $(icon);

		// update and add icon
		//
		this.setIconAttributes(this.icon);
		$(svg).append(this.icon);

		// set initial scale
		//
		this.setScale(this.options.viewport.scale);
	},

	toElement: function() {

		// create element
		//
		let el = ShapeView.prototype.toElement.call(this);

		// set attributes
		//
		this.addIcon(el);

		// set color attributes
		//
		if (this.model.has('color')) {
			this.setElementColor($(el), this.model.get('color'));
		}

		return el;
	},

	//
	// updating methods
	//

	update: function() {
		let location = this.model.get('location');

		// convert values to strings
		//
		let x = this.valueToString(location.x);
		let y = this.valueToString(location.y);

		// update location
		//
		this.$el.attr('x', x + 'mm');
		this.$el.attr('y', y + 'mm');
	},

	//
	// event handling methods
	//

	onChange: function() {
		
		// on location change
		//
		if (this.model.hasChanged('location')) {
			this.update();
		}

		// on color change
		//
		if (this.model.hasChanged('color')) {
			this.setColor(this.model.get('color'));
		}
	},

	onChangeScale: function() {
		this.setScale(this.options.viewport.scale);
	},

	//
	// mouse event handling methods
	//

	onMouseDrag: function() {
		let point = this.dragBehavior.getElementLocation();

		// update marker location
		//
		this.model.moveTo(point);

		// perform callback
		//
		if (this.options.ondrag) {
			this.options.ondrag(point);
		}
	}
}));