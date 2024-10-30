/******************************************************************************\
|                                                                              |
|                            colors-button-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a particular type of toolbar button.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ButtonView from '../../../../../../../views/apps/common/toolbars/buttons/button-view.js';

export default ButtonView.extend({

	//
	// attributes
	//
	
	template: template(`
		<i class="fa fa-palette"></i>
	`),

	//
	// querying methods
	//

	next: function(colorScheme) {
		switch (colorScheme) {
			case 'monochrome':
				return 'standard';
			case 'standard':
				return 'colorful';
			case 'colorful':
				return 'vibrant';
			case 'vibrant':
				return 'monochrome';
		}
	},

	//
	// mouse event handling methods
	//

	onClick: function() {
		/*
		let current = this.parent.app.preferences.get('scheme');

		// perform action
		//
		this.parent.app.setOption('scheme', this.next(current));
		*/

		this.parent.app.getChildView('header menu view').onClickNextScheme();
	}
});