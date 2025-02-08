/******************************************************************************\
|                                                                              |
|                             desktop-app-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app shown on the desktop.                             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPreferences from '../../../../models/preferences/user-preferences.js';
import Wallpaperable from '../../../../views/behaviors/effects/wallpaperable.js';
import AppView from '../../../../views/apps/common/app-view.js';
import AppLoadable from '../../../../views/apps/common/behaviors/loading/app-loadable.js';
import StatusBarView from '../../../../views/apps/desktop/header-bar/status-bar/status-bar-view.js';
import FooterBarView from '../../../../views/apps/desktop/footer-bar/footer-bar-view.js';
import ModalsView from '../../../../views/dialogs/modals-view.js';
import Browser from '../../../../utilities/web/browser.js';

export default AppView.extend(_.extend({}, Wallpaperable, AppLoadable, {

	//
	// attributes
	//

	className: 'desktop app',

	template: template(`
		<div class="body">
			<div class="desktop_app"></div>
		</div>
		<div class="modals"></div>
		<div class="footer-bar" style="display:none"></div>
	`),

	regions: {
		body: '.body',
		modals: {
			el: '.modals',
			replaceElement: true
		},
		footer: {
			el: '.footer-bar',
			replaceElement: true
		}
	},

	events: {
		'mousedown .app > .body': 'onMouseDown',
		'beforeunload': 'onBeforeUnload'
	},

	launchDuration: 300,

	//
	// constructor
	//

	initialize: function() {
		if (this.options.settings) {
			this.settings = this.options.settings;
		}
	},

	//
	// querying methods
	//

	isSelected: function() {
		return this.$el.hasClass('is-selected');
	},

	isCurrent: function() {
		return this.$el.hasClass('is-selected');
	},

	hasSelected: function() {
		if (this.hasChildView('body')) {
			return this.getChildView('body').hasSelected();
		}
	},

	hasSideBar: function(appName) {
		return Browser.is_mobile || appName != 'file_browser';
	},

	hasTabs: function() {
		if (this.hasChildView('body')) {
			return this.getChildView('body contents mainbar').hasTabs();
		}
	},

	//
	// counting methods
	//

	numSelected: function() {
		if (this.hasChildView('body')) {
			return this.getChildView('body').numSelected();
		}
	},

	//
	// getting methods
	//

	getAppName: function() {
		if (this.model.has('link')) {
			return 'file_browser';
		} else {
			return this.options.app.get('id') || 'file_browser';
		}
	},

	getUser: function() {
		if (this.model.has('link')) {
			return this.model.get('link').get('user');
		} else {
			return application.session.user;
		}
	},

	//
	// setting methods
	//

	setAppName: function(appName) {
		if (appName != this.appName) {
			this.onRender();
		}
	},

	setOption: function(key, value) {
		this.getChildView('body').setOption(key, value);
	},

	//
	// loading methods
	//

	loadPreferences: function(appName, options) {

		// load user preferences
		//
		UserPreferences.create(appName).fetch({

			// callbacks
			//
			success: (preferences) => {

				// perform callback
				//
				if (options && options.success) {
					options.success(preferences);
				}
			}
		});
	},

	//
	// window methods
	//

	focus: function() {
		this.$el.addClass('focused');
	},

	blur: function() {
		this.$el.removeClass('focused');
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.showApp(this.options.app.get('id'));

		// add modals to desktop space
		//
		this.showModals();
		this.modals = this.getChildView('modals');

		// add tooltip triggers
		//
		this.addTooltips();

		// add orientation event listener
		//
		window.addEventListener("orientationchange", () => {
			this.onOrientationChange();
		}, false);
	},

	showModals: function() {
		this.showChildView('modals', new ModalsView());
	},

	showAppView: function(appName, AppView) {

		// show app in desktop body
		//
		this.showChildView('body', new AppView({

			// options
			//
			preferences: this.preferences,
			selectedPath: this.options.selectedPath,
			hidden: {
				'sidebar': !this.hasSideBar(appName),
				'footer-bar': true
			},

			// callbacks
			//
			onload: () => this.onLoad(),
			onchange: () => this.onChange(),
			onchangetab: () => this.onChangeTab(),
			onselect: () => this.onSelect(),
			ondeselect: () => this.onDeselect(),
			onchangeselection: () => this.onChangeSelection(),
			onclosetab: () => this.onCloseTab()
		}));

		// append app name to header bar
		//
		let defaults = config.apps[appName];
		if (this.options.show_app_name) {
			let name = $('<div class="app-bar hidden-xs">' +
				'<i class="' + defaults.icon + '"></i>' +
				(defaults.alias || defaults.name) +
				'</div>');
			this.$el.find('.body > .app > .header-bar').prepend(name);
		}

		// make desktop apps unflickable
		//
		this.$el.find('.body > .app > .body').addClass('unflickable');

		// remove footer bar
		//
		this.$el.find('.body > .app > .footer-bar').remove();
	},

	showApp: function(appName) {

		// show desktop app
		//
		application.loadApp(appName, {

			// callbacks
			//
			success: (AppView) => {

				// load user preferences
				//
				this.loadPreferences(appName, {

					// callbacks
					//
					success: (preferences) => {
						this.preferences = preferences;

						// check if view still exists
						//
						if (this.isDestroyed()) {
							return;
						}

						// update view
						//
						this.showAppView(appName, AppView);

						// apply dialog styles
						//
						application.settings.dialogs.apply();
					}
				});
			},

			error: () => {

				// show error message
				//
				application.error({
					message: "The app '" + appName.replace('_', ' ') + "'' could not be loaded."
				});
			}
		});

		// show run menu if appropriate
		//
		if (application.session.user && appName != 'app_launcher') {
			this.$el.find('.run-menu').show();
		} else {
			this.$el.find('.run-menu').hide();
		}

		// hide desktop info
		//
		this.$el.find('.desktop-info').hide();

		// show app launcher
		//
		this.showLauncher(application.desktop.settings.get('launcher_style'));

		// set initial focus
		//
		this.focus();
	},

	showLauncher: function(launcherStyle) {

		// show task bar
		//
		this.showFooterBar();
		if (launcherStyle != 'taskbar') {
			this.getChildView('footer').$el.hide();
		}

		// update menu bar if launcher style changes
		//
		if (launcherStyle != this.launcherStyle) {
			let headerBarView = this.getChildView('body header');
			if (headerBarView && headerBarView.showMenuBar) {
				headerBarView.showMenuBar();
				headerBarView.onLoad();
			}
		}

		// set attributes
		//
		this.launcherStyle = launcherStyle;
	},

	//
	// header bar rendering methods
	//

	showHeaderStatusBar: function() {
		if (this.hasChildView('body header')) {
			if (this.getChildView('body header').hasRegion('status')) {
				this.getChildView('body header').showChildView('status', new StatusBarView());
			}
		}
	},

	//
	// footer bar rendering methods
	//

	showFooterBar: function() {
		this.showChildView('footer', new FooterBarView({
			collection: this.parent.parent.getApps(),

			// options
			//
			show_apps: this.options.app.get('id') != 'app_launcher',

			// callbacks
			//
			onclick: (view) => this.onClickApp(view)
		}));
	},

	showFooterStatusBar: function() {

		// show status in footer bar
		//
		if (this.hasChildView('footer')) {
			this.getChildView('footer').showStatusBar();
		}
	},

	showLink: function(url) {
		application.launch('web_browser', {
			url: url
		});
	},

	showAppByName: function(app, options) {
		application.launch(app, options);
	},

	update: function() {
		this.showHeaderStatusBar();
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

		// show status in header bar
		//
		this.showHeaderStatusBar();

		// show status in footer bar
		//
		this.showFooterStatusBar();

		// load footer bar
		//
		if (this.hasChildView('footer')) {
			this.getChildView('footer').onLoad();
		}

		// make header and footer bar flick draggable
		//
		if (application.desktop.settings.get('desktop_apps').length > 1) {
			this.getChildView('body header').$el.addClass('flickable');
			this.getChildView('footer').$el.addClass('flickable');
		}

		// enable menu bars
		//
		if (this.hasChildView('body header menu')) {
			this.getChildView('body header menu').setEnabled(true);
		}
	},

	onCloseTab: function() {

		// call superclass method
		//
		AppView.prototype.onCloseTab.call(this);

		// check if we are closing the last tab
		//
		if (!this.hasTabs()) {

			// open new tab
			//
			if (this.getChildView('body').newTab) {
				this.getChildView('body').newTab();

			// update menu bar
			//
			} else if (this.hasChildView('body header menu')) {
				this.getChildView('body header menu').onLoad(false);
			}
		}
	},

	//
	// mouse event handling methods
	//

	onMouseDown: function() {

		// blur all modals in this desktop
		//
		if (this.modals) {
			this.modals.blurAll();
		}
		this.focus();
	},

	//
	// mouse event handling methods
	//

	onClickApp: function(view) {
		if (view.model.has('link')) {

			// show link
			//
			this.showLink(view.model.get('link'))
		} else {

			// show app
			//
			this.showAppByName(view.model.get('id'), view.model.get('options'));

			// deselect app icon
			//
			window.setTimeout(() => {
				view.deselect();
			}, this.launchDuration);
		}
	},

	onContextMenu: function() {

		// block event from parent
		//
		// this.block(event);
	},

	onBeforeUnload: function(event) {

		// Handle event with desktop app
		//
		if (this.app.onBeforeUnload) {
			this.app.onBeforeUnload(event);
		}

		return '';
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		if (this.hasChildView('body')) {
			this.getChildView('body').onKeyDown(event);
		}
	},

	//
	// window event handling methods
	//

	onResize: function(event) {
		if (this.hasChildView('body')) {
			this.getChildView('body').onResize(event);
		}
	},

	onOrientationChange: function(event) {
		if (this.hasChildView('body')) {
			this.getChildView('body').onOrientationChange(event);
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// destroy modals associated with desktop
		//
		if (this.modals) {
			this.modals.destroy();
		}
	}
}));