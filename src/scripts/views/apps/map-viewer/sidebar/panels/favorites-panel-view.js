/******************************************************************************\
|                                                                              |
|                            favorites-panel-view.js                           |
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
import PlacesView from '../../../../../views/apps/map-viewer/mainbar/places/places-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'favorites panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-map-pin"></i>Favorites</label>

			<div class="buttons">
				<button type="button" class="add-favorites success btn btn-sm" data-toggle="tooltip" title="Add Favorites">
					<i class="fa fa-plus"></i>
				</button>
			</div>
		</div>

		<div class="items"></div>
	`),

	regions: {
		'items': '.items'
	},

	events: {
		'click .add-favorites': 'onClickAddFavorites'
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

		// show child views
		//
		this.showFavorites();

		// hide add favorite button
		//
		if (!application.session.user) {
			this.$el.find('.add-favorite').hide();
		}
	},

	showFavorites: function() {
		this.showChildView('items', new PlacesView({
			collection: this.collection,

			// options
			//
			view_kind: this.options.view_kind,
			empty: "No favorites.",

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
	// selection event handling methodsd
	//

	onSelect: function(items) {
		if (!items) {
			return;
		} else if (items.model) {
			this.app.selectLayerItem('favorites', items);
		} else {
			this.app.selectLayerItems('favorites', items);
		}
	},

	onDeselect: function(items) {
		if (!items) {
			this.app.getActivePaneView().deselectAll(null, {
				silent: true
			});
		} else if (items.model) {
			this.app.deselectLayerItem('favorites', items);
		} else {
			this.app.deselectLayerItems('favorites', items);
		}
	},

	//
	// file event handling methods
	//

	onOpen: function(item) {

		// zoom to my place marker
		//
		this.app.zoomToPlace(item.model);
	},

	//
	// mouse event handling methods
	//

	onClickAddFavorites: function() {
		this.app.showAddFavoritesDialog();
	}
});