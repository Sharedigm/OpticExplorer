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
		'click .edit-group': 'onClickEditGroup',
		'click .delete-members': 'onClickDeleteItems'
	},

	//
	// querying methods
	//

	enabled: function() {
		let hasSelectedGroup = this.parent.app.hasSelectedGroup();
		let hasSelectedMember = this.parent.app.hasSelectedMember();

		return {
			'edit-group': hasSelectedGroup,
			'delete-members': hasSelectedMember
		};
	},

	//
	// getting methods
	//

	getSelectedModel: function() {
		if (this.parent.app.selected) {
			if (this.parent.app.selected.length > 0) {
				return this.parent.app.selected[0].model;
			} else {
				return this.parent.app.selected.model;
			}
		}
	},

	//
	// event handling methods
	//

	onChangeSelection: function() {
		this.setEnabled(this.enabled());
	},

	//
	// mouse event handling methods
	//

	onClickEditGroup: function() {
		this.parent.app.showEditGroupDialog(this.parent.app.getSelectedGroup());
	},

	onClickDeleteItems: function(event) {
		let confirm = !event.metaKey && !event.ctrlKey;
		if (this.parent.app.hasSelected()) {
			this.parent.app.deleteItems(this.parent.app.getSelectedModels(), {
				confirm: confirm
			});
		}
	}
});