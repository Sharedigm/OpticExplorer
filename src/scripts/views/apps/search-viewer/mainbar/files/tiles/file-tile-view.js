/******************************************************************************\
|                                                                              |
|                               file-tile-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a file tile and name.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FileTileView from '../../../../../../views/apps/file-browser/mainbar/files/tiles/file-tile-view.js';

export default FileTileView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="tile">

			<div class="icon">
				<%= icon %>
				<% if (geo_orientation != undefined) { %>
				<div class="geoorientation marker" style="transform:rotate(<%= Math.round(geo_orientation.heading) %>deg)">
					<i class="fa fa-location-arrow"></i>
				</div>
				<% } %>
			</div>

			<div class="name" spellcheck="false"><%= name %></div>

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

			<div class="badges"></div>
			<div class="spinner"></div>
		</div>

		<div class="specifics">
			<span class="details"><%= details %></span>
			<div class="score details" data-toggle="tooltip" title="score: <%= score %>">
				<div class="rating">
					<% for (i = 0; i < levels; i++) { %>
					<i class="fa fa-star bar<% if (i < num_stars) { %> active<% } %>"></i>
					<% } %>
				</div>
			</div>
		</div>
	`),

	//
	// getting methods
	//

	getDetailLevel: function() {
		return 3;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let levels = 5;
		let score = this.model.get('score');

		return _.extend(FileTileView.prototype.templateContext.call(this), {
			levels: levels,
			score: score,
			max_score: this.options.max_score,
			num_stars: Math.ceil(score / (this.options.max_score + 1) * levels * 1.5)
		});
	}
});