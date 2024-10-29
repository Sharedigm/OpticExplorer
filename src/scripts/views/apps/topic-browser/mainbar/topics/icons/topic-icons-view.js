/******************************************************************************\
|                                                                              |
|                             topic-icons-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of news topic icons.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import IconsView from '../../../../../../views/items/icons/icons-view.js';
import TopicIconView from '../../../../../../views/apps/topic-browser/mainbar/topics/icons/topic-icon-view.js';

export default IconsView.extend({

	//
	// attributes
	//

	childView: TopicIconView,
	editable: false
});