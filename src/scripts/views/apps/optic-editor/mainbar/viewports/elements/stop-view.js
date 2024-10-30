/******************************************************************************\
|                                                                              |
|                                 stop-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a view of an aperture stop element.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SVGRenderable from '../../../../../../views/svg/behaviors/svg-renderable.js';
import ElementView from '../../../../../../views/apps/optic-editor/mainbar/viewports/elements/element-view.js';
import StopAnnotationView from '../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/elements/stop-annotation-view.js';
import Vector2 from '../../../../../../utilities/math/vector2.js';
import Bounds2 from '../../../../../../utilities/bounds/bounds2.js';

export default ElementView.extend({

	//
	// attributes
	//

	tagName: 'svg',
	className: 'stop' + ' ' + ElementView.prototype.className,

	template: template(`
		<path class="upper" d="<%= drawing1 %>"></path>
		<path class="lower" d="<%= drawing2 %>"></path>
	`),

	//
	// constructor
	//

	initialize: function(options) {

		// call superclass constructor
		//
		ElementView.prototype.initialize.call(this, options);

		// listen to surfaces
		//
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

	//
	// attribute methods
	//

	attributes: function() {
		let height = this.getHeight();

		return {
			'id': this.getId(),
			'x': (this.options.offset? this.options.offset.x : 0) + 'mm',
			'y': (-height / 2 + (this.options.offset? this.options.offset.y : 0)) + 'mm',
			'width': (this.model.spacing || 1) + 'mm',
			'height': height + 'mm',
		}
	},

	title: function() {
		let index = this.model.getStopIndex();
		return 'Stop' + (index != undefined? index + 1 : '');
	},

	//
	// getting methods
	//

	getId: function() {
		return this.options.parent.getId() + '-stop' + this.model.getIndex();
	},

	getOffset: function() {
		let x = parseFloat(this.$el.attr('x').replace('mm', ''));
		let y = parseFloat(this.$el.attr('y').replace('mm', '')) + this.model.radius;
		return new Vector2(x, y);
	},

	getBounds: function() {
		let xmin = this.options.offset? this.options.offset.x : 0;
		let xmax = xmin;
		let ymin = -this.model.radius;
		let ymax = this.model.radius;
		return new Bounds2(new Vector2(xmin, ymin), new Vector2(xmax, ymax));
	},

	getWidth: function() {
		return 0;
	},

	getHeight: function() {
		return (this.model.radius * 2);
	},

	getAnnotation: function() {
		return new StopAnnotationView({
			model: this.model,
			parent: this,
			viewport: this.options.viewport
		});
	},

	//
	// setting methods
	//

	setViewbox: function(element) {
		let width = (this.model.spacing || 1);
		let height = (this.model.radius * 2);
		
		// set attributes
		//
		element.setAttributeNS(null, 'viewBox', 0 + ' ' + (-height / 2) + ' ' +
			(width)  + ' ' + height);
	},

	//
	// editing methods
	//

	edit: function() {
		this.showEditStopDialogView();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			drawing1: this.toUpperDrawing(),
			drawing2: this.toLowerDrawing()
		};
	},

	//
	// svg rendering methods
	//

	toUpperDrawing: function() {
		let x1 = 0;
		let y1 = this.model.aperture / 2;
		let x2 = 0;
		let y2 = this.model.radius;
		return 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2 + ' ' + 'Z';
	},

	toLowerDrawing: function() {
		let x1 = 0;
		let y1 = -this.model.aperture / 2;
		let x2 = 0;
		let y2 = -this.model.radius;
		return 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2 + ' ' + 'Z';
	},

	toElement: function() {

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

	//
	// dialog rendering methods
	//

	showEditStopDialogView: function() {
		import(
			'../../../../../../views/apps/optic-editor/dialogs/elements/edit-stop-dialog-view.js'
		).then((EditStopDialogView) => {
			this.options.viewport.getParentView('app').show(new EditStopDialogView.default({
				model: this.model,
				viewport: this.options.viewport
			}));
		});
	},

	//
	// updating methods
	//

	update: function() {

		// call superclass method
		//
		ElementView.prototype.update.call(this);

		// update attributes
		//
		this.$el.find('.upper').attr('d', this.toUpperDrawing());
		this.$el.find('.lower').attr('d', this.toLowerDrawing());

		// update viewbox
		//
		this.setViewbox(this.el);

		// update tooltip
		//
		this.updateTooltips();
	},

	updateIds: function() {
		let id = this.getId();

		// update element
		//
		this.$el.attr('id', id);

		// update shadow
		//
		$(this.shadow).attr('xlink:href', '#' + id);
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
	}
});