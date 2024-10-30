/******************************************************************************\
|                                                                              |
|                            optic-info-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for showing information about an optic.         |
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
import OpticInfoFormView from '../../../../../views/apps/optic-editor/forms/info/optic-info-form-view.js';

export default InfoDialogView.extend({
	
	//
	// saving methods
	//

	save: function() {

		// disable save button
		//
		this.$el.find('.save').prop('disabled', true);

		// save changes
		//
		this.model.save(undefined, {

			// callbacks
			//
			success: () => {

				// close dialog
				//
				this.hide();
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Your changes could not be saved.",
					response: response
				});
			}
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			title: this.model.get('name') + ' Info'
		};
	},

	form: function() {
		return new OpticInfoFormView({
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