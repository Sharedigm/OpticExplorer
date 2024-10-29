/******************************************************************************\
|                                                                              |
|                            project-cards-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of task project cards.                  |
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
import ProjectCardView from '../../../../../../views/apps/project-browser/mainbar/projects/cards/project-card-view.js';

export default CardsView.extend({

	//
	// attributes
	//

	childView: ProjectCardView,
	editable: false
});