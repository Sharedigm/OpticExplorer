/******************************************************************************\
|                                                                              |
|                             people-panel-view.js                             |
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
import UsersView from '../../../../../views/apps/profile-browser/mainbar/users/users-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'people panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-user-friends"></i>People</label>
		
			<div class="buttons">
				<button type="button" class="add-people success btn btn-sm" data-toggle="tooltip" title="Add People">
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
		'click .add-people': 'onClickAddPeople'
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
			this.$el.find('.add-people').hide();
		}

		// show child views
		//
		this.showPeople();
	},

	showPeople: function() {
		this.showChildView('items', new UsersView({
			collection: this.collection,

			// options
			//
			view_kind: this.options.view_kind,
			empty: "No people.",

			// capabilities
			//
			selectable: true,
			editable: false,
			draggable: false,
			droppable: false,
			
			// callbacks
			//
			onload: () => this.onLoad(),
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item)
		}));
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.app.onLoad();
	},

	//
	// selection event handling methods
	//

	onSelect: function(items) {
		if (!items) {
			return;
		} else if (items.model) {
			this.app.selectLayerItem('people', items);
		} else {
			this.app.selectLayerItems('people', items);
		}
	},

	onDeselect: function(items) {
		if (!items) {
			this.app.getActivePaneView().deselectAll(null, {
				silent: true
			});
		} else if (items.model) {
			this.app.deselectLayerItem('people', items);
		} else {
			this.app.deselectLayerItems('people', items);
		}
	},

	//
	// file event handling methods
	//

	onOpen: function(item) {

		// show image
		//
		application.launch('profile_viewer', {
			model: item.model
		});
	},

	//
	// mouse event handling methods
	//

	onClickAddPeople: function() {
		this.app.showAddPeopleDialog();
	}
});