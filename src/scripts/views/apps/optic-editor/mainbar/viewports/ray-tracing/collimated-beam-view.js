/******************************************************************************\
|                                                                              |
|                           collimated-beam-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a view of a beam (array of paths).          |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BeamView from '../../../../../../views/apps/optic-editor/mainbar/viewports/ray-tracing/beam-view.js';
import CollimatedBeamAnnotationView from '../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/ray-tracing/collimated-beam-annotation-view.js';

export default BeamView.extend({

	//
	// attributes
	//

	className: 'collimated beam',

	//
	// getting methods
	//

	getAnnotation: function() {
		if (this.annotated && this.hasFocus()) {
			return new CollimatedBeamAnnotationView({
				model: this.model,

				// options
				//
				extend: this.model.get('paths').extended,
				viewport: this.options.viewport,
				parent: this
			});
		}
	}
});