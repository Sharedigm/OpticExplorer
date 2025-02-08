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
import AppLaunchable from '../../../../../../views/apps/common/behaviors/opening/app-launchable.js';
import Minimizable from '../../../../../../views/dialogs/behaviors/minimizable.js';

export default MenuView.extend(_.extend({}, AppLaunchable, {

	//
	// attributes
	//

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
		this.items = this.getDesktopItems();

		// update menu upon change in tasks
		//
		this.listenTo(this.tasks, 'add', () => {
			this.render();
		});
		this.listenTo(this.tasks, 'remove', () => {
			this.render();
		});
	},

	getDesktopItems: function() {
		let items = [];

		// add apps
		//
		for (let i = 0; i < this.apps.length; i++) {
			let app = this.apps.at(i);
			items.push({
				class: 'app-item',
				icon: app.get('icon'),
				name: app.get('name'),
				tags: {
					'data-index': i
				}
			});
		}

		// add tasks
		//
		if (this.tasks.length > 0) {
			items.push("separator");

			for (let i = 0; i < this.tasks.length; i++) {
				let task = this.tasks.at(i);
				items.push({
					class: 'task-item',
					icon: task.get('icon'),
					name: task.get('title'),
					tags: {
						'data-index': i
					}
				});
			}
		}

		return items;
	},

	//
	// rendering methods
	//

	template: function(data) {
		return data.view.toHtml(data.view.getDesktopItems());
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

	showLink: function(url) {
		application.launch('web_browser', {
			url: url
		});
	},

	showApp: function(app, options) {
		application.launch(app, options);
	},

	//
	// mouse event handling methods
	//

	onClickApp: function(event) {
		let element = $(event.target).closest('li');
		let index = parseInt($(element).attr('data-index'));
		let model = this.apps.at(index);

		if (model.has('link')) {

			// show link
			//
			this.showLink(model.get('link'));
		} else {

			// show app
			//
			this.showApp(model.get('id'), model.get('options'));
		}
	},

	onClickTask: function() {
		let element = $(event.target).closest('li');
		let index = parseInt($(element).attr('data-index'));
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