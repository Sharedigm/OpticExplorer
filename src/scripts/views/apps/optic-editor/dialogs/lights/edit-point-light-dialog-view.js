/******************************************************************************\
|                                                                              |
|                       edit-point-light-dialog-view.js                        |
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
import PointLightFormView from '../../../../../views/apps/optic-editor/forms/lights/point-light-form-view.js';

export default EditLightDialogView.extend({

	//
	// attributes
	//

	icon: '<i class="fa fa-lightbulb"></i>',
	title: 'Edit Point Light',

	//
	// rendering methods
	//

	form: function() {
		return new PointLightFormView({
			model: this.model,

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid)
		});
	}
});