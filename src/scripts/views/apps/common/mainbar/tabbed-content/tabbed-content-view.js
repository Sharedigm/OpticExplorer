/******************************************************************************\
|                                                                              |
|                             tabbed-content-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for editing code files.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import TabsView from '../../../../../views/apps/common/mainbar/tabbed-content/tabs/tabs-view.js';
import TabPanesView from '../../../../../views/apps/common/mainbar/tabbed-content/tab-panes/tab-panes-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'tabbed-content',

	template: template(`
		<div class="tabs"></div>
		<div class="tab-panes"></div>
	`),

	tabsView: TabsView,
	tabPanesView: TabPanesView,

	regions: {
		tabs: {
			el: '.tabs',
			replaceElement: false
		},
		panes: {
			el: '.tab-panes',
			replaceElement: true
		}
	},

	//
	// constructor
	//

	initialize: function() {

		// listen to collection
		//
		this.listenTo(this.collection, 'add', () => {
			this.setActiveIndex(this.collection.length - 1);
		});
	},

	//
	// querying methods
	//

	isDirty: function() {
		if (this.hasActiveView()) {
			return this.getActiveView().dirty;
		}
	},

	hasTabs: function() {
		if (this.hasChildView('tabs')) {
			return this.getChildView('tabs').hasTabs();
		}
	},

	hasMultipleTabs: function() {
		if (this.hasChildView('tabs')) {
			return this.getChildView('tabs').hasMultipleTabs();
		}
	},

	hasTabView: function(index) {
		if (this.hasChildView('tabs')) {
			return this.getChildView('tabs').hasChildViewAt(index);
		}
	},

	hasActiveTabView: function() {
		return this.hasTabView(this.getActiveIndex());
	},

	hasPaneView: function(index) {
		if (this.hasChildView('panes')) {
			return this.getChildView('panes').hasChildViewAt(index);
		}
	},

	hasActivePaneView: function() {
		return this.hasActiveTabView() && this.hasPaneView(this.getActiveIndex());
	},

	hasActiveView: function() {
		return this.hasActivePaneView() && this.getActivePaneView().hasChildView('content');
	},

	//
	// counting methods
	//

	numTabs: function() {
		if (this.hasChildView('tabs')) {
			return this.getChildView('tabs').numTabs();
		}
	},

	//
	// getting methods
	//

	getTabView: function(index) {
		if (this.hasChildView('tabs')) {
			return this.getChildView('tabs').getChildViewAt(index);
		}
	},

	getPaneView: function(index) {
		if (this.hasChildView('panes')) {
			return this.getChildView('panes').getChildViewAt(index);
		}
	},

	//
	// active tab getting methods
	//

	getActiveIndex: function() {
		if (this.hasChildView('tabs')) {
			return this.getChildView('tabs').getActiveIndex();
		}
	},

	getActiveView: function() {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().getChildView('content');
		}
	},

	getActiveTabView: function() {
		return this.getTabView(this.getActiveIndex());
	},

	getActivePaneView: function() {
		return this.getPaneView(this.getActiveIndex());
	},

	//
	// setting methods
	//

	setActiveTab: function(index) {
		this.getChildView('tabs').setActiveIndex(index);
	},
	
	setActivePane: function(index) {
		this.getChildView('panes').setActiveIndex(index);
	},

	setActiveIndex: function(index) {
		this.setActiveTab(index);
		this.setActivePane(index);

		// perform callback
		//
		if (this.options.onchangetab) {
			this.options.onchangetab(index);
		}
	},

	setDirty: function(dirty) {

		// update tab pane
		//
		this.getActiveTabView().setDirty(dirty);

		// mark tab view
		//
		this.getChildView('tabs').setDirty();
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.showTabs();
		this.showTabPanes();

		// hide tabs for embedded apps
		//
		let app = this.getParentView('app');
		if (app && app.options.show_tabs == false) {
			this.hideTabs();
		}
	},

	showTabs: function() {
		this.showChildView('tabs', new this.tabsView({
			collection: this.collection,

			// options
			//
			closeable: true,

			// callbacks
			//
			onchange: this.options.onchangetab,
			onclose: this.options.onclose
		}));
		this.getChildView('tabs').$el.addClass('inset').addClass('flush');
	},

	hideTabs: function() {
		this.$el.find('.tabs').hide();
	},

	showTabPanes: function() {
		this.showChildView('panes', new this.tabPanesView(this.options));
	},

	//
	// event handling methods
	//

	onChange: function() {
		if (this.hasActiveView()) {

			// mark pane
			//
			this.setDirty();

			// mark tab
			//
			this.getChildView('tabs').setDirty();
		}
	},

	//
	// window event handling methods
	//

	onResize: function(event) {
		if (this.hasChildView('panes')) {
			this.getChildView('panes').onResize(event);
		}
	}
});