/******************************************************************************\
|                                                                              |
|                           preferences-panel-view.js                          |
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
import AppsView from '../../../../../views/apps/common/items/apps-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'preferences panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-snowflake"></i>Preferences</label>
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
		'click .item': 'onClickItem'
	},

	//
	// getting methods
	//

	getItemByName: function(name) {
		let children = this.getChildView('items').getChildren();
		for (let i = 0; i < children.length; i++) {
			let child = children[i];
			if (child.model.get('name').toLowerCase() == name.toLowerCase()) {
				return child;
			}
		}
	},

	getSelectedChildView: function(which) {
		if (this.hasChildView('items')) {
			return this.getChildView('items').getSelectedChildView(which);
		}
	},

	getSelectedModels: function() {
		if (this.hasChildView('items')) {
			return this.getChildView('items').getSelectedModels();
		}
	},

	//
	// selecting methods
	//

	selectByName: function(name) {
		if (this.hasChildView('items')) {
			return this.getChildView('items').selectByName(name);
		}
	},

	deselectAll: function() {
		if (this.hasChildView('items')) {
			this.getChildView('items').deselectAll();
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.showItems();
	},

	showItems: function() {
		this.showChildView('items', new AppsView({
			collection: this.collection,

			// options
			//
			view_kind: this.options.view_kind,

			// state
			//
			selected: this.options.selected,

			// capabilities
			//
			deselectable: false,

			// callbacks
			//
			onselect: (item) => {
				this.options.onselect(item.model.get('name'));
			}
		}));		
	}
}, {

	//
	// static methods
	//

	getIndex: function(name) {
		for (let i = 0; i < this.defaults.length; i++) {
			if (name == this.defaults[i].name) {
				return i;
			}
		}
	},

	defaults: function() {
		let defaults = [];

		function filter(app) {
			return app.app && app.preferences &&
				app.hidden != true && 
				app.name != 'Settings Manager';
		}

		// get defaults of visible apps with preferences
		//
		let keys = Object.keys(config.apps);
		for (let i = 0; i < keys.length; i++) {
			let app = config.apps[keys[i]];
			if (filter(app)) {
				defaults.push(app);
			}
		}
		
		return defaults;
	}()
});