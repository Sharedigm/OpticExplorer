/******************************************************************************\
|                                                                              |
|                            surfaces-list-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a list of surfaces.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TableListView from '../../../../../../views/collections/tables/table-list-view.js';
import SurfacesListItemView from '../../../../../../views/apps/optic-editor/mainbar/data-editor/surfaces-list/surfaces-list-item-view.js';
import BaseView from '../../../../../../views/base-view.js';

export default TableListView.extend({

	//
	// attributes
	//

	template: template(`
		<thead>
			<tr>
				<th class="profile">
					<span>Kind</span>
				</th>

				<th class="side">
					<span>Side</span>
				</th>

				<th class="radius-of-curvature">
					<span>ROC</span>
				</th>

				<th class="curvature">
					<span>Curvature</span>
				</th>

				<th class="radius">
					<span>Radius</span>
				</th>

				<th class="diameter">
					<span>Diameter</span>
				</th>

				<th class="coating hidden-md hidden-sm hidden-xs">
					<span>Coating</span>
				</th>

				<th class="spacing hidden-xs">
					<span>Spacing</span>
				</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	`),

	childView: SurfacesListItemView,

	emptyView: BaseView.extend({
		className: 'empty',
		template: template('No surfaces.')
	}),

	//
	// table attributes
	//

	show_numbering: true,

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		TableListView.prototype.initialize.call(this);

		// set attributes
		//
		if (this.options.show_numbering != undefined) {
			this.show_numbering = this.options.show_numbering;
		}

		// listen to collection for changes
		//
		this.listenTo(this.collection, 'reorder', this.onReorder);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			collection: this.collection
		};
	},

	childViewOptions: function(model) {
		return {

			// options
			//
			index: this.collection.indexOf(model),
			viewport: this.options.viewport,
			parent: this,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		}
	},

	onRender: function() {

		// call superclass method
		//
		TableListView.prototype.onRender.call(this);

		// perform initial validation
		//
		this.validate();
	},

	//
	// selecting methods
	//

	selectAll: function() {
		for (let i = 0; i < this.children.length; i++) {
			let view = this.children.findByIndex(i);
			view.select();
		}
		this.onSelect();
	},

	deselectAll: function() {
		for (let i = 0; i < this.children.length; i++) {
			let view = this.children.findByIndex(i);
			view.deselect();
		}
		this.onDeselect();
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
	// form methods
	//

	submit: function() {

		// submit forms
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

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	onSelect: function(view) {

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect(view);
		}	
	},

	onDeselect: function(view) {

		// perform callback
		//
		if (this.options.ondeselect) {
			this.options.ondeselect(view);
		}			
	},

	onReorder: function() {
		this.collection.sort();
	}
});