/******************************************************************************\
|                                                                              |
|                            shareable-by-link.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a behavior that allows sharing by link.                       |
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

	shareItemByLink: function(item, options) {

		// check if item can be shared
		//
		if (!this.checkItemShareable(item)) {
			return;
		}

		// share item by link
		//
		if (item.get('num_links') > 0) {
			this.showShareByLinkDialog(item, options);
		} else {
			this.showNewLinkDialog(item, options);
		}
	},

	shareSelectedByLink: function(options) {
		this.shareItemByLink(this.getSelectedModels()[0], _.extend({}, options, {
			message: config.apps.file_browser.share_invitation_message
		}));
	},

	shareModelByLink: function(options) {
		this.shareItemByLink(this.getModel? this.getModel() : this.model, _.extend({}, options, {
			message: config.apps.file_browser.share_invitation_message
		}));
	},

	shareByLink: function(options) {
		if (this.hasSelected()) {
			this.shareSelectedByLink(options);
		} else {
			this.shareModelByLink(options);
		}
	},

	//
	// dialog rendering methods
	//

	showShareByLinkDialog: function(item, options) {
		import(
			'../../../../../views/apps/file-browser/sharing/links/dialogs/share-by-link-dialog-view.js'
		).then((ShareByLinkDialogView) => {

			// show share by link dialog
			//
			this.show(new ShareByLinkDialogView.default(_.extend({
				model: item
			}, options)));
		});
	},

	showNewLinkDialog: function(item, options) {
		import(
			'../../../../../views/apps/file-browser/sharing/links/dialogs/new-link-dialog-view.js'
		).then((NewLinkDialogView) => {

			// show new link dialog
			//
			this.show(new NewLinkDialogView.default(_.extend({
				target: item
			}, options)));
		});
	}
};