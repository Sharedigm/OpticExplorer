/******************************************************************************\
|                                                                              |
|                             account-icons-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of user account icons.                  |
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
import ContainableMappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/containable-mappable.js';
import AccountIconView from '../../../../../../views/apps/account-manager/mainbar/accounts/icons/account-icon-view.js';

export default IconsView.extend(_.extend({}, ContainableMappable, {

	//
	// attributes
	//

	childView: AccountIconView,
	editable: false
}));