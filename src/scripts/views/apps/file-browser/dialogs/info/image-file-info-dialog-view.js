/******************************************************************************\
|                                                                              |
|                         image-file-info-dialog-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for showing information about an image          |
|        file.                                                                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FileInfoDialogView from '../../../../../views/apps/file-browser/dialogs/info/file-info-dialog-view.js';
import ImageFileInfoView from '../../../../../views/apps/file-browser/forms/info/image-file-info-view.js';

export default FileInfoDialogView.extend({

	//
	// rendering methods
	//

	info: function() {
		return new ImageFileInfoView({
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