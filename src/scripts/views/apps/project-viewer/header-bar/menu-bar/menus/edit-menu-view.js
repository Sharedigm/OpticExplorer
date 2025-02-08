/******************************************************************************\
|                                                                              |
|                               edit-menu-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying edit dropdown menus.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Project from '../../../../../../models/projects/project.js';
import Task from '../../../../../../models/projects/task.js';
import Comment from '../../../../../../models/comments/comment.js';
import Reply from '../../../../../../models/comments/reply.js';
import EditMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/edit-menu-view.js';

export default EditMenuView.extend({

	//
	// attributes
	//

	events: {

		// project options
		//
		'click .edit-project': 'onClickEdit',
		'click .delete-projects': 'onClickDelete',

		'click .edit-task': 'onClickEdit',
		'click .delete-tasks': 'onClickDelete',

		'click .edit-comment': 'onClickEdit',
		'click .delete-comment': 'onClickDelete',

		'click .edit-reply': 'onClickEdit',
		'click .delete-reply': 'onClickDelete'
	},

	//
	// querying methods
	//

	isOwned: function() {
		let hasSelected = this.parent.app.hasSelected();
		let selected = hasSelected? this.parent.app.getSelectedModels() : undefined;
		let isProject = hasSelected && selected[0] instanceof Project;
		let project = isProject? selected[0] : undefined;
		return project && project.isOwnedBy(application.session.user);
	},

	enabled: function() {
		let hasSelectedProject = this.parent.app.hasSelectedProject();
		let numSelectedProjects = this.parent.app.numSelectedProjects();
		let oneSelectedProject = numSelectedProjects == 1;
		let hasSelectedTask = this.parent.app.hasSelectedTask();
		let numSelectedTasks = this.parent.app.numSelectedTasks();
		let oneSelectedTask = numSelectedTasks == 1;
		let isOwned = this.isOwned();

		return {
			'edit-project': oneSelectedProject && isOwned,
			'delete-projects': hasSelectedProject,
			'edit-task': oneSelectedTask && isOwned,
			'delete-tasks': hasSelectedTask
		};
	},

	//
	// setting methods
	//

	setMenuMode: function(mode) {
		this.setElementVisible('.project-option', mode == 'project');
		this.setElementVisible('.task-option', mode == 'task');
		this.setElementVisible('.comment-option', mode == 'comment');
		this.setElementVisible('.reply-option', mode == 'reply');
	},

	//
	// rendering methods
	//

	onRender: function() {

		// set initial mode
		//
		this.setMenuMode('project');
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// call superclass method
		//
		EditMenuView.prototype.onLoad.call(this);

		// set initial menu mode
		//
		this.setMenuMode('project');
	},

	//
	// mouse event handling methods
	//

	onClickEdit: function() {
		this.parent.app.editSelected();
	},

	onClickDelete: function() {
		this.parent.app.deleteSelected();
	},

	//
	// selection event handling methods
	//

	onSelect: function(view) {
		if (view.length > 0) {
			view = view[0];
		}

		// show / hide applicable menu options
		//
		let model = view.model;
		if (model instanceof Project) {
			this.setMenuMode('project');
		} else if (model instanceof Task) {
			this.setMenuMode('task');
		} else if (model instanceof Comment) {
			this.setMenuMode('comment');
		} else if (model instanceof Reply) {
			this.setMenuMode('reply');
		} else {
			this.setMenuMode();
		}

		// set enabled / disabled state
		//
		this.onChange();
	},

	onDeselect: function() {
		this.setElementVisible('.project-option', true);
		this.setElementVisible('.task-option', false);
		this.setElementVisible('.comment-option', false);
		this.setElementVisible('.reply-option', false);

		this.setItemDisabled('edit-project', true);
		this.setItemDisabled('delete-project', true);
	}
});