/******************************************************************************\
|                                                                              |
|                         mappable-user-cards-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of mappable user cards.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserCardsView from '../../../../../../views/apps/profile-browser/mainbar/users/cards/user-cards-view.js';
import ContainableMappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/containable-mappable.js';
import MappableUserCardView from '../../../../../../views/apps/map-viewer/mainbar/users/cards/mappable-user-card-view.js';

export default UserCardsView.extend(_.extend({}, ContainableMappable, {

	//
	// attributes
	//

	childView: MappableUserCardView
}));