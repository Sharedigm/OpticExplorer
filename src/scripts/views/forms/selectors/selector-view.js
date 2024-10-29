/******************************************************************************\
|                                                                              |
|                               selector-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for selecting an item from a list.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../views/base-view.js';
import '../../../../vendor/bootstrap/js/dropdown.js';
import '../../../../vendor/select2/js/select2.js';

export default BaseView.extend({

	//
	// attributes
	//

	tagName: 'select',

	events: {
		'change': 'onChange',
		'click .dropdown-menu li': 'onClickMenuItem',
		'mousedown .dropdown-menu li': 'onClickMenuItem'
	},

	//
	// constructor
	//

	initialize: function() {

		// set initial value
		//
		this.selected = this.options.initialValue;

		// check if first option is selected by default
		//
		if (!this.options.unselectable || this.collection.length == 1) {
			this.selected = this.at(0);
		}
	},

	//
	// querying methods
	//

	hasSelected: function() {
		return this.getSelected() !== undefined;
	},

	//
	// getting methods
	//

	getSelected: function() {
		return this.selected;
	},
	
	getSelectedIndex: function() {
		return this.el.selectedIndex;
	},

	//
	// setting methods
	//

	setSelectedIndex: function(index) {
		this.el.selectedIndex = index;
	},

	//
	// rendering methods
	//

	onRender: function() {

		// apply select2 selector
		//
		this.selector = $(this.$el.select2({
			width: '100%'
		}));
	},

	//
	// event handling methods
	//

	onChange: function() {

		// set value
		//
		this.selected = this.at(this.getSelectedIndex());

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	onClickMenuItem: function() {

		// perform callback
		//
		if (this.options.onclickMenuItem) {
			this.options.onclickMenuItem();
		}
	},

	onMouseDownMenuItem: function() {

		// remove unselected option
		//
		if (!this.options.unselectable) {
			if (this.$el.find('option.unselected').length > 0) {
				this.$el.find('option.unselected').remove();
				this.onChange();
			}
		}
	}
});