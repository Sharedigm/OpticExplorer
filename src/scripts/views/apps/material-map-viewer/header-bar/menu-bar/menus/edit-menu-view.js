/******************************************************************************\
|                                                                              |
|                               edit-menu-view.js                              |
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
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import EditMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/edit-menu-view.js';

export default EditMenuView.extend({

	//
	// attributes
	//
	
	events: {
		'click .add-material': 'onClickAddMaterial',
		'click .edit-material': 'onClickEditMaterial',
		'click .cut': 'onClickCut',
		'click .copy': 'onClickCopy',
		'click .paste': 'onClickPaste',
		'click .put': 'onClickPut',
		'click .delete': 'onClickDelete',
		'click .clear-clipboard': 'onClickClearClipboard'
	},
	
	//
	// querying methods
	//

	enabled: function() {
		let hasSelected = this.parent.app.hasSelected();
		let hasSelectedMaterials = this.parent.app.hasSelectedMaterials();
		let hasClipboardItems = this.parent.app.hasClipboardItems();

		return {
			'add-material': true,
			'edit-material': hasSelectedMaterials,
			'cut': hasSelectedMaterials,
			'copy': hasSelectedMaterials,
			'paste': hasClipboardItems,
			'put': hasClipboardItems,
			'delete': hasSelected,
			'clear-clipboard': hasClipboardItems
		};
	},

	//
	// mouse event handling methods
	//

	onClickAddMaterial: function() {
		this.parent.app.addNewMaterial();
	},

	onClickEditMaterial: function() {
		this.parent.app.editSelected();
	},

	onClickCut: function() {
		this.parent.app.cutSelected();
	},

	onClickCopy: function() {
		this.parent.app.copySelected();
	},

	onClickPaste: function() {
		this.parent.app.pasteSelected();
	},

	onClickPut: function() {
		this.parent.app.putSelected();
	},

	onClickDelete: function() {
		this.parent.app.deleteSelected();
	},

	onClickClearClipboard: function() {
		this.parent.app.clearClipboard();
	}
});