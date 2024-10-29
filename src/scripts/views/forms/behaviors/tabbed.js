/******************************************************************************\
|                                                                              |
|                               highlightable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a highlighting behavior.                                 |
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
	// getting methods
	//

	getActiveIndex: function() {
		let tabs = this.$el.find('.tab');
		let activeTab = this.$el.find('.active.tab');
		return tabs.index(activeTab);
	},

	//
	// setting methods
	//

	setActiveIndex: function(index) {
		let tabs = this.$el.find('.tab');
		let panes = this.$el.find('.tab-pane');

		if (tabs.length < index - 1) {
			return;
		}

		// set active tab
		//
		tabs.removeClass('active');
		$(tabs[index]).addClass('active');

		// set active pane
		//
		panes.removeClass('active');
		$(panes[index]).addClass('active');
	},
};