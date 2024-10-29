/******************************************************************************\
|                                                                              |
|                               edit-menu-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying edit dropdown menus.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ChatMessage from '../../../../../../models/chats/chat-message.js';
import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';

export default MenuView.extend({

	//
	// attributes
	//

	template: template(`
		<li role="presentation" class="chat option">
			<a class="edit message"><i class="fa fa-pencil-alt"></i>Edit Message<span class="command shortcut">E</span></a>
		</li>
		
		<li role="presentation" class="chat option">
			<a class="delete message"><i class="fa fa-trash-alt"></i>Delete Message<span class="shortcut">delete</span></a>
		</li>
	`),

	events: {

		// topic options
		//
		'click .edit': 'onClickEditItem',
		'click .delete': 'onClickDeleteItem'
	},

	//
	// querying methods
	//

	enabled: function() {
		let selected = this.parent.app.selected;
		let isMessage = selected && selected instanceof ChatMessage;
		let editable = isMessage && selected.isOwnedBy(application.session.user);

		return {
			'edit': editable,
			'delete': editable
		};
	},

	//
	// mouse event handling methods
	//

	onClickEditItem: function() {
		this.parent.app.editSelected();
	},

	onClickDeleteItem: function() {
		this.parent.app.deleteSelected();
	}
});