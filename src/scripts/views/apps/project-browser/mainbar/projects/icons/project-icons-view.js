/******************************************************************************\
|                                                                              |
|                            project-icons-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of task project icons.                  |
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
import ProjectIconView from '../../../../../../views/apps/project-browser/mainbar/projects/icons/project-icon-view.js';

export default IconsView.extend({

	//
	// attributes
	//

	childView: ProjectIconView,
	editable: false
});