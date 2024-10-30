/******************************************************************************\
|                                                                              |
|                          fit-materials-button-view.js                        |
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
	
	template: '<i class="fa fa-gem"></i>',

	//
	// mouse event handling methods
	//

	onClick: function() {
		let appView = this.getParentView('app');
		let viewport = appView.getActiveViewport();
		let offset = viewport.getMarkersCenter() || new Vector2(0, 0);
		let scale = viewport.getMarkersScale() || 1;
		this.getParentView('app').transformTo(offset.scaledBy(-viewport.pixelsPerMillimeter), scale);
	}
});
