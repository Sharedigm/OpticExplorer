/******************************************************************************\
|                                                                              |
|                                nav-bar-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a navigation toolbar.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ToolbarView from '../../../../../views/apps/common/toolbars/toolbar-view.js';
import PrevButtonView from '../../../../../views/apps/search-viewer/header-bar/nav-bar/buttons/prev-button-view.js';
import NextButtonView from '../../../../../views/apps/search-viewer/header-bar/nav-bar/buttons/next-button-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="prev" data-toggle="tooltip" title="Prev" data-placement="bottom"></div>
		<div class="next" data-toggle="tooltip" title="Next" data-placement="bottom"></div>
	`),

	regions: {
		prev: '.prev',
		next: '.next'
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ToolbarView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('prev', new PrevButtonView());
		this.showChildView('next', new NextButtonView());
	}
});
