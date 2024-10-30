/******************************************************************************\
|                                                                              |
|                          add-element-button-view.js                          |
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
		<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 50 512 562">
			<path d="m 103.6688,334.08496 c 0,119.18143 34.49617,215.79625 77.05269,215.79625 42.55265,0 77.05011,-96.61482 77.05011,-215.79625 0,-119.18143 -34.49746,-215.79625 -77.05011,-215.79625 -42.55652,0 -77.05269,96.61482 -77.05269,215.79625 z M 271.52554,168.2803 c 16.02674,44.88903 24.85413,103.77243 24.85413,165.80466 0,62.03223 -8.82739,120.91433 -24.85413,165.80466 -7.0964,19.87375 -15.48364,36.63374 -24.9957,49.99159 l 59.49057,0 c 42.55524,0 77.05269,-96.61482 77.05269,-215.79625 0,-119.18143 -34.49745,-215.79625 -77.05269,-215.79625 l -59.49057,0 c 9.51206,13.35785 17.8993,30.11654 24.9957,49.99159 z" />
		</svg>
	`,

	//
	// mouse event handling methods
	//

	onClick: function() {

		// show add element dialog
		//
		this.getParentView('app').showAddElementDialog();
	}
});