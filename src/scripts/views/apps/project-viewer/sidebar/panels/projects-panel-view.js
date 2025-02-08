/******************************************************************************\
|                                                                              |
|                            projects-panel-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a type of sidebar panel.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import ContainableSelectable from '../../../../../views/behaviors/containers/containable-selectable.js';
import ProjectsView from '../../../../../views/apps/project-browser/mainbar/projects/projects-view.js';

export default SideBarPanelView.extend(_.extend({}, ContainableSelectable, {

	//
	// attributes
	//

	className: 'projects panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-clipboard"></i>Projects</label>
		
			<div class="buttons">
				<button type="button" class="add-projects success btn btn-sm" data-toggle="tooltip" title="Add Projects">
					<i class="fa fa-plus"></i>
				</button>
			</div>
		</div>
		
		<div class="items"></div>
	`),

	regions: {
		'items': {
			el: '.items',
			replaceElement: true
		}
	},

	events: {
		'click .add-projects': 'onClickAddProjects'
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('items')) {
			this.getChildView('items').each(callback, filter, options);
		}
	},

	//
	// loading methods
	//

	fetchProjects: function(done) {
		return this.collection.fetchCurrent({

			// callbacks
			//
			success: (collection) => {
				if (done) {
					done(collection);
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not fetch user's projects.",
					response: response
				});		
			}
		});
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SideBarPanelView.prototype.onRender.call(this);
		
		// show child views
		//
		this.request = this.fetchProjects((collection) => {

			// add default project
			//
			collection.add(this.app.getDefaultProject());

			// show user projects
			//
			this.showProjects();

			// perform callback
			//
			if (this.options.onload) {
				this.options.onload(collection);
			}
		});
	},

	showProjects: function() {
		this.showChildView('items', new ProjectsView({
			collection: this.collection,

			// options
			//
			preferences: UserPreferences.create('project_viewer', {
				view_kind: this.app.options.sidebar_view_kind
			}),

			// state
			//
			selected: this.options.selected,

			// capabilities
			//
			selectable: true,
			deselectable: true,
			editable: false,
			draggable: true,
			droppable: true,

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

	onClickAddProjects: function() {
		this.parent.app.showNewProjectDialog();
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// abort request
		//
		if (this.request && this.request.state() == 'pending') {
			this.request.abort();
		}
	}
}));