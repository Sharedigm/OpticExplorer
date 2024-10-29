/******************************************************************************\
|                                                                              |
|                                   rotatable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of view behavior for switching between            |
|        vertical and horizontal layouts.                                      |
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
		'click #horizontal': 'onClickHorizontal',
		'click #vertical': 'onClickVertical'
	},

	//
	// querying methods
	//

	isHorizontal: function() {
		return this.hasClass('horizontal');
	},

	isVertical: function() {
		return this.hasClass('vertical');
	},

	//
	// collapsing methods
	//

	toHorizontal: function() {

		// clear width / height
		//
		this.$el.attr('style', '');

		// update view
		//
		this.$el.addClass('horizontal');
		this.$el.removeClass('vertical');

		// update icon
		//
		this.$el.find('#horizontal').hide();
		this.$el.find('#vertical').show();

		// play 'collapse' sound
		//
		application.play('collapse');
	},

	toVertical: function() {

		// clear width / height
		//
		this.$el.attr('style', '');

		// update view
		//
		this.$el.removeClass('horizontal');
		this.$el.addClass('vertical');

		// update icon
		//
		this.$el.find('#horizontal').show();
		this.$el.find('#vertical').hide();

		// play 'expand' sound
		//
		application.play('expand');
	},

	toggleRotation: function() {
		if (this.isVertical()) {
			this.toHorizontal();
		} else {
			this.toVertical();
		}
	},

	//
	// mouse event handling methods
	//

	onClickHorizontal: function(event) {
		this.toHorizontal();
		event.stopPropagation();
	},

	onClickVertical: function(event) {
		this.toVertical();
		event.stopPropagation();
	}
};
