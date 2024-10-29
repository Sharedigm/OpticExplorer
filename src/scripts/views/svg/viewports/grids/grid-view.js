/******************************************************************************\
|                                                                              |
|                                   grid-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility to draw a grid of regularly spaced lines.           |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';
import SVGRenderable from '../../../../views/svg/behaviors/svg-renderable.js';
import Vector2 from '../../../../utilities/math/vector2.js';
import Bounds2 from '../../../../utilities/bounds/bounds2.js';

export default BaseView.extend(_.extend({}, SVGRenderable, {

	//
	// attributes
	//

	className: 'grid',
	layer: 'background',

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (!this.options.spacing) {
			this.options.spacing = 1;
		}

		// set attributes
		//
		this.setBounds(this.options.viewport.bounds);
		this.setPattern({
			'id': 'grid' + (this.constructor.prototype.count++) + '-grid-pattern'
		});

		// listen to viewport
		//
		if (this.options.viewport) {
			this.listenTo(this.options.viewport, 'resize', this.onResize);
			this.listenTo(this.options.viewport, 'change:scale', this.onZoom);
			this.listenTo(this.options.viewport, 'change:offset', this.onChange);
		}
	},

	//
	// getting methods
	//

	getGridBounds: function(bounds) {
		let xmin = Math.ceil(bounds.x.min / this.spacing) * this.spacing;
		let xmax = Math.ceil(bounds.x.max / this.spacing) * this.spacing;
		let ymin = Math.ceil(bounds.y.min / this.spacing) * this.spacing;
		let ymax = Math.ceil(bounds.y.max / this.spacing) * this.spacing;
		return new Bounds2(new Vector2(xmin, ymin), new Vector2(xmax, ymax));
	},

	getPattern: function(attributes) {
		let spacing = this.options.spacing;

		// create pattern
		//
		let pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');

		// set attributes
		//
		for (let name in attributes) {
			$(pattern).attr(name, attributes[name]);
		}
		$(pattern).attr('width', spacing + 'mm');
		$(pattern).attr('height', spacing + 'mm');
		pattern.setAttributeNS(null, 'patternUnits', 'userSpaceOnUse');

		// create svg
		//
		let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		$(svg).attr('x', 0);
		$(svg).attr('y', 0);
		$(svg).attr('width', spacing + 'mm');
		$(svg).attr('height', spacing + 'mm');
		svg.setAttributeNS(null, 'viewBox', '0 0 ' + spacing + ' ' + spacing);

		// create path
		//
		let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		$(path).attr('d', 'M ' + spacing + ' 0 ' + 'L 0 0 0 ' + spacing);

		// set path attributes
		//
		$(path).attr('fill', 'none');

		// add path to svg
		//
		$(svg).append(path);

		// add svg to pattern
		//
		$(pattern).append(svg);

		return pattern;
	},

	//
	// setting methods
	//

	setBounds: function(bounds) {
		this.bounds = bounds;

		// set element attributes
		//
		if (this.$el && bounds) {
			this.$el.attr('x', bounds.left);
			this.$el.attr('y', bounds.bottom);
			this.$el.attr('width', bounds.width());
			this.$el.attr('height', bounds.height());
		}
	},

	setPattern: function(attributes) {
		this.pattern = this.getPattern(attributes);

		// find or create defs
		//
		let defs = this.options.viewport.$el.find('defs')[0];
		if (!defs) {
			defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
			this.options.viewport.$el.append(defs);
		}

		// add pattern to defs
		//
		$(defs).append(this.pattern);
	},

	//
	// svg rendering methods
	//

	toElement: function() {

		// create element
		//
		let el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

		// set attributes
		//
		$(el).attr({
			class: this.className,
			x: this.bounds.left,
			y: this.bounds.bottom,
			width: '100%',
			height: '100%',
			fill: 'url(#' + $(this.pattern).attr('id') + ')'
		});

		return el;
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.setBounds(this.options.viewport.bounds);
	},

	onZoom: function() {
		this.setBounds(this.options.viewport.bounds);
	},

	//
	// window event handling methods
	//

	onResize: function() {
		this.setBounds(this.options.viewport.bounds);
	}
}, {
	
	//
	// static attributes
	//

	count: 0	
}));