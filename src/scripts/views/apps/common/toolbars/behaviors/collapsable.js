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
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// attributes
	//

	events: {
		'click #expand': 'onClickExpand',
		'click #collapse': 'onClickCollapse'
	},

	//
	// querying methods
	//

	isCollapsed: function() {
		return this.$el.hasClass('collapsed');
	},

	//
	// collapsing methods
	//

	collapse: function() {

		// clear width / height
		//
		this.$el.attr('style', '');

		// collapse toolbar
		//
		this.$el.addClass('collapsed');

		// update collapse icon
		//
		this.$el.find('#collapse').hide();
		this.$el.find('#expand').show();

		// play 'collapse' sound
		//
		application.play('collapse');
	},

	expand: function() {

		// clear width / height
		//
		this.$el.attr('style', '');

		// expand toolbar
		//
		this.$el.removeClass('collapsed');

		// update collapse icon
		//
		this.$el.find('#collapse').show();
		this.$el.find('#expand').hide();

		// play 'expand' sound
		//
		application.play('expand');
	},

	toggleCollapse: function() {
		if (this.isCollapsed()) {
			this.expand();
		} else {
			this.collapse();
		}
	},

	//
	// mouse event handling methods
	//

	onClickCollapse: function(event) {
		this.collapse();
		event.stopPropagation();
	},

	onClickExpand: function(event) {
		this.expand();
		event.stopPropagation();
	}
};
