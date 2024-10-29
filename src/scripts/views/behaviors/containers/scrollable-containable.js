/******************************************************************************\
|                                                                              |
|                          scrollable-containable.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a scrolling behavior for containers.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Scrollable from '../../../views/behaviors/layout/scrollable.js';

export default _.extend({}, Scrollable, {

	//
	// getting methods
	//

	getScrollPosition: function() {
		let scroll = this.getScroll();

		// find child dimensions
		//
		let child = this.$el.find(':first-child');
		let childWidth = child.width();
		let childHeight = child.height();

		// find view dimensions
		//
		let width = this.$el.width();
		let height = this.$el.height();

		// compute scroll position
		//
		let left = 0.5;
		let top = 0.5;
		if (childWidth > width) {
			left = (width / 2 + scroll.left) / childWidth;
		}
		if (childHeight > height) {
			top = (height / 2 + scroll.top) / childHeight;
		}

		// return scroll position
		//
		return {
			left: left,
			top: top
		};
	},

	//
	// setting methods
	//

	setScrollPosition: function(position) {

		// find child dimensions
		//
		let child = this.$el.find(':first-child');
		let childWidth = child.width();
		let childHeight = child.height();

		// find view dimensions
		//
		let width = this.$el.width();
		let height = this.$el.height();

		// compute scroll
		//
		let left = 0;
		let top = 0;
		if (childWidth > width) {
			left = (childWidth * position.left) - (width / 2);
		}
		if (childHeight > height) {
			top = (childHeight * position.top) - (height / 2);
		}

		// set scrollbars
		//
		this.scrollTo({
			left: left,
			top: top
		});
	}
});