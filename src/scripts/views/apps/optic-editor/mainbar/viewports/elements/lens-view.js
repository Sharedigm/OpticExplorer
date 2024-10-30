/******************************************************************************\
|                                                                              |
|                                 lens-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a view of a single lens element.            |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SVGRenderable from '../../../../../../views/svg/behaviors/svg-renderable.js';
import ElementView from '../../../../../../views/apps/optic-editor/mainbar/viewports/elements/element-view.js';
import PlanarView from '../../../../../../views/apps/optic-editor/mainbar/viewports/elements/surfaces/planar-view.js';
import SphericalView from '../../../../../../views/apps/optic-editor/mainbar/viewports/elements/surfaces/spherical-view.js';
import LensAnnotationView from '../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/elements/lens-annotation-view.js';
import Vector2 from '../../../../../../utilities/math/vector2.js';
import Bounds2 from '../../../../../../utilities/bounds/bounds2.js';
import Browser from '../../../../../../utilities/web/browser.js';

export default ElementView.extend({

	//
	// attributes
	//

	tagName: 'svg',
	className: 'lens' + ' ' + ElementView.prototype.className,

	template: template(`
		<g class="front">
			<g class="filled">
				<path class="transmitted" d="<%= drawing %>"></path>
				<path class="diffuse" d="<%= drawing %>"></path>
				<path class="specular" d="<%= drawing %>"></path>
			</g>
			<g class="stroked">
				<path class="edges" d="<%= drawing %>"></path>
				<path class="front surface"></path>
				<path class="back surface"></path>
			</g>
		</g>
	`),

	back_template: template(`
		<g class="back">
			<g class="filled">
				<path class="transmitted" d="<%= silhouette %>"></path>
				<path class="diffuse" d="<%= silhouette %>"></path>
				<path class="specular" d="<%= silhouette %>"></path>
			</g>
			<g class="stroked">
				<path class="silhouette edges" d="<%= silhouette %>"></path>
				<% if (edges) { %><path class="internal edges" d="<%= edges %>"></path><% } %>
			</g>
		</g>
	`),

	regions: {
		front: {
			el: '.front.surface',
			replaceElement: true
		},
		back: {
			el: '.back.surface',
			replaceElement: true
		}
	},

	is_multilayer: !Browser.is_firefox,

	//
	// constructor
	//

	initialize: function(options) {

		// call superclass constructor
		//
		ElementView.prototype.initialize.call(this, options);

		// set attributes
		//
		this.back_id = 'lens-back' + Math.floor(Math.random() * 10000);
		this.front_id = 'lens-front' + Math.floor(Math.random() * 10000);

		// listen to models
		//
		this.listenTo(this.model, 'load', () => this.updateColors({
			silent: true
		}));
		this.listenTo(this.model, 'change', () => this.update({
			silent: true
		}));
		this.listenTo(this.model.front, 'change', () => this.update({
			silent: true
		}));
		this.listenTo(this.model.back, 'change', () => this.update({
			silent: true
		}));
	},

	createSurfaceView: function(options) {
		switch (options.model.getProfile()) {
			case 'planar':
				return new PlanarView(options);
			case 'spherical':
				return new SphericalView(options);
		}
	},

	//
	// attribute methods
	//

	attributes: function() {
		let width = this.getWidth();
		let height = this.getHeight();
		let material = this.model.get('material');
		let color = material && material.getColor? material.getColor() : undefined;
		let x = ((this.options.offset? this.options.offset.x : 0) - this.getSurfaceOffset());
		let y = (-height / 2 + (this.options.offset? this.options.offset.y : 0));

		return {
			id: this.getId(),
			x: x + 'mm',
			y: y + 'mm',
			width: width + 'mm',
			height: height + 'mm',
			stroke: color,
			fill: color
		}
	},

	title: function() {
		let index = this.model.getLensIndex();
		return 'Lens' + (index != undefined? index + 1 : '');
	},

	//
	// getting methods
	//

	getId: function() {
		return this.options.parent.getId() + '-lens' + this.model.getIndex();
	},

	getShadowedId: function() {
		return this.$el.attr('id') + '-back';
	},

	getOffset: function() {
		let x = parseFloat(this.$el.attr('x').replace('mm', ''));
		let y = parseFloat(this.$el.attr('y').replace('mm', '')) + this.model.radius;
		return new Vector2(x + this.getSurfaceOffset(), y);
	},

	getFrontView: function() {
		return this.createSurfaceView({
			model: this.model.front,
			clockwise: true,
			viewport: this.options.viewport,
			editable: this.options.editable,
			parent: this
		});
	},

	getBackView: function() {
		return this.createSurfaceView({
			model: this.model.back,
			offset: new Vector2(this.model.thickness, 0),
			clockwise: false,
			viewport: this.options.viewport,
			editable: this.options.editable,
			parent: this
		});
	},

	getSurfaceViews: function() {
		return {
			'front': this.getFrontView(),
			'back': this.getBackView()
		};
	},

	getSurfaceOffset: function() {
		return this.model.front.isConcave()? this.model.front.thickness : 0;
	},

	getSurfaceView: function(side) {
		switch (side) {
			case 'front':
				return this.views.front;
			case 'back':
				return this.views.back;
		}
	},

	getSurfaceViewOf: function(surface) {
		if (this.views.front.model == surface) {
			return this.views.front;
		} else if (this.views.back.model == surface) {
			return this.views.back;
		}
	},

	getBounds: function() {
		let width = this.model.getMaxThickness();
		let xmin = (this.options.offset? this.options.offset.x : 0) - this.getSurfaceOffset();
		let xmax = xmin + width;
		let ymin = -this.model.radius;
		let ymax = this.model.radius;
		return new Bounds2(new Vector2(xmin, ymin), new Vector2(xmax, ymax));
	},

	getWidth: function() {
		return this.model.getMaxThickness();
	},

	getHeight: function() {
		return (this.model.radius * 2);
	},

	getAnnotation: function() {
		return new LensAnnotationView({
			model: this.model,
			parent: this,
			viewport: this.options.viewport
		});
	},

	//
	// setting methods
	//

	setColor: function(color) {
		this.setElementColor(this.$el, color);
		this.setElementColor(this.back, color);
	},

	setElementColor(element, color) {
		$(element).attr({
			'stroke': color,
			'fill': color
		});
	},

	setViewbox: function(element) {
		let width = this.model.getMaxThickness();
		let height = (this.model.radius * 2);
		let xmin = this.model.front.isConcave()? -this.model.front.thickness : 0;
		let ymin = -height / 2;
		
		// set attributes
		//
		element.setAttributeNS(null, 'viewBox', xmin + ' ' + ymin + ' ' +
			width  + ' ' + height);
	},

	setAnnotationOffset: function(offset) {

		// call superclass method
		//
		ElementView.prototype.setAnnotationOffset.call(this, offset);

		// update surfaces
		//
		this.views.front.setAnnotationOffset(offset);
		this.views.back.setAnnotationOffset(offset);
	},

	setLocation: function(x, y) {

		// add units
		//
		if (typeof x == 'number') {
			x += 'mm';
		}
		if (typeof y == 'number') {
			y += 'mm';
		}

		// call superclass method
		//
		ElementView.prototype.setLocation.call(this, x, y);

		// offset layers
		//
		$(this.back).attr({
			x: x,
			y: y
		});
	},

	//
	// selecting methods
	//

	select: function() {

		// call superclass method
		//
		ElementView.prototype.select.call(this);

		// select lens back
		//
		$(this.back).addClass('selected');

		// deselect children
		//
		this.deselectSurfaces();
	},

	deselect: function() {

		// call superclass method
		//
		ElementView.prototype.deselect.call(this);

		// select lens back
		//
		$(this.back).removeClass('selected');

		// deselect children
		//
		this.deselectSurfaces();
	},

	deselectSurfaces: function() {
		this.views.front.deselect();
		this.views.back.deselect();
	},

	//
	// editing methods
	//

	edit: function() {
		this.showEditElementDialogView();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			drawing: this.toDrawing()
		};
	},

	onRender: function() {

		// call superclass method
		//
		ElementView.prototype.onRender.call(this);

		// show child views
		//
		this.showSurfaces();
		this.addLayers();
	},

	showSurfaces: function() {
		this.showChildView('front', this.views.front);
		this.showChildView('back', this.views.back);
	},

	addLayers: function() {
		this.addShadow();
		this.addBack();
	},

	addBack: function() {
		this.back = this.toBack();
		this.options.viewport.addElement(this.back, 'underlay');
	},

	toTop: function() {

		// call superclass method
		//
		ElementView.prototype.toTop.call(this);

		// raise back lens
		//
		this.elementToTop(this.back);
	},

	//
	// svg rendering methods
	//

	toBack: function() {

		// create element
		//
		let el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		$(el).attr({
			id: this.getId() + '-back',
			class: 'lens',
			x: this.$el.attr('x'),
			y: this.$el.attr('y'),
			width: this.$el.attr('width'),
			height: this.$el.attr('height'),
			viewBox: this.$el.attr('viewBox'),
			fill: this.$el.attr('fill'),
			stroke: this.$el.attr('stroke')
		});

		// add background elements
		//
		el.innerHTML = this.back_template({
			silhouette: this.toSilhouette(),
			edges: this.toEdges()
		});

		return el;
	},

	toEdge: function(front, back, sign) {
		let x, y;

		// decreasing radius
		//
		if (front.radius > back.radius) {
			let x1 = (-this.model.thickness / 2 + front.thickness * Math.sign(front.radius_of_curvature * sign)) * sign;
			let x2 = (this.model.thickness / 2 + back.thickness * Math.sign(back.radius_of_curvature * sign)) * sign;
			x = (this.model.beveled? (x1 + x2) / 2 : x2) + this.model.thickness / 2;
			y = front.radius * sign;

		// increasing radius
		//
		} else if (front.radius < back.radius) {
			let x1 = (-this.model.thickness / 2 + front.thickness * Math.sign(front.radius_of_curvature * sign)) * sign;
			let x2 = (this.model.thickness / 2 + back.thickness * Math.sign(back.radius_of_curvature * sign)) * sign;
			x = (this.model.beveled? (x1 + x2) / 2 : x1) + this.model.thickness / 2;
			y = back.radius * sign;

		// same radius
		//
		} else {
			return null;
		}

		// convert values to strings
		//
		x = this.valueToString(x);
		y = this.valueToString(y);

		return 'L ' + x + ' ' + y;
	},

	toDrawing: function() {
		let d1 = this.views.front.toDrawing(new Vector2(0, 0), true);
		let e1 = this.toEdge(this.model.front, this.model.back, 1);
		let d2 = this.views.back.toDrawing(new Vector2(this.model.thickness, 0), false, true);
		let e2 = this.toEdge(this.model.back, this.model.front, -1);

		// create drawing
		//
		let d = d1;
		if (e1) {
			d += ' ' + e1;
		}
		d += ' ' + d2;
		if (e2) {
			d += ' ' + e2;
		}
		d += ' Z';

		return d;
	},

	toSilhouette: function() {
		let d1 = this.views.front.toEdge && !this.views.front.model.isConvex()? this.views.front.toEdge(new Vector2(0, 0), true, false) : this.views.front.toDrawing(new Vector2(0, 0), true, false);
		let e1 = this.toEdge(this.model.front, this.model.back, 1);
		let d2 = this.views.back.toEdge && !this.views.back.model.isConcave()? this.views.back.toEdge(new Vector2(this.model.thickness, 0), false, true) : this.views.back.toDrawing(new Vector2(this.model.thickness, 0), false, true);
		let e2 = this.toEdge(this.model.back, this.model.front, -1);

		// create drawing
		//
		let d = d1;
		if (e1) {
			d += ' ' + e1;
		}
		d += ' ' + d2;
		if (e2) {
			d += ' ' + e2;
		}
		d += ' Z';

		return d;
	},

	toEdges: function() {
		let e1 = this.views.front.toEdge && this.views.front.model.isConvex()? this.views.front.toEdge(new Vector2(0, 0), true, false) : undefined;
		let e2 = this.views.back.toEdge && this.views.back.model.isConcave()? this.views.back.toEdge(new Vector2(this.model.thickness, 0), false, false) : undefined;

		// create drawing
		//
		let e;
		if (e1) {
			e = e1;
		}
		if (e2) {
			if (e) {
				e += ' ' + e2;
			} else {
				e = e2;
			}
		}
		if (e) {
			e += ' Z';
		}

		return e;
	},

	toElement: function() {

		// create surface views
		//
		this.views = this.getSurfaceViews();

		// create element
		//
		let el = SVGRenderable.toElement.call(this);

		// set viewbox
		//
		this.setViewbox(el);

		// add tooltip attributes
		//
		$(el).attr({

			// add tooltip to path instead of group because
			// browser bounding box calculations are inexact
			// 
			'title': _.result(this, 'title'),
			'data-toggle': 'tooltip'
		});

		return el;
	},

	removeBack: function() {
		if (this.back) {
			this.back.remove();
		}
	},

	//
	// hiding methods
	//

	hide: function() {
		this.$el.addClass('hidden');
		$(this.back).addClass('hidden');
	},

	show: function() {
		this.$el.removeClass('hidden');
		$(this.back).removeClass('hidden');
	},

	//
	// dialog rendering methods
	//

	showEditElementDialogView: function() {
		import(
			'../../../../../../views/apps/optic-editor/dialogs/elements/edit-element-dialog-view.js'
		).then((EditElementDialogView) => {
			this.options.viewport.getParentView('app').show(new EditElementDialogView.default({
				model: this.model,

				// options
				//
				tab: 'element',
				viewport: this.options.viewport
			}), {
				focus: '#lens input'
			});
		});
	},

	//
	// updating methods
	//

	update: function() {

		// call superclass method
		//
		ElementView.prototype.update.call(this);

		// replace child views
		//
		if (this.model.hasChanged('front')) {
			this.updateFront();
		}
		if (this.model.hasChanged('back')) {
			this.updateBack();
		}

		// update child views
		//
		this.views.front.update();
		this.views.back.options.offset = new Vector2(this.model.thickness, 0);
		this.views.back.update();

		// update view
		//
		this.updateAttributes();

		// update tooltips
		//
		this.updateTooltips();
	},

	updateShadow: function() {
		let id = this.getId();
		$(this.shadow).attr('href', '#' + id + '-back');
	},

	updateIds: function() {

		// update element id
		//
		this.$el.attr('id', this.getId());
		this.updateShadow();
	},

	updateAttributes: function() {

		// update view
		//
		this.$el.find('.front path:not(.surface)').attr('d', this.toDrawing());

		// update back view
		//
		$(this.back).find('.back path').attr('d', this.toSilhouette());
		$(this.back).find('.back .internal.edges').attr('d', this.toEdges());

		// update viewbox
		//
		this.setViewbox(this.el);

		// update back attributes
		//
		$(this.back).attr({
			x: this.$el.attr('x'),
			y: this.$el.attr('y'),
			width: this.$el.attr('width'),
			height: this.$el.attr('height'),
			viewBox: this.$el.attr('viewBox')
		});
	},

	updateColors: function() {
		let material = this.model.get('material');
		let color = material? material.getColor() : undefined;
		this.setColor(color);
	},

	updateSurfaces: function() {
		this.updateFront();
		this.updateBack();
	},

	updateFront: function() {
		let selected = this.views.front.isSelected();

		if (selected) {
			this.views.front.deselect();
		}

		// create surface view
		//
		this.views.front = this.getFrontView();

		// show child views
		//
		this.showChildView('front', this.views.front);

		// update state
		//
		if (selected) {
			this.views.front.select();
		}

		delete this.model.changed.front;
	},

	updateBack: function() {
		let selected = this.views.back.isSelected();

		if (selected) {
			this.views.back.deselect();
		}

		// create surface view
		//
		this.views.back = this.getBackView();

		// show child views
		//
		this.showChildView('back', this.views.back);

		// update state
		//
		if (selected) {
			this.views.back.select();
		}

		delete this.model.changed.back;
	},

	removeLayers: function() {
		this.removeShadow();
		this.removeBack();
	},

	//
	// tooltip methods
	//

	addTooltips: function() {

		// add tooltip trigger
		//
		ElementView.prototype.addTooltips.call(this, {

			// options
			//
			el: this.$el,
			trigger: 'hover',
			container: 'body',

			// callbacks
			//
			placement: (element) => {

				// compute offset
				//
				let lens = this.model;
				let thickness = lens.getMaxThickness();
				let frontThickness = lens.front.thickness * lens.front.sign();
				let backThickness = lens.back.thickness * lens.back.sign();
				let edgeThickness = thickness - (frontThickness > 0? frontThickness : 0)
					- (backThickness < 0? -backThickness : 0)
				let edgeCenter = (frontThickness > 0? frontThickness : 0) + edgeThickness / 2;	
				let center = thickness / 2;
				let offset = (edgeCenter - center);

				// offset tooltip to center of edge
				//
				$(element).css({'margin-left': offset * this.options.viewport.pixelsPerMillimeter * this.options.viewport.scale});
				return 'top';
			}
		});
	},
	
	updateTooltips: function() {

		// call superclass method
		//
		ElementView.prototype.updateTooltips.call(this);

		// update surface tooltips
		//
		this.views.front.updateTooltips();
		this.views.back.updateTooltips();
	},

	//
	// event handling methods
	//

	onChange: function() {

		// call superclass method
		//
		ElementView.prototype.onChange.call(this);

		// update view
		//
		this.update();
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// call mixin methods
		//
		ElementView.prototype.onBeforeDestroy.call(this);

		// clean up view
		//
		this.removeLayers();
	}
});