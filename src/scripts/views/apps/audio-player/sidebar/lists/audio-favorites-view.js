/******************************************************************************\
|                                                                              |
|                            audio-favorites-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a list of audio favorites.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Directory from '../../../../../models/storage/directories/directory.js';
import FileFavorites from '../../../../../models/favorites/file-favorites.js';
import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import Keyboard from '../../../../../views/keyboard/keyboard.js';
import FavoritesView from '../../../../../views/apps/audio-player/sidebar/favorites/favorites-view.js';

export default FavoritesView.extend({

	//
	// attributes
	//

	preferences: UserPreferences.create('file_browser', {
		view_kind: 'trees',
		detail_kind: null,
		show_hidden_files: false,
		sort_kind: null
	}),

	//
	// constructor
	//

	initialize: function(options) {

		// call superclass method
		//
		FavoritesView.prototype.initialize.call(this, options);

		// set optional parameter defaults
		//
		if (!this.options.favorites) {
			this.options.favorites = new FileFavorites({
				category: 'audio'
			});
		}
		if (!this.options.preferences) {
			this.options.preferences = this.preferences;
		}

		// initialize model
		//
		this.model = new Directory({
			contents: this.options.favorites.toItems().toArray()
		});
		this.collection = this.model.contents;
	},

	//
	// getting methods
	//

	getPaths: function() {
		let paths = [];
		for (let i = 0; i < this.collection.length; i++) {
			paths.push(this.collection.at(i).get('path'));
		}
		return paths;
	},

	//
	// favorites methods
	//

	addFavorites: function(items, options) {

		// add items to collection
		//
		for (let i = 0; i < items.length; i++) {
			this.collection.add(items[i]);
		}

		// update
		//
		this.saveFavorites(options);
	},

	removeFavorites: function(items, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm remove
			//
			application.confirm({
				title: "Remove from Favorites",
				message: "Are you sure you want to delete " + 
					(items.length == 1? '"' + items[0].getName() + '"' : "these " + items.length + " items") +
					" from your list of favorites?",

				// callbacks
				//
				accept: () => {
					this.removeFavorites(items, _.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// remove items from collection
			//
			for (let i = 0; i < items.length; i++) {
				this.collection.remove(items[i]);
			}

			// play remove sound
			//
			application.play('remove');

			// update
			//
			this.saveFavorites({

				// callbacks
				//
				success: (model) => {
					if (options && options.success) {
						options.success(model);
					}
				},

				error: (model, response) => {
					if (options && options.error) {
						options.error(model, response);
					}
				}
			});
		}
	},

	saveFavorites: function(options) {

		// update model
		//
		this.options.favorites.setPaths(this.getPaths());

		// save model
		//
		if (application.isSignedIn()) {
			this.options.favorites.save(undefined, options);
		}
	},

	//
	// event handling methods
	//

	onChange: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	//
	// file event handling methods
	//

	onOpen: function(item) {

		// open item in file browser
		//
		this.getParentView('app').openItems([item.model], {

			// callbacks
			//
			success: () => this.deselectAll()
		});
	},

	//
	// drag and drop event handling methods
	//

	onDropOnChild: function(items) {
		
		// add items to favorites
		//
		this.addFavorites(items, {

			// callbacks
			//
			success: () => {

				// play move sound
				//
				application.play('move');
			}
		});
	},
	
	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {

		// disregard handled or repeated key events
		//
		if (event.isDefaultPrevented() || event.isPropagationStopped() || Keyboard.isAutorepeat(event)) {
			return;
		}

		switch (event.keyCode) {

			// delete selected with confirmation
			//
			case Keyboard.keyCodes.backspace:
				if (!event.target.isContentEditable && this.hasSelected()) {
					this.removeItems(this.getSelectedModels(), {
						confirm: true
					});
				} else {
					return;
				}
				break;

			default:
				return;
		}

		// block event from parent
		//
		this.block(event);
	},

	//
	// window event handling methods
	//

	onResize: function() {
		this.reflow();
	},
});