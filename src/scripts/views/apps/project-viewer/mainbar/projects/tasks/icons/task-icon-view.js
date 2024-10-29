/******************************************************************************\
|                                                                              |
|                               task-icon-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an icon view of a project task.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import IconView from '../../../../../../../views/items/icons/icon-view.js';
import Droppable from '../../../../../../../views/behaviors/drag-and-drop/droppable.js';

export default IconView.extend(_.extend({}, Droppable, {
	
	//
	// attributes
	//

	template: template(`
		<div class="row">
			<div class="icon">
				<image class="non-binary-only" src="<%= image %>" />
				<i class="binary-only <%= icon %>"></i>
			</div>
		
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
		
		<div class="info row">
			<div class="name" spellcheck="false"><%= name %></div>
		</div>
		
		<div class="specifics row">
			<span class="details"><%= details %></span>
		</div>
	`),

	events: _.extend({}, IconView.prototype.events, Droppable.events, {
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

	getDetailLevel: function() {
		let detailKind = this.options.preferences? this.options.preferences.get('detail_kind') : undefined;
		if (detailKind) {
			switch (detailKind) {
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
		IconView.prototype.onRender.call(this);

		// set attributes
		//
		this.app = this.getParentView('app');

		// allow extra space for details
		//
		this.setDetailLevel(this.getDetailLevel());
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