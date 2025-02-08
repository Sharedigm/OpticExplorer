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

import SelectMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/select-menu-view.js';

export default SelectMenuView.extend({

	//
	// attributes
	//
	
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