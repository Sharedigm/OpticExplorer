/******************************************************************************\
|                                                                              |
|                            dynamic-annotating.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for dynamically rendering annotations.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// attributes
	//

	annotations: 'sometimes',
	dynamic_annotations: true,
	annotations_delay: 100,
	delayed_annotation_scale: 5,
	max_annotation_scale: undefined,

	//
	// setting methods
	//

	setAnnotations: function(visible) {
		if (visible) {
			this.annotations = this.dynamic_annotations? 'sometimes' : 'always';
		} else {
			this.annotations = 'never';
		}
		this.updateAnnotations();
	},

	//
	// shadow updating methods
	//

	showAnnotations: function() {
		this.$el.removeClass('unannotated');
	},

	hideAnnotations: function() {
		this.$el.addClass('unannotated');
	},

	showDelayedAnnotations: function() {

		// show annotations if no change within a short period of time 
		//		
		clearTimeout(this.annotating_timeout);
		this.hideAnnotations();
		this.annotating_timeout = setTimeout(() => {
			clearTimeout(this.annotating_timeout);

			// show / hide annotations
			//
			let scale = this.getRelativeScale();
			if (!this.max_annotation_scale || scale < this.max_annotation_scale) {
				this.showAnnotations();
			}
		}, this.annotations_delay);
	},

	showScaledAnnotations: function() {

		// show / hide annotations, depending upon scale
		//
		let scale = this.getRelativeScale();
		if (!this.max_annotation_scale || scale <= this.max_annotations_scale) {

			// always show annotations
			//
			this.showAnnotations();
		} else {

			// hide annotations
			//
			this.hideAnnotations();
		}
	},

	showScaledDelayedAnnotations: function() {

		// show / hide annotations, depending upon scale
		//
		let scale = this.getRelativeScale();
		if (scale <= this.delayed_annotation_scale) {

			// always show annotations
			//
			this.showAnnotations();
		} else if (!this.max_annotation_scale || scale < this.max_annotation_scale) {

			// show annotations if zoomed out
			//
			this.showDelayedAnnotations();
		} else {

			// hide annotations
			//
			this.hideAnnotations();
		}
	},

	updateAnnotations: function() {
		switch (this.annotations) {
			case 'always':
				this.showAnnotations();
				break;
			case 'sometimes':
				if (this.annotations_delay) {
					this.showScaledDelayedAnnotations();
				} else {
					this.showScaledAnnotations();
				}
				break;
			case 'never':
				this.hideAnnotations();
				break;
		}
	}
}