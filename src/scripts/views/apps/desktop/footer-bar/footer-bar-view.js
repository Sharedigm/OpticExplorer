/******************************************************************************\
|                                                                              |
|                              footer-bar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for managing files and applications.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Apps from '../../../../collections/apps/apps.js';
import ToolbarContainerView from '../../../../views/apps/common/toolbars/toolbar-container-view.js';
import RunMenuView from '../../../../views/apps/desktop/footer-bar/run-menu-view.js';
import TaskBarView from '../../../../views/apps/desktop/footer-bar/task-bar/task-bar-view.js';
import DesktopToolbarView from '../../../../views/apps/desktop/toolbar/desktop-toolbar-view.js';
import Browser from '../../../../utilities/web/browser.js';

export default ToolbarContainerView.extend({

	//
	// attributes
	//

	className: 'footer-bar',

	template: template(`
		<div class="left handle-bar"><div class="handle"></div></div>
		<div class="run-menu"></div>
		<div class="task-bar"></div>
		<div class="right handle-bar"><div class="handle"></div></div>
		
		<div class="desktop-info-bar">
			<div class="desktop-tools"></div>
			<div class="desktop-status"></div>
		</div>
	`),

	regions: {
		menu: '.run-menu',
		tasks: {
			el: '.task-bar',
			replaceElement: true
		},
		tools: {
			el: '.desktop-tools',
			replaceElement: true
		},
		status: {
			el: '.desktop-status',
			replaceElement: true
		}
	},

	//
	// querying methods
	//

	hasStatusBarView: function() {
		return this.app && this.app.getStatusBarView;
	},

	//
	// getting methods
	//

	getTemplate: function() {
		return this.template;
	},

	getStatusBarView: function() {
		return this.app.getStatusBarView();
	},

	//
	// rendering methods
	//

	onRender: function() {
		let show_run_menu = config.defaults.desktop.show_app_launcher && this.options.show_apps != false;
		let show_pinned_apps = config.defaults.desktop.preferences.pinned_apps && this.options.show_apps != false;

		// for mobile, don't show both run menu and pinned apps
		//
		if (Browser.is_mobile) {
			if (show_run_menu) {
				show_pinned_apps = false;
			}
		}

		// show child views
		//
		if (show_run_menu) {
			this.showRunMenu();
		}
		this.showTaskBar({
			show_pinned_apps: show_pinned_apps
		});

		// show desktop toolbar
		//
		this.showDesktopToolbar();
		
		// add tooltip triggers
		//
		this.addTooltips();
	},

	//
	// rendering methods
	//

	showRunMenu: function() {
		this.showChildView('menu', new RunMenuView({
			collection: new Apps(this.collection.filter((app) => {
				return !app.get('hidden');
			})),

			// callbacks
			//
			onclick: (item) => this.parent.onClickApp(item)
		}));
	},

	showTaskBar: function(options) {
		this.showChildView('tasks', new TaskBarView(options));
	},

	showDesktopToolbar: function() {
		this.showChildView('tools', new DesktopToolbarView());
	},

	showStatusBar: function() {

		// show app status bar info
		//
		if (this.hasStatusBarView()) {

			// display status bar in desktop footer
			//
			this.showChildView('status', this.getStatusBarView());
		}
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.app = this.parent.getChildView('body');
		
		// show footer status
		//
		this.showStatusBar();

		// load footer status
		//
		if (this.hasChildView('status') && this.getChildView('status').onLoad) {
			this.getChildView('status').onLoad();
		}
	},

	onChange: function(attribute) {
		if (this.hasChildView('status')) {
			if (this.getChildView('status').onChange) {
				this.getChildView('status').onChange(attribute);
			}
		}
	},

	onChangeTab: function(index) {
		if (this.hasChildView('status')) {
			if (this.getChildView('status').onChangeTab) {
				this.getChildView('status').onChangeTab(index);
			}
		}
	},

	//
	// event handling methods
	//

	onChangeInfo: function(key, value) {

		// update view
		//
		this.app.setOption(key, value);

		// update menu bar
		//
		this.app.onChange();
	}
});