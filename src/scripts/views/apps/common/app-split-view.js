/******************************************************************************\
|                                                                              |
|                                app-split-view.js                             |
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

import AppView from '../../../views/apps/common/app-view.js';
import SplitView from '../../../views/layout/split-view.js';

export default AppView.extend({

	//
	// attributes
	//

	regions: {
		header: {
			el: '.header-bar',
			replaceElement: true
		},
		contents: {
			el: '.contents',
			replaceElement: true
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
		'contextmenu > .body': 'onContextMenu',

		// drag and drop events
		//
		'dragenter > .body > .split-view > .mainbar': 'onDragEnter',
		'dragover > .body > .split-view > .mainbar': 'onDragOver',
		'dragleave > .body > .split-view > .mainbar': 'onDragLeave',
		'drop > .body > .split-view > .mainbar': 'onDrop'
	},

	splitSizes: [25, 75],
	minTwoColumnSize: 720,

	//
	// constructor
	//

	initialize: function() {

		// call superclass method
		//
		AppView.prototype.initialize.call(this);

		// set preferences
		//
		let preferences = Object.keys(this.preferences.attributes);
		let options = Object.keys(this.options);
		for (let i = 0; i < options.length; i++) {
			let key = options[i];
			if (preferences.includes(key)) {
				this.preferences.set(key, this.options[key]);
			}
		}

		// set attributes
		//
		this.sidebar_view_kind = this.preferences.get('sidebar_view_kind');
	},

	//
	// querying methods
	//

	isSidebarVisible: function() {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').isVisible();
		} else {
			return this.preferences.get('show_sidebar');
		}
	},

	isSideBarPanelVisible: function(name) {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').isPanelVisible(name);
		} else {
			return this.preferences.get('sidebar_panels').includes(name);
		}
	},

	hasRegion: function(name) {
		switch (name) {
			case 'sidebar':
				return this.hasRegion('contents sidebar');
			case 'mainbar':
			case 'content':
				return this.hasRegion('contents mainbar');
			default:
				return AppView.prototype.hasRegion.call(this, name);
		}
	},

	hasChildView: function(name) {
		switch (name) {
			case 'sidebar':
				return this.hasChildView('contents sidebar');
			case 'mainbar':
			case 'content':
				return this.hasChildView('contents mainbar');
			default:
				return AppView.prototype.hasChildView.call(this, name);
		}
	},
	
	//
	// getting methods
	//

	getSidebarPanels: function() {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').getPanelsVisible();
		} else {
			return this.preferences.get('sidebar_panels');
		}
	},

	getOrientation: function() {
		return $(window).width() > 600? 'horizontal' : 'vertical';
	},

	getRegion: function(name) {
		switch (name) {
			case 'sidebar':
				return this.getChildView('contents sidebar');
			case 'mainbar':
			case 'content':
				return this.getChildView('contents mainbar');
			default:
				return AppView.prototype.getRegion.call(this, name);
		}
	},

	getChildView: function(name) {
		switch (name) {
			case 'sidebar':
				return this.getChildView('contents sidebar');
			case 'mainbar':
			case 'content':
				return this.getChildView('contents mainbar');
			default:
				return AppView.prototype.getChildView.call(this, name);
		}
	},

	getToolbarView: function() {
		return this.getChildView('mainbar panes toolbar')
	},

	//
	// setting methods
	//

	setModel: function(model) {

		// update attributes
		//
		this.model = model;

		// update child views
		//
		if (this.hasChildView('contents') && this.getChildView('contents').setModel) {
			this.getChildView('contents').setModel(model);
		}

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

			//
			// mainbar options
			//

			case 'view_kind':
				this.getChildView('content').setOption(key, value);

				// update footer tile size slider
				//
				if (this.hasChildView('footer')) {
					this.getChildView('footer').onChange();
				}
				break;

			// sidebar options
			//
			case 'show_sidebar':
			case 'show_desktop_sidebar':

				// show / hide sidebar
				//
				this.setSideBarVisibility(value);
				break;

			case 'sidebar_size':
				this.getChildView('contents').setSideBarSize(value);
				break;

			case 'sidebar_min_size':
				this.getChildView('contents').setSideBarMinSize(value);
				break;

			case 'sidebar_panels':
				this.getChildView('sidebar').setPanelsVisible(value);
				break;

			// sidebar item options
			//	
			case 'sidebar_view_kind':
				this.sidebar_view_kind = value;
				this.getChildView('sidebar').setViewKind(value);
				break;

			case 'sidebar_tile_size':
				this.sidebar_tile_size = value;
				this.getChildView('sidebar').setTileSize(value);
				break;

			// window options
			//		
			case 'window_size':
				if (this.dialog) {
					this.dialog.setSize(config.defaults.dialogs.sizes[value]);
				}
				break;
	
			// other options
			//			
			default:
				if (this.hasChildView('content') && this.getChildView('content').setOption) {
					this.getChildView('content').setOption(key, value);
				}
				break;
		}

		// call superclass method
		//
		AppView.prototype.setOption.call(this, key, value);
	},

	setMainToolbarVisible: function(visible) {
		if (visible) {
			this.$el.find('.mainbar .toolbar').show();
		} else {
			this.$el.find('.mainbar .toolbar').hide();
		}
	},

	//
	// highlighting methods
	//

	highlight: function() {
		if (this.highlightable != false) {
			this.$el.find('.body > .split-view > .mainbar').addClass('highlighted');
		}
	},

	unhighlight: function() {
		if (this.highlightable != false) {
			this.$el.find('.body > .split-view > .mainbar').removeClass('highlighted');
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// set rendering options
		//
		if (this.preferences.has('sidebar_view_kind')) {
			this.options.sidebar_view_kind = this.preferences.get('sidebar_view_kind');
		}

		// call superclass method
		//
		AppView.prototype.onRender.call(this);
	},

	showContents: function() {
		this.showSplitter();

		// show / hide sidebar
		//
		if (!this.preferences || this.preferences.get('show_sidebar')) {
			this.showSideBar();
		} else {
			this.getChildView('contents').hideSideBar();
		}

		this.showContent();
	},

	showSplitter: function() {
		let orientation = this.getOrientation();

		// set split sizes from preferences
		//
		if (this.preferences && this.preferences.has('sidebar_size')) {
			let sidebarSize = this.preferences.get('sidebar_size');
			this.split_sizes = [sidebarSize, 100 - sidebarSize];
		}
		if (this.preferences && this.preferences.has('sidebar_min_size')) {
			let sidebarMinSize = this.preferences.get('sidebar_min_size');
			this.min_split_sizes = [sidebarMinSize, 0];
		}

		// show split view
		//
		this.showChildView('contents', new SplitView({
			className: 'split-view contents' + (orientation? ' ' + orientation : ''),
			orientation: orientation,
			sizes: this.split_sizes,
			min_sizes: this.min_split_sizes,
			gutter_size: application.settings.theme.get('splitter_size')
		}));
	},

	showChildView: function(name, childView) {
		switch (name) {
			case 'sidebar':
				this.showSideBar(childView);
				break;
			case 'content':
				this.showContent(childView);
				break;
			default:
				AppView.prototype.showChildView.call(this, name, childView);
		}
	},

	showSideBar: function(sidebarView) {
		if (sidebarView) {
			this.getChildView('contents').showChildView('sidebar', sidebarView);
		} else if (this.getSideBarView) {
			this.getChildView('contents').showChildView('sidebar', this.getSideBarView());	
		}
	},

	showContent: function(contentView) {
		if (contentView) {
			this.getChildView('contents').showChildView('mainbar', contentView);
		} else if (this.getContentView) {
			this.getChildView('contents').showChildView('mainbar', this.getContentView());	
		}
	},

	setSideBarVisibility: function(visiblity) {
		if (visiblity) {
			if (!this.hasChildView('sidebar')) {
				this.showSideBar();
			}
			this.getChildView('contents').showSideBar();
		} else {
			this.getChildView('contents').hideSideBar();
		}
		this.onResize();
	},

	addContentElement: function(element) {
		let mainbars = this.$el.find('.contents .mainbar');
		$(mainbars[mainbars.length - 1]).append(element);
		return element;
	},

	//
	// selection event handling methods
	//

	onSelect: function(items) {

		// call superclass method
		//
		AppView.prototype.onSelect.call(this, items);

		// handle child views
		//
		if (this.hasChildView('sidebar') && this.getChildView('sidebar').onSelect) {
			this.getChildView('sidebar').onSelect(items);
		}
	},

	onDeselect: function(items) {

		// call superclass method
		//
		AppView.prototype.onDeselect.call(this, items);

		// handle child views
		//
		if (this.hasChildView('sidebar') && this.getChildView('sidebar').onDeselect) {
			this.getChildView('sidebar').onDeselect(items);
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {

		// call superclass method
		//
		AppView.prototype.onKeyDown.call(this, event);

		// check sidebar keyboard shortcuts
		//
		if (this.hasChildView('sidebar') && this.getChildView('sidebar').onKeyDown) {
			this.getChildView('sidebar').onKeyDown(event);
		}
	},

	//
	// window event handling methods
	//

	onResize: function(event) {

		// apply to child views
		//
		if (this.hasChildView('sidebar') && this.getChildView('sidebar').onResize) {
			this.getChildView('sidebar').onResize(event);
		}
		if (this.hasChildView('mainbar') && this.getChildView('mainbar').onResize) {
			this.getChildView('mainbar').onResize(event);
		}
	},

	onMaximize: function() {
		/*
		if (options && options.full_screen && Browser.is_mobile) {
			this.getChildView('contents').hideSideBar();
		}
		*/
	},

	onUnmaximize: function() {
		/*
		if (Browser.is_mobile) {
			this.getChildView('contents').showSideBar();
		}
		*/
	}
});