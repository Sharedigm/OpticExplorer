/******************************************************************************\
|                                                                              |
|                           material-marker-view.js                            |
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
import Bounds2 from '../../../../../../utilities/bounds/bounds2.js';

export default MarkerView.extend(_.extend({}, Selectable, {

	//
	// attributes
	//

	className: 'material marker',
	width: 20,
	height: 20,
	blocking: true,

	//
	// constructor
	//

	initialize: function(options) {

		// call superclass constructor
		//
		MarkerView.prototype.initialize.call(this, options);

		// listen to model
		//
		this.listenTo(this.model, 'change', this.update);
		this.listenTo(this.model, 'select', this.select);
		this.listenTo(this.model, 'deselect', this.deselect);
	},

	//
	// querying methods
	//

	attributes: function() {
		let point = this.getPoint();
		let color = this.getColor();
		return {
			x: point.x + 'mm',
			y: point.y + 'mm',
			fill: color,
			stroke: color
		}
	},

	title: function() {
		let name = this.model.get('name') || 'Untitled';
		let v = this.model.get('abbe_number');
		let n = this.model.get('index_of_refraction');
		return name + '<br /> n = ' + n + ', v = ' + v;
	},

	//
	// getting methods
	//

	getIcon: function() {
		let catalog = this.model.get('catalog');
		if (!this.constructor.catalogs.includes(catalog)) {
			this.constructor.catalogs.push(catalog);
		}
		let index = this.constructor.catalogs.indexOf(catalog);
		let keys = Object.keys(this.constructor.icons);
		let key = keys[index % keys.length];
		let icon = this.constructor.icons[key];
		return icon;
	},

	getPoint: function() {
		let v = this.model.get('abbe_number');
		let n = this.model.get('index_of_refraction');
		return this.options.viewport.abbeToVector(v, n);
	},

	getColor: function() {
		let v = this.model.get('abbe_number');
		let n = this.model.get('index_of_refraction');
		if (ColorScheme.current) {
			return ColorScheme.current.getColorAt(n, v);
		}
	},

	getBounds: function() {
		let point = this.getPoint();
		return new Bounds2(point, point);
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

	//
	// opening methods
	//

	open: function() {
		this.getParentView('app').openMaterial(this.model);
	},

	//
	// rendering methods
	//

	onRender: function() {

		// set attributes
		//
		this.addTooltipAttrs();
	},

	onAttach: function() {

		// add tooltip trigger
		//
		this.addTooltips({
			trigger: 'hover',
			container: this.$el.closest('div')
		});
	},

	update: function() {
		this.$el.attr(this.attributes());
		this.updateTooltips();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange('material');
		}
	},

	updateColor: function() {
		this.setColor(this.getColor());
	},

	updateTooltips: function() {
		this.setTooltip(this.title());
	},

	//
	// viewport event handling methods
	//

	onChangeScale: function() {

		// call superclass method
		//
		MarkerView.prototype.onChangeScale.call(this);

		// unhighlight
		//
		this.hideTooltips();
	}
}), {

	//
	// static attributes
	//

	catalogs: [],
	icons: {
		square: `
			<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 24 24">
				<path class="edges" d="M 24 0 h -24 v 24 h 24 v -24 z" />
				<path class="transmitted" d="M 18 6 h -12 v 12 h 12 v -12 z" />
				<path class="diffuse" d="M 18 6 h -12 v 12 h 12 v -12 z" />
			</svg>
		`,

		circle: `
			<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 24 24">
				<circle class="edges" cx="12" cy="12" r="12" />
				<circle class="transmitted" cx="12" cy="12" r="6" />
				<circle class="diffuse" cx="12" cy="12" r="6" />
			</svg>
		`,

		triangle: `
			<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 24 24">
				<polygon class="edges" transform="translate(12,12)" points="-12,12 12,12 0,-12" />
				<polygon class="transmitted" transform="translate(12,14)" points="-6,6 6,6 0,-6" />
				<polygon class="diffuse" transform="translate(12,12)" points="-6,6 6,6 0,-6" />
			</svg>
		`,
	}
});