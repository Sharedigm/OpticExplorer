/******************************************************************************\
|                                                                              |
|                           material-markers-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a marker on the Abbe glass diagram.            |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SelectableCollectionView from '../../../../../../views/collections/selectable-collection-view.js';
import SVGCollectionRenderable from '../../../../../../views/svg/behaviors/svg-collection-renderable.js';
import MaterialMarkerView from '../../../../../../views/apps/material-map-viewer/mainbar/abbe-diagram/markers/material-marker-view.js';
import Vector2 from '../../../../../../utilities/math/vector2.js';

export default SelectableCollectionView.extend(_.extend({}, SVGCollectionRenderable, {

	//
	// attributes
	//

	className: 'material markers',
	childView: MaterialMarkerView,
	layer: 'overlay',

	//
	// constructor
	//

	initialize: function() {
		this.listenTo(this.collection, 'add', this.onAdd);
		this.listenTo(this.collection, 'remove', this.onRemove);
	},

	//
	// querying methods
	//

	hasMaterials: function() {
		return this.collection.length > 0;
	},

	//
	// getting methods
	//

	getCenter: function() {
		let points = [];
		for (let i = 0; i < this.children.length; i++) {
			let child = this.children.findByIndex(i);
			let point = child.getPoint();
			points.push(point);
		}
		return Vector2.centerOf(points);
	},

	getWidth: function() {
		let xmin, xmax;
		for (let i = 0; i < this.children.length; i++) {
			let child = this.children.findByIndex(i);
			let point = child.getPoint();
			let x = point.x;
			if (!xmin || x < xmin) {
				xmin = x;
			}
			if (!xmax || x > xmax) {
				xmax = x;
			}
		}
		return xmax - xmin;
	},

	getHeight: function() {
		let ymin, ymax;
		for (let i = 0; i < this.children.length; i++) {
			let child = this.children.findByIndex(i);
			let point = child.getPoint();
			let y = point.y;
			if (!ymin || y < ymin) {
				ymin = y;
			}
			if (!ymax || y > ymax) {
				ymax = y;
			}
		}
		return ymax - ymin;
	},

	getSize: function() {
		let width = this.getWidth();
		let height = this.getHeight();
		return Math.sqrt(Math.sqr(width) + Math.sqr(height));
	},

	//
	// rendering methods
	//

	childViewOptions: function(model) {
		return {
			model: model,

			// options
			//
			viewport: this.options.viewport,
			parent: this,

			// callbacks
			//
			onchange: this.options.onchange,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		};
	},

	//
	// updating methods
	//

	updateColors: function() {
		for (let i = 0; i < this.children.length; i++) {
			let childView = this.children.findByIndex(i);
			childView.updateColor();
		}
	},

	//
	// collection event handling methods
	//

	onAdd: function(model) {
		this.addChildModel(model);

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange('material');
		}
	},

	onRemove: function(model) {
		this.removeChildModel(model);

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange('material');
		}
	}
}));