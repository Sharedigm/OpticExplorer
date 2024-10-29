/******************************************************************************\
|                                                                              |
|                            url-list-item-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a single url list item.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ListItemView from '../../../../../views/items/lists/list-item-view.js';
import Url from '../../../../../utilities/web/url.js';

export default ListItemView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="info">
		
			<div class="icon">
				<img class="favicon" src="<%= favicon %>" onerror="this.classList.add('lost')" />
				<i class="placeholder fa fa-cloud"></i>
			</div>
		
			<div class="name" spellcheck="false"><%= name %></div>
		
			<div class="specifics">
				<span class="details"><%= details %></span>
			</div>
		</div>
	`),

	//
	// getting methods
	//

	getFaviconUrl: function() {
		return Url.getHostUrl(this.model.get('url')) + '/favicon.ico';
	},

	getName: function() {
		return this.model.get('name');
	},
	
	//
	// rendering methods
	//

	templateContext: function() {
		return {
			favicon: this.getFaviconUrl(),
			name: this.getName(),
			details: null
		};
	}
});