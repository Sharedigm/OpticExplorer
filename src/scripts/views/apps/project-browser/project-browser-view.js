/******************************************************************************\
|                                                                              |
|                           project-browser-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for browsing and finding projects.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Projects from '../../../collections/projects/projects.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import SelectableContainable from '../../../views/behaviors/containers/selectable-containable.js';
import MultiSelectable from '../../../views/behaviors/selection/multi-selectable.js';
import ProjectInfoShowable from '../../../views/apps/project-browser/dialogs/info/behaviors/project-info-showable.js';
import HeaderBarView from '../../../views/apps/project-browser/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/project-browser/sidebar/sidebar-view.js';
import ProjectsView from '../../../views/apps/project-browser/mainbar/projects/projects-view.js';
import FooterBarView from '../../../views/apps/project-browser/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/project-browser/forms/preferences/preferences-form-view.js'

export default AppSplitView.extend(_.extend({}, SelectableContainable, MultiSelectable, ProjectInfoShowable, {

	//
	// attributes
	//

	name: 'project_browser',

	events: {
		'click > .body': 'onClick',
		'contextmenu > .body': 'onContextMenu'
	},

	//
	// constructor
	//

	initialize: function() {
	
		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);
		
		// set attributes
		//
		this.collection = new Projects();
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('content')) {
			this.getChildView('content').each(callback, filter, options);
		}
	},

	//
	// getting methods
	//

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// setting methods
	//

	setProjects: function(projects) {

		// set attributes
		//
		this.collection.reset(projects);
		this.search = null;

		// update main bar
		//
		if (this.collection.length == 0) {
			this.showMessage("No projects found.", {
				icon: '<i class="fa fa-hashtag"></i>'
			});
		} else {
			this.hideMessage();	
		}

		// update footer bar
		//
		if (this.hasChildView('info')) {
			this.getChildView('info').update();
		}
	},

	clear: function() {
		this.collection.reset();
	},

	reset: function() {
		this.setProjects(this.subscribed.models);

		// update footer
		//
		if (this.hasChildView('info')) {
			this.getChildView('info').onChange();
		}
	},
	
	//
	// selecting methods
	//

	select: function(which) {
		this.getChildView('content').select(which);
	},

	openSelected: function() {
		let effect = application.settings.theme.get('icon_open_effect');
		let delay = effect && effect != 'none'? 500 : 0;

		// call attention to selected items
		//
		this.each((item) => {
			if (item.isSelected()) {
				item.showEffect(effect);
			}
		});

		// open selected projects in project viewer after delay
		//
		window.setTimeout(() => {
			this.showSelectedProjects();
		}, delay);
	},

	//
	// searching methods
	//

	searchFor: function(search) {

		// update message
		//
		if (search) {
			this.hideMessage();
		} else {
			/*
			this.showMessage("Search for a project of interest!", {
				icon: '<i class="fa fa-hashtag"></i>'
			});
			this.clear();
			*/

			this.setProjects(this.unsubscribed.models);

			// update footer
			//
			if (this.hasChildView('info')) {
				this.getChildView('info').onChange();
			}

			return;
		}

		// update nav bar
		//
		this.getChildView('header nav').goto(search, {
			silent: true
		});

		// perform search
		//
		new Projects().fetchUnsubscribed({

			// options
			//
			data: {
				search: search
			},

			// callbacks
			//
			success: (collection) => {

				// update attributes
				//
				this.search = search;

				// update views
				//
				this.setProjects(collection.models);
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not find project.",
					response: response
				});
			}
		});
	},

	clearSearch: function() {

		// clear search bar
		//
		if (this.hasChildView('header search')) {
			this.getChildView('header search').remove();
		}

		// clear navigation
		//
		this.getChildView('header nav').reset();

		// clear view
		//
		this.hideMessage();
	},

	//
	// deleting methods
	//

	deleteProject: function(project, options) {

		// check if project can be deleted
		//
		if (!project || project.isDefault() || !project.isOwnedBy(application.session.user)) {
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

	deleteSelectedProjects: function() {
		this.deleteProject(this.getSelectedModel());
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		AppSplitView.prototype.onRender.call(this);
		
		// show child views
		//
		this.showHeaderBar();
		this.showCurrent();

		// this.showContents();

		// show / hide footer bar
		//
		if (!this.options.hidden || !this.options.hidden['footer-bar']) {
			this.showFooterBar();
		} else {
			this.$el.find('.footer-bar').remove();
		}
		
		// show initial help message
		//
		this.showMessage("Loading projects...", {
			icon: '<i class="fa fa-spin fa-spinner"></i>',
		});
	},

	showCurrent: function() {
		this.collection.fetchCurrent({

			// callbacks
			//
			success: () => {
				this.subscribed = this.collection.clone();
				this.setProjects(this.subscribed.models);
				this.onLoad();
			}
		});
	},

	onShow: function() {

		// set focus
		//
		this.$el.find('.search-bar input').focus();
	},

	showProjects: function(projects) {
		application.launch('project_viewer', {
			collection: new Projects(projects)
		});
	},

	showSelectedProjects: function() {
		this.showProjects(this.getSelectedModels());
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView();
	},

	//
	// content rendering methods
	//

	getSideBarView: function() {
		return new SideBarView({

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),
			hidden: this.options.hidden,

			// callbacks
			//
			onsave: this.options.onsave,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		});
	},

	getContentView: function() {
		return new ProjectsView({
			collection: this.collection,

			// options
			//
			preferences: this.preferences,
			selected: this.getSelectedModels(),
			multicolumn: true,

			// capabilities
			//
			selectable: true,
			draggable: true,
			droppable: false,
			editable: false,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropon: (items, item) => this.onDropOn(items, item)
		});
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView();
	},

	//
	// dialog rendering methods
	//

	showNewProjectDialog: function() {
		import(
			'../../../views/apps/project-browser/dialogs/projects/new-project-dialog-view.js'
		).then((NewProjectDialogView) => {

			// show add post project dialog
			//
			application.show(new NewProjectDialogView.default({

				// callbacks
				//
				onsave: this.options.onsave
			}));
		});
	},

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/project-browser/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	showInfoDialog: function(options) {
		let items = this.getSelectedModels();
		let effect = application.settings.theme.get('icon_open_effect');
		let delay = effect && effect != 'none'? 500 : 0;
		
		// call attention to selected items 
		//
		this.each((item) => {
			if (item.isSelected()) {
				item.showEffect(effect);
			}
		});

		// show info after delay
		//
		window.setTimeout(() => {
			if (items.length == 1) {
				this.showProjectInfoDialog(items[0], options);
			} else if (items.length > 1) {
				this.showProjectsInfoDialog(items, options);
			} else {

				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-info-circle"></i>',
					title: "Show Info",
					message: "No items selected."
				});
			}
		}, delay);
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// enable / disable send requests
		//
		this.getChildView('sidebar').setNumSelected(this.numSelected());

		// call superclass method
		//
		AppSplitView.prototype.onLoad.call(this);
	},

	onOpen: function(item) {

		// open selected projects
		//
		if (!this.options.onopen) {
			this.openSelected();
		}

		// perform callback
		//
		if (this.options.onopen) {
			this.options.onopen(item);
		}
	},

	//
	// selection event handling methods
	//

	onChangeSelection: function() {
		
		// call superclass method
		//
		AppSplitView.prototype.onChangeSelection.call(this);

		// enable / disable send requests
		//
		this.getChildView('sidebar').setNumSelected(this.numSelected());
	}
}), {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});