/******************************************************************************\
|                                                                              |
|                                  element-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an abstract base class for viewing optical elements.          |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../../views/base-view.js';
import Selectable from '../../../../../../views/behaviors/selection/selectable.js';
import MouseDragElementBehavior from '../../../../../../views/behaviors/mouse/mouse-drag-element-behavior.js';
import SVGCollectionRenderable from '../../../../../../views/svg/behaviors/svg-collection-renderable.js';
import SVGAnnotatable from '../../../../../../views/svg/behaviors/svg-annotatable.js';
import Vector2 from '../../../../../../utilities/math/vector2.js';
import Browser from '../../../../../../utilities/web/browser.js';

export default BaseView.extend(_.extend({}, Selectable, SVGCollectionRenderable, SVGAnnotatable, {

	//
	// attributes
	//

	className: 'element',
	blocking: Browser.is_mobile,
	editable: true,

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.parent = this.options.parent;

		// listen to model
		//
		this.listenTo(this.model, 'select', () => this.select({
			silent: true
		}));
		this.listenTo(this.model, 'deselect', () => this.deselect({
			silent: true
		}));
		this.listenTo(this.model, 'change', () => this.onChange());
	},

	//
	// querying methods
	//

	isDraggable: function() {
		return this.getParentView('app').draggable;
	},

	prev: function(options) {
		let index = this.parent.indexOf(this);
		if (index > 0) {
			return this.parent.findByIndex(index - 1);
		} else if (!options || options.wraparound) {
			return this.parent.getSelectedChildView('last');
		}
	},

	next: function(options) {
		let index = this.parent.indexOf(this);
		if (index < this.parent.children.length - 1) {
			return this.parent.findByIndex(index + 1);
		} else if (!options || options.wraparound){
			return this.parent.getSelectedChildView('first');
		}
	},

	//
	// getting methods
	//

	getHighlightGradient: function(context) {
		let radius = this.model.getRadius();
		let gradient = context.createLinearGradient(0, -radius, 0, radius);

		/*
		gradient.addColorStop(0, 'rgba(255,255,255,0.0)');
		gradient.addColorStop(0.25, 'rgba(255,255,255,0.0)');
		gradient.addColorStop(0.33, 'rgba(255,255,255,1.0)');
		gradient.addColorStop(0.50, 'rgba(255,255,255,0.0)');
		gradient.addColorStop(1, 'rgba(0,0,0,0.125)');
		*/

		gradient.addColorStop(0, 'rgba(255,255,255,0.0)');
		gradient.addColorStop(0.1, 'rgba(255,255,255,0.0)');
		gradient.addColorStop(0.25, 'rgba(255,255,255,0.75)');
		gradient.addColorStop(0.3, 'rgba(255,255,255,1.0)');
		gradient.addColorStop(0.4, 'rgba(255,255,255,0.0)');
		gradient.addColorStop(0.5, 'rgba(255,255,255,0.0)');
		gradient.addColorStop(0.6, 'rgba(255,255,255,0.0)');
		gradient.addColorStop(0.7, 'rgba(255,255,255,0.5)');
		gradient.addColorStop(0.8, 'rgba(255,255,255,0.0)');
		gradient.addColorStop(1, 'rgba(0,0,0,0.125)');
		return gradient;
	},

	//
	// setting methods
	//

	setIndex: function(index, options) {
		this.model.setIndex(index, {
			silent: true
		});

		// set element offsets
		//
		this.options.parent.offsetElements(options);

		// update ordering
		//
		this.options.parent.updateIds();
	},

	setOffset: function(offset, options) {
		let height = this.getHeight();

		// get current offset
		//		
		let startOffset = this.getOffset();
		let originalOffset = this.options.offset;

		if (options && options.duration > 0) {

			// compute change
			//
			let finishOffset = offset;
			let change = finishOffset.minus(startOffset);

			// animate attributes
			//
			$({t: 0}).animate({t: 1}, {
				duration: options.duration,

				// callbacks
				//
				step: (t) => {

					// update offset
					//
					let offset = startOffset.plus(change.scaledBy(t));
					this.options.offset = offset;

					// update attributes
					//
					let surfaceOffset = this.getSurfaceOffset? this.getSurfaceOffset() : 0;
					let x = offset.x - surfaceOffset;
					let y = offset.y - height / 2;
					this.setLocation(x, y);

					// update annotations
					//
					if (this.isAnnotated()) {
						if (t < 1) {

							// update annotation trans
							//
							this.setAnnotationOffset((offset.minus(originalOffset)).scaledBy(this.options.viewport.pixelsPerMillimeter));
						} else {
							
							// finish updating annotations
							//
							if (t == 1) {
								this.setAnnotationOffset();
							}
						}
					}

					// update shadows
					//
					this.options.viewport.update();

					// perform callback
					//
					if (t == 1 && options && options.finish) {
						options.finish();
					}
				}
			});
		} else {

			// change offset
			//
			this.options.offset = offset;

			// change attributes
			//
			let surfaceOffset = this.getSurfaceOffset? this.getSurfaceOffset() : 0;
			let x = (this.options.offset? this.options.offset.x : 0) - surfaceOffset;
			let y = (this.options.offset? this.options.offset.y : 0) - height / 2;
			this.setLocation(x, y);
	
			// update annotations
			//
			if (this.isAnnotated()) {
				this.setAnnotationOffset();
			}
		}
	},

	setLocation: function(x, y) {
		let svg = this.$el;

		// add units
		//
		if (typeof x == 'number') {
			x += 'mm';
		}
		if (typeof y == 'number') {
			y += 'mm';
		}

		$(svg).attr('x', x);
		$(svg).attr('y', y);

		// update highlight
		//
		if (this.highlight) {
			$(this.highlight).attr('x', x);
			$(this.highlight).attr('y', y);			
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// add tooltip triggers
		//
		this.addTooltips({
			el: this.$el
		});	
	},

	toTop: function() {
		this.elementToTop(this.$el);
	},

	elementToTop: function(element) {
		let parent = $(element).parent();
		element = $(element).detach();
		parent.append(element);
	},

	//
	// svg rendering methods
	//

	addShadow: function() {
		this.shadow = this.toShadow();
		this.options.viewport.addElement(this.shadow, 'background');
	},

	toShadow: function() {

		// create new use node
		//
		let xmlns = "http://www.w3.org/2000/svg";   
		let xlinkns = 'http://www.w3.org/1999/xlink';
		let use = document.createElementNS(xmlns, 'use');

		// compute shadow offset
		//
		let xOffset = this.getWidth() / 5 * this.options.viewport.pixelsPerMillimeter;
		let yOffset = this.getHeight() / 20 * this.options.viewport.pixelsPerMillimeter;

		// set attributes
		//
		use.setAttributeNS(xlinkns, 'href', '#' + this.getShadowedId());
		$(use).attr({
			'class': 'softer shadow',
			'transform': 'scale(1, 1), translate(' + xOffset + ', ' + yOffset + ')'
		});

		return use;
	},

	removeShadow: function() {
		if (this.shadow) {
			this.shadow.remove();
		}
	},

	//
	// hiding methods
	//

	hide: function() {
		this.$el.addClass('hidden');
	},

	show: function() {
		this.$el.removeClass('hidden');
	},

	//
	// updating methods
	//

	update: function() {

		// update attributes
		//
		this.$el.attr(this.attributes());

		// update visibility
		//
		if (this.model.get('hidden')) {
			this.hide();
		} else {
			this.show();
		}

		// call mixin method
		//
		SVGAnnotatable.updateAnnotations.call(this);

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange('element');
		}
	},

	updateTooltips: function() {
		this.setTooltip(_.result(this, 'title'));
	},

	updateIds: function() {

		// update element id
		//
		this.$el.attr('id', this.getId());
	},

	addMouseDragBehavior: function() {

		// create new mouse drag object behavior
		//			
		this.behavior = new MouseDragElementBehavior(this.$el, {
			viewport: this.options.viewport,

			// callbacks
			//
			onmousedrag: (event) => {

				// disable element while dragging
				//
				if (!this.model.disabled) {
					this.model.set('disabled', true, {
						silent: true
					});
					this.model.trigger('disable');
				}
				
				// update shadows
				//
				this.options.viewport.update();

				// call event handler
				//
				this.onMouseDrag(event);
			},

			ondragelement: (x, y) => {
				this.setLocation(x, y);
			},

			onmouseup: (event) => {

				// call drag end event handler, if necessary
				//
				if (this.behavior && this.behavior.isDragged()) {
					this.onMouseDragEnd(event);
				}

				// call event handler
				//
				this.onMouseUp(event);
			}
		});
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.update();

		// call mixin method
		//
		SVGAnnotatable.onChange.call(this);
	},

	handleClick: function(event) {

		// call superclass method
		//
		Selectable.handleClick.call(this, event);

		// check if we are in object drag mode
		//
		if (this.isDraggable()) {
			this.toTop();

			// reset annotation offset
			//
			this.setAnnotationOffset();
		
			// add behavior
			//
			this.addMouseDragBehavior();

			// start mouse drag behavior
			//
			this.behavior.mouseDownHandler(event);
		}
	},

	onMouseDrag: function() {

		// update annotation
		//
		let drag = this.behavior.getOffset(this.behavior.start, this.behavior.current);
		let offset = new Vector2(drag.left, drag.top).scaledBy(1 / this.options.viewport.scale);
		this.setAnnotationOffset(offset);
	},

	onMouseUp: function() {

		// end mouse drag behavior
		//
		if (this.behavior) {

			// unbind events
			//
			this.behavior.off();
			this.behavior.onDestroy();
			this.behavior = null;

			// unblock events 
			//
			this.options.transparent = true;
		}
	},

	onMouseDragEnd: function() {

		// set new element order
		//
		this.setIndex(this.options.parent.getElementViewIndex(this), {
			duration: this.options.parent.options.move_duration,

			// callbacks
			//
			done: () => {

				// re-enable element
				//
				this.model.set('disabled', false, {
					silent: true
				});
				this.model.trigger('enable');

				// play reorder sound
				//
				application.play('reorder');
			}
		});
	},

	onDoubleClick: function() {
		this.onSelect();

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

		// call mixin methods
		//
		SVGAnnotatable.onBeforeDestroy.call(this);

		// clean up view
		//
		this.removeShadow();

		// clean up tooltips
		//
		this.removeTooltips();
	}
}));