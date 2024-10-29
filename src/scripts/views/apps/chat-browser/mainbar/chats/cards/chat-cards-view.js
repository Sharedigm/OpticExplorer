/******************************************************************************\
|                                                                              |
|                              chat-cards-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of chat cards.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CardsView from '../../../../../../views/items/cards/cards-view.js';
import ChatCardView from '../../../../../../views/apps/chat-browser/mainbar/chats/cards/chat-card-view.js';

export default CardsView.extend({

	//
	// attributes
	//

	editable: false,

	//
	// views
	//

	childView: ChatCardView
});