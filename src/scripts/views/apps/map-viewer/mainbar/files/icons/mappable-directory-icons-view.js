/******************************************************************************\
|                                                                              |
|                       mappable-directory-icons-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of file & directory icons.              |
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
import DirectoryIconsView from '../../../../../../views/apps/file-browser/mainbar/files/icons/directory-icons-view.js';
import MappableFileIconView from '../../../../../../views/apps/map-viewer/mainbar/files/icons/mappable-file-icon-view.js';
import MappableDirectoryIconView from '../../../../../../views/apps/map-viewer/mainbar/files/icons/mappable-directory-icon-view.js';
import MappableVolumeIconView from '../../../../../../views/apps/map-viewer/mainbar/files/icons/mappable-volume-icon-view.js';

export default DirectoryIconsView.extend({

	//
	// rendering methods
	//

	childView: function(item) {
		if (item instanceof Volume) {
			return MappableVolumeIconView;
		} else if (item instanceof File) {
			return MappableFileIconView;
		} else if (item instanceof Directory) {
			return MappableDirectoryIconView;
		}
	}
});