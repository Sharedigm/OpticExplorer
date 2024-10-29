/******************************************************************************\
|                                                                              |
|                            directory-list-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a directory list of items.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DirectoryListView from '../../../../../../views/apps/file-browser/mainbar/files/lists/directory-list-view.js';
import File from '../../../../../../models/storage/files/file.js';
import Directory from '../../../../../../models/storage/directories/directory.js';
import Volume from '../../../../../../models/storage/directories/volume.js';
import DirectoryItemView from '../../../../../../views/apps/file-browser/mainbar/files/lists/directory-item-view.js';
import FileItemView from '../../../../../../views/apps/search-viewer/mainbar/files/lists/file-item-view.js';
import VolumeItemView from '../../../../../../views/apps/file-browser/mainbar/files/lists/volume-item-view.js';

export default DirectoryListView.extend({

	//
	// rendering methods
	//
	
	childView: function(item) {
		if (item instanceof Volume) {
			return VolumeItemView;
		} else if (item instanceof File) {
			return FileItemView;
		} else if (item instanceof Directory) {
			return DirectoryItemView;
		}
	}
});