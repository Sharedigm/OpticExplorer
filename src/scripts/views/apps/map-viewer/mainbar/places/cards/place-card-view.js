/******************************************************************************\
|                                                                              |
|                              place-card-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an card view of a map place.                             |
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
import Mappable from '../../../../../../views/apps/map-viewer/mainbar/maps/behaviors/mappable.js';

export default CardView.extend(_.extend({}, Mappable, {
	
	//
	// attributes
	//

	className: 'place item',

	template: template(`
		<div class="card">
		
			<div class="icon">
				<%= icon %>
				<% if (description && !icon_path) { %>
				<i class="fa place-info fa-info-circle"></i>
				<% } %>
			</div>
		
			<div class="info">
				<div class="row">
					<div class="name" spellcheck="false"><%= name %></div>
				</div>
				<div class="row">
					<span class="details"><%= description %></div>
				</div>
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
		} else if (this.model.has('description') && this.model.get('description') != '') {
			return '<i class="fa fa-map-marker"></i>';
		} else {
			return '<i class="fa fa-map-marker-alt"></i>';
		}
	}
}));