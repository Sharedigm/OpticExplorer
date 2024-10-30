/******************************************************************************\
|                                                                              |
|                          show-data-editor-button-view.js                     |
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
		<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 512 512">
			<path d="M96.251,196.001H50v-40h46.251V196.001z M96.251,236.001H50v39.998h46.251V236.001z M96.251,315.999H50v40
			h46.251V315.999z M96.251,76.001H50v40h46.251V76.001z M96.251,395.999H50v40h46.251V395.999z M136.251,76.001v40H462v-40H136.251z
			 M136.251,196.001H462v-40H136.251V196.001z M136.251,275.999H462v-39.998H136.251V275.999z M136.251,355.999H462v-40H136.251V355.999z M136.251,435.999H462v-40H136.251V435.999z"/>
		</svg>
	`,

	//
	// methods
	//

	activate: function() {
		let preferences = this.options.parent.app.preferences;
		if (preferences.get('show_data_editor')) {
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
		this.options.parent.app.setOption('show_data_editor', true);
	},

	deselect: function() {

		// call superclass method
		//
		ToggleButtonView.prototype.deselect.call(this);

		// perform action
		//
		this.options.parent.app.setOption('show_data_editor', false);
	}
});
