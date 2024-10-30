/******************************************************************************\
|                                                                              |
|                      edit-distant-object-dialog-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog used to edit an existing distant object.        |
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
import DistantObjectFormView from '../../../../../views/apps/optic-editor/forms/objects/distant-object-form-view.js';

export default EditObjectDialogView.extend({

	//
	// attributes
	//

	title: 'Edit Distant Object',

	//
	// rendering methods
	//

	form: function() {
		return new DistantObjectFormView({
			model: this.model,

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid)
		});
	}
});