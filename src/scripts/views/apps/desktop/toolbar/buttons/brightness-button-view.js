/******************************************************************************\
|                                                                              |
|                          brightness-button-view.js                           |
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

import ButtonView from '../../../../../views/apps/common/toolbars/buttons/button-view.js';
import TimeUtils from '../../../../../utilities/time/time-utils.js';
import Browser from '../../../../../utilities/web/browser.js';

export default ButtonView.extend({

	//
	// attributes
	//
	
	template: '<i class="fa fa-adjust"></i>',

	//
	// setting methods
	//

	setIcon: function(brightness) {

		// set button icon
		//
		switch (brightness) {
			case 'light':
				this.$el.html('<i class="fa fa-circle"></i>');
				break;
			case 'medium':
				this.$el.html('<i class="fa fa-adjust"></i>');
				break;
			case 'dark':
				this.$el.html('<i class="far fa-circle"></i>');
				break;
		}
	},

	setBrightness: function(brightness) {

		// set button icon
		//
		// this.setIcon(brightness);

		// set brightness
		//
		application.settings.theme.setCurrentTheme(brightness);

		// make brightness setting persistent
		//
		this.saveBrightness(brightness);
	},

	//
	// saving methods
	//

	saveBrightness: function(brightness) {
		switch (TimeUtils.getTimeOfDay()) {
			case 'day':
				application.settings.theme.saveValue('day_theme', brightness);
				break;
			case 'night':
				application.settings.theme.saveValue('night_theme', brightness);
				break;
		}			
	},

	//
	// rendering methods
	//

	onRender: function() {

		// add tooltip info
		//
		this.$el.attr({
			'data-toggle': 'tooltip',
			'title': 'Brightness'
		});
	},

	//
	// mouse event methods
	//

	onClick: function() {
		switch (application.settings.theme.getCurrentTheme()) {
			case 'light':
				this.setBrightness('medium');
				break;
			case 'medium':
				this.setBrightness('dark');
				break;
			case 'dark':
				this.setBrightness('light');
				break;
			case 'auto':
				this.setBrightness(Browser.isDarkModeEnabled()? 'medium' : 'dark');
				break;
		}
	}
});