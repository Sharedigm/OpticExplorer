/******************************************************************************\
|                                                                              |
|                             account-card-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a user account's icon and name.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CardView from '../../../../../../views/items/cards/card-view.js';
import FileDroppable from '../../../../../../views/apps/file-browser/mainbar/behaviors/file-droppable.js';
import Mappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/mappable.js';
import AccountBadgesView from '../../../../../../views/apps/account-manager/mainbar/accounts/badges/account-badges-view.js';

export default CardView.extend(_.extend({}, FileDroppable, Mappable, {

	//
	// attributes
	//

	template: template(`
		<div class="card">
			<div class="icon">
				<% if (url) { %>
				<div class="thumbnail" style="background-image:url(<%= url %>)" >
					<img style="display:none" src="<%= url %>" onerror="this.classList.add('lost')" />
					<i class="placeholder far fa-user"></i>
				</div>
				<% } else { %>
				<i class="fa fa-user"></i>
				<% } %>
			</div>
		
			<div class="info">
				<div class="row">
					<div class="name"><%= name %></div>
					<div class="badges"></div>
				</div>
		
				<div class="specifics row">
					<span class="details"><%= details %></span>
				</div>
			</div>
		</div>
	`),

	regions: {
		badges: {
			el: '.badges',
			replaceElement: true
		}
	},

	events: _.extend({}, CardView.prototype.events, FileDroppable.events),
	
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
		this.showChildView('badges', new AccountBadgesView({
			model: this.model
		}));	
	}
}));