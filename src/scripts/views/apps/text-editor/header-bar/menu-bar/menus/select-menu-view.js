/******************************************************************************\
|                                                                              |
|                              select-menu-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying select dropdown menus.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SelectMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/select-menu-view.js';

export default SelectMenuView.extend({

	//
	// attributes
	//

	events: {
		'click .select-all': 'onClickSelectAll',
		'click .select-word': 'onClickSelectWord',
		'click .select-line': 'onClickSelectLine',
		'click .select-paragraph': 'onClickSelectParagraph',
		'click .select-before': 'onClickSelectBefore',
		'click .select-after': 'onClickSelectAfter',
		'click .select-range': 'onClickSelectRange'
	},

	//
	// mouse event handling methods
	//

	onClickSelectAll: function() {
		this.parent.app.select('all');
	},

	onClickSelectWord: function() {
		this.parent.app.select('word');
	},

	onClickSelectLine: function() {
		this.parent.app.select('line');
	},

	onClickSelectParagraph: function() {
		this.parent.app.select('paragraph');
	},

	onClickSelectBefore: function() {
		this.parent.app.select('before');
	},

	onClickSelectAfter: function() {
		this.parent.app.select('after');
	},

	onClickSelectRange: function() {
		this.parent.app.selectRange();
	}
});