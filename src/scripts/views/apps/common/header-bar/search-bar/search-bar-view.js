/******************************************************************************\
|                                                                              |
|                                search-bar-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching files.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ToolbarView from '../../../../../views/apps/common/toolbars/toolbar-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="searches"></div>
	`),

	regions: {
		searches: {
			el: '.searches',
			replaceElement: true
		}
	},

	//
	// setting methods
	//

	setVisible: function(visible) {
		if (visible) {
			this.$el.closest('.search-bar').removeClass('hidden');
		} else {
			this.$el.closest('.search-bar').addClass('hidden')
		}
	},

	//
	// rendering methods
	//

	clear: function() {
		this.getRegion('searches').empty();
	},

	onAttach: function() {

		// hide / show search bar
		//
		this.setVisible(this.options.kind != undefined);
	}
});