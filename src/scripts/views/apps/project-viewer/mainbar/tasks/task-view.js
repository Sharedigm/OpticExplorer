/******************************************************************************\
|                                                                              |
|                                 task-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for viewing project tasks.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import ContainableSelectable from '../../../../../views/behaviors/containers/containable-selectable.js';
import TimeUtils from '../../../../../utilities/time/time-utils.js';

export default BaseView.extend(_.extend({}, ContainableSelectable, {

	//
	// attributes
	//

	className: 'task',

	template: template(`
		<div class="panel">
			<form class="task-info form-horizontal">
		
				<div class="buttons">
					<% if (editable) { %>
					<button type="button" class="edit success btn btn-sm" data-toggle="tooltip" title="Edit">
						<i class="fa fa-pencil-alt"></i>	
					</button>
					<% } %>
		
					<% if (commentable) { %>
					<button type="button" class="comment caution btn btn-sm" data-toggle="tooltip" title="Comment"<% if (comments.length > 0) { %> style="display:none"<% } %>>
						<i class="fa fa-comment"></i>	
					</button>
					<% } %>
		
					<% if (editable) { %>
					<button type="button" class="delete warning btn btn-sm" data-toggle="tooltip" title="Delete">
						<i class="fa fa-xmark"></i>	
					</button>
					<% } %>
				</div>
		
				<div class="task-title form-group">
					<label class="control-label">
						<div class="icon">
							<image class="non-binary-only" src="<%= image %>" />
							<i class="binary-only <%= icon %>"></i>
						</div>
					</label>
					<div class="controls">
						<h2 class="form-control-static">
							<%= title %>
						</h2>
					</div>
				</div>
		
				<br />
		
				<% if (description) { %>
				<div class="panel">
					<div class="description form-group">
						<label class="control-label"><i class="fa fa-quote-left"></i>Description</label>
						<div class="controls">
							<p class="form-control-static">
								<%= description %>
							</p>
						</div>
					</div>
				</div>
				<% } %>
		
				<div class="panel">
					<div class="heading">
						<label><i class="fa fa-info-circle"></i>Details</label>
					</div>
		
					<div class="task-project form-group">
						<label class="control-label"><i class="fa fa-clipboard"></i>Project</label>
						<div class="controls">
							<p class="form-control-static">
								<%= project.getName() %>
							</p>
						</div>
					</div>
		
					<div class="keywords form-group" style="display:none">
						<label class="control-label"><i class="fa fa-key"></i>Keywords</label>
						<div class="controls">
							<p class="form-control-static">
								<%= keywords && keywords != ''? keywords : 'none' %>
							</p>
						</div>
					</div>
		
					<div class="priority form-group">
						<label class="control-label"><i class="fa fa-star-half-alt"></i>Priority</label>
						<div class="controls">
							<p class="form-control-static">
								<%= priority_description %>
								<span class="fineprint" style="margin-left:5px">
									<% for (let i = 0; i < priority; i++) { %>
									<i class="fa fa-star"></i>
									<% } %>
								</span>
							</p>
						</div>
					</div>
		
					<% if (status && status != '' && status != 'open') { %>
					<div class="status form-group">
						<label class="control-label"><i class="fa fa-question-circle"></i>Status</label>
						<div class="controls">
							<p class="form-control-static">
								<div class="clickable badges">
									<% if (status && status != '' && status != 'open') { %>
									<span class="status badge<% if (badge_type) { %> <%= badge_type %><% } %>">
										<%= status.replace('_', ' ') %>
									</span>
									<% } %>
								</div>
							</p>
						</div>
					</div>
					<% } %>
				</div>
		
				<div class="panel">
					<div class="heading">
						<label><i class="fa fa-calendar"></i>Dates</label>
					</div>
		
					<div class="create-date form-group">
						<label class="control-label"><i class="fa fa-magic"></i>Created</label>
						<div class="controls">
							<p class="form-control-static">
								<%= created_at && created_at.format? created_at.format() : created_at %>
							</p>
						</div>
					</div>
		
					<% if (updated_at) { %>
					<div class="modify-date form-group">
						<label class="control-label"><i class="fa fa-pencil-alt"></i>Modified</label>
						<div class="controls">
							<p class="form-control-static">
								<%= updated_at && updated_at.format? updated_at.format() : updated_at %>
							</p>
						</div>
					</div>
					<% } %>
		
					<% if (due_date) { %>
					<div class="due-date form-group">
						<label class="control-label"><i class="fa fa-calendar"></i>Due</label>
						<div class="controls">
							<p class="form-control-static control-inline">
								<%= due_date && due_date.format? due_date.format('UTC:ddd mmm dd yyyy') : due_date %>
							</p>
							<div class="buttons-inline" style="display:none">
								<button type="button" class="edit-date btn btn-sm" data-toggle="tooltip" title="Edit">
									<i class="fa fa-calendar"></i>	
								</button>
							</div>
						</div>
					</div>
					<% } %>
				</div>
			</form>
		</div>
	`),

	events: {
		'click .buttons .edit': 'onClickEdit',
		'click .buttons .delete': 'onClickDelete',
	},

	//
	// getting methods
	//

	getBadgeType: function() {
		switch (this.model.get('status')) {
			case 'complete':
				return 'success';
			case 'in_review':
				return 'caution';
			case 'closed':
				return 'warning';
		}
	},

	getImage: function() {
		return this.model.getImage({
			max_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
	},

	getIcon: function() {
		return this.model.getIcon();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let dueDate = this.model.has('due_date')? TimeUtils.LocalDateToUTCDate(this.model.get('due_date')) : undefined;

		return {
			image: this.getImage(),
			icon: this.getIcon(),
			project: this.getParentView('app').getTaskProject(this.model),
			priority_description: this.model.getPriority(),
			badge_type: this.getBadgeType(),
			due_date: dueDate,
			editable: true,
			commentable: true,
			comments: []
		};
	},

	onRender: function() {

		// set attributes
		//
		this.app = this.getParentView('app');
	},

	//
	// mouse event handling methods
	//

	onClickEdit: function() {
		this.app.showEditTaskDialog(this.model, {

			// callbacks
			//
			onsubmit: () => {
				this.render();
			}
		});
	},

	onClickDelete: function() {
		this.app.deleteTask(this.model, {

			// callbacks
			//
			success: () => {
				this.app.closeTab();
			}
		});
	}
}));