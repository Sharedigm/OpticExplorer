/******************************************************************************\
|                                                                              |
|                          connection-info-showable.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for showing connection information.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Connections from '../../../../../../collections/users/connections/connections.js';

export default {

	//
	// dialog rendering methods
	//

	showConnectionInfoDialog: function(connection, options) {
		import(
			'../../../../../../views/apps/connection-manager/dialogs/info/connection-info-dialog-view.js'
		).then((ConnectionInfoDialogView) => {

			// show connection info dialog
			//
			this.show(new ConnectionInfoDialogView.default(_.extend({
				model: connection
			}, options)));				
		});		
	},

	showConnectionsInfoDialog: function(connections, options) {

		// show info for a single item
		//
		if (connections.length == 1) {
			this.showConnectionInfoDialog(connections[0], options);
			return;
		}

		import(
			'../../../../../../views/apps/connection-manager/dialogs/info/connections-info-dialog-view.js'
		).then((ConnectionsInfoDialogView) => {

			// show connections info dialog
			//
			this.show(new ConnectionsInfoDialogView.default(_.extend({
				collection: new Connections(connections)
			}, options)));				
		});		
	}
}