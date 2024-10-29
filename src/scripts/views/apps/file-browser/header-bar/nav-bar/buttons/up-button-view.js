/******************************************************************************\
|                                                                              |
|                                 up-button-view.js                            |
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

import ButtonView from '../../../../../../views/apps/common/toolbars/buttons/button-view.js';

export default ButtonView.extend({

	//
	// attributes
	//
	
	template: '<i class="fa fa-arrow-up"></i>',

	//
	// querying methods
	//

	isEnabled: function() {
		return this.parent.app.getActiveModel().hasParent();
	},

	//
	// rendering methods
	//

	update: function() {

		// update enabled / disabled state
		//
		if (this.parent.app.hasActiveView()) {
			this.setDisabled(!this.isEnabled());
		}
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.update();
	},

	onChange: function() {
		this.update();
	},

	//
	// mouse event handling methods
	//

	onClick: function() {
		this.parent.pushDirectory(this.parent.app.getActiveModel().getParent());
	}
});
