/******************************************************************************\
|                                                                              |
|                          volume-info-dialog-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for showing information about a volume.         |
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
import VolumeInfoView from '../../../../../views/apps/file-browser/forms/info/volume-info-view.js';

export default ItemInfoDialogView.extend({
	
	//
	// rendering methods
	//

	info: function() {
		return new VolumeInfoView({
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