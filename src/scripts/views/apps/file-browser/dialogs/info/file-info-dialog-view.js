/******************************************************************************\
|                                                                              |
|                            file-info-dialog-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for showing information about a file.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ItemInfoDialogView from '../../../../../views/apps/file-browser/dialogs/info/item-info-dialog-view.js';
import FileInfoView from '../../../../../views/apps/file-browser/forms/info/file-info-view.js';

export default ItemInfoDialogView.extend({
	
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
					message: "Your permission changes could not be saved.",
					response: response
				});
			}
		});
	},
	
	//
	// rendering methods
	//

	info: function() {
		return new FileInfoView({
			model: this.model,

			// options
			//
			tab: this.options.tab,
			links: this.options.links,
			shareRequests: this.options.shareRequests,

			// callbacks
			//
			onchange: () => this.update()
		});
	}
});