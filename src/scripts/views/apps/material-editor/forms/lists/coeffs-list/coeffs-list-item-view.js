/******************************************************************************\
|                                                                              |
|                              coeffs-list-item-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a single coefficient list item.        |
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
import '../../../../../../../vendor/mathjax/es5/tex-mml-chtml.js';

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
		
		<td class="math coeff first">
			$$ <%= key %> $$
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
		'input .value': 'onInputValue'
	},

	//
	// constructor
	//

	initialize: function() {
		this.value = this.model.get('value');
	},

	//
	// querying methods
	//

	getValue: function() {
		let html = this.$el.find('td.value').html().trim();
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

		// add math formatting
		//
		window.setTimeout(() => {
			this.showMath();
		}, 100);
	},

	showMath: function() {

		// add math formatting
		//
		MathJax.typeset();
	},

	//
	// form methods
	//

	submit: function() {
		this.model.set({
			value: this.value
		})
	},

	//
	// validation methods
	//

	validate: function() {
		let value = this.getValue();

		// check value
		//
		if (value == undefined) {
			this.$el.find('.value').addClass('error');
			return "This field is required.";		
		} else if (isNaN(value)) {
			this.$el.find('.value').addClass('error');
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

	onKeyDownValue: function() {

		// clear cell and value
		//
		if (!this.model.has('value')) {
			this.$el.find('td.value').html('');
			this.value = undefined;
		}

		this.onChange();
	},

	onInputValue: function() {
		this.value = this.getValue();
		this.onChange();
	}
});