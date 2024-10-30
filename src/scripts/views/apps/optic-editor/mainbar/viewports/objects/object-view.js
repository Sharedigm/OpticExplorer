/******************************************************************************\
|                                                                              |
|                                object-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a light emitting scene object.                 |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MarkerView from '../../../../../../views/svg/shapes/marker-view.js';
import Selectable from '../../../../../../views/behaviors/selection/selectable.js';
import SVGAnnotatable from '../../../../../../views/svg/behaviors/svg-annotatable.js';
import MouseDragElementBehavior from '../../../../../../views/svg/viewports/behaviors/manipulation/mouse-drag-element-behavior.js';

export default MarkerView.extend(_.extend({}, SVGAnnotatable, Selectable, {

	//
	// attributes
	//

	className: 'object ' + MarkerView.prototype.className,
	editable: true,
	unscaled: false,

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		MarkerView.prototype.initialize.call(this);

		// set attributes
		//
		this.index = this.constructor.count++;

		// listen to model for select
		//
		this.listenTo(this.model, 'change', this.update);
		this.listenTo(this.model, 'select', this.select);
		this.listenTo(this.model, 'deselect', this.deselect);
	},

	//
	// setting methods
	//

	setColor: function(color) {

		// call superclass method
		//
		this.setElementColor(this.$el, color);

		// set color of beams
		//
		if (this.beamView1) {
			this.beamView1.setColor(color);
		}
		if (this.beamView2) {
			this.beamView2.setColor(color);
		}

		// set color of image, if exists
		//
		if (this.imageView) {
			this.imageView.setColor(color);
		}
	},

	//
	// selecting methods
	//

	select: function() {
		if (this.isSelected()) {
			return;
		}

		// move to top
		//
		this.toTop();

		// select image
		//
		if (this.imageView) {
			this.imageView.select();
		}

		// call mixin method
		//
		SVGAnnotatable.select.call(this);
	},

	deselect: function() {
		if (!this.isSelected()) {
			return;
		}

		// deselect image
		//
		if (this.imageView) {
			this.imageView.deselect();
		}

		// call mixin method
		//
		SVGAnnotatable.deselect.call(this);
	},

	//
	// adding methods
	//

	addDragBehavior: function() {
		this.dragBehavior = new MouseDragElementBehavior(this.$el, {
			viewport: this.options.viewport,
			on: true,
			blocking: true,

			// callbacks
			//
			onmousedown: () => {
				this.select();
			},
			onmousedrag: () => {

				// update model
				//
				this.model.moveTo(this.dragBehavior.getElementLocation());
			}
		});
	},

	addListeners: function() {
		let viewport = this.options.viewport;
		if (viewport) {

			// get elements from viewport
			//
			let elementsView = viewport.elementsView;
			if (elementsView) {
				let elements = elementsView.collection;

				// listen to elements
				//
				this.listenTo(elements, 'add remove change reorder enable disable', () => {
					this.update();
				});
			}
		}
	},

	//
	// removing methods
	//

	removeBeams: function() {
		if (this.beamView1) {
			this.beamView1.destroy();
			this.beamView1 = null;
		}
		if (this.beamView2) {
			this.beamView2.destroy();
			this.beamView2 = null;
		}
	},

	removeImage: function() {
		if (this.imageView) {
			this.imageView.destroy();
			this.imageView = null;
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call mixin method
		//
		SVGAnnotatable.onRender.call(this);

		// add subviews
		//
		this.addBeams();
		this.addImage();

		// set behaviors
		//
		if (this.options.draggable) {
			this.addDragBehavior();
		}

		// set initial state
		//
		if (this.options.selected) {
			this.select();
		}

		// add listening callbacks
		//
		this.addListeners();

		// add tooltip triggers
		//
		this.addTooltips();
	},

	toTop: function() {
		let parent = this.$el.parent();
		let element = this.$el.detach();
		parent.append(element);
	},

	hide: function() {
		MarkerView.prototype.hide.call(this);
		this.hideBeams();
		this.hideImage();

		if (this.isSelected()) {
			this.hideAnnotation();
		}
	},

	show: function() {
		MarkerView.prototype.show.call(this);
		this.showBeams();
		this.showImage();

		if (this.isSelected()) {
			this.showAnnotation();
		}
	},

	//
	// updating methods
	//

	update: function() {
		let viewport = this.options.viewport;
		let elementsView = viewport.elementsView;
		let elements = elementsView.collection;

		// call superclass method
		//
		MarkerView.prototype.update.call(this);

		// update visibility
		//
		if (this.model.get('hidden')) {
			this.hide();
		} else {
			this.show();
		}

		// update views
		//
		if (elements.length > 0) {
			this.updateBeamsAndImage();
		} else {
			this.removeBeamsAndImage();
		}
	},

	updateBeamsAndImage: function() {
		if (!this.beamView1 && !this.beamView2) {
			this.addBeams();
			if (this.beamView1 && this.beamView2) {
				if (this.beamView1.hasFocus() && this.beamView2.hasFocus()) {
					this.addImage();
				}
			}	
		} else {
			this.updateBeams();
			if (this.beamView1.hasFocus() && this.beamView2.hasFocus()) {
				if (this.imageView) {
					this.updateImage();
				} else {
					this.addImage();
				}
			} else {
				this.removeImage();
			}
		}
	},

	removeBeamsAndImage: function() {
		this.removeBeams();
		this.removeImage();
	},

	//
	// event handling methods
	//

	onChange: function() {

		// call superclass method
		//
		MarkerView.prototype.onChange.call(this);

		// call mixin method
		//
		SVGAnnotatable.onChange.call(this);

		// update
		//
		this.updateBeamsAndImage();
	},

	//
	// mouse event handling methods
	//

	onDoubleClick: function() {

		// show edit dialog
		//
		if (this.editable) {
			this.edit();
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
		this.removeBeams();
		this.removeImage();
	}
}), {

	//
	// static attributes
	//

	count: 0
});