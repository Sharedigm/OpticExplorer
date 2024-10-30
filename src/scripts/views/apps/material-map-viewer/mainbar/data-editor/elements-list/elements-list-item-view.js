/******************************************************************************\
|                                                                              |
|                          elements-list-item-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying an elements list item.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import EditableTableListItemView from '../../../../../../views/collections/tables/editable-table-list-item-view.js';

export default EditableTableListItemView.extend({

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		EditableTableListItemView.prototype.initialize.call(this);

		// set attributes
		//
		this.spacing = this.model.get('spacing');

		// listen to model
		//
		this.listenTo(this.model, 'change', () => this.render());
		this.listenTo(this.model, 'select', () => this.select());
		this.listenTo(this.model, 'deselect', () => this.deselect());
	},

	//
	// form querying methods
	//

	isValid: function() {

		// revalidate the for,
		//
		return this.validate() == true;
	},

	//
	// viewport getting methods
	//

	getViewportView: function() {
		let splitView = this.getParentView('split-view');
		if (splitView) {
			return splitView.getChildView('mainbar');
		}
	},

	getElementView: function() {
		let viewportView = this.getViewportView();
		if (viewportView) {
			return viewportView.getElementView(this.model);
		}
	},

	//
	// editing methods
	//

	edit: function() {
		this.getElementView().edit();
	},

	//
	// rendering methods
	//

	onRender: function() {

		// make list item grabbable
		//
		this.$el.addClass('grabbable');
		
		// set selected
		//
		let elementView = this.getElementView();
		if (elementView && elementView.isSelected()) {
			this.$el.addClass('selected');
		}

		// perform initial validation
		//
		this.validate();
	},

	//
	// updating methods
	//

	updateValue: function(kind) {
		this.setValue(kind, this.getValue(kind));
	},

	//
	// form methods
	//

	submit: function() {

		// update model
		//
		if (this.edited) {

			// set model attributes
			//
			this.model.set(this.getValues());

			this.edited = false;
		}
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.edited = true;
		this.options.parent.onChange();
	}
});