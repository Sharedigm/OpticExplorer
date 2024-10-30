/******************************************************************************\
|                                                                              |
|                      show-optical-axis-button-view.js                        |
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

import ToggleButtonView from '../../../../../../../views/apps/common/toolbars/buttons/toggle-button-view.js';

export default ToggleButtonView.extend({

	//
	// attributes
	//
	
	template: `
		<i class="fa fa-arrows-left-right"></i>
	`,

	//
	// methods
	//

	activate: function() {
		let preferences = this.options.parent.app.preferences;
		if (preferences.get('show_optical_axis')) {
			this.$el.addClass('selected');
		}
	},

	//
	// toggle methods
	//

	select: function() {

		// call superclass method
		//
		ToggleButtonView.prototype.select.call(this);

		// perform action
		//
		this.options.parent.app.setOption('show_optical_axis', true);
	},

	deselect: function() {

		// call superclass method
		//
		ToggleButtonView.prototype.deselect.call(this);

		// perform action
		//
		this.options.parent.app.setOption('show_optical_axis', false);
	}
});