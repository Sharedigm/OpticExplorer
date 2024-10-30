/******************************************************************************\
|                                                                              |
|                       edit-scene-object-dialog-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog used to edit an existing scene object.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import EditObjectDialogView from '../../../../../views/apps/optic-editor/dialogs/objects/edit-object-dialog-view.js';
import SceneObjectFormView from '../../../../../views/apps/optic-editor/forms/objects/scene-object-form-view.js';

export default EditObjectDialogView.extend({

	//
	// attributes
	//

	title: 'Edit Scene Object',

	//
	// rendering methods
	//

	form: function() {
		return new SceneObjectFormView({
			model: this.model,

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid)
		});
	}
});