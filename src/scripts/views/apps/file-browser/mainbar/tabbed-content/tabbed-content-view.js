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

import TabbedContentView from '../../../../../views/apps/common/mainbar/tabbed-content/tabbed-content-view.js';
import TabsView from '../../../../../views/apps/file-browser/mainbar/tabbed-content/tabs/tabs-view.js';
import TabPanesView from '../../../../../views/apps/file-browser/mainbar/tabbed-content/tab-panes/tab-panes-view.js';

export default TabbedContentView.extend({

	//
	// attributes
	//

	tabsView: TabsView,
	tabPanesView: TabPanesView,

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasActivePaneView()) {
			this.getActivePaneView().each(callback, filter, options);
		}
	},

	//
	// setting methods
	//

	setModel: function(model) {
		this.getActiveTabView().setModel(model);
		this.getActivePaneView().setModel(model);
	},

	setOption: function(key, value) {

		// apply to children
		//
		for (let i = 0; i < this.getChildView('panes').children.length; i++) {
			this.getChildView('panes').getChildViewAt(i).setOption(key, value);
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		TabbedContentView.prototype.onRender.call(this);

		// show / hide tabs
		//
		this.updateTabs();
	},

	updateTabs: function() {
		if (this.collection.length > 1) {
			this.$el.find('.tabs').show();
		} else {
			this.$el.find('.tabs').hide();
		}
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.updateTabs();
	},

	onChange: function() {
		this.updateTabs();
	},

	onCloseTab: function() {
		this.updateTabs();
	}
});