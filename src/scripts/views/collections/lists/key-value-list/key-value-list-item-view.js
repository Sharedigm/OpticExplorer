/******************************************************************************\
|                                                                              |
|                            key-value-list-item-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a single key value pair.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	tagName: 'tr',

	template: _.template(`
		<% if (numbered) { %>
		<td class="prepend number">
		</td>
		<% } %>
		
		<td <% if (editable) { %>contenteditable="true" <% } %>class="key first">
			<%= key %>
		</td>
		
		<td <% if (editable) { %>contenteditable="true" <% } %>class="value<% if (!editable) { %> last<% } %>">
			<% if (value != undefined) { %>
			<%= value %>
			<% } else { %>
			<span class="warning">undefined</span>
			<% } %>
		</td>
		
		<% if (orderable) { %>
		<td class="order narrow last">
		<% if (index != 0) { %>
		<button type="button" class="move-up btn btn-sm" tabindex="-1"><i class="fa fa-arrow-up"></i></button>
		<% } %>
		<% if (index != num - 1) { %>
		<button type="button" class="move-down btn btn-sm" tabindex="-1"><i class="fa fa-arrow-down"></i></button>
		<% } %>
		</td>
		<% } %>
		
		<% if (deletable) { %>
		<td class="append">
			<button type="button" class="delete btn btn-sm" tabindex="-1"><i class="fa fa-xmark"></i></button>
		</td>
		<% } %>
	`),

	events: {
		'keydown .value': 'onKeyDownValue',
		'input .key': 'onInputKey',
		'input .value': 'onInputValue',
		'click button.move-down': 'onClickMoveDown',
		'click button.move-up': 'onClickMoveUp',
		'click button.delete': 'onClickDelete'
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			index: this.options.index,
			num: this.collection.length,
			numbered: this.options.numbered,
			editable: this.options.editable,
			orderable: this.options.orderable,
			deletable: this.options.deletable
		};
	},

	onKeyDownValue: function() {

		// clear cell
		//
		if (!this.model.has('value')) {
			this.$el.find('td.value').html('');
		}
	},

	onInputKey: function() {

		// update model
		//
		this.model.set({
			key: this.$el.find('td.key').html().trim()
		});

		this.onChange();
	},

	onInputValue: function() {

		// update model
		//
		this.model.set({
			value: this.$el.find('td.value').html().trim()
		});

		this.onChange();
	},

	onClickMoveDown: function() {
		let index = this.collection.indexOf(this.model);

		// remove from collection
		//
		this.collection.remove(this.model, {
			silent: true
		});

		// reinsert at next position
		//
		this.collection.add(this.model, {
			at: index + 1,
			silent: true
		});

		this.options.parent.render();
		this.onChange();
	},

	onClickMoveUp: function() {
		let index = this.collection.indexOf(this.model);

		// remove from collection
		//
		this.collection.remove(this.model, {
			silent: true
		});

		// reinsert at prev position
		//
		this.collection.add(this.model, {
			at: index - 1, 
			silent: true
		});

		this.options.parent.render();
		this.onChange();
	},

	onClickDelete: function() {
		this.options.parent.collection.remove(this.model);
		this.onChange();
	},

	onChange: function() {
		if (this.options.onchange) {
			this.options.onchange();
		}
	}
});