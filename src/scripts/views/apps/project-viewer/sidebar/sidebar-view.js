/******************************************************************************\
|                                                                              |
|                               sidebar-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing an app's sidebar.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Project from '../../../../models/projects/project.js';
import Task from '../../../../models/projects/task.js';
import Projects from '../../../../collections/projects/projects.js';
import SideBarView from '../../../../views/apps/common/sidebar/sidebar-view.js';
import ProjectInfoPanelView from '../../../../views/apps/project-viewer/sidebar/panels/project-info-panel-view.js';
import ProjectsPanelView from '../../../../views/apps/project-viewer/sidebar/panels/projects-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['info', 'projects'],

	events: {
		'mousedown': 'onMouseDown'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.collection = new Projects();
	},

	//
	// attribute methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();

		return {
			'info': true,
			'projects': isSignedIn
		};
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('projects')) {
			this.getChildView('projects').each(callback, filter, options);
		}
	},

	//
	// getting methods
	//

	getTaskProject: function(task) {
		let projects = this.getChildView('projects').collection;
		if (projects) {
			return projects.getById(task.get('project_id'));
		}
	},

	//
	// setting methods
	//

	setProject: function(project) {

		// set attributes
		//
		this.model = project;

		// update child views
		//
		if (this.isPanelVisible('info')) {
			this.showPanel('info');
		}

		// scroll into view
		//
		// this.scrollToView(this.findByModel(project));
	},

	setSelected: function(model, options) {
		this.getChildView('projects').setSelectedModel(model, options);

		// scroll into view
		//
		this.scrollToView(this.getProject()[0]);
	},

	//
	// panel rendering methods
	//

	showPanel: function(panel) {

		// show specified panel
		//
		switch (panel) {
			case 'info':
				this.showInfoPanel();
				break;
			case 'projects':
				this.showProjectsPanel();
				break;
		}
	},

	showInfoPanel: function() {
		if (this.model && this.model instanceof Project) {
			this.showProjectInfoPanel(this.model);
		} else if (this.model && this.model instanceof Task) {
			this.showProjectInfoPanel(this.getTaskProject(this.model));
		}
	},

	showProjectInfoPanel: function(project) {
		this.showChildView('info', new ProjectInfoPanelView({
			model: project,

			// options
			//
			view_kind: this.options.info_kind != 'auto'? this.options.info_kind : this.options.view_kind,

			// options
			//
			preferences: this.options.preferences
		}));		
	},

	showProjectsPanel: function() {
		this.showChildView('projects', new ProjectsPanelView({
			collection: this.collection,

			// options
			//
			view_kind: this.options.view_kind,

			// callbacks
			//
			onload: this.options.onload,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			ondrop: this.options.ondrop
		}));		
	},

	//
	// mouse event handling methods
	//

	onMouseDown: function(event) {
		if (event.target == this.el) {
			this.getChildView('projects').deselectAll();
		}
	}
});