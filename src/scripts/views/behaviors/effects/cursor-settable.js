/******************************************************************************\
|                                                                              |
|                            cursor-settable.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of behavior for setting cursors.                  |
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
	// setting methods
	//

	setCursor: function(cursor) {
		this.$el.css('cursor', cursor);
	},

	resetCursor: function() {
		this.$el.css('cursor', '');
	},
};