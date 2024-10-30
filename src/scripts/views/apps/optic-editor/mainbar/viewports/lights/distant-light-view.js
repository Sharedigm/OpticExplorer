/******************************************************************************\
|                                                                              |
|                               distant-light-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a directional (infinity) light source.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import LightView from '../../../../../../views/apps/optic-editor/mainbar/viewports/lights/light-view.js';
import DistantLightAnnotationView from '../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/lights/distant-light-annotation-view.js';
import CollimatedBeamView from '../../../../../../views/apps/optic-editor/mainbar/viewports/ray-tracing/collimated-beam-view.js';

export default LightView.extend({

	//
	// attributes
	//

	className: 'distant ' + LightView.prototype.className,
	title: 'Distant Light',

	//
	// rendering attributes
	//

	icon: `
		<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 512 512">
			<polygon points="256,60.082 293.022,225.727 462,209.75 315.903,296.147 383.314,451.918 256,339.67 128.686,451.918 196.097,296.147 50,209.75 218.978,225.727" transform="matrix(1.1,0,0,1.1,-53.76,-53.76)" />
		</svg>
	`,

	//
	// getting methods
	//

	getAnnotation: function() {
		return new DistantLightAnnotationView({
			model: this.model,

			// options
			//
			parent: this,
			viewport: this.options.viewport
		});
	},

	getBeamView: function(options) {
		return new CollimatedBeamView(options);
	},

	//
	// editing methods
	//

	edit: function() {
		this.showEditDistantLightDialogView();
	},

	//
	// dialog rendering methods
	//

	showEditDistantLightDialogView: function() {
		import(
			'../../../../../../views/apps/optic-editor/dialogs/lights/edit-distant-light-dialog-view.js'
		).then((EditDistantLightDialogView) => {
			this.options.viewport.getParentView('app').show(new EditDistantLightDialogView.default({
				model: this.model,

				// options
				//
				viewport: this.options.viewport
			}));
		});
	}
});