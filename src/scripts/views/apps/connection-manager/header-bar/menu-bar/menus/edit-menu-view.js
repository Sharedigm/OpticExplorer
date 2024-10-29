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

import Connection from '../../../../../../models/users/connections/connection.js';
import Member from '../../../../../../models/users/connections/member.js';
import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';

export default MenuView.extend({

	//
	// attributes
	//

	template: template(`
		<li role="presentation" class="delete group-option">
			<a class="edit-group"><i class="fa fa-pencil-alt"></i>Edit Group<span class="command shortcut">E</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation" class="delete connection-option">
			<a class="delete-connections"><i class="fa fa-trash-alt"></i>Delete Connections<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation" class="delete member-option">
			<a class="delete-members"><i class="fa fa-trash-alt"></i>Delete Members<span class="shortcut">delete</span></a>
		</li>
	`),

	events: {
		'click .edit-group': 'onClickEditGroup',
		'click .delete-connections': 'onClickDeleteItems',
		'click .delete-members': 'onClickDeleteItems'
	},

	//
	// querying methods
	//

	enabled: function() {
		let selected = this.parent.app.getSelectedModel();
		let hasSelectedGroup = this.parent.app.hasSelectedGroup();
		let hasSelectedMembers = selected instanceof Member;
		let hasSelectedConnections = (selected != undefined) && (selected instanceof Connection) && !hasSelectedMembers;

		return {
			'edit-group': hasSelectedGroup == true,
			'delete-connections': hasSelectedConnections,
			'delete-members': hasSelectedMembers
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