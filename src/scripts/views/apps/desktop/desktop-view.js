/******************************************************************************\
|                                                                              |
|                                desktop-view.js                               |
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

import DesktopSettings from '../../../models/settings/desktop-settings.js';
import ThemeSettings from '../../../models/settings/theme-settings.js';
import Apps from '../../../collections/base-collection.js';
import Wallpaperable from '../../../views/behaviors/effects/wallpaperable.js';
import AppView from '../../../views/apps/common/app-view.js';
import SpacesView from '../../../views/apps/desktop/spaces/spaces-view.js';
import DockView from '../../../views/apps/desktop/dock/dock-view.js';
import Browser from '../../../utilities/web/browser.js';

export default AppView.extend(_.extend({}, Wallpaperable, {

	//
	// attributes
	//

	id: 'desktop',

	template: template(`
		<div class="spaces"></div>
		<div id="dock-bar" style="display:none">
			<div class="shelf"></div>
			<div class="dock"></div>
		</div>
	`),

	regions: {
		spaces: {
			el: '.spaces',
			replaceElement: true
		},
		dock: {
			el: '.dock',
			replaceElement: true
		}
	},

	settings: new DesktopSettings(),

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (!this.model) {
			this.model = application.getDirectory();
		}
		if (this.options.settings) {
			this.settings = this.options.settings;
		}

		// initialize application
		//
		application.desktop = this;
	},

	//
	// querying methods
	//

	isCurrent: function() {
		return this.$el.hasClass('is-selected');
	},

	isCurrentApp: function(appName) {
		return appName == this.getCurrentApp().getApp();
	},

	hasClock: function() {
		return this.settings.has('show_clock') &&
			(this.settings.get('show_day') ||
			this.settings.get('show_date') ||
			this.settings.get('show_time'));
	},

	hasApp: function(name) {
		if (this.hasChildView('spaces')) {
			return this.getChildView('spaces').hasApp(name);
		}
	},

	hasCurrentApp: function() {
		return this.hasChildView('spaces');
	},

	isOpenableApp: function(appName, options) {

		// desktop file browser can only show home directory
		//
		if (appName == 'file_browser' && options && (options.model || options.collection)) {
			return false;
		}

		// can open if app is present but not current
		//
		return this.hasApp(appName);
	},

	//
	// getting methods
	//

	getUser: function() {
		if (this.model.has('link')) {
			return this.model.get('link').get('user');
		} else {
			return application.session.user;
		}
	},

	getAppView: function(appName) {
		let index = this.getDesktopAppNames().indexOf(appName);
		return this.getChildView('spaces').getChildViewAt(index).getChildView('body');
	},

	getPlatform: function() {
		return Browser.is_mobile? 'mobile' : 'desktop';
	},

	getApps: function(platform) {
		if (!platform) {
			platform = this.getPlatform();
		}
		return new Apps(application.apps.filter((app) => {
			return [platform, 'all'].contains(app.get('platform'));
		}));
	},

	getCurrentIndex: function() {
		if (this.hasChildView('spaces')) {
			return this.getChildView('spaces').getSelectedIndex();
		}
	},

	getCurrentApp: function() {
		if (this.hasChildView('spaces')) {
			return this.getChildView('spaces').getSelectedView();
		}
	},

	getAppViewAt: function(index) {
		return this.getChildView('spaces').getChildViewAt(index);
	},

	getActiveView: function() {
		if (this.hasCurrentApp()) {
			let appView = this.getCurrentApp();
			if (appView.modals.hasFocused()) {
				return appView.modals.getFocused();
			} else {
				return appView;
			}
		}
	},

	getDesktopAppNames: function() {
		if (application.isAdmin()) {
			return this.settings.get('admin_apps')
		} else {
			return this.settings.get('desktop_apps');
		}
	},

	getDesktopApps: function() {
		return application.apps.getByIds(this.getDesktopAppNames());
	},

	getDesktopNames: function(apps) {
		let names = [];
		for (let i = 0; i < apps.length; i++) {
			let app = application.apps.getById(apps[i]);
			if (app) {
				// names.push(app.get('alias'));
				names.push(app.get('name'));
			} else {
				names.push('?');
			}
		}
		return names;
	},

	//
	// setting methods
	//

	setApp: function(appName, done) {
		let index = this.getDesktopAppNames().indexOf(appName);
		this.getChildView('spaces').setItemNumber(index + 1);
		if (done) {
			window.setTimeout(done, 500);
		}
	},

	setAppIndex: function(index) {
		this.getChildView('spaces').setItemNumber(index + 1);
	},

	setDesktopTheme: function(desktopTheme) {
		switch (desktopTheme) {
			case 'light':
				this.$el.addClass('light');
				this.$el.removeClass('medium');
				this.$el.removeClass('dark');
				this.$el.removeClass('auto');
				ThemeSettings.loadTheme('colorful', 'light');
				ThemeSettings.loadTheme('monochrome', 'light');
				break;
			case 'medium':
				this.$el.removeClass('light');
				this.$el.addClass('medium');
				this.$el.removeClass('dark');
				this.$el.removeClass('auto');
				ThemeSettings.loadTheme('colorful', 'medium');
				ThemeSettings.loadTheme('monochrome', 'medium');
				break;
			case 'dark':
				this.$el.removeClass('light');
				this.$el.removeClass('medium');
				this.$el.addClass('dark');
				this.$el.removeClass('auto');
				ThemeSettings.loadTheme('colorful', 'dark');
				ThemeSettings.loadTheme('monochrome', 'dark');
				break;
			default:
				this.$el.removeClass('light');
				this.$el.removeClass('medium');
				this.$el.removeClass('dark');
				this.$el.addClass('auto');
				break;
		}
	},

	setLauncherStyle: function(launcherStyle) {

		// set attributes
		//
		this.launcherStyle = launcherStyle;

		// remove launcher views
		//
		switch (launcherStyle) {

			case 'taskbar':
				this.$el.find('#dock-bar').hide();
				this.$el.find('.desktop > .footer-bar').show();
				this.$el.removeClass('docked');
				break;

			case 'dock':
				this.$el.find('#dock-bar').show();
				this.$el.find('.desktop > .footer-bar').hide();
				this.$el.addClass('docked');
				break;

			default:
				this.$el.find('#dock-bar').hide();
				this.$el.find('.desktop > .footer-bar').hide();
				this.$el.removeClass('docked');
				break;
		}

		// show launcher views
		//
		this.showLaunchers(launcherStyle);
	},

	setRunMenuItems: function(runMenuItems) {
		switch (runMenuItems || 'icons') {
			case 'icons':
				this.$el.addClass('run-menu-icons');
				this.$el.removeClass('run-menu-cards');
				this.$el.removeClass('run-menu-lists');
				break;
			case 'cards':
				this.$el.removeClass('run-menu-icons');
				this.$el.addClass('run-menu-cards');
				this.$el.removeClass('run-menu-lists');
				break;
			case 'lists':
				this.$el.removeClass('run-menu-icons');
				this.$el.removeClass('run-menu-cards');
				this.$el.addClass('run-menu-lists');
				break;
		}
	},

	setRunMenuCorners: function(runMenuCorners) {
		switch (runMenuCorners) {
			case 'square':
				this.$el.removeClass('round-run-menus');
				this.$el.removeClass('rounded-run-menus');
				this.$el.removeClass('auto-run-menu-corners');
				break;
			case 'rounded':
				this.$el.addClass('rounded-run-menus');
				this.$el.removeClass('round-run-menus');
				this.$el.removeClass('auto-run-menu-corners');
				break;
			case 'round':
				this.$el.removeClass('rounded-run-menus');
				this.$el.addClass('round-run-menus');
				this.$el.removeClass('auto-run-menu-corners');
				break;
			default:
				this.$el.removeClass('rounded-run-menus');
				this.$el.removeClass('round-run-menus');
				this.$el.addClass('auto-run-menu-corners');
				break;
		}
	},

	setRunMenuAttached: function(runMenuAttached) {
		if (runMenuAttached) {
			this.$el.addClass('attached-run-menus');
		} else {
			this.$el.removeClass('attached-run-menus');
		}
	},

	setRunMenuAutohide: function(runMenuAutohide) {
		this.settings.set('run_menu_autohide', runMenuAutohide);
	},

	setTaskBarAlignment: function(taskbarAlignment) {
		switch (taskbarAlignment) {
			case 'left':
				this.$el.removeClass('task-bar-centered');
				break;
			case 'center':
				this.$el.addClass('task-bar-centered');
				break;
		}
	},

	setTaskBarHandles: function(taskBarHandles) {
		if (taskBarHandles) {
			this.$el.addClass('task-bar-handles');
		} else {
			this.$el.removeClass('task-bar-handles');
		}
	},

	setTaskBarMinimized: function(minimized) {
		if (minimized) {
			this.$el.addClass('task-bar-minimized');
		} else {
			this.$el.removeClass('task-bar-minimized');
		}
	},

	setDockTilt: function(dockTilt) {
		switch (dockTilt || 'none') {
			case 'none':
				this.$el.find('#dock-bar').removeClass('tilted-left');
				this.$el.find('#dock-bar').removeClass('tilted-right');
				break;
			case 'left':
				this.$el.find('#dock-bar').addClass('tilted-left');
				this.$el.find('#dock-bar').removeClass('tilted-right');
				break;
			case 'right':
				this.$el.find('#dock-bar').removeClass('tilted-left');
				this.$el.find('#dock-bar').addClass('tilted-right');
				break;
		}
	},

	setDockCorners: function(dockCorners) {
		switch (dockCorners) {
			case 'square':
				this.$el.find('#dock-bar').removeClass('round');
				this.$el.find('#dock-bar').removeClass('rounded');
				this.$el.find('#dock-bar').removeClass('auto-corners');
				break;
			case 'rounded':
				this.$el.find('#dock-bar').addClass('rounded');
				this.$el.find('#dock-bar').removeClass('round');
				this.$el.find('#dock-bar').removeClass('auto-corners');
				break;
			case 'round':
				this.$el.find('#dock-bar').removeClass('rounded');
				this.$el.find('#dock-bar').addClass('round');
				this.$el.find('#dock-bar').removeClass('auto-corners');
				break;
			default:
				this.$el.find('#dock-bar').removeClass('rounded');
				this.$el.find('#dock-bar').removeClass('round');
				this.$el.find('#dock-bar').addClass('auto-corners');
				break;
		}
	},

	setDockAttached: function(dockAttached) {
		if (dockAttached) {
			this.$el.find('#dock-bar').addClass('attached');
		} else {
			this.$el.find('#dock-bar').removeClass('attached');
		}
	},

	setSideBarTransparency: function(transparency) {
		switch (transparency || 'opaque') {
			case 'opaque':
				this.$el.addClass('opaque-sidebars');
				this.$el.removeClass('transparent-sidebars');
				this.$el.removeClass('translucent-sidebars');
				this.$el.removeClass('auto-sidebars');
				break;
			case 'transparent':
				this.$el.removeClass('opaque-sidebars');
				this.$el.addClass('transparent-sidebars');
				this.$el.removeClass('translucent-sidebars');
				this.$el.removeClass('auto-sidebars');
				break;
			case 'translucent':
				this.$el.removeClass('opaque-sidebars');
				this.$el.removeClass('transparent-sidebars');
				this.$el.addClass('translucent-sidebars');
				this.$el.removeClass('auto-sidebars');
				break;
			default:
				this.$el.removeClass('opaque-sidebars');
				this.$el.removeClass('transparent-sidebars');
				this.$el.removeClass('translucent-sidebars');
				this.$el.addClass('auto-sidebars');
				break;
		}
	},

	setSideBarPanels: function(sidebarPanels) {
		switch (sidebarPanels) {
			case 'show':
			case true:
				this.$el.addClass('sidebar-panels');
				this.$el.removeClass('auto-sidebar-panels');
				break;
			case 'hide':
			case false:
				this.$el.removeClass('sidebar-panels');
				this.$el.removeClass('auto-sidebar-panels');
				break;
			case 'auto':
				this.$el.removeClass('sidebar-panels');
				this.$el.addClass('auto-sidebar-panels');
				break;
		}
	},

	setShowAppName: function(showAppName) {
		if (showAppName) {
			this.$el.removeClass('hide-app-name');
		} else {
			this.$el.addClass('hide-app-name');
		}
	},

	setShowClock: function(showClock) {
		if (showClock) {
			this.$el.removeClass('hide-clock');
		} else {
			this.$el.addClass('hide-clock');
		}
	},

	setShowTrashInCorner: function(showTrashInCorner) {
		if (showTrashInCorner) {
			this.$el.addClass('show-trash-in-corner');
		} else {
			this.$el.removeClass('show-trash-in-corner');
		}
	},

	setShowAppInfo: function(showAppInfo) {
		if (showAppInfo) {
			this.$el.removeClass('hide-app-info');
		} else {
			this.$el.addClass('hide-app-info');
		}
	},

	setBackgroundPicture: function(imageFile) {
		this.settings.save({
			background_image: imageFile.get('path'),
			background_size: 'cover'
		});
	},

	//
	// ajax methods
	//

	fetchSettings: function(options) {

		// load settings by user
		//
		this.settings.fetchByUser(this.getUser(), {

			// callbacks
			//
			success: (model) => {

				// apply desktop settings
				//
				this.settings.apply(this);

				// perform callback
				//
				if (options && options.success) {
					options.success(model);
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not load desktop settings.",
					response: response
				});
			}
		});
	},

	//
	// focusing methods
	//

	focus: function() {
		if (this.hasCurrentApp()) {
			this.getCurrentApp().focus();
		}
	},

	blur: function() {
		if (this.hasCurrentApp()) {
			this.getCurrentApp().blur();
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.fetchSettings({

			// callbacks
			//
			success: () => {
				this.showDesktopSpaces();
			}
		});
	},

	showDesktopSpaces: function() {
		this.collection = this.getDesktopApps();
		this.showAppsBar();
		this.showSpaces();
		this.showLaunchers(this.settings.get('launcher_style'));
	},

	showAppsBar: function() {
		let desktopAppNames = this.getDesktopAppNames();
		let multipleDesktops = desktopAppNames && desktopAppNames.length > 1;
		if (multipleDesktops) {
			if (application.hasChildView('header') &&
				application.getChildView('header').showAppsBar) {
				application.getChildView('header').showAppsBar(desktopAppNames, {
					names: this.getDesktopNames(desktopAppNames),
					current: desktopAppNames[0]
				});
			}
		}
	},

	showClock: function() {
		this.getCurrentApp().showClock();
	},

	showSpaces: function() {
		this.showChildView('spaces', new SpacesView({
			model: this.model,
			collection: this.collection,

			// options
			//
			index: 0,
			parent: this,

			// callbacks
			//
			onchange: () => this.onChange(),
			onscroll: (amount) => this.onScroll(amount),
			onsettle: () => this.onSettle()
		}));
	},

	showLaunchers: function(launcherStyle) {

		// show dock
		//
		if (launcherStyle == 'dock') {
			if (!this.hasChildView('dock')) {
				this.showDock();
			}
		}

		// update spaces
		//
		if (this.hasChildView('spaces')) {
			this.getChildView('spaces').showLaunchers(launcherStyle);
		}
	},

	showDock: function() {
		let apps = this.getDesktopAppNames();

		// show dock
		//
		this.showChildView('dock', new DockView({
			show_app_icons: apps.length > 0 && apps[0] != 'app_launcher'
		}));
	},

	parallaxShiftModals: function() {

		// check for desktop spaces
		//
		if (!this.hasChildView('spaces')) {
			return;
		}

		// get desktop slide offset
		//
		let offset = this.getChildView('spaces').getSlideOffset();
		if (!offset) {
			return;
		}

		// add parallax shift to modals
		//
		let modalsView = application.desktop.getCurrentApp().modals;
		modalsView.setStackedOffset(offset);
	},

	show: function(view, options) {
		let app = this.getCurrentApp();
		let dialog = view.opener? view.opener.dialog : null;
		let isMaximized = dialog? dialog.isMaximized() : false;

		if (app && !isMaximized) {

			// show modal in desktop's modals
			//
			app.modals.show(view, options);

			// blur desktop app
			//
			app.blur();
		} else {

			// show modal in global modals
			//
			application.showModal(view, options);
		}
	},

	update: function() {
		if (this.hasChildView('spaces')) {
			this.getChildView('spaces').update();
		}
	},

	updateAppsBar: function() {
		if (application.hasChildView('header apps')) {
			application.getChildView('header apps').setCurrentIndex(this.getCurrentIndex());
		}
	},

	loadApp: function(appName) {
		if (this.hasCurrentApp()) {
			this.getCurrentApp().loadAppView(appName);
		}
	},

	//
	// event handling methods
	//

	onLoad: function() {
		if (this.hasActiveView() && this.getActiveView().onLoad) {
			this.getActiveView().onLoad();
		}
	},

	onChange: function() {

		// update header
		//
		this.updateAppsBar();

		// update current modal
		//
		$('.modals.current').removeClass('current');
		this.getCurrentApp().modals.$el.addClass('current');
	},

	//
	// slider event handling methods
	//

	onScroll: function(amount) {
		if (Math.abs(amount) < 0.5) {
			this.scroll = amount;
		}

		// add parallax shift
		//
		if (application.settings.desktop.get('show_dialog_parallax_shift')) {
			this.parallaxShiftModals();
		}
	},

	onSettle: function() {

		// update apps bar
		//
		let index = this.getCurrentIndex();
		if (application.getChildView('header').hasChildView('apps')) {
			application.getChildView('header').getChildView('apps').setCurrentIndex(index);
		}

		// update current modal
		//
		$('.modals.current').removeClass('current');
		if (this.hasCurrentApp()) {
			this.getCurrentApp().modals.$el.addClass('current');
		}
	},

	//
	// window event handling methods
	//

	onResize: function(event) {
		this.getChildView('spaces').onResize(event);
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		this.getCurrentApp().onKeyDown(event);
	}
}));