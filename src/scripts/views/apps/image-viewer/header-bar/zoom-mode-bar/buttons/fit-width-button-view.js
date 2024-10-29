/******************************************************************************\
|                                                                              |
|                            fit-width-button-view.js                          |
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

import GroupedSelectButtonView from '../../../../../../views/apps/common/toolbars/button-groups/grouped-select-button-view.js';

export default GroupedSelectButtonView.extend({

	//
	// attributes
	//
	
	template: '<i class="fa fa-arrows-left-right-to-line"></i>',

	//
	// mouse event handling methods
	//

	onClick: function() {

		// call superclass method
		//
		GroupedSelectButtonView.prototype.onClick.call(this);
		
		// perform action
		//
		this.parent.zoomTo('fit_width');
	}
});
