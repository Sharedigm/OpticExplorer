/******************************************************************************\
|                                                                              |
|                              select-button-view.js                           |
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

import ToggleButtonView from '../../../../../views/apps/common/toolbars/buttons/toggle-button-view.js';

export default ToggleButtonView.extend({

	//
	// selecting methods
	//

	select: function() {
		if (this.isSelected() || this.isDisabled()) {
			return;
		}

		// select this button
		//
		this.parent.select(this);
	},

	deselect: function() {
		if (!this.isSelected() || this.isDisabled()) {
			return;
		}

		// deselect this button
		//
		this.parent.deselect(this);
	},

	//
	// mouse event handling methods
	//

	onClick: function() {

		// select new button
		//
		this.select();
	}
});