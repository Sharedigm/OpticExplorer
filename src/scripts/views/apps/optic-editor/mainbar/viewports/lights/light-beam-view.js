/******************************************************************************\
|                                                                              |
|                               light-beam-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a light ray light source.                      |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import LightView from '../../../../../../views/apps/optic-editor/mainbar/viewports/lights/light-view.js';
import LightBeamAnnotationView from '../../../../../../views/apps/optic-editor/mainbar/viewports/annotation/lights/light-beam-annotation-view.js';

export default LightView.extend({

	//
	// attributes
	//

	className: 'ray ' + LightView.prototype.className,
	title: 'Light Beam',

	//
	// rendering attributes
	//

	width: 24,
	height: 24,

	icon: `
		<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 512 512">
			<path d="M307.5,153 c 0,0 -40.234,27.359 -64.626,42.439 c  -11.919,5.959 -25.062,9.061 -38.374,9.061H81.022 
			C64.577,208.289,50,231.239,50,257.467 c 0,25.256,13.948,46.11,31.022,50.033H204.5 c 13.311,0,26.454,2.564,38.374,8.516
			C269.947,332.713,307.5,359,307.5,359V153z M170.167,273.166 c  -9.48,0 -17.167 -7.686 -17.167 -17.166
			 c 0 -9.479,7.687 -17.166,17.167 -17.166 c 9.48,0,17.167,7.687,17.167,17.166C187.333,265.48,179.647,273.166,170.167,273.166z M359,153
			v206h -34.334V153H359z M462,273.166h -68.666v -34.332H462V273.166z M462,161.584l -53.109,37.552l -18.608 -25.75l53.109 -37.552
			L462,161.584z M443.392,376.166l -53.109 -37.551l18.608 -25.75L462,350.416L443.392,376.166z"/>
		</svg>
	`,

	//
	// getting methods
	//

	getAnnotation: function() {
		return new LightBeamAnnotationView({
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
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		LightView.prototype.onRender.call(this);

		// set initial rotation
		//
		if (this.model.has('angle')) {
			this.setRotation(this.model.get('angle').in('deg'));
		}
	},

	//
	// dialog rendering methods
	//

	showEditLightRayDialogView: function() {
		import(
			'../../../../../../views/apps/optic-editor/dialogs/lights/edit-light-beam-dialog-view.js'
		).then((EditLightBeamDialogView) => {
			this.options.viewport.getParentView('app').show(new EditLightBeamDialogView.default({
				model: this.model,

				// options
				//
				viewport: this.options.viewport
			}));
		});
	}
});