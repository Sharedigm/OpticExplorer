/******************************************************************************\
|                                                                              |
|                                   app-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying apps.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Item from '../../../models/storage/item.js';
import Directory from '../../../models/storage/directories/directory.js';
import UserPreferences from '../../../models/preferences/user-preferences.js';
import BaseView from '../../../views/base-view.js';
import Keyboard from '../../../views/keyboard/keyboard.js';
import AppDialogView from '../../../views/apps/common/dialogs/app-dialog-view.js';
import ItemDroppable from '../../../views/behaviors/drag-and-drop/item-droppable.js';
import Highlightable from '../../../views/behaviors/selection/highlightable.js';
import Timeable from '../../../views/behaviors/effects/timeable.js';
import Browser from '../../../utilities/web/browser.js';

export default BaseView.extend(_.extend({}, ItemDroppable, Highlightable, Timeable, {

	//
	// attributes
	//

	className: 'app',

	template: template(`
		<% if (show_header_bar != false) { %>
		<div class="header-bar"></div>
		<% } %>
		<div class="body">
			<input type="file" multiple style="display:none" />
			<div class="contents"></div>
			<div class="context-menu"></div>
		</div>
		<% if (show_footer_bar != false) { %>
		<div class="footer-bar"></div>
		<% } %>
	`),

	regions: {
		header: {
			el: '.header-bar',
			replaceElement: true
		},
		contents: {
			el: '.contents',
			replaceElement: false
		},
		context: {
			el: '.context-menu',
			replaceElement: false
		},
		footer: {
			el: '.footer-bar',
			replaceElement: true
		}
	},

	events: {

		// mouse events
		//
		'click > .body': 'onClick',
		'dblclick > .body': 'onDoubleClick',
		'contextmenu': 'onContextMenu',

		// drag and drop events
		//
		'dragenter > .body': 'onDragEnter',
		'dragover > .body': 'onDragOver',
		'dragleave > .body': 'onDragLeave',
		'drop > .body': 'onDrop',

		// touch events
		//
		'doubletap > .body': 'onDoubleTap'
	},

	orientationChangeDelay: 100,

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.show_header_bar == undefined) {
			this.options.show_header_bar = true;
		}
		if (this.options.show_footer_bar == undefined) {
			this.options.show_footer_bar = true;
		}

		// set attributes
		//
		if (this.name) {
			this.$el.addClass(this.name.replace(/_/g, '-'));
		}
		if (this.options && this.options.dialog) {
			this.dialog = this.options.dialog;
		}

		// set dialog attributes
		//
		if (config.apps[this.name]) {
			if (!this.icon) {
				this.icon = config.apps[this.name].icon;
			}
			if (!this.title) {
				this.title = config.apps[this.name].name;
			}
			if (!this.sizes) {
				this.sizes = config.apps[this.name].sizes;
			}

			// set dialog window size
			//
			if (config.apps[this.name].window_size) {
				this.size = config.defaults.dialogs.sizes[config.apps[this.name].window_size];
			}
		}

		// set preferences
		//
		if (this.options.preferences) {
			this.preferences = this.options.preferences;
		} else {
			this.preferences = UserPreferences.create(this.name, this.options.defaults);
		}

		// increment count
		//
		let app = application.getApp(this.name);
		if (app) {
			if (app.has('count')) {
				app.set({
					count: app.get('count') + 1
				});
			} else {
				app.set({
					count: 1
				});
			}
		}
	},

	//
	// querying methods
	//

	isRoot: function() {
		return this.parent == undefined;
	},

	isHome: function() {
		return this.model && this.model instanceof Directory && this.model.isHome();
	},

	isDesktop: function() {
		return !this.dialog && this.parent && this.parent.hasParentView('desktop');
	},

	hasSpaces: function() {
		return this.isDesktop() && this.numSpaces() > 1;
	},

	isWindowed: function() {
		return !this.isDesktop();
	},

	isCompatibleWith: function(item) {
		if (item instanceof Directory) {
			return false;
		} else if (this.extensions) {
			let extensions = _.result(this, 'extensions');
			return extensions.contains(item.getFileExtension());
		} else {
			return true;
		}
	},

	isHeaderBarHidden: function() {
		return this.options.hidden && this.options.hidden['header-bar'];
	},

	isFooterBarHidden: function() {
		return this.options.hidden && this.options.hidden['footer-bar'];
	},

	hasResources: function() {
		return this.constructor.resources != undefined;
	},

	hasStatusBar: function() {
		return this.getStatusBar() != null;
	},

	hasHeaderBar: function() {
		return this.$el.find('.header-bar').length > 0 && this.getHeaderBarView;
	},

	hasFooterBar: function() {
		return this.showFooterBar != null;
	},

	numSpaces: function() {
		return this.parent.parent.numChildren();
	},

	//
	// getting methods
	//

	getApp: function() {
		return this.preferences.app;
	},

	getName: function() {
		return config.apps[this.getApp()].name;
	},

	getPageOrientation: function() {
		return this.$el.width() > this.$el.height()? 'landscape' : 'portrait';
	},

	getRoot: function() {
		let app = this;
		while (app.parent) {
			app = app.parent;
		}
		return app;
	},

	getCompatible: function(items) {
		let compatibleItems = [];
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			if (this.isCompatibleWith(item)) {
				compatibleItems.push(item);
			}
		}
		return compatibleItems;
	},

	getAppId: function() {
		if (this.preferences) {
			let app = this.preferences.app;
			if (app) {
				return app.replace('phone_', '').replace('tablet_', '');
			}
		}
	},

	getColor: function() {
		let id = this.getAppId();
		if (id) {
			return config.apps[id].color;
		}
	},

	getResources: function(name) {
		let resources = this.constructor.resources;
		if (resources) {
			if (name) {
				return resources[name];
			} else {
				return resources;
			}
		} else {
			return {};
		}
	},

	getStatusBar: function() {
		if (this.hasChildView('footer')) {
			return this.getChildView('footer status');
		} else if (this.hasParentView('desktop')) {
			return this.getParentView('desktop').getChildView('footer status');
		}
	},

	//
	// setting methods
	//

	setTitle: function(title, icon) {
		if (this.dialog) {
			this.dialog.setTitle(title, icon);
		}
	},

	setModel: function(model) {

		// update attributes
		//
		this.model = model;

		// set dialog model / title
		//
		if (this.dialog && this.dialog.setModel) {
			this.dialog.setModel(model);
		}
	},

	setOption: function(key, value) {

		// update view
		//
		switch (key) {

			// toolbar options
			//
			case "toolbars":
				this.setToolbarsVisible(value);
				break;
			case "show_toolbars":
				this.setAllToolbarsVisible(value);
				break;

			// window options
			//
			case 'window_size':
				this.dialog.setSize(config.defaults.dialogs.sizes[value]);
				break;

			// other options
			//
			default:
				if (this.hasChildView('contents') && this.getChildView('contents').setOption) {
					this.getChildView('contents').setOption(key, value);
				}
				break;
		}

		// update preferences
		//
		this.preferences.set(key, value);
	},

	setOptions: function(options) {
		for (let key in options) {
			this.setOption(key, options[key]);
		}
	},

	setLaunchOptions: function(launchOptions, preferences) {
		if (!launchOptions) {
			launchOptions = {};
		}

		// add maximized option
		//
		if (preferences.has('maximized')) {
			launchOptions.maximized = preferences.get('maximized');
		}

		// add full screen option
		//
		if (preferences.has('full_screen')) {
			launchOptions.full_screen = preferences.get('full_screen');
		}

		return launchOptions;
	},

	reset: function() {

		// reset view
		//
		if (this.initialize) {
			this.initialize();
		}

		// redraw view
		//
		this.render();
	},

	//
	// toolbar setting methods
	//

	setToolbarVisible: function(toolbar, isVisible) {
		if (this.hasChildView('header')) {
			this.getChildView('header').setToolbarVisible(toolbar, isVisible);
		}
		if (this.hasChildView('footer')) {
			this.getChildView('footer').setToolbarVisible(toolbar, isVisible);
		}
	},

	setToolbarsVisible: function(visible) {

		// show selected toolbars
		//
		if (visible.length !== undefined) {
			if (this.hasChildView('header')) {
				this.getChildView('header').setToolbarsVisible(visible);
			}
			if (this.hasChildView('footer')) {
				this.getChildView('footer').setToolbarsVisible(visible);
			}

		// show / hide all toolbars
		//
		} else {
			this.setAllToolbarsVisible(visible);
		}
	},

	setAllToolbarsVisible: function(isVisible) {
		if (isVisible) {
			this.getChildView('header').$el.removeClass('hidden-toolbars');
		} else {
			this.getChildView('header').$el.addClass('hidden-toolbars');
		}
	},

	//
	// loading methods
	//

	loadPreferences: function(options) {
		if (this.preferences && !this.preferences.loaded && application.session.user) {

			// load app preferences
			//
			this.preferences.load({

				// callbacks
				//
				success: (preferences) => {
					if (options && options.success) {
						options.success(preferences);
					}
				},

				error: () => {

					// show error message
					//
					application.error({
						message: "Could not load application preferences."
					});
				}
			});
		} else {
			if (options && options.success) {
				options.success(this.preferences);
			}
		}
	},

	//
	// launching methods
	//

	newWindow: function(options) {
		application.launch(this.name, _.extend({
			model: this.model
		}, options), {
			new_window: true
		});
	},

	launch: function(options) {
		if (!options) {
			options = {};
		}

		// open in maximized window if no desktop
		//
		if (!application.desktop) {
			options.maximized = true;
		}

		this.loadPreferences({

			// callbacks
			//
			success: (preferences) => {

				// set launch / window options
				//
				options = this.setLaunchOptions(options, preferences);

				// show app
				//
				application.show(new AppDialogView(_.extend({}, options, {
					app: this
				})));
			}
		});
	},

	//
	// highlighting methods
	//

	highlight: function() {
		if (this.highlightable != false) {
			this.$el.find('.body').addClass('highlighted');
		}
	},

	unhighlight: function() {
		if (this.highlightable != false) {
			this.$el.find('.body').removeClass('highlighted');
		}
	},

	//
	// space methods
	//

	prevSpace: function() {
		if (!this.dialog) {
			if (this.hasParentView('spaces')) {
				this.getParentView('spaces').prev(true);
			}
		}
	},

	nextSpace: function() {
		if (!this.dialog) {
			if (this.hasParentView('spaces')) {
				this.getParentView('spaces').next(true);
			}
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			show_header_bar: this.options.show_header_bar,
			show_footer_bar: this.options.show_footer_bar
		};
	},

	onRender: function() {

		// show contents region
		//
		this.showAppBars();
		this.showContents();
	},

	onAttach: function() {
		if (!this.resizable && this.size && Browser.is_mobile) {
			this.$el.addClass('fixed-size').find('.body').css({
				width: this.size[0]
			});
		}

		// add tooltip triggers
		//
		this.addTooltips();
	},

	showAppBars: function() {

		// show header bar
		//
		if (this.hasHeaderBar() && !this.isHeaderBarHidden()) {
			this.showHeaderBar();
		} else {
			this.$el.find('.header-bar').remove();
		}

		// show footer bar
		//
		if (this.hasFooterBar() && !this.isFooterBarHidden()) {
			this.showFooterBar();
		} else {
			this.$el.find('.footer-bar').remove();
		}
	},

	show: function(view) {

		// attach dialog to app
		//
		view.opener = this;
		view.parent = this;

		// show view in modal region
		//
		application.show(view, {
			parent: this.dialog
		});

		return view;
	},

	showHeaderBar: function() {
		if (this.$el.find('.header-bar').length > 0 && this.getHeaderBarView) {
			this.showChildView('header', this.getHeaderBarView());
		}
	},

	showContents: function() {
		if (this.getContentsView) {
			this.showChildView('contents', this.getContentsView());
		}
	},

	showFooterBar: function() {
		if (this.$el.find('.footer-bar').length > 0 && this.getFooterBarView) {
			this.showChildView('footer', this.getFooterBarView());
		}
	},

	//
	// dialog methods
	//

	updateHeader: function() {

		// update dialog header
		//
		if (this.dialog && this.dialog.updateHeader) {
			this.dialog.updateHeader();
		}
	},

	focus: function() {

		// focus dialog
		//
		if (this.dialog) {
			this.dialog.focus();
		} else if (this.parent && this.parent.focus) {
			this.parent.focus();
		}
	},

	blur: function() {

		// blur (unfocus) dialog
		//
		if (this.dialog) {
			this.dialog.blur();
		} else if (this.parent && this.parent.blur) {
			this.parent.blur();
		}
	},

	//
	// message rendering methods
	//

	getMessage: function(message, options) {
		let overlay = $('<div class="full-size message overlay"><div class="help message"></div></div>');
		let helpMessage = overlay.find('.help.message');
		helpMessage.html((options && options.icon? '<div class="icon">' + options.icon + '</div>': '') + message);

		// add callback
		//
		if (options && options.onclick) {
			helpMessage.on('click, tap', options.onclick);
			helpMessage.addClass('clickable');
		}

		return overlay;
	},

	addContentElement: function(element) {
		this.$el.find('.contents').append(element);
		return element;
	},

	showMessage: function(message, options) {

		// clear previous message
		//
		if (this.helpMessage) {
			this.hideMessage();
		}

		// add message to dom
		//
		this.helpMessage = this.addContentElement(this.getMessage(message, options));
	},

	hideMessage: function() {

		// remove existing message from dom
		//
		if (this.helpMessage) {
			this.helpMessage.off('click, tap');
			this.helpMessage.remove();
			this.helpMessage = null;
		}
	},

	//
	// full screen methods
	//

	toggleFullScreen: function() {
		if (this.isDesktop()) {
			application.toggleFullScreen();
		}
	},

	enterFullScreen: function() {
		if (this.isDesktop()) {
			application.requestFullScreen();
		}
	},

	exitFullScreen: function() {
		if (this.isDesktop()) {
			application.exitFullScreen();
		}
	},

	//
	// expansion methods
	//

	toggleExpansion: function() {

		// toggle window full screen
		//
		if (this.dialog) {
			if (!this.dialog.isExpanded()) {
				this.expand();
			} else {
				this.collapse();
			}
		}
	},

	expand: function() {
		if (this.dialog) {
			if (!this.dialog.isExpanded()) {
				this.dialog.maximize({
					full_screen: true
				});
			}
		}
	},

	collapse: function() {
		if (this.dialog) {
			if (this.dialog.isExpanded()) {
				this.dialog.unmaximize();
			}
		}
	},

	//
	// context menu rendering methods
	//

	showContextMenuView: function(view, location) {

		// add context menu to DOM
		//
		this.showChildView('context', view);
		this.getChildView('context').onLoad();

		// position context menu
		//
		this.getChildView('context').$el.css({
			left: location.x,
			top: location.y
		});

		// set context menu orientation
		//
		let orientation = this.getChildView('context').getMenuOrientation();
		this.getChildView('context').setMenuOrientation(orientation);
	},

	hideContextMenu: function() {
		if (this.hasChildView('context')) {
			this.getChildView('context').$el.hide();
		}
	},

	//
	// closing methods
	//

	close: function() {

		// close app dialog
		//
		if (this.dialog) {
			if (this.dialog.isMaximized() && !this.dialog.isFullScreen()) {
				this.dialog.unmaximize();
			}

			this.dialog.close();
		}

		// perform callback
		//
		if (this.options.onclose) {
			this.options.onclose();
		}
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
		
		// handle child views
		//
		if (this.hasChildView('header') && this.getChildView('header').onLoad) {
			this.getChildView('header').onLoad();
		}
		if (this.hasChildView('footer') && this.getChildView('footer').onLoad) {
			this.getChildView('footer').onLoad();
		}

		// perform callback
		//
		if (this.options.onload) {
			this.options.onload();
		}
	},

	onActivate: function() {

		// handle child views
		//
		if (this.hasChildView('header') && this.getChildView('header').onActivate) {
			this.getChildView('header').onActivate();
		}
		if (this.hasChildView('content') && this.getChildView('content').onActivate) {
			this.getChildView('content').onActivate();
		}
		if (this.hasChildView('footer') && this.getChildView('footer').onActivate) {
			this.getChildView('footer').onActivate();
		}

		// perform callback
		//
		if (this.options.onactivate) {
			this.options.onactivate();
		}
	},

	onChange: function(attribute) {

		// handle child views
		//
		if (this.hasChildView('header') && this.getChildView('header').onChange) {
			this.getChildView('header').onChange(attribute);
		}
		if (this.hasChildView('contents') && this.getChildView('contents').onChange) {
			this.getChildView('contents').onChange(attribute);
		}
		if (this.hasChildView('footer') && this.getChildView('footer').onChange) {
			this.getChildView('footer').onChange(attribute);
		}

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(attribute);
		}
	},

	onChangeOption: function() {
		if (this.hasChildView('header')) {
			this.getChildView('header').onChange();
		}

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	onSave: function() {

		// handle child views
		//
		if (this.hasChildView('header') && this.getChildView('header').onSave) {
			this.getChildView('header').onSave();
		}
		if (this.hasChildView('footer') && this.getChildView('footer').onSave) {
			this.getChildView('footer').onSave();
		}

		// perform callback
		//
		if (this.options.onsave) {
			this.options.onsave();
		}
	},

	//
	// tab event handling methods
	//

	onChangeTab: function() {

		// handle child views
		//
		if (this.hasChildView('header') && this.getChildView('header').onChangeTab) {
			this.getChildView('header').onChangeTab();
		}
		if (this.hasChildView('footer') && this.getChildView('footer').onChangeTab) {
			this.getChildView('footer').onChangeTab();
		}

		// perform callback
		//
		if (this.options.onchangetab) {
			this.options.onchangetab();
		}
	},

	onCloseTab: function() {

		// handle child views
		//
		if (this.hasChildView('header') && this.getChildView('header').onCloseTab) {
			this.getChildView('header').onCloseTab();
		}
		if (this.hasChildView('footer') && this.getChildView('footer').onCloseTab) {
			this.getChildView('footer').onCloseTab();
		}

		// perform callback
		//
		if (this.options.onclosetab) {
			this.options.onclosetab();
		}
	},

	//
	// selection event handling methods
	//

	onSelect: function(item) {

		// handle child views
		//
		if (this.hasChildView('header') && this.getChildView('header').onSelect) {
			this.getChildView('header').onSelect(item);
		}
		if (this.hasChildView('footer') && this.getChildView('footer').onSelect) {
			this.getChildView('footer').onSelect(item);
		}

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect(item);
		}
	},

	onDeselect: function(item) {

		// handle child views
		//
		if (this.hasChildView('header') && this.getChildView('header').onDeselect) {
			this.getChildView('header').onDeselect(item);
		}
		if (this.hasChildView('footer') && this.getChildView('footer').onDeselect) {
			this.getChildView('footer').onDeselect(item);
		}

		// if deselecting all
		//
		if (!item && this.isMultiSelectable && this.isMultiSelectable()) {

			// deselect multi select menu item
			//
			let selectMenu = this.getChildView('header menu select');
			if (selectMenu) {
				selectMenu.setItemSelected('select-multiple', false);
			}

			// disable multi select
			//
			this.setMultiSelectable(false);
		}

		// perform callback
		//
		if (this.options.ondeselect) {
			this.options.ondeselect(item);
		}
	},

	onChangeSelection: function() {

		// handle child views
		//
		if (this.hasChildView('header') && this.getChildView('header').onChangeSelection) {
			this.getChildView('header').onChangeSelection();
		}
		if (this.hasChildView('footer') && this.getChildView('footer').onChangeSelection) {
			this.getChildView('footer').onChangeSelection();
		}

		// perform callback
		//
		if (this.options.onchangeselection) {
			this.options.onchangeselection();
		}
	},

	//
	// mouse event handling methods
	//

	onClick: function(event) {

		// dismiss context menu
		//
		if (!event.ctrlKey && this.hasChildView('context')) {
			this.hideContextMenu();
		}
	},

	onClickExitFullScreen: function() {
		this.exitFullScreen();
	},

	onClickMessage: function() {

		// skip mouse events if touch enabled
		//
		if (Browser.is_touch_enabled) {
			return;
		}

		// perform callback
		//
		if (this.onclickmessage) {
			this.onclickmessage();
		}
	},

	onDoubleClick: function(event) {

		// exit full screen mode
		//
		if (this.dialog && this.dialog.isFullScreen()) {
			this.exitFullScreen();
		}

		// block event from parent
		//
		this.block(event);
	},

	//
	// touch event handling methods
	//

	onTapHelpMessage: function() {

		// skip touch events if not touch enabled
		//
		if (!Browser.is_touch_enabled) {
			return;
		}

		// perform callback
		//
		if (this.onclickmessage) {
			this.onclickmessage();
		}
	},

	onDoubleTap: function() {

		// exit full screen mode
		//
		if (this.dialog && this.dialog.isFullScreen()) {
			this.exitFullScreen();
		}	
	},

	//
	// drag and drop event handling methods
	//

	onDropOn: function(items) {

		// unhighlight
		//
		let content = this.getChildView('contents');
		if (content.hasChildView('content')) {
			content = content.getChildView('content');
		}
		if (content.unhighlight) {
			content.unhighlight();
		}

		// bring dialog to top and focus
		//
		if (this.dialog) {
			if (this.dialog.toTop) {
				this.dialog.toTop();
			}
			this.dialog.focus();
		}

		// open dropped items
		//
		let item = items[0];
		if (item instanceof Item) {

			// open files
			//
			let compatibleItems = this.getCompatible(items);
			if (compatibleItems.length > 0) {
				let item = compatibleItems[0];

				// play drop sound
				//
				application.play('drop');

				// open files
				//
				if (compatibleItems.length > 1 && this.openItems) {
					this.openItems(items);
				} else {
					this.openItem(item);
				}
			} else {

				// play error sound
				//
				application.play('error');	
			}
		} else {

			// open models
			//
			if (items.length > 1 && this.openModels) {
				this.openModels(items);
			} else {
				this.openModel(item);
			}
		}
	},

	//
	// context menu event handling methods
	//

	onContextMenu: function(event) {

		// do not handle context menu in debug mode
		//
		if (config.debug) {
			return;
		}

		if (this.getContextMenuView) {
			let offset = this.$el.offset();

			this.showContextMenuView(this.getContextMenuView(), {
				x: event.pageX - offset.left,
				y: event.pageY - offset.top
			});
		}

		// block event from parent
		//
		this.block(event);
	},

	//
	// window event handling methods
	//

	onResize: function(event) {

		// apply to child views
		//
		if (this.hasChildView('content') && this.getChildView('content').onResize) {
			this.getChildView('content').onResize(event);
		}
	},

	onOrientationChange: function(event) {
		if (this.onResize) {

			// resize after delay
			//
			this.setTimeout(() => {

				// update view
				//	
				this.onResize(event);
			}, this.orientationChangeDelay);
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {

		// exit full screen mode
		//
		if (event.key == 'Escape' && this.dialog && this.dialog.isMaximized()) {
			this.dialog.unmaximize();
		}

		// disregard arrow keys when editing content
		//
		if (Keyboard.arrowKeys.contains(event.keyCode) && event.target.isContentEditable) {
			return;
		}

		// check menu keyboard shortcuts
		//
		if (this.hasChildView('header menu') && this.getChildView('header menu').onKeyDown) {
			this.getChildView('header menu').onKeyDown(event);
		}

		// check content key events
		//
		if (this.hasChildView('content') && this.getChildView('content').onKeyDown) {
			this.getChildView('content').onKeyDown(event);
		}
	},

	//
	// cleanup methods
	//

	onDestroy: function() {

		// decrement count
		//
		let app = application.getApp(this.name);
		if (app) {
			if (app.has('count')) {
				app.set({
					count: app.get('count') - 1
				});
			}
		}
	}
}));