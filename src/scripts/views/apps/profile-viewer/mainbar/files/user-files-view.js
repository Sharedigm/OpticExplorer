/******************************************************************************\
|                                                                              |
|                              user-files-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for viewing a user's files.                       |
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
import Keyboard from '../../../../../views/keyboard/keyboard.js';
import FilesView from '../../../../../views/apps/file-browser/mainbar/files/files-view.js';

export default FilesView.extend({

	//
	// attributes
	//

	className: 'user files panel',

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

				// check if view still exists
				//
				if (this.isDestroyed()) {
					return;	
				}

				// show user files
				//
				this.showFiles(data.contents);
			},

			error: () => {
				this.$el.prepend('No files.');
			}
		});
	},

	showFiles: function(collection) {

		// set attributes
		//
		this.collection = collection;

		// filter out images
		//
		collection.set(collection.filter((model) => !(model instanceof ImageFile) && !model.isHidden()));

		// check for non-image files
		//
		if (collection.length == 0) {
			this.$el.prepend('No files.');
		} else {

			// show non-image files
			//
			FilesView.prototype.onRender.call(this);
		}
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

		// disregard delete events for editable items
		//
		if (event.keyCode == Keyboard.keyCodes['delete'] && event.target.isContentEditable) {
			return;
		}
		
		// check control key events
		//
		if (event.metaKey || event.ctrlKey) {
			switch (event.keyCode) {

				// copy selected
				//
				case Keyboard.keyCodes.c:
					if (this.hasSelected()) {
						this.copy(this.getSelectedModels());
					} else {
						return;
					}
					break;

				default:
					return;
			}

		// check non control keys events
		//
		} else {
			return;
		}

		// block event from parent
		//
		this.block(event);
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
