/******************************************************************************\
|                                                                              |
|                             task-list-item-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a single project task list item.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ListItemView from '../../../../../../../views/items/lists/list-item-view.js';
import Droppable from '../../../../../../../views/behaviors/drag-and-drop/droppable.js';

export default ListItemView.extend(_.extend({}, Droppable, {
	
	//
	// attributes
	//

	template: template(`
		<div class="info">
		
			<div class="icon">
				<image class="non-binary-only" src="<%= image %>" />
				<i class="binary-only <%= icon %>"></i>
			</div>
			
			<div class="name" spellcheck="false"><%= name %></div>
			
			<div class="specifics">
		
				<% if (details) { %>
				<span class="details">
					<%= details %>
				</span>
				<% } %>
		
				<div class="clickable badges">
		
					<% if (num_comments > 0) { %>
					<div class="num-comments caution badge" data-toggle="tooltip" title="<%= num_comments + ' ' + (num_comments == 1? 'comment' : 'comments') %>" data-placement="top"<% if (num_comments == 0) { %> style="display:none"<% } %>>
						<i class="fa fa-comment"></i>
						<span class="count"><%= num_comments %></span>
					</div>
					<% } %>
		
					<% if (status && status != '' && status != 'open') { %>
					<span class="status badge<% if (badge_type) { %> <%= badge_type %><% } %>">
						<%= status.replace('_', ' ') %>
					</span>
					<% } %>
		
					<% if (typeof check_in != 'undefined' && check_in) { %>
					<span class="location badge">
						<i class="fa fa-globe"></i>
					</span>
					<% } %>
				</div>
			</div>
		</div>
	`),
	events: _.extend({}, ListItemView.prototype.events, Droppable.events, {
		'click .status': 'onClickStatus'
	}),

	//
	// getting methods
	//

	getName: function() {
		return this.model.get('title');
	},

	getImage: function() {
		return this.model.getImage({
			max_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
	},

	getIcon: function() {
		return this.model.getIcon();
	},

	getDetails: function() {
		let kind = this.options.preferences? this.options.preferences.get('detail_kind') : undefined;
		if (kind) {
			return this.model.getAttribute(kind, this.options.preferences);
		}
	},

	getBadgeType: function() {
		switch (this.get('status')) {
			case 'complete':
				return 'success';
			case 'in_review':
				return 'caution';
			case 'closed':
				return 'warning';
		}
	},

	//
	// setting methods
	//

	setName: function(name) {

		// check if name has changed
		//
		if (name != this.get('title')) {

			// change task title
			//
			this.model.save({
				title: name
			});
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			image: this.getImage(),
			icon: this.getIcon(),
			name: this.getName(),
			details: this.getDetails(),

			// details
			//
			badge_type: this.getBadgeType(),
			num_comments: 0
		};
	},

	onRender: function() {

		// call superclass method
		//
		ListItemView.prototype.onRender.call(this);

		// set attributes
		//
		this.app = this.getParentView('app');
	},

	update: function() {

		// update item details
		//
		this.$el.find('.name').html(this.getName());
		this.$el.find('.details').html(this.getDetails() || '');
	},

	//
	// mouse event handling methods
	//

	onClickStatus: function() {
		this.app.showEditTaskDialog(this.model);
	}
}));