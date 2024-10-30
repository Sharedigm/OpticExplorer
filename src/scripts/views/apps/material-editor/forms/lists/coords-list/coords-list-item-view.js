/******************************************************************************\
|                                                                              |
|                           coords-list-item-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a single pair of coordinates.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2015-2018, Megahed Labs LLC, www.optipedia.org          |
\******************************************************************************/

import BaseView from '../../../../../../views/base-view.js';

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
		
		<td <% if (editable) { %>contenteditable="true" <% } %>class="x first">
			<% if (x != undefined) { %>
			<%= x %>
			<% } else { %>
			<span class="warning">undefined</span>
			<% } %>
		</td>
		
		<td <% if (editable) { %>contenteditable="true" <% } %>class="y last">
			<% if (y != undefined) { %>
			<%= y %>
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
		'input .x': 'onChangeX',
		'input .y': 'onChangeY',
		'click button.move-down': 'onClickMoveDown',
		'click button.move-up': 'onClickMoveUp',
		'click button.delete': 'onClickDelete'
	},

	//
	// querying methods
	//

	getX: function() {
		let html = this.$el.find('td.x').html().trim();
		if (html == '') {
			return undefined;
		} else if (isNaN(html)) {
			return Number.NaN;
		} else {
			return parseFloat(html);
		}
	},

	getY: function() {
		let html = this.$el.find('td.y').html().trim();
		if (html == '') {
			return undefined;
		} else if (isNaN(html)) {
			return Number.NaN;
		} else {
			return parseFloat(html);
		}
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

	onRender: function() {

		// perform initial validation
		//
		this.validate();
	},

	//
	// form methods
	//

	submit: function() {
		this.model.set({
			x: this.x,
			y: this.y,
		})
	},

	//
	// validation methods
	//

	validate: function() {
		let x = this.getX();
		let y = this.getY();

		// check values
		//
		if (x == undefined) {
			this.$el.find('.x').addClass('error');
			return "This field is required.";		
		} else if (isNaN(x)) {
			this.$el.find('.x').addClass('error');
			return "This field must be a number.";
		}
		if (x == undefined) {
			this.$el.find('.y').addClass('error');
			return "This field is required.";		
		} else if (isNaN(y)) {
			this.$el.find('.y').addClass('error');
			return "This field must be a number.";
		}

		// unhighlight errors
		//
		this.$el.find('td').removeClass('error');

		return true;
	},

	isValid: function() {

		// revalidate the for,
		//
		return this.validate() == true;
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.options.parent.onChange();
	},

	onChangeX: function() {
		this.x = this.getX();
		this.onChange();
	},

	onChangeY: function() {
		this.y = this.getY();
		this.onChange();
	},

	//
	// list ordering event handling methods
	//

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
	}
});