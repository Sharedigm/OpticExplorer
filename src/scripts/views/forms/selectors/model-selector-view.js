/******************************************************************************\
|                                                                              |
|                              model-selector-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for selecting a model from a collection.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SelectorView from '../../../views/forms/selectors/selector-view.js';

export default SelectorView.extend({

	//
	// attributes
	//

	tagName: 'select',

	template: template(`
		<% if (!selected) { %>
		<option class="unselected"></option>
		<% } %>
		
		<% if (collection) { %>
		<% for (let i = 0; i < collection.length; i++) { %>
		<% let value = collection.at(i).get(key); %>
		<option<% if (value == selected) { %> selected<% } %>><%= value %></option>
		<% } %>
		<% } %>
	`),
	key: 'name',

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		SelectorView.prototype.initialize.call(this);

		// set attributes
		//
		if (this.options.key != undefined) {
			this.key = this.options.key;
		}
		if (this.options.initial) {
			this.selected = this.options.initial;
			this.options.initialValue = this.selected.get(this.key);
		}
	},

	//
	// querying methods
	//

	getValue: function() {
		return this.selected? this.selected.get(this.key) : '';
	},

	at: function(index) {
		return this.collection? this.collection.at(index) : undefined;
	},

	indexOf: function(value) {
		let options = this.$el.find('select')[0].options;
		for (let i = 0; i < options.length; i++) {
			if (options[i].value == value) {
				return i;
			}
		}
	},

	//
	// setting methods
	//

	setSelectedValue: function(value) {
		this.setSelectedIndex(this.indexOf(value));
		this.onChange();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			collection: this.collection,
			key: this.key,
			selected: this.options.initialValue
		};
	}
});