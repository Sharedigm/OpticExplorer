/******************************************************************************\
|                                                                              |
|                          contacts-list-item-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a contact list item.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ListItemView from '../../../../../../views/items/lists/list-item-view.js';
import Checkable from '../../../../../../views/forms/behaviors/checkable.js';

export default ListItemView.extend(_.extend({}, Checkable, {

	//
	// attributes
	//

	template: template(`
		<div class="info">
			<input type="checkbox"<% if (checked) { %> checked<% } %> />
		
			<div class="small icon tile">
				<div class="thumbnail">
					<i class="fa fa-user"></i>
				</div>
			</div>
			
			<span class="name" spellcheck="false"><%= name %></span>
		
			<div class="specifics">
				<span class="details"><%= details %></span>
			</div>
		</div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			checked: this.options.checked,
			name: this.model.getName(),
			details: this.model.getEmail()
		};
	}
}));
