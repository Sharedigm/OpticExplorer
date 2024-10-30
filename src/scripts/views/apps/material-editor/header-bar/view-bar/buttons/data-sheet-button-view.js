/******************************************************************************\
|                                                                              |
|                           data-sheet-button-view.js                          |
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

import GroupedSelectButtonView from '../../../../../../views/apps/common/toolbars/button-groups/grouped-select-button-view.js';

export default GroupedSelectButtonView.extend({

	//
	// attributes
	//

	className: 'button',

	template: '<i class="fa fa-table"></i>',

	//
	// selecting methods
	//

	select: function(options) {

		// call superclass method
		//
		GroupedSelectButtonView.prototype.select.call(this);

		// perform action
		//
		if (!options || !options.silent) {
			this.parent.parent.app.setOption('view_kind', 'data_sheet');
		}
	}
});