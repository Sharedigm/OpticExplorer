/******************************************************************************\
|                                                                              |
|                               project-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for tracking project tasks.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Task from '../../../../../models/projects/task.js';
import Tasks from '../../../../../collections/projects/tasks.js';
import Items from '../../../../../collections/storage/items.js';
import BaseView from '../../../../../views/base-view.js';
import SelectableContainable from '../../../../../views/behaviors/containers/selectable-containable.js';
import TasksView from '../../../../../views/apps/project-viewer/mainbar/projects/tasks/tasks-view.js';
import PagerView from '../../../../../views/apps/common/mainbar/pager/pager-view.js';

export default BaseView.extend(_.extend({}, SelectableContainable, {

	//
	// attributes
	//

	className: 'project',

	template: template(`
		<div class="tasks"></div>
		<div class="pager"></div>
	`),

	regions: {
		tasks: '.tasks',
		pager: {
			el: '.pager',
			replaceElement: true
		}
	},

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.editable == undefined) {
			this.options.editable = (application.isSignedIn());
		}

		// set attributes
		//
		this.task = new Task({
			project_id: this.model? this.model.get('id') : null,
			title: this.options? this.options.title : null,
			description: this.options? this.options.description : null,
			attachments: new Items(this.options.items),
			check_in: this.options.check_in
		});
		this.collection = new Tasks();

		// set optional parameters
		//
		if (this.options.preferences) {
			if (this.options.tasksPerPage == undefined) {
				this.options.tasksPerPage = this.options.preferences.get('tasks_per_page');
			}
			if (this.options.tasksDirection == undefined) {
				this.options.tasksDirection = this.options.preferences.get('tasks_direction');
			}
		}

		// listen for changes in collection
		//
		this.listenTo(this.collection, 'add', this.onAdd);
		this.listenTo(this.collection, 'remove', this.onRemove);
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('tasks')) {
			this.getChildView('tasks').each(callback, filter, options);
		}
	},

	//
	// getting methods
	//

	getRange: function() {
		return this.getChildView('pager').getRange();
	},

	getTasksPerPage: function() {
		return this.getChildView('pager').getItemsPerPage();
	},

	//
	// setting methods
	//

	setModel: function(model) {
		this.setProject(model);
	},

	setOption: function(key, value) {
		this.getChildView('tasks').setOption(key, value);
	},

	setProject: function(project) {

		// clear previous tasks
		//
		this.reset();

		// set attributes
		//
		this.model = project;

		// show project tasks
		//
		this.fetchAndShowTasks(this.model);
	},

	setTasksPerPage: function(tasksPerPage) {
		if (tasksPerPage != this.getTasksPerPage()) {
			this.getChildView('pager').setItemsPerPage(tasksPerPage);

			// update project tasks
			//
			this.fetchAndShowTasks(this.model);
		}
	},

	setCollection: function(collection) {
		this.collection = collection;

		// update nav bar
		//
		this.getChildView('pager').setNumItems(collection.length);
	},

	setDirection: function(direction) {
		switch (direction) {
			case 'bottom_up':
				this.$el.addClass('bottom-up');
				break;
			case 'top_down':
				this.$el.removeClass('bottom-up');
				break;
		}
	},

	resetTasks: function() {

		// abort request
		//
		if (this.request && this.request.state() == 'pending') {
			this.request.abort();
		}

		// clear elapsed time interval
		//
		this.clearInterval();

		// clear update timeout
		//
		this.clearTimeout();
	},

	reset: function() {
		this.resetTasks();

		// clean up soft deleted tasks
		//
		// this.collection.updateByProject(this.model);	
	},

	//
	// ajax methods
	//

	fetchTasks: function(project, done) {
		let range = this.getRange();

		// fetch selected posts
		//
		this.request = this.collection.fetchByProject(project, {

			// parameters
			//
			data: _.extend(range, this.options.search),

			// callbacks
			//
			success: (collection) => {
				this.request = null;

				// update attributes
				//
				this.setCollection(collection);

				// perform callback
				//
				if (done) {
					done(collection);
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not find project's tasks.",
					response: response
				});
			}
		});	
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.showNavBar();
		this.fetchAndShowTasks(this.model);

		// set tasks direction
		//
		if (this.options.preferences) {
			this.setDirection(this.options.preferences.get('tasks_direction'));
		}
	},

	fetchAndShowTasks: function(project) {
		this.fetchTasks(project, (collection) => {

			// update attributes
			//
			this.setCollection(collection);

			// show list view
			//
			this.showTasks();

			// perform callback
			//
			if (this.options.onload) {
				this.options.onload();
			}
		});	
	},

	showTasks: function() {
		this.showChildView('tasks', new TasksView({
			collection: this.collection,

			// options
			//
			preferences: this.options.preferences,
			multicolumn: true,

			// capabilities
			//
			selectable: true,
			editable: true,
			draggable: true,

			// callbacks
			//
			onload: this.options.onload,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			ondelete: this.options.ondelete
		}));
	},

	showNavBar: function() {
		this.showChildView('pager', new PagerView({
			collection: this.collection,

			// options
			//
			itemType: 'tasks',
			itemsPerPage: this.options.tasksPerPage,

			// callbacks
			//
			onchange: () => {

				// clear list
				//
				this.getChildView('tasks').destroy();

				// update posts list
				//
				this.fetchAndShowTasks(this.model);
			}
		}));
	}
}));