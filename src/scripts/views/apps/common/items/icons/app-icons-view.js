/******************************************************************************\
|                                                                              |
|                               app-icons-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a grid of application icons.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import IconsView from '../../../../../views/items/icons/icons-view.js';
import AppIconView from '../../../../../views/apps/common/items/icons/app-icon-view.js';

export default IconsView.extend({

	//
	// attributes
	//

	className: 'app-icons icon-grid',
	childView: AppIconView,

	//
	// rendering methods
	//

	childViewOptions: function(model) {
		return _.extend({}, this.options, {
			model: model,

			// state
			//
			selected: this.options.selected && this.options.selected.contains(model)
		});
	}
});