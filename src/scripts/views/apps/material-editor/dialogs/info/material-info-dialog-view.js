/******************************************************************************\
|                                                                              |
|                          material-info-dialog-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for showing information about a material.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import InfoDialogView from '../../../../../views/apps/common/dialogs/info/info-dialog-view.js';
import MaterialInfoFormView from '../../../../../views/apps/material-editor/forms/info/material-info-form-view.js';

export default InfoDialogView.extend({

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			title: (this.model? this.model.get('name') : 'Untitled') + ' Info'
		};
	},

	form: function() {
		return new MaterialInfoFormView({
			model: this.model,

			// options
			//
			file: this.options.file,
			tab: this.options.tab,

			// callbacks
			//
			onchange: () => this.update()
		});
	}
});