/******************************************************************************\
|                                                                              |
|                                 file-item-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a file within a directory list.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FileItemView from '../../../../../../views/apps/file-browser/mainbar/files/lists/file-item-view.js';

export default FileItemView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="info">
		
			<div class="icon">
				<%= icon %>
			</div>
			
			<div class="name" spellcheck="false"><%= name %></div>
			
			<div class="specifics">
				<div class="badges"></div>
				<div class="details"><%= details %></div>
				<div class="score details" data-toggle="tooltip" title="score: <%= score %>">
					<div class="rating">
						<% for (i = 0; i < levels; i++) { %>
						<i class="fa fa-star bar<% if (i < num_stars) { %> active<% } %>"></i>
						<% } %>
					</div>
				</div>

				<% if (owner) { %>
				<div class="owner small tile" data-toggle="tooltip" data-html="true" title="shared by <%= owner.getName() %>">
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
		</div>
	`),

	//
	// rendering methods
	//

	templateContext: function() {
		let levels = 5;
		let score = this.model.get('score');

		return _.extend(FileItemView.prototype.templateContext.call(this), {
			levels: levels,
			score: score,
			max_score: this.options.max_score,
			num_stars: Math.ceil(score / (this.options.max_score + 1) * levels * 1.5)
		});
	}
});