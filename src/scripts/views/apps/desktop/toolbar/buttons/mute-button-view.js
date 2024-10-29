/******************************************************************************\
|                                                                              |
|                              mute-button-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a particular type of toolbar button.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ButtonView from '../../../../../views/apps/common/toolbars/buttons/toggle-button-view.js';

export default ButtonView.extend({

	//
	// attributes
	//
	
	template: '<i class="fa fa-volume-up"></i>',

	//
	// rendering methods
	//

	onRender: function() {
		this.update();
	},

	setIcon: function(muted) {

		// set button icon
		//
		if (muted) {

			// change icon to muted
			//
			this.$el.find('i').removeClass('fa-volume-mute').addClass('fa-volume-up');
		} else {

			// change icon to unmuted
			//
			this.$el.find('i').removeClass('fa-volume-up').addClass('fa-volume-mute');
		}
	},

	setTooltips: function(tooltip) {
		this.removeTooltips();

		// add tooltip info
		//
		this.$el.attr({
			'data-toggle': 'tooltip',
			'title': tooltip,
			'data-original-title':  tooltip
		});
	},

	update: function() {
		let muted = application.getMuted();

		// set icon
		//
		this.setIcon(!muted);

		// set tooltips
		//
		this.setTooltips(!muted? 'Mute' : 'Unmute');
	},

	//
	// mouse event methods
	//

	onClick: function() {
		let muted = application.getMuted();
		application.setMuted(!muted);
		this.update();
		this.showTooltips();
	}
});