/******************************************************************************\
|                                                                              |
|                            task-info-panel-view.js                           |
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
import Tasks from '../../../../../collections/projects/tasks.js';
import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import ProjectsView from '../../../../../views/apps/project-browser/mainbar/projects/projects-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'info panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-info-circle"></i>Task</label>
		
			<div class="buttons">
				<button type="button" class="show-info success btn btn-sm" data-toggle="tooltip" title="Show Info">
					<i class="fa fa-info-circle"></i>
				</button>
			</div>
		</div>
		
		<div class="item-info">
			<div class="item"></div>
		
			<% if (description) { %>
			<div class="description form-group" style="display:none">
				<label class="control-label"><i class="fa fa-quote-left"></i>Description</label>
				<div class="controls">
					<div class="well"><%= description %></div>
				</div>
			</div>
			<% } %>
		</div>
	`),

	regions: {
		items: '.item'
	},

	events: {
		'click .show-info': 'onClickShowInfo'
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
		this.showItem();
	},

	showItem: function() {
		this.showChildView('items', new ProjectsView({
			collection: new Tasks([this.model], {
				parse: false
			}),

			// options
			//
			preferences: UserPreferences.create('project_viewer', {
				view_kind: this.options.view_kind
			}),

			// capabilities
			//
			selectable: false
		}));
	},

	/*
	showItem: function() {
		this.showChildView('items', new TasksView({
			collection: new Tasks([this.model], {
				parse: false
			}),

			// options
			//
			preferences: UserPreferences.create('project_viewer', {
				view_kind: this.options.view_kind
			}),

			// capabilities
			//
			selectable: false
		}));
	},
	*/

	//
	// mouse event handling methods
	//

	onClickShowInfo: function() {
		this.getParentView('app').showInfoDialog();
	}
});