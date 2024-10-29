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

import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';

export default MenuView.extend({

	//
	// attributes
	//

	template: template(`
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
			<a class="delete"><i class="fa fa-trash-alt"></i>Delete<span class="shortcut"><i class="fa fa-caret-square-o-left" style="margin-right:0;"></i></span></a>
		</li>
	`),

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