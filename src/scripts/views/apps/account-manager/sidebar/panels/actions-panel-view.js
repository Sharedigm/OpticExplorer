/******************************************************************************\
|                                                                              |
|                             actions-panel-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a type of sidebar panel.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'actions panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-play-circle"></i>Actions</label>
		</div>
		
		<ul class="nav menu">
			<li class="delete-account"><a><i class="fa fa-minus"></i>Delete Account</a></li>
		</ul>
	`),

	events: {
		'click .delete-account a': 'onClickDeleteAccount'
	},	

	//
	// setting methods
	//

	update: function() {
		if (this.app.numSelected() == 0) {
			this.$el.find('.delete-account').addClass('disabled');
		} else {
			this.$el.find('.delete-account').removeClass('disabled');
		}
	},

	//
	// mouse event handling methods
	//

	onClickDeleteAccount: function() {
		this.app.deleteSelected();
	},

	//
	// event handling methods
	//

	onChangeSelected: function() {
		this.update();
	}
});