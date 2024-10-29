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
	// attributes
	//

	highlightable: true,

	//
	// querying methods
	//

	isHighlighted: function() {
		return this.$el.hasClass('highlighted');
	},

	//
	// highlighting methods
	//

	highlight: function() {
		if (this.highlightable) {
			this.$el.addClass('highlighted');
		}
	},

	unhighlight: function(recursive) {
		if (this.highlightable) {
			this.$el.removeClass('highlighted');

			if (recursive) {
				this.$el.find('.highlighted').removeClass('highlighted');
			}
		}
	},

	unhighlightSelection: function() {
		let selection = window.getSelection();
		if (selection) {
			selection.removeAllRanges();
		}
	}
};