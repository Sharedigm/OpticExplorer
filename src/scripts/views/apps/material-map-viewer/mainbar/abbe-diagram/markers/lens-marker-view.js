/******************************************************************************\
|                                                                              |
|                             lens-marker-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a marker on the Abbe glass diagram.            |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ColorScheme from '../../../../../../models/optics/materials/color-scheme.js';
import MarkerView from '../../../../../../views/svg/shapes/marker-view.js';
import Selectable from '../../../../../../views/behaviors/selection/selectable.js';

export default MarkerView.extend(_.extend({}, Selectable, {

	//
	// attributes
	//

	className: 'lens marker',
	width: 50,
	height: 50,

	//
	// rendering attributes
	//

	icon: `
		<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 24 48">
			<path d="M12 0c-4.198 0-8 3.403-8 7.602 0 6.243 6.377 6.903 8 16.398 1.623-9.495 8-10.155 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.342-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
		</svg>
	`,

	//
	// constructor
	//

	initialize: function(options) {

		// call superclass constructor
		//
		MarkerView.prototype.initialize.call(this, options);

		// listen to viewport
		//
		this.listenTo(this.options.viewport, 'change:offset', this.onChangeOffset);
		// this.listenTo(this.options.viewport, 'change:scale', this.onChangeScale);
		this.listenTo(this.options.viewport, 'resize', this.onResize);
	},

	//
	// querying methods
	//

	title: function() {	
		let title = '';
		let elements = this.options.viewport.elements;
		for (let i = 0; i < elements.length; i++) {
			let element = elements.at(i);
			let material = element.get('material');
			if (material && material.matches(this.model)) {
				if (title != '') {
					title = title + ', ';
				}
				title += 'L' + (i + 1);
			}
		}
		return title;
	},

	attributes: function() {
		let v = this.model.get('abbe_number');
		let n = this.model.get('index_of_refraction');
		let point = this.options.viewport.abbeToVector(v, n);
		let color = ColorScheme.current? ColorScheme.current.getColorAt(n, v) : undefined;
		return {
			x: point.x + 'mm',
			y: point.y + 'mm',
			fill: color,
			stroke: color
		}
	},

	//
	// getting methods
	//

	getColor: function() {
		let v = this.model.get('abbe_number');
		let n = this.model.get('index_of_refraction');	
		if (ColorScheme.current) {
			return ColorScheme.current.getColorAt(n, v);
		}
	},

	getElements: function() {
		let elements = this.options.viewport.elements;
		let matchingElements = [];
		for (let i = 0; i < elements.length; i++) {
			let element = elements.at(i);
			let material = element.get('material');
			if (material && material.matches(this.model)) {
				matchingElements.push(element);
			}
		}
		return matchingElements;
	},

	//
	// setting methods
	//

	setColor: function(color) {
		this.$el.attr({
			fill: color,
			stroke: color
		});
	},

	setOffset: function() {

		// get tooltip offset
		//
		let material = this.model;
		let v = material.get('abbe_number') || material.getAbbeNumber();
		let n = material.get('index_of_refraction') || material.getIndexOfRefraction();
		let point = this.options.viewport.abbeToVector(v, n);
		let pixel = this.options.viewport.toPixel(point);
		let style = this.$tooltip.attr('style');

		// find attributes from style
		//
		let strings = style.split(';');
		let attributes = [];
		for (let i = 0; i < strings.length; i++) {
			let substrings = strings[i].split(':');
			let name = $.trim(substrings[0]);
			let value = $.trim(substrings[1]);
			attributes[name] = value;
		}

		// find offset
		//
		this.offset = {
			left: pixel[0] - parseFloat(attributes['left'].replace('px', '')),
			top: pixel[1] - parseFloat(attributes['top'].replace('px', ''))
		};
	},

	//
	// rendering methods
	//

	onRender: function() {

		// add tooltip attributes
		//
		$(this.el).attr({
			'data-toggle': 'tooltip',
			'title': this.title()
		});
	},

	onAttach: function() {

		// add tooltip trigger
		//
		this.addTooltips({
			trigger: 'manual',
			container: this.$el.closest('div'),

			// callbacks
			//
			placement: (element) => {
				this.$tooltip = $(element);
				this.$tooltip.addClass('permanant');
				return 'top';
			}
		});

		window.setTimeout(() => {
			this.$el.tooltip('show');
		}, 1000);
	},

	//
	// updating methods
	//

	updateColor: function() {
		this.setColor(this.getColor());
	},

	updateTooltips: function() {		
		if (this.$tooltip) {
			let material = this.model;
			let v = material.get('abbe_number') || material.getAbbeNumber();
			let n = material.get('index_of_refraction') || material.getIndexOfRefraction();
			let point = this.options.viewport.abbeToVector(v, n);
			let pixel = this.options.viewport.toPixel(point);

			if (!this.offset) {
				this.setOffset();
			}

			let style = 'top:' + (pixel[1] - this.offset.top) + 'px;' + 
				' left:' + (pixel[0] - this.offset.left) + 'px;' + ' display:block';
			this.$tooltip.attr('style', style);
		}
	},

	//
	// selection event handling methods
	//

	select: function() {
		this.$el.addClass('selected');

		// update listeners
		//
		let elements = this.getElements();
		for (let i = 0; i < elements.length; i++) {
			elements[i].trigger('select');
		}

		// perform callback
		//
		if (this.options && this.options.onselect) {
			this.options.onselect(this);
		}
	},

	deselect: function() {
		this.$el.removeClass('selected');

		// update listeners
		//
		let elements = this.getElements();
		for (let i = 0; i < elements.length; i++) {
			elements[i].trigger('deselect');
		}

		// perform callback
		//
		if (this.options && this.options.ondeselect) {
			this.options.ondeselect(this);
		}
	},

	//
	// viewport event handling methods
	//

	onChangeOffset: function() {
		this.updateTooltips();
	},

	onChangeScale: function() {
		this.updateTooltips();

		// call superclass method
		//
		MarkerView.prototype.onChangeScale.call(this);
	}
}));