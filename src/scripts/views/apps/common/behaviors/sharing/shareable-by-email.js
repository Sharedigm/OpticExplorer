/******************************************************************************\
|                                                                              |
|                            shareable-by-email.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a behavior that allows sharing by email.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// sharing methods
	//

	shareItemByEmail: function(item, options) {

		// check if item can be shared
		//
		if (!this.checkItemShareable(item)) {
			return;
		}

		this.showShareByEmailDialog(item, options);
	},

	shareSelectedByEmail: function(options) {
		this.shareItemByEmail(this.getSelectedModels()[0], _.extend({}, options, {
			message: config.apps.file_browser.share_invitation_message
		}));
	},

	shareModelByEmail: function(options) {
		this.shareItemByEmail(this.getModel? this.getModel() : this.model, _.extend({}, options, {
			message: config.apps.file_browser.share_invitation_message
		}));
	},

	shareByEmail: function(options) {
		if (this.hasSelected()) {
			this.shareSelectedByEmail(options);
		} else {
			this.shareModelByEmail(options);
		}
	},

	//
	// dialog rendering methods
	//

	showShareByEmailDialog: function(item, options) {
		import(
			'../../../../../views/apps/file-browser/sharing/mail/dialogs/share-by-email-dialog-view.js'
		).then((ShareByEmailDialogView) => {

			// show share by email dialog
			//
			this.show(new ShareByEmailDialogView.default(_.extend({
				model: item
			}, options)));
		});
	}
};