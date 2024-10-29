/******************************************************************************\
|                                                                              |
|                                svg-annotatable.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a mixin for displaying annotatable selectable views.          |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SVGRenderable from '../../../views/svg/behaviors/svg-renderable.js';
import Selectable from '../../../views/behaviors/selection/selectable.js';
import AxisView from '../../../views/svg/shapes/axis-view.js';

export default {

	//
	// querying methods
	//

	isSelected: function() {

		// call mixin method
		//
		return Selectable.isSelected.call(this);
	},

	isAnnotated: function() {
		return this.annotationView != null;
	},

	//
	// setting methods
	//

	setAxesOffset: function(view, offset) {
		if (offset) {
			let bounds = view.options.viewport.getBounds();
			view.options.viewport.bounds = bounds.offsetBy(offset.reversed());
			this.updateAxes(view);
			view.options.viewport.bounds = bounds;
		} else {
			this.updateAxes(view);
		}
	},

	setAnnotationOffset: function(offset) {
		if (this.annotationView) {

			// update axes
			//
			this.setAxesOffset(this.annotationView, offset);

			// update trans
			//
			if (offset) {			
				$(this.annotationView.el).attr('transform', 'translate(' + offset.x + ',' + offset.y + ')');
			} else {
				$(this.annotationView.el).removeAttr('transform');	
				this.update();
			}
		}
	},

	//
	// selecting methods
	//

	select: function(options) {
		if (this.isSelected()) {
			return;
		}

		// call mixin method
		//
		Selectable.select.call(this, options);

		// annotate upon selection
		//
		this.showAnnotation();
	},

	deselect: function(options) {
		if (!this.isSelected()) {
			return;
		}

		// unannotate upon deselection
		//
		this.hideAnnotation();

		// call mixin method
		//
		Selectable.deselect.call(this, options);
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show annotaton
		//
		if (this.isSelected && this.isSelected() && !this.isAnnotated()) {
			this.showAnnotation();
		}
	},

	showAnnotation: function() {
		if (!this.isAnnotated()) {
			if (!this.annotationView) {
				this.annotationView = this.getAnnotation();
			}
			if (this.annotationView) {
				this.annotation = this.options.viewport.show(this.annotationView);
			} else {
				this.annotation = null;
			}
		}
	},

	hideAnnotation: function() {
		if (this.annotationView) {
			this.annotationView.destroy();
			this.annotationView = null;
		}
	},

	//
	// updating methods
	//

	updateAxes: function(view) {
		if (view instanceof AxisView) {
			view.onChange();
		} else if (view.children) {
			view.children.each((childView) => {
				this.updateAxes(childView);
			});
		}
	},

	updateAnnotations: function() {

		// update annotations
		//
		if (this.annotationView) {
			this.annotationView.update();
		}

		// update children
		//
		this.updateChildAnnotations();
	},

	updateChildAnnotations: function() {
		if (this.children) {
			this.children.each((childView) => {
				if (childView.annotationView) {
					childView.annotationView.update();
				}
			});
		}	
	},

	//
	// event handling methods
	//

	onChange: function() {
		if (this.annotationView) {
			if (this.annotationView.onChange) {
				this.annotationView.onChange();
			}
		}
	},
	
	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// call superclass method
		//
		SVGRenderable.onBeforeDestroy.call(this);

		// destroy annotation
		//
		this.hideAnnotation();
	}
};