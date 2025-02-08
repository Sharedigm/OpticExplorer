/******************************************************************************\
|                                                                              |
|                              edit-menu-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying help dropdown menus.                    |
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
	// methods
	//

	onClickCut: function() {
		this.parent.app.cut();
		this.setItemEnabled('paste');
		this.onChange();
	},

	onClickCopy: function() {
		this.parent.app.copy();
		this.setItemEnabled('paste');
	},

	onClickPaste: function() {
		this.parent.app.paste();
		this.onChange();
	},

	onClickDelete: function() {
		this.parent.app.delete();
		this.onChange();
	},
});