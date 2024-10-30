/******************************************************************************\
|                                                                              |
|                                light-ray-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a light ray light source.                      |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import LightView from '../../../../../../views/apps/optic-editor/mainbar/viewports/lights/light-view.js';
import LightRayAnnotationView from '../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/lights/light-ray-annotation-view.js';

export default LightView.extend({

	//
	// attributes
	//

	className: 'ray ' + LightView.prototype.className,
	beamName: 'ray',
	title: 'Light Ray',

	//
	// rendering attributes
	//

	icon: `
		<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 24 24">
			<path d="M17 12c0 2.762-2.238 5-5 5s-5-2.238-5-5 2.238-5 5-5 5 2.238 5 5zm-9.184-5.599l-3.594-3.594-1.414 1.414 3.594 3.595c.402-.537.878-1.013 1.414-1.415zm4.184-1.401c.34 0 .672.033 1 .08v-5.08h-2v5.08c.328-.047.66-.08 1-.08zm5.598 2.815l3.594-3.595-1.414-1.414-3.594 3.595c.536.402 1.012.878 1.414 1.414zm-12.598 4.185c0-.34.033-.672.08-1h-5.08v2h5.08c-.047-.328-.08-.66-.08-1zm11.185 5.598l3.594 3.593 1.415-1.414-3.594-3.594c-.403.537-.879 1.013-1.415 1.415zm-9.784-1.414l-3.593 3.593 1.414 1.414 3.593-3.593c-.536-.402-1.011-.877-1.414-1.414zm12.519-5.184c.047.328.08.66.08 1s-.033.672-.08 1h5.08v-2h-5.08zm-6.92 8c-.34 0-.672-.033-1-.08v5.08h2v-5.08c-.328.047-.66.08-1 .08z" />
		</svg>
	`,

	width: 20,
	height: 20,

	//
	// getting methods
	//

	getAnnotation: function() {
		return new LightRayAnnotationView({
			model: this.model,

			// options
			//
			parent: this,
			viewport: this.options.viewport
		});
	},

	//
	// setting methods
	//

	setLocation(location) {
		this.model.set({
			location: location,
			direction: location
		});
	},

	//
	// editing methods
	//

	edit: function() {
		this.showEditLightRayDialogView();
	},

	//
	// dialog rendering methods
	//

	showEditLightRayDialogView: function() {
		import(
			'../../../../../../views/apps/optic-editor/dialogs/lights/edit-light-ray-dialog-view.js'
		).then((EditLightRayDialogView) => {
			this.options.viewport.getParentView('app').show(new EditLightRayDialogView.default({
				model: this.model,

				// options
				//
				viewport: this.options.viewport
			}));
		});
	}
});