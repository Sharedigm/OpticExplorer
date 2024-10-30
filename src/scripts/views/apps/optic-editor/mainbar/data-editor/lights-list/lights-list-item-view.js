/******************************************************************************\
|                                                                              |
|                           lights-list-item-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a lights list item.                |
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

		// listen to model
		//
		this.listenTo(this.model, 'select', () => this.select());
		this.listenTo(this.model, 'deselect', () => this.deselect());
		this.listenTo(this.model, 'change', () => this.update());
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

	getLightView: function() {
		let viewportView = this.getViewportView();
		if (viewportView) {
			return viewportView.getChildViewByModel(this.model);
		}
	},

	//
	// editing methods
	//

	edit: function() {
		this.getLightView().edit();
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.edited = true;
		this.options.parent.onChange();
	}
});