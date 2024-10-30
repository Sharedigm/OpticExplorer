/******************************************************************************\
|                                                                              |
|                               abbe-diagram-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing materials on an Abbe diagram.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../../../models/base-model.js';
import Path from '../../../../../models/shapes/path.js';
import MaterialMap from '../../../../../models/optics/materials/material-map.js';
import ColorScheme from '../../../../../models/optics/materials/color-scheme.js';
import Elements from '../../../../../collections/optics/elements/elements.js';
import Materials from '../../../../../collections/optics/materials/materials.js';
import PathView from '../../../../../views/svg/shapes/path-view.js';
import AnnotatedViewportView from '../../../../../views/svg/annotation/annotated-viewport-view.js';
import DynamicShadowing from '../../../../../views/svg/viewports/behaviors/rendering/dynamic-shadowing.js';
import DynamicShading from '../../../../../views/svg/viewports/behaviors/rendering/dynamic-shading.js';
import TextLabelView from '../../../../../views/svg/annotation/text-label-view.js';
import AbbeMarkerView from '../../../../../views/apps/material-map-viewer/mainbar/abbe-diagram/markers/abbe-marker-view.js';
import MaterialMarkersView from '../../../../../views/apps/material-map-viewer/mainbar/abbe-diagram/markers/material-markers-view.js';
import LensMarkersView from '../../../../../views/apps/material-map-viewer/mainbar/abbe-diagram/markers/lens-markers-view.js';
import MouseMoveBehavior from '../../../../../views/behaviors/mouse/mouse-move-behavior.js';
import Vector2 from '../../../../../utilities/math/vector2.js';

export default AnnotatedViewportView.extend(_.extend({}, DynamicShadowing, DynamicShading, {

	//
	// attributes
	//

	className: 'abbe diagram auto viewport',

	//
	// viewport attributes
	//

	layers: ['background', 'shadows', 'underlay', 'normal', 'overlay'],
	delayed_shadow_scale: 0.5,
	max_shadow_scale: 5,

	filters: `
		<!-- soft shadow effect filters -->

		<filter id="softish-shadow" x="-50%" y="-50%" width="200%" height="200%" primitiveUnits="objectBoundingBox" filterRes="100">
			<feGaussianBlur in="SourceAlpha" result="blur" stdDeviation="0.015" />
		</filter>

		<filter id="colored-softish-shadow" x="-50%" y="-50%" width="200%" height="200%" primitiveUnits="objectBoundingBox" filterRes="100">
			<feGaussianBlur in="SourceGraphic" stdDeviation=".015" />
			<feColorMatrix type="matrix" values=
				".5  0  0  0  0
				  0 .5  0  0  0
				  0  0 .5  0  0
				  0  0  0  1  0" />
		</filter>

		<!-- background filters -->

		<filter x="-.05" y="0.15" width="1.1" height="0.75" id="white-background">
			<feFlood flood-color="white"/>
			<feComposite in="SourceGraphic"/>
		</filter>

		<filter x="-.05" y="0.15" width="1.1" height="0.75" id="black-background">
			<feFlood flood-color="black"/>
			<feComposite in="SourceGraphic"/>
		</filter>

		<filter x="-.05" y="0.15" width="1.1" height="0.75" id="dark-background">
			<feFlood flood-color="#333b55"/>
			<feComposite in="SourceGraphic"/>
		</filter>

		<filter x="-.05" y="0.15" width="1.1" height="0.75" id="dark-colored-background">
			<feFlood flood-color="#273060"/>
			<feComposite in="SourceGraphic"/>
		</filter>
	`,

	gradients: `
		<radialGradient id="abbe-highlight" cx="0%" cy="0%" r="200%" fx="0%" fy="-50%" gradientUnits="userSpaceOnUse">
			<stop offset="0%" stop-color="white" stop-opacity="1" />
			<stop offset="25%" stop-color="white" stop-opacity="0.25" />
			<stop offset="100%" stop-color="white" stop-opacity="0" />
		</radialGradient>

		<linearGradient id="abbe-highlight2" x1="0%" x2="0%" y1="-50%" y2="50%" gradientUnits="userSpaceOnUse" gradientTransform="rotate(-50)">
			<stop offset="0%" stop-color="white" stop-opacity="0.5" />
			<stop offset="25%" stop-color="white" stop-opacity="1" />
			<stop offset="35%" stop-color="white" stop-opacity="0.5" />
			<stop offset="65%" stop-color="white" stop-opacity="0.25" />
			<stop offset="75%" stop-color="white" stop-opacity="0.25" />
			<stop offset="100%" stop-color="white" stop-opacity="0" />
		</linearGradient>
	`,

	// viewport attributes
	//

	center: new Vector2(50, 1.725),
	factor: new Vector2(-2, -150),
	offset: new Vector2(0, 0),
	show_x_axis: true,
	show_y_axis: true,

	events: {
		'mousedown': 'onMouseDown'
	},

	//
	// constructor
	//

	initialize: function(options) {

		// call superclass constructor
		//
		AnnotatedViewportView.prototype.initialize.call(this, options);

		// set attributes
		//
		this.model = new MaterialMap();
		this.index = this.constructor.count++;
		this.elements = new Elements();
		this.createMarkerViews();

		// set viewport attributes
		//
		if (this.options.show_grid != undefined) {
			this.show_grid = this.options.show_grid;
		}
		if (this.options.show_abbe_axis != undefined) {
			this.show_abbe_axis = this.options.show_abbe_axis;
		}
		if (this.options.show_index_axis != undefined) {
			this.show_index_axis = this.options.show_index_axis;
		}
		if (this.options.show_colored_viewport != undefined) {
			this.show_colored_viewport = this.options.show_colored_viewport;
		}

		// set diagram attributes
		//
		if (this.options.show_regions != undefined) {
			this.show_regions = this.options.show_regions;
		}
		if (this.options.show_edges != undefined) {
			this.show_edges = this.options.show_edges;
		}
		if (this.options.show_vertices != undefined) {
			this.show_vertices = this.options.show_vertices;
		}
		if (this.options.show_labels != undefined) {
			this.show_labels = this.options.show_labels;
		}
		if (this.options.show_shading != undefined) {
			this.show_shading = this.options.show_shading;
		}
		if (this.options.show_shadows != undefined) {
			this.show_shadows = this.options.show_shadows;
		}
	},

	createMarkerViews: function() {
		this.materialMarkersView = new MaterialMarkersView({
			collection: this.collection,

			// options
			//
			viewport: this,
			parent: this,

			// callbacks
			//
			onchange: this.options.onchange,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		});
		this.lensMarkersView = new LensMarkersView({
			collection: new Materials(this.elements.getUniqueMaterials()),

			// options
			//
			viewport: this,
			parent: this,

			// callbacks
			//
			onchange: this.options.onchange,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		});
	},

	//
	// converting methods
	//

	abbeToVector: function(v, n) {
		let x = (v - this.center.x) * this.factor.x;
		let y = (n - this.center.y) * this.factor.y;
		return new Vector2(x, y);
	},

	vectorToAbbe: function(vector) {
		let v = this.center.x + (vector.x / this.factor.x);
		let n = this.center.y + (vector.y / this.factor.y);
		return {v:v, n:n};
	},

	abbeToVectors: function(coords) {
		let vectors = [];
		for (let i = 0; i < coords.length; i++) {
			vectors.push(this.abbeToVector(coords[i][0], coords[i][1]));
		}
		return vectors;
	},

	toYaml: function(options) {
		return this.collection.toYaml(options);
	},

	//
	// querying methods
	//

	hasSelected: function() {
		return false;
	},

	snapTo: function(amount, factor) {
		let base = 2;
		let zoom = Math.log(amount) / Math.log(base);
		return Math.floor(Math.pow(base, zoom) * factor) / factor;
	},

	//
	// getting methods
	//

	getSelected: function() {
		return this.materialMarkersView.getSelected();
	},

	getRelativeScale: function() {
		return this.getDiagonal() / 800;
	},

	getMarkersScale: function() {
		return 100 / this.materialMarkersView.getSize();
	},

	getMarkersCenter: function() {
		return this.materialMarkersView.getCenter();
	},

	getElementView: function(model) {
		return this.lensMarkersView.getItemView(model);
	},

	//
	// setting methods
	//

	setScale: function(scale, options) {

		// call superclass method
		//
		AnnotatedViewportView.prototype.setScale.call(this, scale, options);

		// update
		//
		this.updateShadows();
	},

	setOffset: function(offset, options) {

		// call superclass method
		//
		AnnotatedViewportView.prototype.setOffset.call(this, offset, options);

		// update
		//
		this.updateShadows();
	},

	setScheme: function(value) {
		ColorScheme.setCurrent(value);
		this.updateColors();
	},

	setTheme: function(theme) {
		switch (theme) {
			case 'light':
				this.$el.removeClass('dark');
				this.$el.addClass('light');
				this.$el.removeClass('auto');
				break;
			case 'medium':
				this.$el.removeClass('dark');
				this.$el.removeClass('light');
				this.$el.removeClass('auto');
				break;
			case 'dark':
				this.$el.addClass('dark');
				this.$el.removeClass('light');
				this.$el.removeClass('auto');
				break;
			case 'auto':
				this.$el.removeClass('dark');
				this.$el.removeClass('light');
				this.$el.addClass('auto');
				break;
		}
	},

	//
	// option setting methods
	//

	setOption: function(key, value) {
		switch (key) {

			// color options
			//
			case 'scheme':
				this.setScheme(value);
				break;
			case 'theme':
				this.setTheme(value);
				break;

			// viewport options
			//
			case 'show_abbe_axis':
				this.setShowXAxis(value);
				break;
			case 'show_index_axis':
				this.setShowYAxis(value);
				break;
			case 'show_colored_viewport':
				this.setShowColoredViewport(value);
				break;

			// diagram options
			//
			case 'show_regions':
				this.setShowRegions(value);
				break;
			case 'show_edges':
				this.setShowEdges(value);
				break;
			case 'show_vertices':
				this.setShowVertices(value);
				break;
			case 'show_labels':
				this.setShowLabels(value);
				break;
			case 'show_shading':
				this.setShading(value);
				break;
			case 'show_shadows':
				this.setShadows(value);
				break;

			// other options
			//
			default:

				// call superclass method
				//
				AnnotatedViewportView.prototype.setOption.call(this, key, value);
				break;
		}
	},

	setOptions: function() {
		this.setViewportOptions();
		this.setDiagramOptions();
	},

	//
	// viewport option setting methods
	//

	setViewportOptions: function() {
		this.setShowGrid(this.options.show_grid);
		this.setShowAbbeAxis(this.options.show_abbe_axis);
		this.setShowIndexAxis(this.options.show_index_axis);
		this.setShowColoredViewport(this.options.show_colored_viewport);
	},

	setShowAbbeAxis: function(showAbbeAxis) {
		this.setShowXAxis(showAbbeAxis);
	},

	setShowIndexAxis: function(showIndexAxis) {
		this.setShowYAxis(showIndexAxis);
	},

	setShowColoredViewport: function(showColoredViewport) {
		this.setClass('colored', showColoredViewport);
	},

	//
	// diagram option setting methods
	//

	setDiagramOptions: function() {
		this.setShowRegions(this.options.show_regions);
		this.setShowEdges(this.options.show_edges);
		this.setShowVertices(this.options.show_vertices);
		this.setShowLabels(this.options.show_labels);
		this.setShading(this.options.show_shading);
		this.setShadows(this.options.show_shadows);
	},

	setShowRegions: function(value) {
		if (value) {
			this.$el.removeClass('hide-regions');
		} else {
			this.$el.addClass('hide-regions');
		}
	},

	setShowEdges: function(value) {
		if (value) {
			this.$el.removeClass('hide-edges');
		} else {
			this.$el.addClass('hide-edges');
		}
	},

	setShowVertices: function(value) {
		if (value) {
			this.$el.removeClass('hide-vertices');
		} else {
			this.$el.addClass('hide-vertices');
		}
	},

	setShowLabels: function(value) {
		if (value) {
			this.$el.removeClass('hide-labels');
		} else {
			this.$el.addClass('hide-labels');
		}
	},

	//
	// rendering methods
	//

	onAttach: function() {

		// call superclass method
		//
		AnnotatedViewportView.prototype.onAttach.call(this);

		// add mouse tracker
		//
		this.addMouseBehavior();

		// set initial state
		//
		this.setOptions();

		// load abbe data
		//
		if (!window.config.abbe) {
			fetch('config/optics/abbe.json').then((response) => response.json()).then((json) => {
				window.config.abbe = json;
				this.onLoad();
			});
		} else {
			this.onLoad();
		}
	},

	onLoad: function() {

		// set initial scale
		//
		this.setScale(this.getRelativeScale());
		this.onChange('scale');

		// render
		//
		this.showAll();
	},

	showAll: function() {
		this.showDiagram(config.abbe);
		this.showLensMarkers();
		this.showMaterialMarkers();
	},

	showDiagram: function() {

		// display annotated map
		//
		this.addElement(this.toRegions(config.abbe), 'normal');
		this.addElement(this.toShadows(), 'shadows');
		this.addElement(this.toEdges(config.abbe), 'normal');
		this.showAbbeMarkers(config.abbe);
		this.showLabels(config.abbe);
	},

	showAbbeMarkers: function(data) {

		// add markers
		//
		for (let i = 0; i < data.vertices.length; i++) {
			let vertex = data.vertices[i];
			let v = vertex[0];
			let n = vertex[1];
			let markerView = new AbbeMarkerView({
				className: 'abbe vertex marker',
				v: vertex[0],
				n: vertex[1],
				model: new BaseModel({
					abbe_number: v,
					index_of_refraction: n,
					location: this.abbeToVector(v, n)
				}),
				viewport: this
			});
			this.show(markerView);

			// add tooltip attributes
			//
			$(markerView.el).attr({
				'data-toggle': 'tooltip',
				'title': markerView.title()
			});

			// add tooltips
			//
			markerView.addTooltips({
				trigger: 'hover',
				container: 'body'				
			});
		}
	},

	toRegionCoords: function(region, vertices) {
		let coords = [];
		for (let j = 0; j < region.vertices.length; j++) {
			coords.push(vertices[region.vertices[j]]);
		}
		return coords;
	},

	toRegion: function(vertices) {
		let center = Vector2.centerOf(vertices);
		let abbeCenter = this.vectorToAbbe(center);
		let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

		// tag group
		//
		$(group).addClass('region');

		// set color
		//
		if (ColorScheme.current) {
			let color = ColorScheme.current.getColorAt(abbeCenter.n, abbeCenter.v);
			$(group).attr({
				fill: color,
				stroke: color
			});
		}

		// add path
		//
		group.append(new PathView({
			model: new Path({
				vertices: vertices
			}),
			closed: true,
			className: 'transmitted',
			viewport: this
		}).toElement());
		group.append(new PathView({
			model: new Path({
				vertices: vertices
			}),
			closed: true,
			className: 'diffuse',
			viewport: this
		}).toElement());
		group.append(new PathView({
			model: new Path({
				vertices: vertices
			}),
			closed: true,
			className: 'specular',
			viewport: this
		}).toElement());
		group.append(new PathView({
			model: new Path({
				vertices: vertices
			}),
			closed: true,
			className: 'edges',
			viewport: this
		}).toElement());

		return group;
	},

	toRegions: function(data) {
		let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

		// set attributes
		//
		$(group).attr({
			id: 'regions' + this.index,
			class: 'regions'
		});

		// add Abbe diagram regions
		//
		for (let name in data.regions) {
			let region = data.regions[name];
			if (region.vertices.length > 0) {
				let coords = this.toRegionCoords(region, data.vertices);
				let vertices = this.abbeToVectors(coords);
				$(group).append(this.toRegion(vertices));	
			}
		}

		return group;	
	},

	toShadows: function() {

		// create new use node
		//
		let xmlns = "http://www.w3.org/2000/svg";   
		let xlinkns = 'http://www.w3.org/1999/xlink';
		let use = document.createElementNS(xmlns, 'use');

		// compute shadow offset
		//
		let xOffset = 10;
		let yOffset = 10;

		// set attributes
		//
		use.setAttributeNS(xlinkns, 'xlink:href', '#regions' + this.index);
		$(use).attr({
			'class': 'shadow',
			'transform': 'translate(' + xOffset + ', ' + yOffset + ')'
		});

		return use;
	},

	toEdges: function(data) {
		let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

		// set attributes
		//
		$(group).attr({
			class: 'edges'
		});

		// add Abbe diagram lines
		//
		for (let i = 0; i < data.lines.length; i++) {
			let line = data.lines[i];
			let vertices = [];
			for (let j = 0; j < line.length; j++) {
				let vertex = data.vertices[line[j]];
				let v = vertex[0];
				let n = vertex[1];
				vertices.push(this.abbeToVector(v, n));
			}
			let pathView = new PathView({
				model: new Path({
					vertices: vertices
				}),
				layer: 'normal',
				viewport: this
			});
			$(group).append(pathView.toElement());
		}
		return group;
	},

	toVertices: function(data) {
		let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

		// set attributes
		//
		$(group).attr({
			class: 'vertices'
		});

		// add markers
		//
		for (let i = 0; i < data.vertices.length; i++) {
			let vertex = data.vertices[i];
			let v = vertex[0];
			let n = vertex[1];
			let markerView = new AbbeMarkerView({
				model: new BaseModel({
					abbe_number: v,
					index_of_refraction: n,
					location: this.abbeToVector(v, n)
				}),
				viewport: this
			});

			// add tooltip attributes
			//
			$(markerView.el).attr({
				'data-toggle': 'tooltip',
				'title': markerView.title()
			});

			$(group).append(markerView.toElement());
		}
		return group;
	},

	showLabels: function(data) {
		let labels = [];

		// add Abbe diagram regions
		//
		for (let name in data.regions) {
			let region = data.regions[name];
			let nMean = 0;
			let vMean = 0;
			if (region.vertices.length > 0) {
				for (let j = 0; j < region.vertices.length; j++) {
					let vertex = data.vertices[region.vertices[j]];
					let v = vertex[0];
					let n = vertex[1];
					nMean += n;
					vMean += v;
				}
				nMean /= region.vertices.length;
				vMean /= region.vertices.length;
			}

			// add label
			//
			if (region.vertices.length > 0) {
				let vector = this.abbeToVector(vMean, nMean).scaledBy(this.pixelsPerMillimeter);
				if (region.offset) {
					vector.x += region.offset[0];
					vector.y += region.offset[1];
				}
				let labelView = new TextLabelView({
					model: new BaseModel({
						text: name,
						center: vector			
					}),
					viewport: this
				})
				this.show(labelView);
				labels[name] = name;

				// add tooltip attributes
				//
				$(labelView.el).attr({
					'data-toggle': 'tooltip',
					'title': region.name
				});

				// add tooltips
				//
				labelView.addTooltips({
					trigger: 'hover',
					container: 'body'		
				});
			}
		}
	},

	showShadows: function() {
		this.$el.find('.shadow').removeClass('hidden');
	},

	hideShadows: function() {
		this.$el.find('.shadow').addClass('hidden');
	},

	//
	// marker rendering methods
	//

	showMaterialMarkers: function() {
		this.show(this.materialMarkersView);
	},

	showLensMarkers: function() {
		this.show(this.lensMarkersView);
	},

	addLensMarkers: function(elements) {
		let materials = elements.getUniqueMaterials();
		this.elements = elements;
		for (let i = 0; i < materials.length; i++) {
			this.lensMarkersView.collection.add(materials[i]);
		}
	},

	addMouseBehavior: function() {

		// show cursor location
		//
		this.mouseBehavior = new MouseMoveBehavior(this.$el, {
			on: true,

			// callbacks
			//
			onmousemove: (event) => {
				if (event.pageX == undefined) {
					return;
				}

				let offset = this.$el.offset();
				let h = event.pageX - offset.left;
				let v = event.pageY - offset.top;
				let point = this.toPoint(h, v);
				this.location = this.vectorToAbbe(point);

				// perform callback
				//
				this.options.onmousemove(event);
			}
		});
	},

	//
	// updating methods
	//

	updateColors: function() {

		// update region colors
		//
		this.$el.find('.regions').replaceWith(this.toRegions(config.abbe));

		// update marker colors
		//
		if (this.materialMarkersView) {
			this.materialMarkersView.updateColors();
		}
		if (this.lensMarkersView) {
			this.lensMarkersView.updateColors();
		}
	},

	//
	// mouse event handling methods
	//

	onMouseDown: function(event) {
		if (!event.shiftKey) {
			this.materialMarkersView.deselectAll();
			this.lensMarkersView.deselectAll();
		}
	}
}), {

	//
	// static attributes
	//

	count: 0
});