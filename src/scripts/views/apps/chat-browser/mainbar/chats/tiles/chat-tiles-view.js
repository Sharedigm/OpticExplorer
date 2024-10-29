/******************************************************************************\
|                                                                              |
|                              chat-tiles-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of chat tiles.                          |
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
import ChatTileView from '../../../../../../views/apps/chat-browser/mainbar/chats/tiles/chat-tile-view.js';

export default TilesView.extend({

	//
	// attributes
	//

	editable: false,

	//
	// views
	//

	childView: ChatTileView
});