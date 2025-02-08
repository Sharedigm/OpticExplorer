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
		'click .cut': 'onClickCut',
		'click .copy': 'onClickCopy',
		'click .paste': 'onClickPaste',
		'click .delete': 'onClickDelete'
	},

	//
	// querying methods
	//

	disabled: function() {
		return {
			'cut': true,
			'copy': true,
			'paste': application.clipboard == undefined,
			'delete': true		
		};
	},

	//
	// mouse event handling methods
	//

	onClickCut: function() {
		this.parent.app.cut();
		this.setItemEnabled('paste');
	},

	onClickCopy: function() {
		this.parent.app.copy();
		this.setItemEnabled('paste');
	},

	onClickPaste: function() {
		this.parent.app.paste();
	},

	onClickDelete: function() {
		this.parent.app.delete();
	},

	//
	// selection event handling methods
	//

	onSelect: function() {
		this.setItemsDisabled([
			'cut', 'copy', 'delete'
		], false);
	},

	onDeselect: function() {
		this.setItemsDisabled([
			'cut', 'copy', 'delete'
		], true);
	}
});