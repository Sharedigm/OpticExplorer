/******************************************************************************\
|                                                                              |
|                              search-by-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract view used for defining searches.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	className: 'search form-inline',
	icon: 'fa fa-search',
	placeholder: "Search",

	events: {

		// form events
		//
		'input input': 'onInput',
		'submit': 'onSubmit',

		// mouse events
		//
		'click .close-btn': 'onClickClose',
		'click .search-btn': 'onClickSearch',

		// keyboard events
		//
		'keydown': 'onKeyDown'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (this.options.value) {
			this.value = this.options.value;
		}
		if (this.options.kind) {
			this.kind = this.options.kind;
			this.key = this.kind;
		}
	},

	//
	// getting methods
	//

	getIcon: function() {
		if (this.icons) {
			return this.icons[this.key];
		} else {
			return this.icon;
		}
	},

	getKey: function() {
		return _.result(this, 'key');
	},
	
	getSearch: function() {
		let key = this.getKey();
		let search = {};
		search[key] = this.getValue();
		return search;
	},

	//
	// form handling methods
	//

	submit: function() {
		this.parent.app.searchFor(this.getSearch());
	},

	//
	// closing methods
	//

	close: function() {
		this.parent.parent.clearSearchBar();
	},

	//
	// form handling methods
	//

	onSubmit: function() {
		this.submit();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.getIcon? this.getIcon() : this.icon,
			value: this.value
		};
	},

	//
	// mouse event handling methods
	//

	onClickClose: function() {
		this.close();
	},
	
	onClickSearch: function() {
		this.submit();
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		if (event.keyCode == 13) {
			this.submit();
		}
	}
});