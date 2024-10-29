/******************************************************************************\
|                                                                              |
|                        line-annotation-button-view.js                        |
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

import MouseModeButtonView from '../../../../../../views/apps/common/toolbars/buttons/mouse-mode-button-view.js';

export default MouseModeButtonView.extend({

	//
	// attributes
	//
	
	template: '<img class="svg" src="images/icons/binary/line-icon.svg">',

	//
	// activating methods
	//

	activate: function() {
	}
});
