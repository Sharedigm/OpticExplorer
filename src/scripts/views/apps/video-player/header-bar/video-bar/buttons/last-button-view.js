/******************************************************************************\
|                                                                              |
|                                last-button-view.js                           |
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
	
	template: '<i class="fa fa-fast-forward"></i>',

	//
	// rendering methods
	//

	onRender: function() {

		// set initial state
		//
		this.setDisabled(!this.parent.clipNumber || this.parent.clipNumber == this.parent.numClips || 
			!this.parent.numClips || this.parent.numClips == 1);
	},
	
	//
	// mouse event handling methods
	//

	onClick: function() {
		this.parent.app.setClipNumber(this.parent.numClips);
	}
});
