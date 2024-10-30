/******************************************************************************\
|                                                                              |
|                             coeffs-list-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a list of coefficients.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2015-2018, Megahed Labs LLC, www.optipedia.org          |
\******************************************************************************/

import KeyValueListView from '../../../../../../views/collections/lists/key-value-list/key-value-list-view.js';
import CoeffsListItemView from '../../../../../../views/apps/material-editor/forms/lists/coeffs-list/coeffs-list-item-view.js';

export default KeyValueListView.extend({

	//
	// attributes
	//

	template: _.template(`
		<% if (collection && collection.length > 0) { %>
		<table>
			<thead>
				<tr>
					<% if (numbered) { %>
					<th class="prepend number"></th>
					<% } %>
				
					<th class="key first">
						<i class="fa fa-superscript"></i>
						<span>Coefficient</span>
					</th>
		
					<th class="value<% if (!editable) { %> last<% } %>">
						<i class="fa fa-calculator"></i>
						<span>Value</span>
					</th>
		
					<% if (orderable) { %>
					<th class="order narrow last">
						<i class="fa fa-list"></i>
						<span>Order</span>
					</th>
					<% } %>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
		<% } else { %>
		<p>No coefficients.</p>
		<% } %>
		
		<% if (expandable) { %>
		<div class="top buttons">
			<button type="button" class="add btn btn-sm" id="add-new-pair" class="btn btn-sm" data-toggle="tooltip" data-content="Add new key value pair" data-placement="left" tabindex="-1"><i class="fa fa-plus"></i></button>
		</div>
		<% } %>
	`),

	childView: CoeffsListItemView,

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			collection: this.collection,
			numbered: this.options.numbered,
			editable: this.options.editable,
			orderable: this.options.orderable,
			deletable: this.options.deletable,
			expandable: this.options.expandable
		};
	},

	childViewOptions: function(model) {
		return {
			index: this.collection.indexOf(model),
			numbered: this.options.numbered,
			editable: this.options.editable,
			orderable: this.options.orderable,
			deletable: this.options.deletable,
			parent: this
		}
	},

	//
	// validation methods
	//

	validate: function() {
		for (let i = 0; i < this.children.length; i++) {

			// get view
			//
			let view = this.children.findByIndex(i);

			// check view
			//
			let validation = view.validate();
			if (validation != true) {
				return validation;
			}
		}
		
		return true;
	},

	isValid: function() {
		for (let i = 0; i < this.children.length; i++) {

			// get view
			//
			let view = this.children.findByIndex(i);

			// check view
			//
			if (!view.isValid()) {
				return false;
			}
		}
		
		return true;
	},

	//
	// form updating methods
	//

	submit: function() {

		// update elements
		//
		for (let i = 0; i < this.children.length; i++) {

			// get view
			//
			let view = this.children.findByIndex(i);

			// submit form
			//
			view.submit();
		}
	},

	//
	// event handling methods
	//

	onChange: function() {
		if (this.options.onchange) {
			this.options.onchange();
		}
	}
});
