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

import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';

export default MenuView.extend({

	//
	// attributes
	//

	template: template(`
		<li role="presentation">
			<a class="add-material"><i class="fa fa-plus"></i>Add<span class="command shortcut">E</span></a>
		</li>
		
		<li role="presentation">
			<a class="edit-material"><i class="fa fa-pencil"></i>Edit<span class="shift command shortcut">E</span></a>
		</li>

		<li role="separator" class="divider"></li>

		<li role="presentation">
			<a class="cut"><i class="fa fa-cut"></i>Cut<span class="command shortcut">X</span></a>
		</li>
		
		<li role="presentation">
			<a class="copy"><i class="fa fa-copy"></i>Copy<span class="command shortcut">C</span></a>
		</li>
		
		<li role="presentation">
			<a class="paste"><i class="fa fa-paste"></i>Paste<span class="command shortcut">V</span></a>
		</li>
		
		<li role="presentation">
			<a class="put"><i class="fa fa-file-arrow-down"></i>Put<span class="shift command shortcut">V</span></a>
		</li>
		
		<li role="presentation">
			<a class="delete"><i class="fa fa-trash-alt"></i>Delete<span class="shortcut">delete</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="clear-clipboard"><i class="fa fa-xmark"></i>Clear Clipboard</a>
		</li>
	`),
	
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