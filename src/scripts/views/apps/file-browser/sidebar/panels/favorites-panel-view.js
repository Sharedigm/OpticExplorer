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

import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import FavoritesView from '../../../../../views/apps/file-browser/sidebar/favorites/favorites-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'favorites panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-star"></i>Favorites</label>

			<div class="buttons">
				<button type="button" class="add-favorites success btn btn-sm" data-toggle="tooltip" title="Add Favorites">
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
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SideBarPanelView.prototype.onRender.call(this);

		// fetch favorites
		//
		if (!this.app.hasFavorites() && application.isSignedIn()) {
			this.request = this.fetchAndShowFavorites();
		} else {
			this.showFavorites(this.app.getFavorites());
		}
	},

	fetchAndShowFavorites: function() {
		return this.app.getFavorites().clear().fetchByUser(application.session.user, {

			// callbacks
			//
			success: (model) => {

				// check if view still exists
				//
				if (this.isDestroyed()) {
					return;
				}

				// update favorites list
				//
				if (Object.keys(model.attributes).length == 0) {
					model.reset();
				}
				this.app.setFavorites(model);
				this.showFavorites(model);
			}
		});
	},

	showFavorites: function(favorites) {

		// show list of favorites
		//
		this.showChildView('items', new FavoritesView({
			model: favorites,

			// options
			//
			preferences: UserPreferences.create('file_browser', {
				// view_kind: this.options.view_kind
				view_kind: 'lists'
			}),
			empty: "No favorites.",

			// capabilities
			//
			selectable: true,
			editable: false,
			draggable: false,
			droppable: true,

			// callbacks
			//
			onchange: this.options.onchange,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		}));
	},

	//
	// mouse event handling methods
	//

	onClickAddFavorites: function() {
		this.app.showAddFavoritesDialog();
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		if (this.hasChildView('items')) {
			this.getChildView('items').onKeyDown(event);
		}
	},

	//
	// window event handling methods
	//

	onResize: function(event) {
		if (this.hasChildView('items')) {
			this.getChildView('items').onResize(event);
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// abort request
		//
		if (this.request && this.request.state() == 'pending') {
			this.request.abort();
		}
	}
});