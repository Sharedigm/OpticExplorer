/******************************************************************************\
|                                                                              |
|                               find-menu-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying find dropdown menus.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FindMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/find-menu-view.js';

export default FindMenuView.extend({

	//
	// attributes
	//

	events: {
		'click .find': 'onClickFind',
		'click .find-next': 'onClickFindNext',
		'click .find-prev': 'onClickFindPrev',
		'click .find-replace': 'onClickFindReplace',
		'click .replace-next': 'onClickReplaceNext',
		'click .replace-prev': 'onClickReplacePrev',
	},

	//
	// querying methods
	//

	disabled: function() {
		return {
			'find-next': true,
			'find-prev': true,
			'replace-next': true,
			'replace-prev': true,
			'find-in-files': true,
			'find-replace-in-files': true
		};
	},

	//
	// mouse event handling methods
	//

	onClickFind: function() {
		this.parent.app.showFindDialog();
	},

	onClickFindNext: function() {
		this.parent.app.findNext();
	},

	onClickFindReplace: function() {
		this.parent.app.showFindReplaceDialog();
	},

	onClickReplaceNext: function() {
		this.parent.app.replaceNext();
	}
});