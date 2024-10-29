/******************************************************************************\
|                                                                              |
|                           shareable-by-invitation.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a behavior for views that allow sharing by invitation.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Browser from '../../../../../utilities/web/browser.js';

export default {

	//
	// sharing methods
	//

	shareItemByInvitation: function(item, options) {

		// check if item can be shared
		//
		if (item && !this.checkItemShareable(item)) {
			return;
		}

		if (Browser.device == 'phone') {
			this.showShareItemsWithConnectionsDialog([item], null, options);
		} else {
			this.showShareItemsDialog([item], null, options);
		}
	},

	shareItemsByInvitation: function(items, options) {

		// check if items can be shared
		//
		if (items && !this.checkItemsShareable(items)) {
			return;
		}

		if (Browser.device == 'phone') {
			this.showShareItemsWithConnectionsDialog(items, null, options);
		} else {
			this.showShareItemsDialog(items, null, options);
		}
	},

	shareItemWithConnections: function(item, connections, options) {

		// check if item can be shared
		//
		if (item && !this.checkItemShareable(item)) {
			return;
		}

		if (Browser.device == 'phone') {
			this.showShareItemsWithConnectionsDialog([item], connections, options);
		} else {
			this.showShareItemsDialog([item], connections, options);
		}
	},

	shareItemsWithConnections: function(items, connections, options) {

		// check if items can be shared
		//
		if (items && !this.checkItemsShareable(items)) {
			return;
		}

		if (Browser.device == 'phone') {
			this.showShareItemsWithConnectionsDialog(items, connections, options);
		} else {
			this.showShareItemsDialog(items, connections, options);
		}
	},

	shareSelectedWithConnections: function(connections, options) {
		this.shareItemsByInvitation(this.getSelectedModels(), connections, _.extend({}, options, {
			message: config.apps.file_browser.share_invitation_message
		}));
	},

	shareModelWithConnections: function(options) {
		this.shareItemByInvitation(this.getModel? this.getModel() : this.model, _.extend({}, options, {
			message: config.apps.file_browser.share_invitation_message
		}));
	},

	shareWithConnections: function(connections, options) {
		if (this.hasSelected()) {
			this.shareSelectedWithConnections(connections, options);
		} else {
			this.shareModelWithConnections(options);
		}
	},

	//
	// dialog rendering methods
	//

	showShareItemsDialog: function(items, connections, options) {
		import(
			'../../../../../views/apps/file-browser/sharing/share-requests/dialogs/share-items-dialog-view.js'
		).then((ShareItemsDialogView) => {

			// show share items dialog
			//
			this.show(new ShareItemsDialogView.default(_.extend({
				items: items,
				connections: connections,
				message: config.apps.file_browser.share_invitation_message
			}, options)));
		});
	},

	showShareItemsWithConnectionsDialog: function(items, connections, options) {
		import(
			'../../../../../views/apps/file-browser/sharing/share-requests/dialogs/share-items-with-connections-dialog-view.js'
		).then((ShareItemsWithConnectionsDialogView) => {

			// show share items with connections dialog
			//
			this.show(new ShareItemsWithConnectionsDialogView.default(_.extend({
				items: items,
				connections: connections,
				message: config.apps.file_browser.share_invitation_message
			}, options)));
		});
	}
};