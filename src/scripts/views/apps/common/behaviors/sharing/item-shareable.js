/******************************************************************************\
|                                                                              |
|                               item-shareable.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for views that deal with sharable items       |
|        (files and directories).                                              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ShareableByInvitation from '../../../../../views/apps/common/behaviors/sharing/shareable-by-invitation.js';
import ShareableByMessage from '../../../../../views/apps/common/behaviors/sharing/shareable-by-message.js';
import ShareableByTopic from '../../../../../views/apps/common/behaviors/sharing/shareable-by-topic.js';
import ShareableByLink from '../../../../../views/apps/common/behaviors/sharing/shareable-by-link.js';
import ShareableByEmail from '../../../../../views/apps/common/behaviors/sharing/shareable-by-email.js';

export default _.extend({}, ShareableByInvitation, ShareableByMessage, ShareableByTopic, ShareableByLink, ShareableByEmail, {

	//
	// querying methods
	//

	hasShareable: function() {
		return this.isItemShareable(this.getModel? this.getModel() : this.model);
	},

	isItemShareable: function(item) {
		return item != undefined && item.isSaved && item.isSaved() && item.isOwned && !item.isOwned();
	},

	//
	// checking methods
	//

	checkItemShareable: function(item) {

		// check if item has been saved
		//
		if (item.isSaved && !item.isSaved()) {

			// show notification
			//
			application.notify({
				icon: '<i class="fa fa-share"></i>',
				title: 'Sharing Error',
				message: "You must save these items before they can be shared by invitation."
			});
			
			return false;

		// check if item is owned
		//
		} else if (item.isOwned && item.isOwned()) {

			// show notification
			//
			application.notify({
				icon: '<i class="fa fa-share"></i>',
				title: 'Sharing Error',
				message: "You must own items to be shared by invitation.  If you want to share an item has been shared with you, then you can make a copy of it to share. "
			});
			
			return false;				
		}

		return true;
	},

	checkItemsShareable: function(items) {

		// check if items have been saved
		//
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			if (item) {

				// check if item has been saved
				//
				if (!item.isSaved()) {

					// show notification
					//
					application.notify({
						icon: '<i class="fa fa-share"></i>',
						title: 'Sharing Error',
						message: "You must save these items before they can be shared by invitation."
					});

					return false;

				// check if item is owned
				//
				} else if (item.isOwned()) {

					// show notification
					//
					application.notify({
						icon: '<i class="fa fa-share"></i>',
						title: 'Sharing Error',
						message: "You must own items to be shared by invitation.  If you want to share an item has been shared with you, then you can make a copy of it to share. "
					});

					return false;
				}
			}
		}

		return true;
	}
});