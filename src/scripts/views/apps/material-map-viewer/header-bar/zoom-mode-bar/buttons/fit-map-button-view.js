/******************************************************************************\
|                                                                              |
|                              fit-map-button-view.js                          |
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
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ButtonView from '../../../../../../views/apps/common/toolbars/buttons/button-view.js';
import Vector2 from '../../../../../../utilities/math/vector2.js';

export default ButtonView.extend({

	//
	// attributes
	//
	
	template: '<i class="fa fa-expand"></i>',

	//
	// mouse event handling methods
	//

	onClick: function() {
		let appView = this.getParentView('app');
		let offset = new Vector2(0, 0);
		let scale = appView.getActiveViewport().getRelativeScale();
		this.getParentView('app').transformTo(offset, scale);
	}
});
