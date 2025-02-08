/******************************************************************************\
|                                                                              |
|                       mappable-directory-list-view.js                        |
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

import File from '../../../../../../models/storage/files/file.js';
import Directory from '../../../../../../models/storage/directories/directory.js';
import Volume from '../../../../../../models/storage/directories/volume.js';
import DirectoryListView from '../../../../../../views/apps/file-browser/mainbar/files/lists/directory-list-view.js';
import MappableFileItemView from '../../../../../../views/apps/map-viewer/mainbar/files/lists/mappable-file-item-view.js';
import MappableDirectoryItemView from '../../../../../../views/apps/map-viewer/mainbar/files/lists/mappable-directory-item-view.js';
import MappableVolumeItemView from '../../../../../../views/apps/map-viewer/mainbar/files/lists/mappable-volume-item-view.js';

export default DirectoryListView.extend({

	//
	// rendering methods
	//
	
	childView: function(item) {
		if (item instanceof Volume) {
			return MappableVolumeItemView;
		} else if (item instanceof File) {
			return MappableFileItemView;
		} else if (item instanceof Directory) {
			return MappableDirectoryItemView;
		}
	}
});