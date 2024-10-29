/******************************************************************************\
|                                                                              |
|                                  tabbed.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app with tabs for multiple content views.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// querying methods
	//

	hasTabs: function() {
		if (this.hasChildView('content')) {
			return this.getChildView('content').hasTabs();
		}
	},

	hasMultipleTabs: function() {
		if (this.hasChildView('content')) {
			return this.getChildView('content').hasMultipleTabs();
		}
	},

	hasActiveView: function() {
		if (this.hasChildView('content')) {
			return this.getChildView('content').hasActiveView();
		}
	},

	hasActiveTabView: function() {
		if (this.hasChildView('content')) {
			return this.getChildView('content').hasActiveTabView();
		}
	},

	hasActivePaneView: function() {
		if (this.hasChildView('content')) {
			return this.getChildView('content').hasActivePaneView();
		}
	},

	hasSelected: function() {
		if (this.hasActiveView()) {
			return this.getActiveView().hasSelected();
		}
	},

	//
	// counting methods
	//

	numTabs: function() {
		if (this.getChildView('content')) {
			return this.getChildView('content').numTabs();
		}
	},

	//
	// getting methods
	//

	getActiveIndex: function() {
		if (this.hasActiveView()) {
			return this.getChildView('content').getActiveIndex();
		}
	},

	getActiveView: function() {
		if (this.hasActiveView()) {
			return this.getChildView('content').getActiveView();
		}
	},

	getTabView: function(index) {
		return this.getChildView('content').getTabView(index);
	},

	getActiveTabView: function() {
		if (this.hasActiveTabView()) {
			return this.getChildView('content').getActiveTabView();
		}
	},

	getPaneView: function(index) {
		return this.getChildView('content').getPaneView(index);
	},

	getActivePaneView: function() {
		if (this.hasActivePaneView()) {
			return this.getChildView('content').getActivePaneView();
		}
	},

	getModel: function() {
		if (this.hasActivePaneView()) {
			return this.getActivePaneView().model;
		}
	},

	getSelected: function() {
		if (this.hasActiveView()) {
			return this.getActiveView().getSelectedText();
		}
	},

	getValue: function() {
		if (this.hasActiveView()) {
			return this.getActiveView().getValue();
		}
	},

	//
	// setting methods
	//

	setActiveIndex: function(index) {
		if (this.hasChildView('content')) {
			this.getChildView('content').setActiveIndex(index);
		}
	},

	setValue: function(value) {
		if (this.hasActiveView()) {
			this.getActiveView().setValue(value);
		}
	},

	//
	// closing methods
	//

	closeTab: function(index) {
		this.getChildView('content').closeTab(index);
	},

	closeActiveTab: function() {
		this.closeTab(this.getActiveIndex());
	},

	//
	// tab event handling methods
	//

	onCloseTab: function() {

		// update tabs
		//
		if (this.numTabs() > 0) {

			// set first tab as active
			//
			this.setActiveIndex(this.numTabs() - 1);
		} else {

			// close application
			//
			this.close();
		}

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
	}
};