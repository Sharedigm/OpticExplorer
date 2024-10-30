/******************************************************************************\
|                                                                              |
|                       edit-distant-light-dialog-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog used to edit an existing distant light.         |
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
import DistantLightFormView from '../../../../../views/apps/optic-editor/forms/lights/distant-light-form-view.js';

export default EditLightDialogView.extend({

	//
	// attributes
	//

	icon: `
		<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 512 512">
			<polygon points="256,60.082 293.022,225.727 462,209.75 315.903,296.147 383.314,451.918 256,339.67 128.686,451.918 196.097,296.147 50,209.75 218.978,225.727" transform="matrix(1.1,0,0,1.1,-53.76,-53.76)" />
		</svg>
	`,

	title: 'Edit Distant Light',

	//
	// rendering methods
	//

	form: function() {
		return new DistantLightFormView({
			model: this.model,

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid)
		});
	}
});