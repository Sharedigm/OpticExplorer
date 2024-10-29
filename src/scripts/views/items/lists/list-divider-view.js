/******************************************************************************\
|                                                                              |
|                             list-divider-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a single list divider item.                    |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ListItemView from '../../../views/collections/lists/list-item-view.js';

export default ListItemView.extend({

	//
	// attributes
	//

	tagName: 'li',
	className: 'divider',

	template: template(`
		<%= name %>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			name: this.model.get('name')
		};
	}
});