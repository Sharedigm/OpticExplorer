/******************************************************************************\
|                                                                              |
|                              dock-icons-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a row of app launcher dock icons.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import IconsView from '../../../../views/items/icons/icons-view.js';
import DockIconView from '../../../../views/apps/desktop/dock/dock-icon-view.js';
import AppLaunchable from '../../../../views/apps/common/behaviors/opening/app-launchable.js';

export default IconsView.extend(_.extend({}, AppLaunchable, {

	//
	// attributes
	//

	className: 'icons',
	childView: DockIconView,

	//
	// rendering methods
	//

	childViewOptions: function(model) {
		return {
			model: model,

			// options
			//
			preferences: this.options.preferences,

			// state
			//
			selected: this.options.selected && this.options.selected.contains(model),

			// capabilities
			//
			selectable: this.options.selectable,
			editable: this.options.editable,

			// callbacks
			//
			onopen: (item) => {
				this.onOpen(item);
			}
		};
	}
}));