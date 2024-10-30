/******************************************************************************\
|                                                                              |
|                            elements-list-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a list of elements.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Lens from '../../../../../../models/optics/elements/lens.js';
import Stop from '../../../../../../models/optics/elements/stop.js';
import Sensor from '../../../../../../models/optics/elements/sensor.js';
import ReorderableTableListView from '../../../../../../views/collections/tables/reorderable-table-list-view.js';
import LensListItemView from '../../../../../../views/apps/optic-editor/mainbar/data-editor/elements-list/lens-list-item-view.js';
import StopListItemView from '../../../../../../views/apps/optic-editor/mainbar/data-editor/elements-list/stop-list-item-view.js';
import SensorListItemView from '../../../../../../views/apps/optic-editor/mainbar/data-editor/elements-list/sensor-list-item-view.js';
import BaseView from '../../../../../../views/base-view.js';

export default ReorderableTableListView.extend({

	//
	// attributes
	//

	template: template(`
		<thead>
			<tr>
				<th class="kind">
					<span>Kind</span>
				</th>

				<th class="thickness">
					<span>Thickness</span>
				</th>

				<th class="focal-length">
					<span>Focal Length</span>
				</th>

				<th class="spacing">
					<span>Spacing</span>
				</th>

				<% if (false) { %>
				<th class="beveled th-sm hidden-xs">
					<span>Beveled</span>
				</th>
				<% } %>

				<th class="is-hidden th-sm hidden-xs">
					<span>Hidden</span>
				</th>

				<th class="material hidden-xs">
					<span>Material</span>
				</th>
			</tr>
		</thead>
		<tbody class="sortable">
		</tbody>
	`),

	emptyView: BaseView.extend({
		className: 'empty',
		template: template('No elements.')
	}),

	//
	// table attributes
	//

	show_numbering: true,

	//
	// constructor
	//

	initialize: function(options) {

		// call superclass constructor
		//
		ReorderableTableListView.prototype.initialize.call(this, options);

		// deactivate event listeners
		//
		this.off("add:child");
		this.off("remove:child");

		// sort by order
		//
		this.options.viewComparator = function(model) {
			return model.getIndex();
		};

		// listen to collection for changes
		//
		this.listenTo(this.collection, 'reorder', this.render);
	},

	//
	// querying methods
	//

	getTableRowIndex: function(element) {
		let rows = this.$el.find('tbody tr:not(.ui-sortable-placeholder)');
		for (let i = 0; i < rows.length; i++) {
			let row = rows[i];
			if (element == row) {
				return i;
			}			
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			collection: this.collection
		};
	},

	childView: function(item) {
		if (item instanceof Lens) {
			return LensListItemView;
		} else if (item instanceof Stop) {
			return StopListItemView;
		} else if (item instanceof Sensor) {
			return SensorListItemView;
		}
	},

	childViewOptions: function() {
		return {

			// options
			//
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
		ReorderableTableListView.prototype.onRender.call(this);

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
	},

	deselectAll: function() {
		for (let i = 0; i < this.children.length; i++) {
			let view = this.children.findByIndex(i);
			view.deselect();
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
	}
});