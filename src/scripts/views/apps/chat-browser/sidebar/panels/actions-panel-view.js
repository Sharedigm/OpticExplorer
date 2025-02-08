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
			<li class="new-chat"><a><i class="fa fa-plus"></i>New Chat</a></li>
		</ul>

		<ul class="nav menu">
			<li class="end-chat"><a><i class="fa fa-minus"></i>End Chat</a></li>
		</ul>
	`),

	events: {
		'click .new-chat a': 'onClickNewChat',
		'click .end-chat a': 'onClickEndChat'
	},	

	//
	// setting methods
	//

	update: function() {
		if (this.app.hasSelectedChat()) {
			this.$el.find('.end-chat').removeClass('disabled');
		} else {
			this.$el.find('.end-chat').addClass('disabled');
		}
	},

	//
	// mouse event handling methods
	//

	onClickNewChat: function() {

		// show new dialog
		//
		this.app.showChatInvitationsDialog();
	},

	onClickEndChat: function() {

		// show new dialog
		//
		this.app.endSelectedChat();
	},

	//
	// event handling methods
	//

	onChangeSelected: function() {
		this.update();
	}
});