/******************************************************************************\
|                                                                              |
|                              topic-icon-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an icon view of a news topic.                            |
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
import Droppable from '../../../../../../views/behaviors/drag-and-drop/droppable.js';

export default IconView.extend(_.extend({}, Droppable, {
	
	//
	// attributes
	//

	template: template(`
		<div class="row">
		
			<div class="icon">
				<%= icon %>
			</div>
		
			<% if (public || private || subscribed) { %>
			<div class="badges">
		
				<% if (public) { %>
				<div class="protection badge" data-toggle="tooltip" title="public" data-placement="bottom">
					<i class="fa fa-globe"></i>
				</div>
				<% } else if (private) { %>
				<div class="protection badge" data-toggle="tooltip" title="private" data-placement="bottom">
					<i class="fa fa-lock"></i>
				</div>
				<% } %>
				<% if (subscribed) { %>
				<div class="subscribed success badge" data-toggle="tooltip" title="subscribed" data-placement="bottom">
					<i class="fa fa-newspaper"></i>
				</div>
				<% } %>
			</div>
			<% } %>
		</div>
		
		<div class="info row">
			<div class="name" spellcheck="false"><%= name %></div>
		</div>
		
		<div class="specifics row">
			<span class="details"><%= details %></span>
		</div>
	`),

	events: _.extend({}, IconView.prototype.events, Droppable.events),

	//
	// getting methods
	//

	getName: function() {
		return this.model.get('name');
	},

	getIcon: function() {
		return this.model.getIcon({
			max_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
	},

	getDetailLevel: function() {
		let detailKind = this.options.preferences? this.options.preferences.get('detail_kind') : undefined;
		if (detailKind) {
			switch (detailKind) {
				case 'members':
					return 2;

				case 'create_date':
				case 'modify_date': {
					let dateFormat = this.options.preferences? this.options.preferences.get('date_format') : undefined;
					switch (dateFormat) {
						case 'date_only':
						case 'day_date':
						case 'time_only':
							return 2;
						case 'date_time':
						case 'day_date_time':
							return 3;
					}
					break;
				}
			}

			return 1;
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		IconView.prototype.onRender.call(this);

		// allow extra space for details
		//
		this.setDetailLevel(this.getDetailLevel());
	}
}));