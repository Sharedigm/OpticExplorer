/******************************************************************************\
|                                                                              |
|                            connection-shareable.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a behavior that allows sharing of connections.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ItemShareable from '../../../../../views/apps/common/behaviors/sharing/item-shareable.js';
import Browser from '../../../../../utilities/web/browser.js';

export default _.extend({}, ItemShareable, {

	//
	// connection sharing methods
	//

	shareWithConnection: function(connection, items, options) {
		this.shareWithConnections([connection], items, options);
	},

	shareWithConnections: function(connections, items, options) {

		// check if items can be shared
		//
		if (items && !this.checkItemsShareable(items)) {
			return;
		}

		if (Browser.device == 'phone') {
			this.showShareItemsWithConnectionsDialog(items, connections, options);
		} else {
			this.showShareWithConnectionsDialog(connections, items, options);
		}
	},

	//
	// dialog rendering methods
	//

	showShareWithConnectionsDialog: function(connections, items, options) {
		application.loadAppView('connection_manager', {

			// callbacks
			//
			success: (ConnectionManagerView) => {
				ConnectionManagerView.showShareWithConnectionsDialog(_.extend({
					items: items,
					connections: connections,
					message: config.apps.file_browser.share_invitation_message
				}, options));
			}
		});
	},
});