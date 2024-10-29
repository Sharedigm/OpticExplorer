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
		
		<li role="presentation">
			<a class="select-none"><i class="fa fa-minus"></i>None<span class="shift command shortcut">A</span></a>
		</li>
		
		<li role="presentation">
			<a class="select-invert"><i class="fa fa-random"></i>Invert<span class="shift command shortcut">I</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="select-multiple"><i class="fa fa-check"></i><i class="fa fa-ellipsis-h"></i>Multiple<span class="shift command shortcut">M</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="select-first"><i class="fa fa-fast-backward"></i>First<span class="shortcut">up arrow</span></a>
		</li>
		
		<li role="presentation">
			<a class="select-prev"><i class="fa fa-backward"></i>Prev<span class="shortcut">left arrow</span></a>
		</li>
		
		<li role="presentation">
			<a class="select-next"><i class="fa fa-forward"></i>Next<span class="shortcut">right arrow</span></a>
		</li>
		
		<li role="presentation">
			<a class="select-last"><i class="fa fa-fast-forward"></i>Last<span class="shortcut">down arrow</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="select-subscribed"><i class="fa fa-newspaper"></i>Subscribed</a>
		</li>
		
		<li role="presentation">
			<a class="select-unsubscribed"><i class="fa fa-xmark"></i>Unsubscribed</a>
		</li>
	`),

	events: {
		'click .select-all': 'onClickSelectAll',
		'click .select-none': 'onClickSelectNone',
		'click .select-invert': 'onClickSelectInvert',
		'click .select-multiple': 'onClickSelectMultiple',
		'click .select-first': 'onClickSelectFirst',
		'click .select-prev': 'onClickSelectPrev',
		'click .select-next': 'onClickSelectNext',
		'click .select-last': 'onClickSelectLast',
		'click .select-subscribed': 'onClickSelectSubscribed',
		'click .select-unsubscribed': 'onClickSelectUnsubscribed'
	},

	//
	// querying methods
	//

	enabled: function() {
		let hasSelected = this.parent.app.hasSelected();
		let hasChildren = this.parent.app.hasChildren();
		let allSelected = this.parent.app.allSelected();

		return {
			'select-all': !allSelected,
			'select-none': hasSelected,
			'select-invert': hasSelected && !allSelected,
			'select-multiple': true,
			'select-first': hasChildren,
			'select-prev': hasSelected,
			'select-next': hasSelected,
			'select-last': hasChildren,
			'select-subscribed': hasChildren,
			'select-unsubscribed': hasChildren
		};
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.onChangeSelection();
	},

	//
	// mouse event handling methods
	//

	onClickSelectAll: function() {
		this.parent.app.selectAll();
	},

	onClickSelectNone: function() {
		this.parent.app.deselectAll();
	},

	onClickSelectInvert: function() {
		this.parent.app.selectInvert();
	},

	onClickSelectMultiple: function() {
		this.parent.app.setMultiSelectable(this.toggleMenuItem('select-multiple'));
	},

	onClickSelectFirst: function() {
		this.parent.app.select('first');
	},

	onClickSelectPrev: function() {
		this.parent.app.select('prev');
	},
	
	onClickSelectNext: function() {
		this.parent.app.select('next');
	},

	onClickSelectLast: function() {
		this.parent.app.select('last');
	},

	onClickSelectSubscribed: function() {
		this.parent.app.select('subscribed');
	},

	onClickSelectUnsubscribed: function() {
		this.parent.app.select('unsubscribed');
	},
});