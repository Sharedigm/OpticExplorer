/******************************************************************************\
|                                                                              |
|                           project-viewer-view.js                             |
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

import Project from '../../../models/projects/project.js';
import Task from '../../../models/projects/task.js';
import Item from '../../../models/storage/item.js';
import BaseCollection from '../../../collections/base-collection.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import MultiDoc from '../../../views/apps/common/behaviors/tabbing/multidoc.js';
import ContainableSelectable from '../../../views/behaviors/containers/containable-selectable.js';
import MultiSelectable from '../../../views/behaviors/selection/multi-selectable.js';
import ItemOpenable from '../../../views/apps/common/behaviors/opening/item-openable.js';
import ItemInfoShowable from '../../../views/apps/file-browser/dialogs/info/behaviors/item-info-showable.js';
import ProjectInfoShowable from '../../../views/apps/project-browser/dialogs/info/behaviors/project-info-showable.js';
import HeaderBarView from '../../../views/apps/project-viewer/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/project-viewer/sidebar/sidebar-view.js';
import TabbedContentView from '../../../views/apps/project-viewer/mainbar/tabbed-content/tabbed-content-view.js';
import FooterBarView from '../../../views/apps/project-viewer/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/project-viewer/forms/preferences/preferences-form-view.js'

export default AppSplitView.extend(_.extend({}, MultiDoc, ContainableSelectable, MultiSelectable, ItemOpenable, ItemInfoShowable, ProjectInfoShowable, {

	//
	// attributes
	//

	name: 'project_viewer',

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);

		// set default topic
		//
		if (!this.constructor.default_project) {
			this.constructor.default_project = new Project({
				id: 0,
				name: this.constructor.getDefaultProjectName()
			});
		}

		// set attributes
		//
		if (this.collection) {
			this.model = this.collection.at(this.collection.length - 1);
		}
		if (!this.model) {
			this.model = this.constructor.default_project;
		}
		if (!this.collection) {
			this.collection = new BaseCollection([this.model]);
		}
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasActiveView()) {
			let activeView = this.getActiveView();
			if (activeView.each) {
				activeView.each(callback, filter, options);
			}
		}
	},

	//
	// querying methods
	//

	hasSelectedProject: function() {
		if (this.hasChildView('sidebar projects')) {
			return this.getChildView('sidebar projects').hasSelected();
		}
	},

	hasOpenProject: function() {
		return !this.collection.isEmpty();
	},

	hasOpenProjects: function() {
		return this.collection.length > 1;
	},

	hasSelectedTasks: function() {
		if (this.hasActiveView()) {
			return this.getActiveView().hasSelected();
		}
	},

	hasSelectedTask: function() {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().hasSelected();
		}
	},

	//
	// counting methods
	//

	numProjects: function() {
		if (this.hasChildView('sidebar projects')) {
			return this.getChildView('sidebar projects').numChildren();
		}
	},

	numSelectedProjects: function() {
		if (this.hasChildView('sidebar projects')) {
			return this.getChildView('sidebar projects').numSelected();
		}	
	},

	numOpenProjects: function() {
		return this.collection.length;
	},

	numTasks: function() {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().numChildren();
		}
	},

	numSelectedTasks: function() {
		if (this.hasActiveView()) {
			return this.getActiveView().numSelected();
		}
	},

	//
	// getting methods
	//

	getDefaultProject: function() {
		return this.constructor.default_project;
	},

	getTaskProject: function(task) {
		return this.getChildView('sidebar').getTaskProject(task);
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// sidebar getting methods
	//

	getProjects: function() {
		if (this.hasChildView('sidebar projects')) {
			return this.getChildView('sidebar projects').getChildModels();
		}
	},

	getSelectedProjects: function() {
		if (this.hasChildView('sidebar projects')) {
			return this.getChildView('sidebar projects').getSelectedModels();
		}
	},

	//
	// mainbar getting methods
	//

	getOpenProjects: function() {
		return this.collection.toArray();
	},

	getSelectedOpenProject: function() {
		return this.model;
	},

	getTasks: function() {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().getChildModels();
		}
	},

	getSelectedTasks: function() {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().getSelectedModels();
		}
	},

	//
	// setting methods
	//

	setProject: function(project) {

		// call superclass method
		//
		AppSplitView.prototype.setModel.call(this, project);
	},

	setTasksProject: function(tasks, project, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-arrow-right"></i>',
				title: 'Move ' + (tasks.length == 1? 'Task' : 'Tasks'),
				message: "Are you sure that you would like to move " + (tasks.length == 1? "this task" : "these " + tasks.length + " tasks") + " from #" +
					this.model.get('name') + " to #" + project.get('name') + "?",
				
				// callbacks
				//
				accept: () => {
					this.setTasksProject(tasks, project, _.extend({
						confirm: false
					}, options));
				}
			});
		} else {

			// move items from current project to selected project
			//
			for (let i = 0; i < tasks.length; i++) {
				tasks[i].setProject(project);
			}

			// play drop sound
			//
			application.play('drop');		
		}
	},

	//
	// selecting methods
	//

	select: function(which) {
		this.getActiveView().select(which);
	},

	//
	// project methods
	//

	openProject: function(project, options) {
		this.openModel(project, options);
	},

	openProjects: function(projects, options) {
		this.openModels(projects, options);
	},

	addProjects: function(projects) {

		// add projects to collection
		//
		for (let i = 0; i < projects.length; i++) {
			this.collection.add(projects[i]);
		}

		// update footer bar
		//
		this.showProjectsInfo();

		// switch to new project
		//
		this.setProject(projects[projects.length - 1]);
	},

	removeProject: function(options) {
		
		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				title: "Remove Project",
				message: "Are you sure you want to delete the project #" + 
					(this.model.get('name')) + " from your list of projects?",

				// callbacks
				//
				accept: () => {
					this.removeProject({
						confirm: false
					});
				}
			});
		} else {

			// remove current user from project
			//
			this.model.removeMember(application.session.user, {

				// callbacks
				//
				success: (model) => {

					// remove project from list
					//
					this.collection.remove(model);
					this.showProjectsInfo();

					// reset selected project
					//
					this.setProject(this.constructor.default_project);

					// play remove sound
					//
					application.play('remove');
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not remove this project.",
						response: response
					});		
				}
			});
		}
	},

	deleteTask: function(task, options) {
		this.deleteTasks([task], options);
	},

	deleteTasks: function(tasks, options) {
		let self = this;
		let count = 0;
		let num_tasks = tasks.length;

		function deleteTask(task) {
			task.destroy({

				// callbacks
				//
				success: () => {
					count++;
					if (count == num_tasks) {
						application.play('remove');
					}

					// update view
					//
					self.showStatusMessage();

					// perform callback
					//
					if (options && options.success) {
						options.success();
					}
				}
			});		
		}

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {
			
			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete Tasks",
				message: "Are you sure you want to delete " + (tasks.length == 1? 'the task "' + tasks[0].get('title') + '"': 'these ' + tasks.length + ' tasks') + " from this project?",
				
				// callbacks
				//
				accept: () => {
					this.deleteTasks(tasks, _.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {
			for (let i = 0; i < tasks.length; i++) {
				deleteTask(tasks[i]);
			}
		}
	},

	//
	// editing methods
	//

	editSelected: function() {
		if (this.hasSelectedTask()) {
			this.showEditTaskDialog(this.getSelectedTasks()[0]);
		} else if (this.hasSelectedProject()) {
			this.showEditProjectDialog(this.getSelectedProjects()[0]);
		}
	},

	//
	// deleting methods
	//

	deleteProject: function(project, options) {

		// check if project can be deleted
		//
		if (project.isDefault() || !project.isOwnedBy(application.session.user)) {
			return;
		}

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete Project",
				message: "Are you sure you want to delete #" + project.get('name') +
					" and all of its tasks?",

				// callbacks
				//
				accept: () => {
					this.deleteProject(project, _.extend({
						confirm: false
					}, options));
				}
			});
		} else {

			// delete project
			//
			project.destroy({

				// callbacks
				//
				success: () => {

					// reset selected project
					//
					this.setProject(this.getDefaultProject());

					// play delete sound
					//
					application.play('delete');		
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not delete project.",
						response: response
					});			
				}
			});
		}
	},

	deleteSelected: function() {
		if (this.hasSelectedTask()) {
			this.deleteTasks(this.getSelectedTasks());
		} else if (this.hasSelectedProject()) {
			this.deleteProjects(this.getSelectedProjects());
		}
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView();
	},

	//
	// contents rendering methods
	//

	getSideBarView: function() {
		return new SideBarView({
			model: this.model,

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			info_kind: this.preferences.get('sidebar_info_kind'),
			view_kind: this.preferences.get('sidebar_view_kind'),

			// callbacks
			//
			onload: (collection) => this.onLoad(collection),
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.openModel(item.model),
			ondrop: (item) => {
				this.setTasksProject(this.getSelectedModels(), item.model);
				item.unhighlight();
			}
		});
	},

	getContentView: function() {
		return new TabbedContentView({
			collection: this.collection,

			// options
			//
			preferences: this.preferences,
			multicolumn: true,

			// callbacks
			//
			onload: (item) => this.onLoad(item),
			onopen: (item) => this.onOpen(item),
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onchangetab: (index) => this.onChangeTab(index),
			ondropout: (items) => this.onDropOut(items),
			ondelete: (items) => this.onDelete(items),
			onclose: (index) => this.closeTab(index)
		});
	},

	showStatusMessage: function() {
		if (this.numTasks() == 0) {
			this.showMessage("No tasks.", {
				icon: '<i class="fa fa-check"></i>'
			});
		} else {
			this.hideMessage();
		}
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView({
			collection: this.collection
		});
	},

	//
	// message rendering methods
	//

	showHelpMessage: function() {
		this.showMessage("No projects.", {
			icon: '<i class="far fa-clipboard"></i>',

			// callbacks
			//
			onclick: () => this.showOpenProjectsDialog()
		});
	},

	//
	// dialog rendering methods
	//

	showNewProjectDialog: function() {
		import(
			'../../../views/apps/project-browser/dialogs/projects/new-project-dialog-view.js'
		).then((NewProjectDialogView) => {

			// show new project dialog
			//
			this.show(new NewProjectDialogView.default({
				model: this.model,

				// callbacks
				//
				onsave: (project) => {

					// add project to list
					//
					this.collection.add(project);

					// play new sound
					//
					application.play('new');
				}
			}));
		});
	},

	showOpenProjectsDialog: function() {
		import(
			'../../../views/apps/project-viewer/dialogs/projects/open-projects-dialog-view.js'
		).then((OpenProjectsDialogView) => {

			// show open projects dialog
			//
			this.show(new OpenProjectsDialogView.default({

				// callbacks
				//
				onopen: (projects) => {

					// add projects to open items collection
					//
					this.openModels(projects);
				}
			}));
		});
	},

	/*
	showProjectInvitationsDialog: function(project) {
		import(
			'../../../views/apps/project-viewer/sharing/dialogs/project-invitations-dialog-view.js'
		).then((ProjectInvitationsDialogView) => {

			// show project invitations dialog
			//
			this.show(new ProjectInvitationsDialogView.default({
				model: project,
				message: config.apps.topic_viewer.project_invitation_message
			}));
		});
	},
	*/

	showEditProjectDialog(project) {
		import(
			'../../../views/apps/project-browser/dialogs/projects/edit-project-dialog-view.js'
		).then((EditProjectDialogView) => {

			// show edit project dialog
			//
			this.show(new EditProjectDialogView.default({
				model: project,

				// callbacks
				//
				onsave: () => {
					this.getChildView('sidebar').render();
				}
			}));
		});
	},

	showNewTaskDialog: function(kind) {
		import(
			'../../../views/apps/project-viewer/dialogs/tasks/new-task-dialog-view.js'
		).then((NewTaskDialogView) => {

			// show new task dialog
			//
			this.show(new NewTaskDialogView.default({
				
				// options
				//
				kind: kind,
				project: this.model,

				// callbacks
				//
				onsave: (task) => {

					// add task to list
					//
					this.getActiveView().collection.add(task);

					// play new sound
					//
					application.play('add');

					// update view
					//
					this.showStatusMessage();
				}
			}));
		});
	},

	showEditTaskDialog: function(task, options) {
		import(
			'../../../views/apps/project-viewer/dialogs/tasks/edit-task-dialog-view.js'
		).then((EditTaskDialogView) => {
			this.show(new EditTaskDialogView.default(_.extend({
				model: task,

				// options
				//
				preferences: this.preferences
			}, options)));
		});
	},

	showInfoDialog: function() {
		if (this.selected && this.selected.model instanceof Item) {
			
			// show attachment info
			//
			this.showItemInfoDialog(this.selected.model);
		} else if (this.hasSelectedProject()) {

			// show sidebar chat info
			//
			this.showProjectsInfoDialog(this.getSelectedProjects());
		} else if (this.hasOpenProject()) {

			// show mainbar chat info
			//
			this.showProjectInfoDialog(this.getSelectedOpenProject());
		}
	},

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/project-viewer/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// check if view still exists
		//
		if (this.isDestroyed()) {
			return;
		}

		// update view
		//
		this.showStatusMessage();

		// set initial search
		//
		if (this.options.search != undefined) {
			this.setSearch(this.options.search);
			this.searchFor(this.options.search);
		}

		// call superclass method
		//
		AppSplitView.prototype.onLoad.call(this);
	},

	onOpen: function(item) {

		// open selected projects
		//
		if (item.model instanceof Project || item.model instanceof Task) {
			this.openModel(item.model);
		}

		// perform callback
		//
		if (this.options.onopen) {
			this.options.onopen(item);
		}
	},

	onChangeTab: function(index) {

		// set attributes
		//
		this.model = this.collection.at(index);

		// update sidebar info panel
		//
		this.getChildView('sidebar').setProject(this.model);

		// call superclass method
		//
		AppSplitView.prototype.onChangeTab.call(this, index);
	},

	onDelete: function() {

		// play remove sound
		//
		application.play("remove");
	},

	//
	// selection event handling methods
	//

	onSelect: function(item) {
		this.selected = item;

		// call superclass method
		//
		AppSplitView.prototype.onSelect.call(this, item);
	},

	onDeselect: function(item) {
		this.selected = null;

		// call superclass method
		//
		AppSplitView.prototype.onDeselect.call(this, item);
	}
}), {

	//
	// static querying methods
	//

	isDefaultProjectName: function(name) {
		return name && name != '' && this.getDefaultProjectName() == name;
	},

	hasDefaultProjectName: function() {
		return this.getTopicName() != undefined;
	},

	//
	// static getting methods
	//

	getPreferences: function() {
		return config.preferences.project_viewer || {};
	},

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	},

	getDefaultProjectName: function() {
		return this.getPreferences().default_project;
	}
});