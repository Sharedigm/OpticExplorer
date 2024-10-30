/******************************************************************************\
|                                                                              |
|                              coords-list-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a list of coordinate pairs.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2015-2018, Megahed Labs LLC, www.optipedia.org          |
\******************************************************************************/

import BaseModel from '../../../../../../models/base-model.js';
import BaseCollection from '../../../../../../collections/base-collection.js';
import TableListView from '../../../../../../views/collections/tables/table-list-view.js';
import CoordsListItemView from '../../../../../../views/apps/material-editor/forms/lists/coords-list/coords-list-item-view.js';

export default TableListView.extend({

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
						<i class="fa fa-key"></i>
						<span><%= titles[0] %></span>
					</th>
		
					<th class="value<% if (!editable) { %> last<% } %>">
						<i class="fa fa-tag"></i>
						<span><%= titles[1] %></span>
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
		<p>No coordinates.</p>
		<% } %>
		
		<% if (expandable) { %>
		<div class="top buttons">
			<button type="button" class="add btn btn-sm" id="add-new-pair" class="btn btn-sm" data-toggle="tooltip" data-content="Add new key value pair" data-placement="left" tabindex="-1"><i class="fa fa-plus"></i></button>
		</div>
		<% } %>
	`),

	childView: CoordsListItemView,

	events: {
		'click #add-new-coords': 'onClickAddNewCoords',
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (!this.options.titles) {
			this.options.titles = ['x', 'y'];
		}

		// create collection from coords
		//
		this.collection = new BaseCollection();
		if (this.options.array) {
			for (let i = 0; i < this.options.array.length; i++) {
				this.collection.add(new BaseModel({
					x: this.options.array[i][0],
					y: this.options.array[i][1]
				}));				
			}
		}

		// call superclass method
		//
		TableListView.prototype.initialize.call(this);
	},

	//
	// querying methods
	//

	toData: function() {

		// create coords from collection
		//
		let array = [];
		for (let i = 0; i < this.collection.length; i++) {
			let model = this.collection.at(i);
			array.push([
				model.get('x'),
				model.get('y')
			]);
		}
		return array;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			collection: this.collection,
			titles: this.options.titles,
			numbered: this.options.numbered,
			editable: this.options.editable,
			orderable: this.options.orderable,
			deletable: this.options.deletable,
			expandable: this.options.expandable
		};
	},

	childViewOptions: function(model) {
		return {
			model: model,
			index: this.collection.indexOf(model),
			collection: this.collection,
			numbered: this.options.numbered,
			editable: this.options.editable,
			orderable: this.options.orderable,
			deletable: this.options.deletable,
			expandable: this.options.expandable,
			parent: this
		}
	},

	onRender: function() {

		// add popover triggers
		//
		this.addPopovers();
	},

	addPopovers: function() {

		// show popovers on hover
		//
		this.$el.find('[data-toggle="popover"]').popover({
			trigger: 'hover'
		});
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
	},
	
	onClickAddNewCoords: function() {
		this.collection.add(
			new BaseModel({
				coords: [undefined, undefined]
			})
		);

		// re-render list
		//
		this.render();
	},
});
