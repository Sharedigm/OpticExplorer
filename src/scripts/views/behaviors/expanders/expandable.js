/******************************************************************************\
|                                                                              |
|                                  expandable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of view behavior for collapsing / expanding.      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Browser from '../../../utilities/web/browser.js';

export default {

	//
	// attributes
	//
	className: 'expandable',
	
	events: {

		// mouse events
		//
		'click .expander': 'onClickExpander',

		// touch events
		//
		'tap .expander': 'onTapExpander'
	},

	//
	// querying methods
	//

	isExpanded: function() {
		return this.$el.hasClass('expanded');
	},

	isCollapsed: function() {
		return !this.$el.hasClass('expanded');
	},

	//
	// collapsing methods
	//

	expand: function(options) {
		this.$el.addClass('expanded');

		if (options && options.recursive) {
			this.$el.find('.expandable').addClass('expanded');
		}

		// play 'expand' sound
		//
		application.play('expand');
	},

	collapse: function(options) {
		this.$el.removeClass('expanded');

		if (options && options.recursive) {
			this.$el.find('.expandable').removeClass('expanded');
		}

		// play 'collapse' sound
		//
		application.play('collapse');
	},

	toggleCollapse: function(options) {
		if (!this.isExpanded()) {
			this.expand(options);
		} else {
			this.collapse(options);
		}
	},

	//
	// mouse event handling methods
	//

	onClickExpander: function(event) {

		// skip mouse events if touch enabled
		//
		if (Browser.is_touch_enabled) {
			return;
		}

		this.toggleCollapse();

		// block event from parent
		//
		this.block(event);
	},

	//
	// touch event handling methods
	//

	onTapExpander: function(event) {

		// skip touch events if not touch enabled
		//
		if (!Browser.is_touch_enabled) {
			return;
		}

		this.toggleCollapse();

		// play tap sound
		//
		application.play('tap');

		// block event from parent
		//
		this.block(event);		
	}
};
