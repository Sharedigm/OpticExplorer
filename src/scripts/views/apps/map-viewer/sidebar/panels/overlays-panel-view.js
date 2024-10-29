/******************************************************************************\
|                                                                              |
|                            overlays-panel-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a type of sidebar panel.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import FilesView from '../../../../../views/apps/file-browser/mainbar/files/files-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'overlays panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-grip-lines"></i>Overlays</label>
		
			<div class="buttons">
				<button type="button" class="add-overlays success btn btn-sm" data-toggle="tooltip" title="Add Overlays">
					<i class="fa fa-plus"></i>
				</button>
			</div>
		</div>
		
		<div class="items"></div>
	`),

	regions: {
		'items': {
			el: '.items',
			replaceElement: true
		}
	},

	events: {
		'click .add-overlays': 'onClickAddOverlays'
	},

	//
	// querying methods
	//

	hasSelected: function() {
		if (this.hasChildView('items')) {
			return this.getChildView('items').hasSelected();
		}
	},

	//
	// counting methods
	//

	numSelected: function() {
		if (this.hasChildView('items')) {
			return this.getChildView('items').numSelected();
		} else {
			return 0;
		}
	},

	//
	// getting methods
	//

	getSelected: function() {
		if (this.hasChildView('items')) {
			return this.getChildView('items').getSelected();
		}
	},

	//
	// selecting methods
	//

	selectAll: function(filter, options) {
		this.getChildView('items').selectAll(filter, options);
	},

	deselectAll: function(filter, options) {
		this.getChildView('items').deselectAll(filter, options);
	},


	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SideBarPanelView.prototype.onRender.call(this);

		// hide add items button
		//
		if (!application.session.user) {
			this.$el.find('.add-overlays').hide();
		}

		// show child views
		//
		this.showMapItems();
	},

	showMapItems: function() {
		this.showChildView('items', new FilesView({
			collection: this.collection,

			// options
			//
			view_kind: this.options.view_kind,
			empty: "No overlays.",

			// capabilities
			//
			selectable: true,
			editable: false,
			draggable: false,
			droppable: false,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item)
		}));
	},

	//
	// selection event handling methods
	//

	onSelect: function(items) {
		if (!items) {
			return;
		} else if (items.model) {
			this.app.selectLayerItem('overlays', items);
		} else {
			this.app.selectLayerItems('overlays', items);
		}
	},

	onDeselect: function(items) {
		if (!items) {
			this.app.getActivePaneView().deselectAll(null, {
				silent: true
			});
		} else if (items.model) {
			this.app.deselectLayerItem('overlays', items);
		} else {
			this.app.deselectLayerItems('overlays', items);
		}
	},

	//
	// file event handling methodsd
	//

	onOpen: function(item) {

		// show image
		//
		application.launch('image_viewer', {
			model: item.model
		});
	},

	//
	// mouse event handling methods
	//

	onClickAddOverlays: function() {

		// open new dialog
		//
		this.app.showAddOverlaysDialog();
	}
});