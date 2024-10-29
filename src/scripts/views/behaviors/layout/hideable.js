/******************************************************************************\
|                                                                              |
|                                 hideable.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for hiding views.                             |
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

	isVisible: function() {
		return this.$el.is(':visible');
	},

	//
	// setting methods
	//

	setVisible: function(visibility) {
		if (visibility) {
			this.$el.removeClass('hidden');
		} else {
			this.$el.addClass('hidden');
		}
	},

	setVisibility: function(selector, visibility) {
		if (visibility) {
			this.$el.find(selector).removeClass('hidden');
		} else {
			this.$el.find(selector).addClass('hidden');
		}
	},

	//
	// rendering methods
	//

	hide: function() {
		this.$el.hide();
	},

	show: function() {
		this.$el.show();
	}
};