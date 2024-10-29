/******************************************************************************\
|                                                                              |
|                             user-photos-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for viewing a user's public photos.               |
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
import ImageFile from '../../../../../models/storage/media/image-file.js';
import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import BaseView from '../../../../../views/base-view.js';
import FilesView from '../../../../../views/apps/file-browser/mainbar/files/files-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template('<div class="gallery"></div>'),
	className: 'user photos panel',

	regions: {
		gallery: '.gallery'
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.request = new Directory({
			'public_id': this.model.get('id')
		}).load({

			// callbacks
			//
			success: (data) => {
				this.showGallery(data.contents);
			},

			error: () => {
				this.$el.prepend('No photos.');
			}
		});
	},

	showGallery: function(collection) {
		this.collection = collection;

		// filter for images
		//
		collection.set(collection.filter((model) => (model instanceof ImageFile) && !model.isHidden()));

		// check for image files
		//
		if (collection.length == 0) {
			this.$el.prepend('No photos.');
		} else if (this.hasRegion('gallery')) {

			// show image gallery
			//
			this.showChildView('gallery', new FilesView({
				collection: collection,

				// options
				//
				preferences: UserPreferences.create('file_browser', {
					view_kind: this.options.view_kind
				}),

				// callbacks
				//
				onopen: this.options.onopen
			}));
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
