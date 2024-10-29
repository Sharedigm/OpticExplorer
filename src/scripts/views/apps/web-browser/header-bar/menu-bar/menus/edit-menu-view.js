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
			<a class="delete"><i class="fa fa-trash-alt"></i>Delete<span class="shortcut">delete</span></a>
		</li>
	`),

	events: {
		'click .cut': 'onClickCut',
		'click .copy': 'onClickCopy',
		'click .paste': 'onClickPaste',
		'click .delete': 'onClickDelete'
	},

	//
	// mouse event handling methods
	//

	onClickCut: function() {
	},

	onClickCopy: function() {
	},

	onClickPaste: function() {
	},

	onClickDelete: function() {
	}
});