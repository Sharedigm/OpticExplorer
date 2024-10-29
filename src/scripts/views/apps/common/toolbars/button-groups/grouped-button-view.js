/******************************************************************************\
|                                                                              |
|                              grouped-button-view.js                          |
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

import SelectButtonView from '../../../../../views/apps/common/toolbars/buttons/select-button-view.js';

export default SelectButtonView.extend({

	//
	// attributes
	//

	events: {
		'mouseenter': 'onMouseEnter'
	},

	//
	// event handling methods
	//

	onMouseEnter: function() {

		// make sure that previously shown tool groups are hidden
		//
		this.parent.parent.$el.find('.tools').hide();

		// show this tool group
		//
		this.$el.parent().parent().find('.tools').show();
	}
});
