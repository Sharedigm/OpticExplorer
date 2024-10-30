/******************************************************************************\
|                                                                              |
|                                elements-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a view of a collection of elements.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Lens from '../../../../../../models/optics/elements/lens.js';
import Stop from '../../../../../../models/optics/elements/stop.js';
import Sensor from '../../../../../../models/optics/elements/sensor.js';
import SelectableCollectionView from '../../../../../../views/collections/selectable-collection-view.js';
import LensView from '../../../../../../views/apps/optic-editor/mainbar/viewports/elements/lens-view.js';
import StopView from '../../../../../../views/apps/optic-editor/mainbar/viewports/elements/stop-view.js';
import SensorView from '../../../../../../views/apps/optic-editor/mainbar/viewports/elements/sensor-view.js';
import SVGCollectionRenderable from '../../../../../../views/svg/behaviors/svg-collection-renderable.js';
import SVGAnnotatable from '../../../../../../views/svg/behaviors/svg-annotatable.js';
import ElementsAnnotationView from '../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/elements/elements-annotation-view.js';
import Vector2 from '../../../../../../utilities/math/vector2.js';
import Bounds from '../../../../../../utilities/bounds/bounds.js';

export default SelectableCollectionView.extend(_.extend({}, SVGCollectionRenderable, SVGAnnotatable, {

	//
	// attributes
	//

	className: 'elements',
	layer: 'optics',

	// no events on collection
	//
	events: {},

	// animate element changes
	//
	animated: true,

	//
	// constructor
	//

	initialize: function(options) {

		// set optional parameter defaults
		//
		if (!options) {
			options = {};
		}

		// call superclass method
		//
		SelectableCollectionView.prototype.initialize.call(this, options);

		// set attributes
		//
		this.index = this.constructor.count++;
		this.options = options;
		this.viewportOffset = this.getViewportOffset();

		// watch collection for changes
		//
		this.collection.on('add', this.onAdd, this);
		this.collection.on('remove', this.onRemove, this);
		this.collection.on('change', this.onChange, this);
	},

	//
	// querying methods
	//

	indexOf: function(elementView) {
		return this.collection.indexOf(elementView.model);
	},

	findByIndex: function(index) {
		for (let i = 0; i < this.children.length; i++) {
			let childView = this.children.findByIndex(i);
			if (childView) {
				let element = childView.model;
				if (this.collection.indexOf(element) == index) {
					return childView;
				}
			}
		}
	},

	//
	// getting methods
	//

	getId: function() {
		return 'elements' + this.index;
	},

	getOffset: function() {
		return -this.collection.getLength() / 2;
	},

	getViewportOffset: function() {
		return new Vector2(this.getOffset() * this.options.viewport.pixelsPerMillimeter, 0);
	},

	getElementOffset: function(element) {
		return this.getElementOffsetByIndex(this.indexOf(element));
	},

	getElementOffsetByIndex: function(index, units) {
		let offset = 0;

		if (units == undefined) {
			units = 'mm';
		}

		for (let i = 0; i < index; i++) {
			let element = this.at(i);

			// advance element offset
			//
			if (element.has('thickness')) {
				offset += element.get('thickness').in(units);
			}
			if (element.has('spacing')) {
				offset += element.get('spacing').in(units);
			}
		}

		return offset;
	},

	getElementViewIndex: function(elementView) {
		let index = 0;
		let xmin = parseFloat(elementView.$el.attr('x').replace('mm', ''));
		let xmax = xmin + (elementView.model.thickness? elementView.model.thickness : 0);
		let bounds = new Bounds(xmin, xmax);
		
		for (let i = 0; i < this.collection.length; i++) {
			let model = this.collection.at(i);
			let childView = this.children.findByModel(model);
			let xmin2 = childView.options.offset.x;
			let xmax2 = xmin2 + (childView.model.thickness? childView.model.thickness : 0);
			let childBounds = new Bounds(xmin2, xmax2);

			// booleans
			//
			let childIsBefore = childBounds.min < bounds.min;
			let childIsAfter = childBounds.max > bounds.max;

			if (childIsBefore) {

				// insert after child
				//
				index = i;
			} else if (childIsAfter) {

				// done
				//
				break;
			} else {

				// continue
				//
				index = i;
			}
		}
		return index;
	},

	getSelectedModels: function(options) {
		let models = [];
		this.collection.each((model) => {
			let view = this.children.findByModel(model);
			if (view && view.isSelected()) {
				if (options && options.clone) {
					models.push(model.clone());
				} else {
					models.push(model);
				}
			}
		});
		return models;
	},

	getSelectedElementIndex: function() {
		for (let i = 0; i < this.children.length; i++) {
			let child = this.children.findByIndex(i);
			if (child.isSelected()) {
				return this.indexOf(child);
			}
		}
	},

	getSelectedElementView: function(which) {
		switch (which) {
			case 'first':
				return this.findByIndex(0);
			case 'prev':
				if (this.hasSelected()) {
					let index = this.getSelectedElementIndex();
					if (index > 0) {
						return this.findByIndex(index - 1);
					} else {
						return this.getSelectedElementView('last');
					}
				}
				break;
			case 'next':
				if (this.hasSelected()) {
					let index = this.getSelectedElementIndex();
					if (index < this.children.length - 1) {
						return this.findByIndex(index + 1);
					} else {
						return this.getSelectedElementView('first');
					}
				}
				break;
			case 'last': {
				let index = this.children.length - 1;
				return this.findByIndex(index);
			}
		}		
	},

	getSelectedSurfaceView: function(which) {
		switch (which) {
			case 'first': {
				let surfaceView = this.getSelectedElementView('first');
				if (surfaceView) {
					return surfaceView.views.front;
				}
				break;
			}
			case 'prev': {
				let surfaceView = this.getSelectedSurfaceView();
				if (surfaceView) {
					return surfaceView.prev();
				}
				break;
			}
			case 'next': {
				let surfaceView = this.getSelectedSurfaceView();
				if (surfaceView) {
					return surfaceView.next();
				}
				break;
			}
			case 'last': {
				let surfaceView = this.getSelectedElementView('last');
				if (surfaceView) {
					return surfaceView.views.back;
				}
				break;
			}
			default: {
				for (let i = 0; i < this.children.length; i++) {
					let child = this.children.findByIndex(i);
					if (child.views) {
						if (child.views.front.isSelected()) {
							return child.views.front;
						} else if (child.views.back.isSelected()) {
							return child.views.back;
						}
					}
				}
				break;
			}
		}		
	},

	getAnnotation: function() {
		return new ElementsAnnotationView({
			collection: this.collection,
			viewport: this.options.viewport,
			parent: this
		});
	},

	//
	// rendering methods
	//

	render: function() {

		// add element to viewport
		//
		let element = this.toElement();
		this.setElement(element);
		this._isRendered = true;
		this.reversed = false;

		// call superclass method
		//
		SelectableCollectionView.prototype.render.call(this);

		// alert listeners of rendering
		//
		this.triggerMethod('render', this);

		return element;
	},

	onRender: function() {

		// move elements with convex first surface to top
		//
		for (let i = 0; i < this.children.length; i++) {
			let childView = this.children.findByIndex(i);
			if (childView.model.front && childView.model.front.isConvex()) {
				childView.toTop();
			}
		}
	},

	childView: function(model) {
		if (model instanceof Lens) {
			return LensView;
		} else if (model instanceof Stop) {
			return StopView;
		} else if (model instanceof Sensor) {
			return SensorView;
		}
	},

	childViewOptions: function(model) {

		// create new lens view
		//
		return {
			model: model,

			// options
			//
			offset: new Vector2(this.collection.getElementOffset(model), 0),
			viewport: this.options.viewport,
			editable: this.options.editable,
			parent: this,

			// callbacks
			//
			onchange: this.options.onchange,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onchangeselection: this.options.onchangeselection
		};	
	},

	//
	// svg rendering methods
	//

	toElement: function() {

		// create element
		//
		let el = document.createElementNS('http://www.w3.org/2000/svg', 'g');

		// set group attributes
		//
		$(el).attr({
			'id': 'elements',
			'class': 'elements'
		});

		return el;
	},

	//
	// updating methods
	//

	update: function() {

		// update element ids
		//
		// this.updateIds();

		// update offsets
		//
		this.updateElements();

		// adjust viewport offset
		//
		this.updateViewport();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange('element');
		}
	},

	updateElements: function() {
		this.offsetElements({
			duration: this.options.move_duration,

			// callbacks
			//
			done: () => {
				if (this.options.onreorder) {
					this.options.onreorder();
				}
			}
		});
	},

	updateColors: function() {
		for (let i = 0; i < this.children.length; i++) {
			let elementView = this.children.findByIndex(i);
			if (elementView.updateColors) {
				elementView.updateColors();
			}
		}
	},

	updateViewport: function() {
		if (this.update_viewport_offsets != false) {
			this.offsetViewport({
				duration: this.options.move_duration
			});
		}
	},

	updateIds: function() {
		for (let i = 0; i < this.collection.length; i++) {
			let element = this.collection.at(i);
			let elementView = this.children.findByModel(element);
			if (elementView) {
				elementView.updateIds();
			}
		}
	},

	offsetElements: function(options) {
		let elements = this.collection;
		let x = 0;
		let duration = this.animated && options && options.duration? options.duration : 0;
		let changed = false;

		for (let i = 0; i < elements.length; i++) {
			let model = elements.at(i);
			let childView = this.children.findByModel(model);

			// update element offset
			//
			if (childView) {
				let offset = new Vector2(x, 0);
				let childOffset = childView.getOffset();
				let epsilon = 0.001;

				if (childOffset.minus(offset).length() > epsilon) {
					childView.setOffset(offset, {
						duration: duration
					});
					changed = true;
				}

				// update tooltips
				//
				childView.updateTooltips();
			}

			// advance element offset
			//
			if (model.thickness) {
				x += model.thickness;
			}
			if (model.spacing) {
				x += model.spacing;
			}
		}

		if (changed && this.animated) {

			// trigger reorder after animation
			//
			window.setTimeout(() => {
				this.collection.trigger('reorder');

				// perform callback
				//
				if (options && options.done) {
					options.done();
				}
			}, duration);
		}
	},

	offsetViewport: function(options) {
		let viewport = this.options.viewport;
		let duration = options? options.duration : 0;

		// perform only one animation at a time
		//
		if (this.animation) {
			return;
		}
		
		// compute difference in offset
		//
		let viewportOffset = this.getViewportOffset();
		let difference = this.viewportOffset.minus(viewportOffset);
		let viewportOffset2 = viewport.offset.minus(difference);
		this.viewportOffset = viewportOffset;

		if (duration > 0 && this.animated) {
			let startOffset = viewport.offset || new Vector2(0, 0);
			let finishOffset = viewportOffset2;
			let delta = finishOffset.minus(startOffset);

			// animate viewport offset
			//
			this.animation = $({t: 0}).animate({t: 1}, {
				duration: duration,

				// callbacks
				//
				step: (t) => {
					let viewportOffset = startOffset.plus(delta.scaledBy(t));
					viewport.setOffset(viewportOffset);
				},

				complete: () => {
					this.animation = null;
				}
			});
		} else {

			// update viewport offset
			//
			viewport.setOffset(viewportOffset2);
		}	
	},

	flipAll: function() {
		if (this.collection.length > 0) {
			this.update_viewport_offsets = false;
			this.collection.flipAll();
			this.update_viewport_offsets = true;
		}
	},

	//
	// event handling methods
	//

	onAdd: function(model) {
		this.addChildModel(model);
		this.update();
		this.updateIds();
	},

	onRemove: function(model) {
		this.removeChildModel(model);
		this.update();
		this.updateIds();
	},

	onChange: function() {
		this.update();

		// clear previous tooltips
		//
		this.removeTooltips();
	}
}), {

	//
	// static attributes
	//

	count: 0
});
