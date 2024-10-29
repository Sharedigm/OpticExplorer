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
	key: 'search',

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
	// setting methods
	//

	setValue: function(value) {
		this.$el.find('input').val(value);
	},

	//
	// querying methods
	//

	hasValue: function() {
		return this.$el.find('input').val() != '';
	},

	//
	// getting methods
	//

	getKey: function() {
		return this.key;
	},

	getValue: function() {
		return this.$el.find('input').val();
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
	// rendering methods
	//

	templateContext: function() {
		return {
			value: this.options.value
		};
	},

	//
	// form handling methods
	//

	onSubmit: function() {
		this.submit();
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