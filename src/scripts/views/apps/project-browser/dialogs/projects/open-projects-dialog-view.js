/******************************************************************************\
|                                                                              |
|                         add-projects-dialog-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box to add a new task project.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Project from '../../../../../models/projects/project.js';
import DialogView from '../../../../../views/dialogs/dialog-view.js';
import ProjectBrowserView from '../../../../../views/apps/project-browser/project-browser-view.js';

export default DialogView.extend({

	//
	// attributes
	//
	
	className: 'focused modal dialog',

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-clipboard"></i>
					</div>
					<div class="title">
						Add Projects
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
				
				<div class="modal-footer">	
					<div class="buttons">
						<button class="add-projectxs btn btn-primary" data-dismiss="modal" disabled>
							<i class="fa fa-plus"></i>Add Projects
						</button>
						<button class="cancel btn" data-dismiss="modal">
							<i class="fa fa-xmark"></i>Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		body: {
			el: '.modal-body',
			replaceElement: true
		},
	},

	events: _.extend({}, DialogView.prototype.events, {
		'click .add-projects': 'onClickAddProjects'
	}),

	//
	// dialog attributes
	//

	icon: '<i class="fa fa-plus"></i>',
	title: "Add Projects",

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (this.options.title) {
			this.title = this.options.title;
		}

		// call superclass constructor
		//
		DialogView.prototype.initialize.call(this);

		// set default attributes
		//
		if (!this.model) {
			this.model = application.getDirectory();
		}
	},

	//
	// adding methods
	//

	addProject: function(project) {
		project.addMember(application.session.user, {

			// callbacks
			//
			success: (data) => {
				this.close();

				let project = new Project(data, {
					parse: true
				});

				// perform callback
				//
				if (this.options.onadd) {
					this.options.onadd([project]);
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not add project.",
					response: response
				});
			}
		});
	},

	addProjects: function(projects) {
		if (projects && projects.length > 0) {
			for (let i = 0; i < projects.length; i++) {
				this.addProject(projects[i]);
			}
		}
	},

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('.modal-footer .add-projects').prop('disabled', disabled);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.icon,
			title: this.title
		};
	},

	onRender: function() {
		
		// call superclass method
		//
		DialogView.prototype.onRender.call(this);

		// show child views
		//
		this.showProjectBrowser();
	},

	showProjectBrowser: function() {
		this.showChildView('body', new ProjectBrowserView({
			model: this.model,

			// options
			//
			dialog: this,
			hidden: {
				'add-projects': true,
				'footer-bar': true
			},

			// state
			//
			selected: this.options.selected,

			// callbacks
			//
			onopen: (items) => this.onOpen(items),
			onchange: () => this.onChange(),
			onselect: () => this.update(),
			ondeselect: () => this.update(),
			onsave: (item) => this.onSave(item)
		}));
	},

	onShown: function() {

		// call superclass method
		//
		DialogView.prototype.onShown.call(this);

		// set focus to search input
		//
		this.$el.find('input[type="search"]').focus();
	},

	update: function() {

		// update buttons
		//
		this.setDisabled(!this.getChildView('body').hasSelected());
	},

	//
	// event handling methods
	//

	onOpen: function(items) {

		// perform callback
		//
		if (this.options.onopen) {
			this.options.onopen(items);
		}
	},

	onSave: function(item) {

		// perform callback
		//
		if (this.options.onsave) {
			this.options.onsave(item);
		}
	},

	//
	// mouse event handling methods
	//

	onClickAddProjects: function() {

		// add selected projects
		//
		this.addProjects(this.getChildView('body').getSelectedModels());
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		this.getChildView('body').onKeyDown(event);
	}
});