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

	template: template(`
		<li role="presentation">
			<a class="select-all"><i class="fa fa-asterisk"></i>All<span class="command shortcut">A</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="select-word"><i class="fa fa-text-width"></i>Word<span class="command shortcut">1</span></a>
		</li>
		
		<li role="presentation">
			<a class="select-line"><i class="fa fa-arrows-alt-h"></i>Line<span class="command shortcut">2</span></a>
		</li>
		
		<li role="presentation">
			<a class="select-paragraph"><i class="fa fa-paragraph"></i>Paragraph<span class="command shortcut">3</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="select-before"><i class="fa fa-long-arrow-alt-up"></i>Before<span class="command shortcut">9</span></a>
		</li>
		
		<li role="presentation">
			<a class="select-after"><i class="fa fa-long-arrow-alt-down"></i>After<span class="command shortcut">0</span></a>
		</li>
		
		<li role="presentation">
			<a class="select-range"><i class="fa fa-arrows-alt-v"></i>Range</a>
		</li>
	`),

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