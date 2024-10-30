/******************************************************************************\
|                                                                              |
|                              select-menu-view.js                             |
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
			<a class="select-before"><i class="fa fa-long-arrow-left"></i>Before<span class="command shortcut">9</span></a>
		</li>
		
		<li role="presentation">
			<a class="select-after"><i class="fa fa-long-arrow-right"></i>After<span class="command shortcut">0</span></a>
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
		'click .select-before': 'onClickSelectBefore',
		'click .select-after': 'onClickSelectAfter',
	},
	
	//
	// querying methods
	//

	enabled: function() {
		let numElements = this.parent.app.numElements();
		let numSelectedElements = this.parent.app.numSelectedElements();
		let hasSelectedElements = this.parent.app.hasSelectedElements();
		let hasSelectedSurfaces = this.parent.app.hasSelectedSurfaces();
		let hasSelected = hasSelectedElements || hasSelectedSurfaces;
		let allElementsSelected = numSelectedElements == numElements;

		return {
			'select-all': !allElementsSelected,
			'select-none': hasSelected,
			'select-invert': hasSelectedElements && !allElementsSelected,
			'select-first': hasSelected,
			'select-prev': hasSelected,
			'select-next': hasSelected,
			'select-last': hasSelected,
			'select-before': hasSelectedElements,
			'select-after': hasSelectedElements
		};
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

	onClickSelectBefore: function() {
		this.parent.app.select('before');
	},

	onClickSelectAfter: function() {
		this.parent.app.select('after');
	}
});