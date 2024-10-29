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
	// rendering methods
	//

	onRender: function() {

		// update view
		//
		this.update();
	},

	update: function() {

		// update enabled / disabled state
		//
		this.setDisabled(!this.parent.app.directory || !this.parent.app.directory.hasParent());
	},

	//
	// mouse event handling methods
	//

	onClick: function() {
		this.parent.pushDirectory(this.parent.app.directory.getParent());
	}
});
