/******************************************************************************\
|                                                                              |
|                             item-selector-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for selecting an item from a list of names.       |
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
		
		<% for (let i = 0; i < items.length; i++) { %>
		<% let value = items[i][key]; %>
		<option<% if (value == selected) { %> selected<% } %>><%= value %></option>
		<% } %>
	`),
	items: [],
	key: 'name',

	//
	// constructor
	//

	initialize: function() {

		// set initial value
		//
		this.selected = this.options.initialValue;
	},

	//
	// querying methods
	//

	at: function(index) {
		return this.items[index];
	},
	
	indexOf: function(value) {
		return this.names.indexOf(value);
	},

	//
	// setting methods
	//

	setSelectedName: function(value) {
		this.setSelectedIndex(this.indexOf(value));
		this.onChange();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			items: this.items,
			key: this.key,
			selected: this.selected
		};
	}
});