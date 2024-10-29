/******************************************************************************\
|                                                                              |
|                            directory-pages-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of file & directory pages.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../../../../models/storage/files/file.js';
import Directory from '../../../../../../models/storage/directories/directory.js';
import Volume from '../../../../../../models/storage/directories/volume.js';
import PagesView from '../../../../../../views/items/pages/pages-view.js';
import FilePageView from '../../../../../../views/apps/file-browser/mainbar/files/pages/file-page-view.js';
import DirectoryPageView from '../../../../../../views/apps/file-browser/mainbar/files/pages/directory-page-view.js';
import VolumePageView from '../../../../../../views/apps/file-browser/mainbar/files/pages/volume-page-view.js';

export default PagesView.extend({

	//
	// rendering methods
	//

	childView: function(item) {
		if (item instanceof Volume) {
			return VolumePageView;
		} else if (item instanceof File) {
			return FilePageView;
		} else if (item instanceof Directory) {
			return DirectoryPageView;
		}
	}
});