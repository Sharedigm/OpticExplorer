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
		<% if (unselectable) { %>
		<option></option>
		<% } %>
		<% for (let i = 0; i < names.length; i++) { %>
		<option<% if (names[i] == selected) { %> selected<% } %>><%= names[i] %></option>
		<% } %>
	`),
	names: [],

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
		return this.names[index];
	},
	
	indexOf: function(name) {
		return this.names.indexOf(name);
	},

	//
	// setting methods
	//

	setSelectedName: function(name) {
		this.setSelectedIndex(this.indexOf(name));
		this.onChange();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			names: this.names,

			// options
			//
			selected: this.selected,

			// capabilities
			//
			unselectable: this.unselectable
		};
	}
});