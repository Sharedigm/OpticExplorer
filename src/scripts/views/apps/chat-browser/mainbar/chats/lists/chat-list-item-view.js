/******************************************************************************\
|                                                                              |
|                            chat-list-item-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a user icon and name.                          |
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

export default ListItemView.extend({


	//
	// attributes
	//

	template: template(`
		<div class="info">
		
			<div class="small icon tile">
				<% if (url) { %>
				<div class="thumbnail" style="background-image:url(<%= url %>)" >
					<img style="display:none" src="<%= url %>" onerror="this.classList.add('lost')" />
					<i class="placeholder far fa-user"></i>
				</div>
				<% } else { %>
				<i class="fa fa-user"></i>
				<% } %>
			</div>
			
			<span class="name" spellcheck="false"><%= name %></span>
		
			<div class="specifics">
				<div class="badges"></div>
				<div class="details"><%= details %></div>
			</div>
		</div>
	`),

	//
	// getting methods
	//
	
	getThumbnailUrl: function(member) {
		if (member) {
			return member.getProfilePhotoUrl({
				min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
			});		
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let member = this.model.getUser();
		return {
			url: this.getThumbnailUrl(member),
			name: this.getName(member),
			details: this.getDetails(),
			is_online: member && member.isOnline(),
			is_active: member && member.isActive()
		};
	}
});