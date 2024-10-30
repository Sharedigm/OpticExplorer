/******************************************************************************\
|                                                                              |
|                                beam-view.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a view of a beam (array of paths).          |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../../../../models/base-model.js';
import CollectionView from '../../../../../../views/collections/collection-view.js';
import Selectable from '../../../../../../views/behaviors/selection/selectable.js';
import SVGCollectionRenderable from '../../../../../../views/svg/behaviors/svg-collection-renderable.js';
import SVGAnnotatable from '../../../../../../views/svg/behaviors/svg-annotatable.js';
import PathView from '../../../../../../views/apps/optic-editor/mainbar/viewports/ray-tracing/path-view.js';
import FocusView from '../../../../../../views/apps/optic-editor/mainbar/viewports/ray-tracing/focus-view.js';
import BeamAnnotationView from '../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/ray-tracing/beam-annotation-view.js';
import Vector2 from '../../../../../../utilities/math/vector2.js';
import '../../../../../../utilities/web/css-utils.js';

export default CollectionView.extend(_.extend({}, Selectable, SVGCollectionRenderable, SVGAnnotatable, {

	//
	// attributes
	//

	className: 'beam',
	layer: 'lights',
	annotated: true,

	//
	// rendering attributes
	//

	icon: `
		<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 512 512">
			<path d="M172.693,199.522l-40.508-67.336l67.464,40.584C189.064,179.905,179.909,188.997,172.693,199.522z
			 M314.155,174.019c9.228,6.516,17.312,14.54,23.898,23.715l41.761-65.547L314.155,174.019z M173.59,314.827l-41.404,64.988
			l64.88-41.336C187.997,331.946,180.055,323.948,173.59,314.827z M313.168,339.722l66.646,40.094l-40.168-66.771
			C332.564,323.505,323.569,332.561,313.168,339.722z M462,256.001l-141.77,31.426c-6.242,12.733-16.161,23.326-28.37,30.421L256,462
			l-35.861-144.153c-12.208-7.094-22.127-17.688-28.368-30.42L50,256.001l141.77-31.427c6.242-12.733,16.16-23.326,28.368-30.421
			L256,50l35.861,144.153c12.209,7.095,22.128,17.688,28.369,30.421L462,256.001z M288.01,256c0-17.678-14.331-32.01-32.01-32.01
			c-17.68,0-32.013,14.332-32.013,32.01c0,17.681,14.333,32.012,32.013,32.012C273.679,288.012,288.01,273.681,288.01,256z"/>
		</svg>
	`,

	events: {
		'mousedown': 'onMouseDown',
		'dblclick': 'onDoubleClick'
	},
	
	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.show_focus == undefined) {
			this.options.show_focus = true;
		}

		// set attributes
		//
		this.id = 'beam' + this.constructor.count++;
		this.views = this.getPathViews(this.model.get('paths'));
		this.show_focus = this.options.show_focus;
		if (this.options.className) {
			this.className = this.options.className;
		}

		// create children
		//
		for (let i = 0; i < this.views.length; i++) {
			this.children._add(this.views[i]);
		}

		// listen to model
		//
		this.listenTo(this.model, 'change', this.onChange);
		this.listenTo(this.model, 'select', this.onSelect);
		this.listenTo(this.model, 'deselect', this.onDeselect);
	},

	//
	// attribute methods
	//

	title: function() {
		return 'Beam' + (this.options.index != undefined? (this.options.index + 1) : '');
	},

	//
	// querying methods
	//

	hasFocus: function() {
		return this.model.get('paths').focus != undefined;
	},

	//
	// counting methods
	//

	numObstructed: function() {
		return this.numChildren(function (element) {
			return element.collection.obstructed;
		});
	},

	numReflected: function() {
		return this.numChildren(function (element) {
			return element.collection.reflected;
		});
	},

	numTransmitted: function() {
		return this.numChildren(function (element) {
			return !element.collection.obstructed && !element.collection.reflected;
		});
	},

	//
	// getting methods
	//

	getFirstIndex: function(filter) {
		let i = 0; 
		while (i < this.children.length) {
			let path = this.children.findByIndex(i);
			if (filter(path)) {
				return i;
			} else {
				i++;
			}
		}
	},

	getLastIndex: function(filter) {
		let i = this.children.length - 1; 
		while (i >= 0) {
			let path = this.children.findByIndex(i);
			if (filter(path)) {
				return i;
			} else {
				i--;
			}
		}
	},

	getFirstTransmittedIndex: function() {
		return this.getFirstIndex((path) => {
			return path.collection.transmitted && !path.collection.obstructed && !path.collection.reflected;
		});
	},

	getLastTransmittedIndex: function() {
		return this.getLastIndex((path) => {
			return path.collection.transmitted && !path.collection.obstructed && !path.collection.reflected;
		});
	},

	getObstruction: function() {
		return this.numObstructed() / this.children.length;
	},

	getReflection: function() {
		return this.numReflected() / this.children.length;
	},

	getTransmission: function() {
		return this.numTransmitted() / this.children.length;
	},

	getWavefront: function(first, last) {
		let firstChild = this.children.findByIndex(first);
		let lastChild = this.children.findByIndex(last);
		let vertex1 = firstChild.collection[firstChild.collection.length - 1];
		let vertex2 = lastChild.collection[lastChild.collection.length - 1];

		if (!vertex1.equals(vertex2)) {
			let array = [];
			for (let i = first; i < last; i++) {
				let child = this.children.findByIndex(i);
				array.push(child.collection[child.collection.length - 1]);
			}
			return array;
		} else {
			return [];
		}
	},

	getPathViews: function(paths) {
		let views = [];
		for (let i = 0; i < paths.length; i++) {
			views.push(new PathView({
				collection: paths[i],

				// options
				//
				parent: this,
				viewport: this.options.viewport
			}));
		}
		return views;
	},

	getFocus: function() {
		return this.model.get('paths').focus;
	},

	getFocusPosition: function() {
		if (this.focus) {
			let location = this.focus.get('location');
			return {
				left: location.x,
				top: location.y
			};
		}
	},

	getAnnotation: function() {
		if (this.annotated && this.hasFocus()) {
			return new BeamAnnotationView({
				model: this.model,

				// options
				//
				extend: this.model.get('paths').extended,
				viewport: this.options.viewport,
				parent: this
			});
		}
	},

	getDirection: function() {
		let lightView = this.options.parent;

		// find viewport size
		//
		let width = this.options.viewport.getWidth() / this.options.viewport.pixelsPerMillimeter / this.options.viewport.scale;

		// find direction
		//
		let angle = lightView.model.has('angle')? lightView.model.get('angle').in('deg') : 0;
		return new Vector2(width / 2, 0).rotatedBy(angle);	
	},

	//
	// setting methods
	//

	setColor: function(color) {
		if (color) {
			this.$el.addClass('colored');
			this.$el.attr('stroke', color);
			this.$el.attr('fill', color);
		} else {
			this.$el.removeClass('colored');
			this.$el.removeAttr('stroke');
			this.$el.removeAttr('fill');
		}
		if (this.focus) {
			this.focus.set({
				color: color
			});
		}
	},

	//
	// selecting methods
	//

	select: function() {
		if (this.isSelected()) {
			return;
		}

		// call mixin method
		//
		SVGAnnotatable.select.call(this);

		// select children
		//
		if (this.focusView) {
			this.focusView.select();
		}
	},

	deselect: function() {
		if (!this.isSelected()) {
			return;
		}

		// call mixin method
		//
		SVGAnnotatable.deselect.call(this);

		// deselect children
		//
		if (this.focusView) {
			this.focusView.deselect();
		}
	},

	//
	// svg rendering methods
	//

	toPaths: function() {

		// set attributes
		//
		let paths = {
			reflected: document.createElementNS('http://www.w3.org/2000/svg', 'g'),
			obstructed: document.createElementNS('http://www.w3.org/2000/svg', 'g'),
			transmitted: document.createElementNS('http://www.w3.org/2000/svg', 'g'),
			untransmitted: document.createElementNS('http://www.w3.org/2000/svg', 'g')
		}

		// set path attributes
		//
		$(paths.reflected).attr('class', 'paths');
		$(paths.obstructed).attr('class', 'paths');
		$(paths.transmitted).attr('class', 'paths');
		$(paths.untransmitted).attr('class', 'paths');

		// add paths to group
		//
		let first = null;
		let last = null;
		let prev = null;
		let direction = this.getDirection();
		this.children.each((childView) => {

			// set path direction
			//
			childView.options.direction = direction;

			// render path
			//
			let element = childView.render();

			// render child view
			//
			if (childView.collection.obstructed) {
				(paths.obstructed).append(element);
			} else if (childView.collection.reflected) {
				$(paths.reflected).append(element);
			} else if (childView.collection.transmitted) {
				$(paths.transmitted).append(element);
			} else {
				$(paths.untransmitted).append(element);
			}

			if (childView.collection.transmitted) {
				let obstructed = childView.collection.obstructed || childView.collection.reflected;

				// find first unobstructed
				//
				if (!first && !obstructed) {
					first = childView;
					first.$el.addClass('first');
				}

				// find last unobstructed
				//
				if (first && !last && prev && obstructed) {
					last = prev;
					prev.$el.addClass('last');
				}

				if (!obstructed) {
					prev = childView;
				}
			}
		});

		if (first && !last && prev) {
			prev.$el.addClass('last');
		}

		return paths;
	},

	toDrawing: function(i1, i2) {
		let first = this.children.findByIndex(i1);
		let last = this.children.findByIndex(i2);
		if (first != undefined && last != undefined && first != last) {
			let side1 = first.collection.clone();
			let side2 = this.getWavefront(i1, i2);
			let side3 = last.collection.clone().reverse();

			// concat vertices together
			//
			let vertices = side1.concat(side2).concat(side3);
			
			// create drawing from vertices
			//
			if (vertices.length > 0) {
				let x = vertices[0].x * this.options.viewport.pixelsPerMillimeter;
				let y = vertices[0].y * this.options.viewport.pixelsPerMillimeter;

				// convert to strings
				//
				x = this.valueToString(x);
				y = this.valueToString(y);

				let d = 'M ' + x + ' ' + y;
				for (let i = 1; i < vertices.length; i++) {
					x = vertices[i].x * this.options.viewport.pixelsPerMillimeter;
					y = vertices[i].y * this.options.viewport.pixelsPerMillimeter;

					// convert to strings
					//
					x = this.valueToString(x);
					y = this.valueToString(y);
					
					d += ' L ' + x + ' ' + y;
				}
				d += ' Z';
				return d;
			}
		}
	},

	toFilledPath: function(i1, i2) {
		let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

		// set attributes
		//
		$(path).attr({
			'id': this.id,
			'class': 'filled',
			'd': this.toDrawing(i1, i2)
		});

		return path;
	},

	toElement: function() {
		let paths = this.toPaths();

		// create element
		//
		let el = document.createElementNS('http://www.w3.org/2000/svg', 'g');

		// set attributes
		//
		$(el).attr('class', this.className);

		// set color attributes
		//
		if (this.model.has('color')) {
			let color = this.model.get('color');
			$(el).addClass('colored');
			$(el).attr('stroke', color);
			$(el).attr('fill', color)
		}

		// create element structure
		//
		let reflected = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		let obstructed = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		let transmitted = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		let untransmitted = document.createElementNS('http://www.w3.org/2000/svg', 'g');

		// set path attributes
		//
		$(reflected).addClass('reflected');
		$(obstructed).addClass('obstructed');
		$(transmitted).addClass('transmitted');
		$(untransmitted).addClass('untransmitted');

		// append paths to group
		//
		$(el).append(reflected);
		$(el).append(obstructed);
		$(el).append(transmitted);
		$(el).append(untransmitted);

		// add stroked paths
		//
		$(reflected).append(paths.reflected);
		$(obstructed).append(paths.obstructed);
		$(transmitted).append(paths.transmitted);
		$(untransmitted).append(paths.untransmitted);

		// add filled paths
		//
		let first = this.getFirstTransmittedIndex();
		let last = this.getLastTransmittedIndex();
		let filledPath = this.toFilledPath(first, last);
		$(transmitted).append(filledPath);

		return el;
	},

	toBackground: function() {

		// create new use node
		//
		let xmlns = "http://www.w3.org/2000/svg";   
		let xlinkns = 'http://www.w3.org/1999/xlink';
		let use = document.createElementNS(xmlns, 'use');

		// set attributes
		//
		use.setAttributeNS(xlinkns, 'xlink:href', '#' + this.id);
		$(use).attr({
			'class': 'background'
		});

		return use;
	},

	showFocus: function() {

		// create new focus
		//
		this.focus = new BaseModel({
			location: this.model.get('paths').focus,
			color: this.model.get('color')
		});

		// create new focus view
		//
		this.focusView = new FocusView({
			model: this.focus,
			viewport: this.options.viewport,
			optics: this.options.optics,
			parent: this
		});

		// create annotation view
		//
		if (this.isSelected()) {
			if (!this.isAnnotated()) {
				this.showAnnotation();
			}
		}

		// listen to focus
		//
		/*
		this.listenTo(this.focusView, 'select', function() {
			this.trigger('select');
		});
		this.listenTo(this.focusView, 'deselect', function() {
			this.trigger('deselect');
		});
		*/

		if (this.options.viewport) {

			// show in light layer
			//
			this.options.viewport.show(this.focusView, 'lights');
		} else {

			// append to beam
			//
			this.$el.append(this.focusView.render());
		}

		// set focus view to selected
		//
		if (this.isSelected()) {
			this.focusView.select();
		}
	},

	hideFocus: function() {
		this.focusView.destroy();
		this.focusView = null;
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call mixin method
		//
		SVGAnnotatable.onRender.call(this);

		// show subviews
		//
		if (this.options.show_focus && this.hasFocus()) {
			this.showFocus();
		}

		// set initial state
		//
		if (this.options.selected) {
			this.select();
		}

		// add background
		//
		// this.addBackground();
	},

	addBackground: function() {
		this.background = this.toBackground();
		this.options.viewport.addElement(this.background, 'background');
	},

	update: function() {
		let paths = this.model.get('paths');

		if (paths.length != this.children.length) {

			// destroy previous path views
			//
			this.clear();

			// create new path views
			//
			this.views = this.getPathViews(paths);

			// create new children
			//
			for (let i = 0; i < this.views.length; i++) {
				this.children._add(this.views[i]);
			}
		} else {

			// update path views
			//
			let direction = this.getDirection();
			for (let i = 0; i < paths.length; i++) {
				let childView = this.children.findByIndex(i);
				childView.collection = paths[i];

				// set path direction
				//
				childView.options.direction = direction;
			}
		}

		// render updated views
		//
		this.updatePaths();

		// update focus
		//
		if (paths.focus) {
			if (this.options.show_focus) {
				if (!this.focusView) {

					// create focus
					//
					this.showFocus();
				}

				// update focus
				//
				this.focus.set({
					location: paths.focus
				});
			}
		} else {

			// remove focus
			//
			if (this.focusView) {
				this.hideFocus();
				this.hideAnnotation();
			}
		}
	},

	clearPaths: function() {
		this.$el.find('.reflected').empty();
		this.$el.find('.obstructed').empty();
		this.$el.find('.transmitted').empty();
		this.$el.find('.untransmitted').empty();
	},

	updatePaths: function() {
		let paths = this.toPaths();

		// redraw paths
		//
		this.clearPaths(this.$el);

		// add stroked paths
		//
		this.$el.find('.reflected').append(paths.reflected);
		this.$el.find('.obstructed').append(paths.obstructed);
		this.$el.find('.transmitted').append(paths.transmitted);
		this.$el.find('.untransmitted').append(paths.untransmitted);
	
		// add filled paths
		//
		let first = this.getFirstTransmittedIndex();
		let last = this.getLastTransmittedIndex();
		let filledPath = this.toFilledPath(first, last);
		this.$el.find('.transmitted').append(filledPath);
	},

	clear: function() {
		while (this.children.length > 0) {
			let childView = this.children.findByIndex(0);
			if (childView) {
				this.children._remove(childView);
				childView.destroy();
			}	
		}
	},

	//
	// hiding methods
	//

	hide: function() {
		this.$el.hide();
		this.hideAnnotation();

		// hide focus, if exists
		//
		if (this.focusView) {
			this.focusView.hide();
		}
	},

	show: function() {
		this.$el.show();
		if (this.isSelected()) {
			this.showAnnotation();
		}

		// show focus, if exists
		//
		if (this.focusView) {
			this.focusView.show();
		}
	},

	//
	// event handling methods
	//

	onChange: function() {

		// on path change
		//
		if (this.model.hasChanged('paths')) {
			this.update();
		}

		// on color change
		//
		if (this.model.hasChanged('color')) {
			this.setColor(this.model.get('color'));
		}
	},

	onSelect: function() {
		// this.options.viewport.elementsView.showAnnotation();
	},

	onDeselect: function() {
		// this.options.viewport.elementsView.hideAnnotation();
	},

	//
	// mouse event handling methods
	//

	onDoubleClick: function(event) {

		// perform callback
		//
		if (this.options.ondoubleclick) {
			this.options.ondoubleclick(event);
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// call mixin method
		//
		SVGAnnotatable.onBeforeDestroy.call(this);

		// destroy subviews
		//
		if (this.focusView) {
			this.focusView.destroy();
		}
	}
}), {

	//
	// static attributes
	//

	count: 0
});