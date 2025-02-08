/******************************************************************************\
|                                                                              |
|                              user-cards-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of user cards.                          |
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
import ContainableMappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/containable-mappable.js';
import UserCardView from '../../../../../../views/apps/profile-browser/mainbar/users/cards/user-card-view.js';

export default CardsView.extend(_.extend({}, ContainableMappable, {

	//
	// attributes
	//

	childView: UserCardView,
	editable: false
}));