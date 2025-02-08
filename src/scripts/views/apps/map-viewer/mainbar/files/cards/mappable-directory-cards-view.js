/******************************************************************************\
|                                                                              |
|                       mappable-directory-cards-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of file & directory cards.              |
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
import DirectoryCardsView from '../../../../../../views/apps/file-browser/mainbar/files/cards/directory-cards-view.js';
import MappableFileCardView from '../../../../../../views/apps/map-viewer/mainbar/files/cards/mappable-file-card-view.js';
import MappableDirectoryCardView from '../../../../../../views/apps/map-viewer/mainbar/files/cards/mappable-directory-card-view.js';
import MappableVolumeCardView from '../../../../../../views/apps/map-viewer/mainbar/files/cards/mappable-volume-card-view.js';

export default DirectoryCardsView.extend({

	//
	// rendering methods
	//

	childView: function(item) {
		if (item instanceof Volume) {
			return MappableVolumeCardView;
		} else if (item instanceof File) {
			return MappableFileCardView;
		} else if (item instanceof Directory) {
			return MappableDirectoryCardView;
		}
	}
});