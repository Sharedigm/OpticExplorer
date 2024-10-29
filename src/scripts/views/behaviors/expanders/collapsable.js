/******************************************************************************\
|                                                                              |
|                                  collapsable.js                              |
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

export default {

	//
	// attributes
	//
	className: 'collapsable',
	
	events: {

		// mouse events
		//
		'click .expander': 'onClickExpander',
		'mousedown .expander': 'onMouseDownExpander',

		// touch events
		//
		'tap .expander': 'onTapExpander'
	},

	//
	// querying methods
	//

	isCollapsed: function() {
		return this.$el.hasClass('collapsed');
	},

	isExpanded: function() {
		return !this.$el.hasClass('collapsed');
	},

	//
	// collapsing methods
	//

	collapse: function(options) {
		this.$el.addClass('collapsed');

		if (options && options.recursive) {
			this.$el.find('.collapsable').addClass('collapsed');
		}

		// play 'collapse' sound
		//
		application.play('collapse');
	},

	expand: function(options) {
		this.$el.removeClass('collapsed');

		if (options && options.recursive) {
			this.$el.find('.collapsable').removeClass('collapsed');
		}

		// play 'expand' sound
		//
		application.play('expand');
	},

	toggleCollapse: function(options) {
		if (this.isCollapsed()) {
			this.expand(options);
		} else {
			this.collapse(options);
		}
	},

	//
	// mouse event handling methods
	//

	onClickExpander: function(event) {
		this.toggleCollapse();

		// block event from parent
		//
		this.block(event);
	},

	onMouseDownExpander: function(event) {
		this.toggleCollapse();

		// block event from parent
		//
		this.block(event);		
	},

	//
	// touch event handling methods
	//

	onTapExpander: function(event) {
		this.toggleCollapse();

		// block event from parent
		//
		this.block(event);		
	}
};
