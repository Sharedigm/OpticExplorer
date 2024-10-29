/******************************************************************************\
|                                                                              |
|                         post-attachment-tile-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a tile item view of a post attachment.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TileView from '../../../../../../views/items/tiles/tile-view.js';

export default TileView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="tile">
			<div class="icon">
				<% if (url) { %>
				<div class="thumbnail" style="background-image:url(<%= url %>)" >
					<img style="display:none" src="<%= url %>" onerror="this.classList.add('lost')" />
					<i class="placeholder far fa-image"></i>
				</div>
				<% } else { %>
				<i class="fa fa-image"></i>
				<% } %>
			</div>
		
			<div class="name" spellcheck="false"><%= name %></div>
			<div class="badges">
				<div class="likes success badge" data-toggle="tooltip" title="Liked by <%= num_likes %>" data-placement="top"<% if (num_likes == 0) { %> style="display:none"<% } %>>
					<i class="fa fa-thumbs-up"></i>
					<span class="count"><%= num_likes %></span>
				</div>

				<div class="num-comments caution badge" data-toggle="tooltip" title="<%= num_comments + ' ' + (num_comments == 1? 'comment' : 'comments') %>" data-placement="top"<% if (num_comments == 0) { %> style="display:none"<% } %>>
					<i class="fa fa-comment"></i>
					<span class="count"><%= num_comments %></span>
				</div>
			</div>
		</div>
		
		<div class="specifics">
			<span class="details"><%= details %></span>
		</div>
	`),

	regions: {
		badges: {
			el: '.badges',
			replaceElement: true
		}
	},

	size: 256,

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			url: this.model.getThumbnailUrl({
				max_size: this.size * (window.devicePixelRatio || 1)
			}),
			name: undefined,
			num_likes: this.model.get('post').get('num_likes'),
			num_comments: this.model.get('post').get('num_comments'),
			details: undefined
		};
	}
});