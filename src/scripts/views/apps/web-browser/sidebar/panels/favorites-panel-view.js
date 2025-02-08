/******************************************************************************\
|                                                                              |
|                           favorites-panel-view.js                            |
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

import WebFavorites from '../../../../../models/favorites/web-favorites.js';
import BaseCollection from '../../../../../collections/base-collection.js';
import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import UrlListView from '../../../../../views/apps/web-browser/sidebar/lists/url-list-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'favorites panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-star"></i>Favorites</label>

			<div class="buttons">
				<button type="button" class="add-favorites success btn btn-sm" data-toggle="tooltip" title="Add to Favorites">
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
	// getting methods
	//

	getSelected: function() {
		return this.getChildView('items').getSelected();
	},

	//
	// adding methods
	//

	addFavorites: function(items, options) {
		let data = {};

		// add to global favorites
		//
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			let name = item.get('name');
			let value = item.get('url');
			data[name] = value;
		}

		// save user favorites
		//
		this.collection.save(data, {

			// callbacks
			//
			success: (collection) => {

				// update list
				//
				this.showFavorites(collection);

				// play new sound
				//
				application.play('new');

				// perform callback
				//
				if (options && options.success) {
					options.success();
				}
			}
		});
	},

	deleteFavorites: function(items, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				title: "Remove from Favorites",
				message: "Are you sure you want to delete " +
					(items.length == 1? '"' + items[0].model.get('name') + '"' : "these " + items.length + " items") +
					" from your list of favorites?",

				// callbacks
				//
				accept: () => {
					this.deleteFavorites(items, _.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// remove from favorites
			//
			for (let i = 0; i < items.length; i++) {
				this.collection.unset(items[i].model.get('name'));
			}

			// save user favorites
			//
			this.collection.save({}, {

				// callbacks
				//
				success: (collection) => {

					// update list
					//
					this.showFavorites(collection);

					// play remove sound
					//
					application.play('remove');

					// perform callback
					//
					if (options && options.success) {
						options.success();
					}
				}
			});
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SideBarPanelView.prototype.onRender.call(this);

		// check if we have favorites or if we need to fetch them
		//
		if (!this.collection && application.session.user) {
			this.request = this.fetchAndShowFavorites();
		} else {
			this.showFavorites(this.constructor.favorites);
		}
	},

	fetchAndShowFavorites: function() {
		return new WebFavorites(config.apps.web_browser.favorites).fetchByUser(application.session.user, {

			// callbacks
			//
			success: (model) => {
				if (Object.keys(model.attributes).length == 0) {
					model.reset();
				}
				this.constructor.favorites = model;
				this.showFavorites(model);
			}
		});
	},

	showFavorites: function(favorites) {

		// create new list of favorites
		//
		this.showChildView('items', new UrlListView({
			collection: new BaseCollection(favorites.toItems()),

			// options
			//
			empty: "No favorites.",

			// capabilities
			//
			selectable: true,
			draggable: false,
			droppable: true,
			editable: false,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			ondropon: (items) => this.onDropOn(items)
		}));
	},

	//
	// mouse event handling methods
	//

	onClickAddFavorites: function() {
		this.getParentView('app').addToFavorites();
	},

	//
	// selection event handling methods
	//

	onSelect: function(item) {

		// set address to favorite's url
		//
		let url = item.model.get('url');
		this.app.onSelect(item);
		this.app.setAddress(url);

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect(item);
		}
	},

	onDeselect: function(item) {
		this.app.onDeselect(item);

		// perform callback
		//
		if (this.options.ondeselect) {
			this.options.ondeselect(item);
		}
	},

	//
	// drag and drop event handling methods
	//

	onDropOn: function(items) {

		// perform callback
		//
		if (this.options.ondropon) {
			this.options.ondropon(items);
		}
	}
});