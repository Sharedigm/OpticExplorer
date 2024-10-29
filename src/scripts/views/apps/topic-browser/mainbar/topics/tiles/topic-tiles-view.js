/******************************************************************************\
|                                                                              |
|                             topic-tiles-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of news topic tiles.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TilesView from '../../../../../../views/items/tiles/tiles-view.js';
import TopicTileView from '../../../../../../views/apps/topic-browser/mainbar/topics/tiles/topic-tile-view.js';

export default TilesView.extend({

	//
	// attributes
	//

	childView: TopicTileView,
	editable: false
});