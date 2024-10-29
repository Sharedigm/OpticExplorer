/******************************************************************************\
|                                                                              |
|                              select-menu-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying file dropdown menus.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SelectMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/select-menu-view.js';

export default SelectMenuView.extend({

	//
	// attributes
	//

	template: template(`
		<li role="presentation">
			<a class="select-first"><i class="fa fa-fast-backward"></i>First<span class="shortcut">up arrow</span></a>
		</li>
		
		<li role="presentation">
			<a class="select-prev"><i class="fa fa-backward"></i>Prev<span class="shortcut">left arrow</span></a>
		</li>
		
		<li role="presentation">
			<a class="select-next"><i class="fa fa-forward"></i>Next<span class="shortcut">right arrow</span></a>
		</li>
		
		<li role="presentation">
			<a class="select-last"><i class="fa fa-fast-forward"></i>Last<span class="shortcut">down arrow</span></a>
		</li>
	`),

	events: {
		'click .select-first': 'onClickSelectFirst',
		'click .select-prev': 'onClickSelectPrev',
		'click .select-next': 'onClickSelectNext',
		'click .select-last': 'onClickSelectLast'
	},
	
	//
	// mouse event handling methods
	//

	onClickSelectFirst: function() {
		this.parent.app.select('first');
	},

	onClickSelectPrev: function() {
		this.parent.app.select('prev');
	},

	onClickSelectNext: function() {
		this.parent.app.select('next');
	},

	onClickSelectLast: function() {
		this.parent.app.select('last');
	}
});