/******************************************************************************\
|                                                                              |
|                            directory-tiles-view.js                           |
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
import TilesView from '../../../../../../views/items/tiles/tiles-view.js';
import FileTileView from '../../../../../../views/apps/file-browser/mainbar/files/tiles/file-tile-view.js';
import DirectoryTileView from '../../../../../../views/apps/file-browser/mainbar/files/tiles/directory-tile-view.js';
import VolumeTileView from '../../../../../../views/apps/file-browser/mainbar/files/tiles/volume-tile-view.js';

export default TilesView.extend({

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		TilesView.prototype.onRender.call(this);

		// set tile size
		//
		this.setTileSize(this.options.tile_size || 'medium');
	},

	childView: function(item) {
		if (item instanceof Volume) {
			return VolumeTileView;
		} else if (item instanceof File) {
			return FileTileView;
		} else if (item instanceof Directory) {
			return DirectoryTileView;
		}
	}
});