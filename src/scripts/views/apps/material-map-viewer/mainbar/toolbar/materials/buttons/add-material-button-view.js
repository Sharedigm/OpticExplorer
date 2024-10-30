/******************************************************************************\
|                                                                              |
|                          add-material-button-view.js                         |
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
	
	template: `
		<i class="fa fa-gem"></i>
	`,

	//
	// mouse event handling methods
	//

	onClick: function() {

		// perform action
		//
		this.getParentView('app').addNewMaterial();
	}
});