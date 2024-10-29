/******************************************************************************\
|                                                                              |
|                             task-form-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a editable form view of a task.                               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../views/forms/form-view.js';
import TimeUtils from '../../../../../utilities/time/time-utils.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="items">
			<div class="icon-grid">
				<div class="item" style="height:75px">
					<div class="row">
						<div class="icon">
							<image class="non-binary-only" src="<%= image %>" />
							<i class="binary-only <%= icon %>"></i>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="task-kind form-group">
			<label class="control-label"><i class="fa fa-check"></i>Kind</label>
			<div class="controls">
				<select>
					<option value="task"<% if (kind == 'task') { %> selected<% } %>>Task</option>
					<option value="bug"<% if (kind == 'bug') { %> selected<% } %>>Bug</option>
					<option value="feature"<% if (kind == 'feature') { %> selected<% } %>>Feature</option>
				</select>
				<i class="active fa fa-question-circle" data-toggle="popover" title="Kind" data-content="This is the kind of the task."></i>
			</div>
		</div>
		
		<div class="task-title form-group">
			<label class="required control-label"><i class="fa fa-quote-left"></i>Title</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="required form-control" rows="2" maxlength="1000"><%= title %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Title" data-content="This is the title of the task."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="description form-group" style="margin:10px 0">
			<label class="control-label"><i class="fa fa-quote-left"></i>Description</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="4" maxlength="1000"><%= description %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Description" data-content="This is a description of the task."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="keywords form-group" style="display:none">
			<label class="control-label"><i class="fa fa-key"></i>Keywords</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= keywords %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Keywords" data-content="This is a set of keywords to make the task easier to find."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="priority form-group">
			<label class="control-label"><i class="fa fa-star"></i>Priority</label>
			<div class="controls">
				<select>
					<option value="5"<% if (priority == 5) { %> selected<% } %>>Highest</option>
					<option value="4"<% if (priority == 4) { %> selected<% } %>>High</option>
					<option value="3"<% if (priority == 3 || !priority) { %> selected<% } %>>Medium</option>
					<option value="2"<% if (priority == 2) { %> selected<% } %>>Low</option>
					<option value="1"<% if (priority == 1) { %> selected<% } %>>Lowest</option>
				</select>
				<i class="active fa fa-question-circle" data-toggle="popover" title="Priority" data-content="This is the priority of the task."></i>
			</div>
		</div>
		
		<div class="status form-group">
			<label class="control-label"><i class="fa fa-question-circle"></i>Status</label>
			<div class="controls">
				<select>
					<option value="open"<% if (status == 'open') { %> selected<% } %>>Open</option>
					<option value="in_progress"<% if (status == 'in_progress') { %> selected<% } %>>In Progress</option>
					<option value="complete"<% if (status == 'complete') { %> selected<% } %>>Complete</option>
					<option value="in_review"<% if (status == 'in_review') { %> selected<% } %>>In Review</option>
					<option value="closed"<% if (status == 'closed') { %> selected<% } %>>Closed</option>
				</select>
				<i class="active fa fa-question-circle" data-toggle="popover" title="Priority" data-content="This is the current status of the task."></i>
			</div>
		</div>
		
		<div class="due-date form-group">
			<label class="required control-label"><i class="fa fa-calendar-alt"></i>Due Date</label>
			<div class="controls">
				<div class="input-group">
					<input type="date" class="required form-control" value="<%= due_date? due_date.format('UTC:yyyy-mm-dd') : '' %>">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Due Date" data-content="This is the due date of this task."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	events: _.extend({}, FormView.prototype.events, {
		'change .task-kind select': 'onChangeKind'
	}),

	//
	// getting methods
	//

	getWords: function(string) {
		if (string) {
			return string.replace(',', '').split(' ');
		} else {
			return [];
		}
	},

	getValue: function(key) {
		switch (key) {
			case 'kind':
				return this.$el.find('.task-kind select').val();
			case 'title':
				return this.$el.find('.task-title textarea').val();
			case 'description':
				return this.$el.find('.description textarea').val();
			case 'keywords':
				return this.getWords(this.$el.find('.keywords input').val());
			case 'priority':
				return this.$el.find('.priority select').val();
			case 'status':
				return this.$el.find('.status select').val();
			case 'due_date':
				return this.$el.find('.due-date input').val();
		}
	},

	getValues: function() {
		return {
			kind: this.getValue('kind'),
			title: this.getValue('title'),
			description: this.getValue('description'),
			keywords: this.getValue('keywords'),
			priority: this.getValue('priority'),
			status: this.getValue('status'),
			due_date: this.getValue('due_date')
		};
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
	// setting methods
	//

	setIcon: function(icon) {
		this.$el.find('.item .icon').html(icon);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let dueDate = this.model.has('due_date')? this.model.get('due_date') : undefined;
		if (typeof dueDate == 'string') {
			dueDate = new Date(dueDate);
		}
		return {
			image: this.getImage(),
			icon: this.getIcon(),
			due_date: dueDate? TimeUtils.LocalDateToUTCDate(dueDate) : undefined
		};
	},

	updateIcon: function() {
		this.$el.find('.icon-grid img').attr('src', this.getImage());
		this.$el.find('.icon-grid i').attr('class', 'binary-only' + this.getIcon());
	},

	//
	// mouse event handling methods
	//

	onChangeKind: function() {
		this.model.set({
			kind: this.getValue('kind')
		});
		this.updateIcon();
	}
});