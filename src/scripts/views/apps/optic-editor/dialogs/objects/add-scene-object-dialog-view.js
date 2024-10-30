/******************************************************************************\
|                                                                              |
|                       add-scene-object-dialog-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog view used to add a new scene object.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import AddObjectDialogView from '../../../../../views/apps/optic-editor/dialogs/objects/add-object-dialog-view.js';
import SceneObjectFormView from '../../../../../views/apps/optic-editor/forms/objects/scene-object-form-view.js';

export default AddObjectDialogView.extend({

	//
	// attributes
	//

	title: 'Add Scene Object',

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