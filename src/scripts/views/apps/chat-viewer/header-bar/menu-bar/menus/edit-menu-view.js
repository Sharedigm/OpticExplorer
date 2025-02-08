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

import EditMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/edit-menu-view.js';

export default EditMenuView.extend({

	//
	// attributes
	//

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
		let hasChat = this.parent.app.collection.length > 0;
		let hasSelectedMessage = hasChat && this.parent.app.hasSelectedMessage();

		return {
			'edit': hasSelectedMessage,
			'delete': hasSelectedMessage
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