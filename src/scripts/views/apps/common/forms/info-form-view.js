/******************************************************************************\
|                                                                              |
|                               info-form-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract base class for form views.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../views/forms/form-view.js';
import Tabbed from '../../../../views/forms/behaviors/tabbed.js';

export default FormView.extend(_.extend({}, Tabbed, {

	//
	// querying methods
	//

	hasTabNamed: function(tabName) {
		return this.$el.find('.' + tabName + '.tab').length > 0;
	},

	//
	// getting methods
	//

	getTabNamed: function(tabName) {
		return this.$el.find('.' + tabName + '.tab');
	},

	getPaneNamed: function(tabName) {
		return this.$el.find('.' + tabName + '.tab-pane');
	},

	getActiveTabName: function() {
		let activeTab = this.$el.find('.active.tab');
		let className = activeTab.attr('class');
		let tabName = className.replace('tab', '').replace('active', '').trim();
		return tabName;
	},

	//
	// setting methods
	//

	setActiveTabName: function(tabName) {
		if (this.hasTabNamed(tabName)) {
			this.$el.find('.active').removeClass('active');
			this.getTabNamed(tabName).addClass('active');
			this.getPaneNamed(tabName).addClass('active');
		}
	},
}));