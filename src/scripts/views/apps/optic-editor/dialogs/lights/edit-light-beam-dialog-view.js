/******************************************************************************\
|                                                                              |
|                        edit-light-beam-dialog-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog used to edit an existing point light.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import EditLightDialogView from '../../../../../views/apps/optic-editor/dialogs/lights/edit-light-dialog-view.js';
import LightBeamFormView from '../../../../../views/apps/optic-editor/forms/lights/light-beam-form-view.js';

export default EditLightDialogView.extend({

	//
	// attributes
	//

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

	title: 'Edit Light Beam',

	//
	// rendering methods
	//

	form: function() {
		return new LightBeamFormView({
			model: this.model,

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid)
		});
	}
});