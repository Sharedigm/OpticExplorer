/******************************************************************************\
|                                                                              |
|                            account-cards-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of user account cards.                  |
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
import AccountCardView from '../../../../../../views/apps/account-manager/mainbar/accounts/cards/account-card-view.js';

export default CardsView.extend(_.extend({}, ContainableMappable, {

	//
	// attributes
	//

	childView: AccountCardView,
	editable: false
}));