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

import FileFavorites from '../../../../../models/favorites/file-favorites.js';
import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import AudioFavoritesView from '../../../../../views/apps/audio-player/sidebar/lists/audio-favorites-view.js';

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

		// check if we need to fetch favorites
		//
		if (!this.constructor.favorites && application.session.user) {
			this.request = this.fetchAndShowFavorites();
		} else {
			this.showFavorites(this.constructor.favorites);
		}
	},

	fetchAndShowFavorites: function() {
		return new FileFavorites({
			category: 'code',
			defaults: config.apps.audio_player.favorites,
		}).clear().fetchByUser(application.session.user, {

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

		// show list of favorites
		//
		this.showChildView('items', new AudioFavoritesView({

			// options
			//
			favorites: favorites,

			// capabilities
			//
			selectable: true,
			editable: false,
			draggable: true,
			droppable: true,
			uploadable: false,

			// callbacks
			//
			onchange: this.options.onchange,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		}));
	},

	//
	// dialog rendering methods
	//

	showOpenDialog: function() {
		import(
			'../../../../../views/apps/audio-player/dialogs/audio/open-audio-dialog-view.js'
		).then((OpenAudioDialogView) => {

			// show open dialog
			//
			this.getParentView('app').show(new OpenAudioDialogView.default({
				model: this.getParentView('app').getHomeDirectory(),

				// options
				//
				title: "Add Favorites",

				// callbacks
				//
				onopen: (items) => {

					// add selected items to favorites
					//
					this.getChildView('items').addFavorites(items, {

						// callbacks
						//
						success: () => {

							// play add sound
							//
							application.play('add');
						}
					});
				}
			}));
		});
	},

	//
	// mouse event handling methods
	//

	onClickAddFavorites: function() {
		this.showOpenDialog();
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
	}
});