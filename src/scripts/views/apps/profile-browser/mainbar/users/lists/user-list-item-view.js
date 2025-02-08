/******************************************************************************\
|                                                                              |
|                            user-list-item-view.js                            |
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
import FileDroppable from '../../../../../../views/apps/file-browser/mainbar/behaviors/file-droppable.js';
import Mappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/mappable.js';
import UserBadgesView from '../../../../../../views/apps/profile-browser/mainbar/users/badges/user-badges-view.js';

export default ListItemView.extend(_.extend({}, FileDroppable, Mappable, {

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

	regions: {
		badges: {
			el: '.badges',
			replaceElement: true
		}
	},

	events: _.extend({}, ListItemView.prototype.events, FileDroppable.events),

	//
	// getting methods
	//

	getName: function(kind) {
		return this.model.getName(kind);
	},

	getThumbnailUrl: function() {
		return this.model.getProfilePhotoUrl({
			min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
	},

	getIcon: function() {
		if (this.model.hasProfilePhoto()) {
			return '<div class="thumbnail" style="background-image:url(' + this.getThumbnailUrl() + ')"></div>';
		} else {
			return '<i class="fa fa-user"></i>';
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			url: this.getThumbnailUrl(),
			name: this.getName(),
			details: this.getDetails()
		};
	},

	showBadges: function() {
		this.showChildView('badges', new UserBadgesView({
			model: this.model
		}));	
	}
}));