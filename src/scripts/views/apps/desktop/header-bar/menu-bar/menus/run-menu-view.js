/******************************************************************************\
|                                                                              |
|                                run-menu-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying file dropdown menus.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';
import Launchable from '../../../../../../views/apps/common/behaviors/launching/launchable.js';
import Minimizable from '../../../../../../views/dialogs/behaviors/minimizable.js';

export default MenuView.extend(_.extend({}, Launchable, {

	//
	// attributes
	//

	template: template(`
		<% if (apps) { %>
		<% for (let i = 0; i < apps.length; i++) { %>
		<% let app = apps.at(i); %>
		<li role="presentation">
			<a class="app-item" data-index="<%= i %>"><i class="<%= app.get('icon') %>"></i><%= app.get('name') %></a>
		</li>
		<% } %>
		
		<% if (tasks.length > 0) { %>
		<li role="separator" class="divider"></li>
		<% } %>
		<% } %>
		
		<% for (let j = 0; j < tasks.length; j++) { %>
		<% let task = tasks.at(j); %>
		<li role="presentation">
			<a class="task-item" data-index="<%= j %>"><i class="<%= task.get('icon') %>"></i><%= task.get('title') %></a>
		</li>
		<% } %>
	`),

	events: {
		'click .app-item': 'onClickApp',
		'click .task-item': 'onClickTask'
	},

	//
	// constructor
	//

	initialize: function() {

		// call superclass method
		//
		MenuView.prototype.initialize.call(this);

		// set attributes
		//
		if (config.defaults.desktop.show_app_launcher) {
			this.apps = this.getApps();
		}
		this.tasks = Minimizable.getMinimized();

		// update menu upon change in tasks
		//
		this.listenTo(this.tasks, 'add', () => {
			this.render();
		});
		this.listenTo(this.tasks, 'remove', () => {
			this.render();
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			apps: this.apps,
			tasks: this.tasks
		};
	},

	onRender: function() {

		// do nothing - do not disable items
		//
	},

	onAttach: function() {

		// set menu class on open
		//
		this.$el.on('open', () => {

			// set max menu height
			//
			this.$el.css('max-height', this.getParentView('app').$el.height() - 30);
		});
	},

	//
	// mouse event handling methods
	//

	onClickApp: function(event) {
		let index = parseInt($(event.target).attr('data-index'));
		let model = this.apps.at(index);

		if (model.has('link')) {

			// go to link
			//
			/*
			application.navigate(model.get('link'), {
				trigger: true
			});
			*/
			application.launch('web_browser', {
				url: model.get('link')
			});
		} else {
			application.launch(model.get('id'), model.get('options'));
		}
	},

	onClickTask: function() {
		let index = parseInt($(event.target).attr('data-index'));
		let model = this.tasks.at(index);

		let view = model.get('view');
		view.unminimize();

		// bring dialog to top and focus
		//
		if (view.toTop) {
			view.toTop();
		}
		view.focus();

		// destroy item
		//
		model.destroy();
	}
}));