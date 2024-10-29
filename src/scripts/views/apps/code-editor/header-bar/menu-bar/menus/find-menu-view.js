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

import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';

export default MenuView.extend({

	//
	// attributes
	//

	template: template(`
		<li role="presentation">
			<a class="find"><i class="fa fa-search"></i>Find<span class="command shortcut">F</span></a>
		</li>
		
		<li role="presentation">
			<a class="find-next"><i class="fa fa-step-forward"></i>Find Next<span class="command shortcut">G</span></a>
		</li>
		
		<li role="presentation">
			<a class="find-prev"><i class="fa fa-step-backward"></i>Find Prev<span class="shift command shortcut">G</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="find-replace"><i class="fa fa-search-plus"></i>Find / Replace<span class="shift command shortcut">F</span></a>
		</li>
		
		<li role="presentation">
			<a class="replace-next"><i class="fa fa-forward"></i>Replace / Find Next<span class="command shortcut">H</span></a>
		</li>
		
		<li role="presentation">
			<a class="replace-prev"><i class="fa fa-backward"></i>Replace / Find Prev<span class="shift command shortcut">H</span></a>
		</li>
		
		<% if (options['multi-file']) { %>
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="find-in-files"><i class="fa fa-file"></i>Find in Files</a>
		</li>
		
		<li role="presentation">
			<a class="find-replace-in-files"><i class="fa fa-file"></i>Find & Replace in Files</a>
		</li>
		<% } %>
	`),

	events: {
		'click .find': 'onClickFind',
		'click .find-next': 'onClickFindNext',
		'click .find-prev': 'onClickFindPrev',
		'click .find-replace': 'onClickFindReplace',
		'click .replace-next': 'onClickReplaceNext',
		'click .replace-prev': 'onClickReplacePrev',
	},

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options['multi-file'] == undefined) {
			this.options['multi-file'] = false;
		}
	},

	//
	// querying methods
	//

	disabled: function() {
		return {
			'find': false,
			'find-next': true,
			'find-prev': true,
			'replace-next': true,
			'replace-prev': true,
			'find-in-files': true,
			'find-replace-in-files': true	
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			options: this.options
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

	onClickFindPrev: function() {
		this.parent.app.findPrev();
	},

	onClickFindReplace: function() {
		this.parent.app.showFindReplaceDialog();
	},

	onClickReplaceNext: function() {
		this.parent.app.replaceNext();
	},

	onClickReplacePrev: function() {
		this.parent.app.replacePrev();
	},

	//
	// find / replace event handling methods
	//

	onFound: function() {
		this.setItemsDisabled([
			'find-next', 'find-prev'
		], false);
	},

	onReplaced: function() {
		this.setItemsDisabled([
			'replace-next', 'replace-prev'
		], false);
	}
});