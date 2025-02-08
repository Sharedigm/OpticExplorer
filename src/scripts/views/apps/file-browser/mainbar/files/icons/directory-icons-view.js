/******************************************************************************\
|                                                                              |
|                            directory-icons-view.js                           |
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
import IconsView from '../../../../../../views/items/icons/icons-view.js';
import FileIconView from '../../../../../../views/apps/file-browser/mainbar/files/icons/file-icon-view.js';
import DirectoryIconView from '../../../../../../views/apps/file-browser/mainbar/files/icons/directory-icon-view.js';
import VolumeIconView from '../../../../../../views/apps/file-browser/mainbar/files/icons/volume-icon-view.js';

export default IconsView.extend({

	//
	// rendering methods
	//

	childView: function(item) {
		if (item instanceof Volume) {
			return VolumeIconView;
		} else if (item instanceof File) {
			return FileIconView;
		} else if (item instanceof Directory) {
			return DirectoryIconView;
		}
	}
});