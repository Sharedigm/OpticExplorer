/******************************************************************************\
|                                                                              |
|                               multi-grid-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a zoomable, multiresolution grid.             |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';
import SVGRenderable from '../../../../views/svg/behaviors/svg-renderable.js';

export default BaseView.extend(_.extend({}, SVGRenderable, {

	//
	// attributes
	//

	className: 'multi grid',
	layer: 'background',
	strokeWidth: 0.5,
	
	//
	// constructor
	//

	initialize: function() {
		this.constructor.count++;

		// set optional parameter defaults
		//
		if (!this.options.numGrids) {
			this.options.numGrids = 2;
		}
		if (!this.options.gridSize) {
			this.options.gridSize = 10;
		}
		if (!this.options.minSpacing) {
			this.options.minSpacing = 0.5;
		}

		// set attributes
		//
		this.scale = this.options.scale || 1;
		this.setBounds(this.options.viewport.bounds);
		this.setPatterns({
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

	getZoomLevel: function() {

		// get log in base grid size of scale
		//
		return Math.log(this.scale / this.options.minSpacing) / Math.log(this.options.gridSize);
	},

	getMinGridSpacing: function() {

		// get minimum spacing based upon zoom level
		//
		return 1 / this.options.gridSize ** Math.floor(this.getZoomLevel());
	},

	getPatterns: function(attributes) {
		let patterns = [];
		patterns.id = attributes.id;

		// create pattern
		//
		let spacing = this.getMinGridSpacing();
		for (let i = 0; i < this.options.numGrids; i++) {
			let pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');

			// set pattern attributes
			//
			$(pattern).attr('id', attributes.id + i);
			for (let name in attributes) {
				if (name != 'id') {
					$(pattern).attr(name, attributes[name]);
				}
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

			// add background to pattern
			//
			if (i > 0) {
				let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
				$(rect).attr('width', spacing + 'mm');
				$(rect).attr('height', spacing + 'mm');
				$(rect).attr('fill', 'url(#' + attributes.id + (i - 1) + ')');

				// add rect to pattern
				//
				$(pattern).append(rect);
			}

			// create path
			//
			let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			$(path).attr('d', 'M ' + spacing + ' 0 L 0 0 0 ' + spacing);
			$(path).attr('stroke-width', this.strokeWidth / this.scale);

			// add path to svg
			//
			$(svg).append(path);

			// add svg to pattern
			//
			$(pattern).append(svg);

			// add to list of patterns
			//
			patterns[i] = pattern;

			// go to next grid
			// 
			spacing *= this.options.gridSize;
		}
		
		return patterns;
	},

	getPatternAttributes: function() {
		let attributes = [];
		let zoomLevel = this.getZoomLevel();
		let zoomFraction = zoomLevel - Math.floor(zoomLevel);
		let minAlpha = zoomFraction;

		// create pattern attributes
		//
		for (let i = 0; i < this.options.numGrids; i++) {
			attributes[i] = {};

			if (i == 0) {

				// fade in smallest grid
				//
				attributes[i]['stroke-opacity'] = minAlpha;
			} else {

				// interpolate other grids
				//
				attributes[i]['stroke-opacity'] = (minAlpha + i / (this.options.numGrids - 1) * (1 - minAlpha));
			}
		}

		return attributes;
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

		// set grid bounds
		//
		if (this.grids) {
			for (let i = 0; i < this.grids.length; i++) {
				this.grids[i].setBounds(bounds);
			}
		}
	},

	setScale: function(scale) {

		// set attributes
		//
		this.scale = scale;

		// update grid patterns
		//
		this.updatePatterns();
	},

	setPatternsAttributes: function(patterns, attributes) {
		for (let i = 0; i < patterns.length; i++) {
			let pattern = patterns[i];
			for (let key in attributes[i]) {
				$(pattern).find('path').attr(key, attributes[i][key]);
			}	
		}
	},

	setPatterns: function(attributes) {
		this.patterns = this.getPatterns(attributes);

		// update patterns attributes
		//
		this.setPatternsAttributes(this.patterns, this.getPatternAttributes());

		// find or create defs
		//
		let defs = this.options.viewport.$el.find('defs')[0];
		if (!defs) {
			defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
			this.options.viewport.$el.prepend(defs);
		}

		// add patterns to defs
		//
		for (let i = 0; i < this.patterns.length; i++) {
			$(defs).append(this.patterns[i]);
		}
	},

	//
	// svg rendering methods
	//

	toElement: function() {
		let pattern = this.patterns[this.patterns.length - 1];

		// create element
		//
		let el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

		// set attributes
		//
		$(el).attr({
			class: this.className,
			x: this.bounds? this.bounds.left : 0,
			y: this.bounds? this.bounds.bottom : 0,
			width: '100%',
			height: '100%',
			fill: 'url(#' + $(pattern).attr('id') + ')'
		});

		return el;
	},

	onRender: function() {

		// set initial scale
		//
		this.setScale(this.options.viewport.scale);
	},

	//
	// updating methods
	//

	updatePatterns: function() {
		let defs = this.options.viewport.$el.find('defs')[0];
		let minGridSpacing = this.getMinGridSpacing();
		
		// update patterns if spacing or scale changes
		//
		if (defs && minGridSpacing != this.minGridSpacing || this.patternScale != this.options.viewport.scale) {
			this.minGridSpacing = minGridSpacing;
			this.patterns = this.getPatterns({
				id: this.patterns.id
			});

			// remove previous patterns
			//
			for (let i = 0; i < this.patterns.length; i++) {
				$(defs).find('#' + $(this.patterns[i]).attr('id')).remove();
			}

			// add new patterns
			//
			for (let i = 0; i < this.patterns.length; i++) {
				$(defs).append(this.patterns[i]);
			}

			this.patternScale = this.options.viewport.scale;
		} 

		// update patterns attributes
		//
		this.setPatternsAttributes(this.patterns, this.getPatternAttributes());
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.setBounds(this.options.viewport.bounds);
	},

	onZoom: function() {
		this.setScale(this.options.viewport.scale);
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