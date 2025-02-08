/******************************************************************************\
|                                                                              |
|                            place-list-item-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a single map place list item.                  |
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
import Mappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/mappable.js';

export default ListItemView.extend(_.extend({}, Mappable, {
	
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
				<% if (description) { %>
				<div class="details"<% if (description) { %> data-toggle="tooltip" title="<%= description %>"<% } %>>
					<i class="fa fa-info-circle"></i>
				</div>
				<% } %>
			</div>
		</div>
	`),

	//
	// getting methods
	//

	getIconUrl: function() {
		return config.servers.api + '/file/thumb?max-size=100&path=' + encodeURIComponent(this.get('icon_path'));
	},

	getIconImage: function() {
		return '<img class="thumbnail" src="' + this.getIconUrl() + '"/>';
	},

	getIcon: function() {
		if (this.model.has('icon_path')) {
			return this.getIconImage();
		} else if (this.model.has('id')) {
			return '<i class="fa fa-map-pin"></i>';
		} else {
			return '<i class="fa fa-map-marker-alt"></i>';
		}
	},

	//
	// rendering method
	//

	onRender: function() {
		if (this.model.has('icon_path')) {
			this.$el.find('.icon').addClass('thumbnail');
		}
	}
}));