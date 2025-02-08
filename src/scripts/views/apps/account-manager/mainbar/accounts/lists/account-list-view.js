/******************************************************************************\
|                                                                              |
|                              account-list-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a list of user account items.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ListView from '../../../../../../views/items/lists/list-view.js';
import ContainableMappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/containable-mappable.js';
import AccountListItemView from '../../../../../../views/apps/account-manager/mainbar/accounts/lists/account-list-item-view.js';

export default ListView.extend(_.extend({}, ContainableMappable, {

	//
	// attributes
	//

	editable: false,

	// views
	//
	childView: AccountListItemView
}));