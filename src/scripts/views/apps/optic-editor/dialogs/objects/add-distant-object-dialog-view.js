/******************************************************************************\
|                                                                              |
|                      add-distant-object-dialog-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog view used to add a new distant object.          |
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
import DistantObjectFormView from '../../../../../views/apps/optic-editor/forms/objects/distant-object-form-view.js';

export default AddObjectDialogView.extend({

	//
	// attributes
	//

	title: 'Add Distant Object',

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