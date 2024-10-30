/******************************************************************************\
|                                                                              |
|                                  surface-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an abstract base class for viewing optical surfaces.          |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../../../views/base-view.js';
import Selectable from '../../../../../../../views/behaviors/selection/selectable.js';
import SVGRenderable from '../../../../../../../views/svg/behaviors/svg-renderable.js';
import SVGAnnotatable from '../../../../../../../views/svg/behaviors/svg-annotatable.js';

export default BaseView.extend(_.extend({}, Selectable, SVGRenderable, SVGAnnotatable, {
	
	//
	// attributes
	//

	className: 'surface',
	editable: true,

	events: {
		'mousedown': 'onMouseDown',
		'mouseup': 'onMouseUp',
		'dblclick': 'onDoubleClick'
	},

	//
	// constructor
	//

	initialize: function() {
		
		// set attributes
		//
		this.parent = this.options.parent;

		// drawing options
		//
		if (this.options) {
			if (!this.options.strokeStyle && this.options.material) {
				this.options.strokeStyle = this.options.material.getColor();
			}
		}

		// listen to model
		//
		this.listenTo(this.model, 'select', () => this.select());
		this.listenTo(this.model, 'deselect', () => this.deselect());
		this.listenTo(this.model, 'change', () => this.update());
	},

	//
	// attribute methods
	//

	title: function() {
		let index = this.model.getIndex();
		return 'Surface' + (index != undefined? index + 1 : '');
	},

	attributes: function() {
		let offset = this.options? this.options.offset : null;
		let clockwise = (this.options && this.options.clockwise)? true : false;
		let append = (this.options && this.options.append)? true : false;
		return {
			'class': this.getClassName(),
			'd': this.toDrawing(offset, clockwise, append),
			'rel': 'tooltip',
			'title': _.result(this, 'title')
		}
	},

	//
	// querying methods
	//


	prev: function() {
		if (this.model.getSide() == 'back') {
			return this.parent.views.front;
		} else {

			// get prev lens
			//
			let element = this.parent.prev();
			while (!element.views && element != this.parent) {
				element = element.prev();
			}

			if (element.views.back) {
				return element.views.back;
			}
		}
	},

	next: function() {
		if (this.model.getSide() == 'front') {
			return this.parent.views.back;
		} else {

			// get next lens
			//
			let element = this.parent.next();
			while (!element.views && element != this.parent) {
				element = element.next();
			}

			if (element.views.back) {
				return element.views.front;
			}
		}
	},

	//
	// getting methods
	//

	getClassName: function() {
		let className = this.model.getSide() + ' ' + this.className;

		if (this.model.has('coating')) {
			className += ' ' + this.model.get('coating');
		}
		if (this.isSelected()) {
			className += ' selected';
		}

		return className;
	},

	//
	// setting methods
	//

	setOffset: function(offset) {
		let clockwise = this.model.index == 0;
		let append = false;

		// set attributes
		//
		this.options.offset = offset;

		// update path
		//
		this.$el.attr('d', this.toDrawing(offset, clockwise, append));
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

	onRender: function() {

		// add tooltip trigger
		//
		this.addTooltips();
	},

	//
	// dialog rendering methods
	//

	showEditElementDialogView: function() {
		import(
			'../../../../../../../views/apps/optic-editor/dialogs/elements/edit-element-dialog-view.js'
		).then((EditElementDialogView) => {
			application.show(new EditElementDialogView.default({
				model: this.model.parent,

				// options
				//
				tab: this.model.getSide() == 'front'? 'front' : 'back',
				parent: this.options.parent.options.parent,
				viewport: this.options.viewport
			}), {
				focus: this.model.getSide() == 'front'? '#front input' : '#back input'
			});
		});
	},

	//
	// updating methods
	//

	update: function() {
		
		// update attributes
		//
		this.$el.attr(this.attributes());

		// update tooltip
		//
		this.updateTooltips();
	},

	//
	// tooltip methods
	//

	addTooltips: function() {

		// add tooltip trigger
		//
		BaseView.prototype.addTooltips.call(this, {

			// options
			//
			el: this.$el,
			trigger: 'hover',
			container: 'body',
			viewport: this.el,

			// callbacks
			//
			placement: (element) => {
				let thickness = this.model.thickness * this.model.sign();
				switch (this.model.index) {

					// first surface
					//
					case 0:
						if (thickness < 0) {
							$(element).css({'margin-left': -thickness * this.options.viewport.pixelsPerMillimeter * this.options.viewport.scale});
						}
						return 'left';

					// second surface
					//
					case 1:
						if (thickness > 0) {
							$(element).css({'margin-left': -thickness * this.options.viewport.pixelsPerMillimeter * this.options.viewport.scale});							
						}
						return 'right';
				}
			}
		});
	},

	updateTooltips: function() {
		this.setTooltip(_.result(this, 'title'));
	},

	//
	// event handling methods
	//

	onChange: function() {

		// call superclass method
		//
		SVGAnnotatable.onChange.call(this);

		// update view
		//
		this.update();
		this.parent.update();

		// update parent
		//
		this.options.parent.onChange();
	},

	//
	// mouse event handling methods
	//

	onMouseDown: function(event) {

		// deselect elements
		//
		this.options.parent.options.parent.deselectAll();

		// call superclass method
		//
		Selectable.onMouseDown.call(this, event);
	},

	onDoubleClick: function(event) {
		this.onSelect();

		// show edit dialog
		//
		if (this.editable) {
			this.edit();
		}

		// finish handling event
		//
		event.stopPropagation();
	}
}));