/******************************************************************************\
|                                                                              |
|                           groups-list-item-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a single group of users.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ListItemView from '../../../../views/items/lists/list-item-view.js';
import Droppable from '../../../../views/behaviors/drag-and-drop/droppable.js';

export default ListItemView.extend(_.extend({}, Droppable, {

	//
	// attributes
	//

	className: 'directory item',

	events: _.extend({}, ListItemView.prototype.events, Droppable.events),

	//
	// getting methods
	//

	getIcon: function() {
		return '<i class="fa fa-folder"></i>';
	},

	getName: function() {
		return this.model.get('name');
	},

	//
	// drag and drop event handling methods
	//

	onDropOn: function(items) {

		// perform callback
		//
		if (this.options.ondropon) {
			this.options.ondropon(items, this);
		}
	}
}));
