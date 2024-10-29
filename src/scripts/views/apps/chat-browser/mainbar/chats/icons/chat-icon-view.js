/******************************************************************************\
|                                                                              |
|                               chat-icon-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a chat icon and name.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import IconView from '../../../../../../views/items/icons/icon-view.js';

export default IconView.extend({


	//
	// attributes
	//

	template: template(`
		<div class="row one">
			<div class="icon">
				<% if (url) { %>
				<div class="thumbnail" style="background-image:url(<%= url %>)" >
					<img style="display:none" src="<%= url %>" onerror="this.classList.add('lost')" />
					<i class="placeholder far fa-user"></i>
				</div>
				<% } else { %>
				<div class="thumbnail">
					<i class="fa fa-user"></i>
				</div>
				<% } %>
			</div>
		
			<div class="badges"></div>
		</div>
		
		<div class="row two">
			<div class="name" spellcheck="false"><%= name %></div>
		</div>
		
		<div class="specifics row">
			<span class="details"><%= details %></span>
		</div>
	`),

	//
	// getting methods
	//

	getThumbnailUrl: function() {
		let member = this.model.getUser();
		if (member) {
			return member.getProfilePhotoUrl({
				min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
			});		
		}
	},

	getIcon: function() {
		let member = this.model.getUser();
		if (member && member.hasProfilePhoto()) {
			return '<div class="thumbnail" style="background-image:url(' + this.getThumbnailUrl(member) + ')"></div>';
		} else {
			return '<i class="fa fa-user"></i>';
		}
	},

	getDetailLevel: function() {
		let detailKind = this.options.preferences? this.options.preferences.get('detail_kind') : undefined;
		if (detailKind) {
			switch (detailKind) {
				case 'members':
					return 1;

				case 'create_date':
				case 'modify_date': {
					let dateFormat = this.options.preferences? this.options.preferences.get('date_format') : undefined;
					switch (dateFormat) {
						case 'day_date':
						case 'date_time':
						case 'day_date_time':
							return 2;
					}
				}
			}
			
			return 2;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let member = this.model.getUser();
		return {
			url: this.getThumbnailUrl(),
			name: this.getName(member),
			is_online: member && member.isOnline(),
			is_active: member && member.isActive(),
			details: this.getDetails()
		};
	}
});