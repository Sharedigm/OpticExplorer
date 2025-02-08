/******************************************************************************\
|                                                                              |
|                            settings-panel-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a set of settings.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../../../models/base-model.js';
import BaseCollection from '../../../../../collections/base-collection.js';
import BaseView from '../../../../../views/base-view.js';
import SettingsView from '../../../../../views/apps/settings-browser/sidebar/items/settings-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'settings panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-cog"></i>Settings</label>
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
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (!this.collection) {
			this.collection = new BaseCollection([
				new BaseModel({
					id: 'account',
					name: 'Account',
					image: 'images/icons/settings/account.svg',
					icon: 'fa fa-key'
				}),
				new BaseModel({
					id: 'desktop',
					name: 'Desktop',
					image: 'images/icons/settings/desktop.svg',
					icon: 'fa fa-desktop'
				}),
				new BaseModel({
					id: 'notifications',
					name: 'Notifications',
					image: 'images/icons/settings/notifications.svg',
					icon: 'fa fa-exclamation-triangle'
				}),
				new BaseModel({
					id: 'sign-ins',
					name: 'Sign-Ins',
					image: 'images/icons/settings/sign-ins.svg',
					icon: 'fa fa-sign-in-alt'
				}),
				new BaseModel({
					id: 'sound',
					name: 'Sound',
					image: 'images/icons/settings/sound.svg',
					icon: 'fa fa-volume-up'
				}),
				new BaseModel({
					id: 'storage',
					name: 'Storage',
					image: 'images/icons/settings/storage.svg',
					icon: 'fa fa-database'
				})
			]);
		}
	},

	//
	// getting methods
	//

	getItemByName: function(name) {
		let children = this.getChildView('items').getChildren();
		for (let i = 0; i < children.length; i++) {
			let child = children[i];
			if (child.model.get('name') == name) {
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
	// setting methods
	//

	setViewKind: function(viewKind) {
		if (this.hasChildView('items')) {
			return this.getChildView('items').setViewKind(viewKind);
		}
	},

	//
	// selecting methods
	//

	selectByName: function(name) {
		this.deselectAll();

		// find item by name
		//
		let item = this.getItemByName(name);

		// select item
		//
		if (item) {
			item.select({
				silent: true
			});
		}

		return item;
	},

	deselectAll: function() {
		this.getChildView('items').deselectAll(null, {
			silent: true
		});
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
		this.showChildView('items', new SettingsView({
			collection: this.collection,

			// options
			//
			view_kind: this.options.view_kind,

			// state
			//
			selected: this.options.selected,

			// capabilities
			//
			selectable: true,
			deselectable: true,

			// callbacks
			//
			onselect: this.options.onselect
		}));
	}
});