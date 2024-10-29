/******************************************************************************\
|                                                                              |
|                              group-icons-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a grid view of a collection of connection groups.        |
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
import GroupIconView from '../../../../../../views/apps/connection-manager/sidebar/groups/icons/group-icon-view.js';

export default IconsView.extend({

	//
	// attributes
	//

	childView: GroupIconView,
	editable: false
});