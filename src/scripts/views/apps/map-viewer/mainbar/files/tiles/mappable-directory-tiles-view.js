/******************************************************************************\
|                                                                              |
|                       mappable-directory-tiles-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of file & directory tiles.              |
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
import DirectoryTilesView from '../../../../../../views/apps/file-browser/mainbar/files/tiles/directory-tiles-view.js';
import MappableFileTileView from '../../../../../../views/apps/map-viewer/mainbar/files/tiles/mappable-file-tile-view.js';
import MappableDirectoryTileView from '../../../../../../views/apps/map-viewer/mainbar/files/tiles/mappable-directory-tile-view.js';
import MappableVolumeTileView from '../../../../../../views/apps/map-viewer/mainbar/files/tiles/mappable-volume-tile-view.js';

export default DirectoryTilesView.extend({

	//
	// rendering methods
	//

	childView: function(item) {
		if (item instanceof Volume) {
			return MappableVolumeTileView;
		} else if (item instanceof File) {
			return MappableFileTileView;
		} else if (item instanceof Directory) {
			return MappableDirectoryTileView;
		}
	}
});