/******************************************************************************\
|                                                                              |
|                              volume-icon-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a volume icon and name.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import VolumeIconView from '../../../../../../views/apps/file-browser/mainbar/files/icons/file-icon-view.js';
import Mappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/mappable.js';

export default VolumeIconView.extend(_.extend({}, Mappable, {

	//
	// attributes
	//

	template: template(`
		<div class="row">

			<div class="icon">
				<%= icon %>

				<% if (geo_orientation != undefined) { %>
				<div class="geoorientation marker" style="transform:rotate(<%= Math.round(geo_orientation.heading) %>deg)" data-toggle="tooltip" title="orientation: <%= Math.round(geo_orientation.heading) %> &deg; N">
					<i class="fa fa-location-arrow"></i>
				</div>
				<% } %>

				<% if (owner) { %>
				<div class="owner small tile" data-toggle="tooltip" data-html="true" title="shared by<br /><%= owner.getName() %>" data-placement="right">
					<% if (owner.hasProfilePhoto()) { %>
					<div class="thumbnail" style="background-image:url(<%= owner_thumbnail_url %>)">
						<img style="display:none" src="<%= owner_thumbnail_url %>" onerror="this.classList.add('lost')" />
						<i class="placeholder far fa-user"></i>
					</div>
					<% } else { %>
					<div class="thumbnail">
						<i class="fa fa-user"></i>
					</div>
					<% } %>
				</div>
				<% } %>
			</div>

			<div class="badges"></div>
			<div class="spinner"></div>
		</div>

		<div class="info row">
			<div class="name" spellcheck="false"><%= name %></div>
		</div>

		<div class="specifics row">
			<span class="details"><%= details %></span>
		</div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.getIcon(),
			name: this.getName(),
			owner: this.getOwner(),
			owner_thumbnail_url: this.getOwnerThumbnailUrl(),
			details: this.getDetails(),
			geo_orientation: this.getGeoOrientation()
		};
	}
}));