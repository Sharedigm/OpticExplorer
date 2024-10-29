/******************************************************************************\
|                                                                              |
|                            directory-pager-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a set of file & directory pages.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import PagerView from '../../../../../../views/items/pages/pager-view.js';
import DirectoryPagesView from '../../../../../../views/apps/file-browser/mainbar/files/pages/directory-pages-view.js';
import Keyboard from '../../../../../../views/keyboard/keyboard.js';

export default PagerView.extend({

	//
	// attributes
	//

	childView: DirectoryPagesView,

	//
	// querying methods
	//

	indexOf: function(item) {
		let index;
		let showHidden = this.options.preferences.get('show_hidden_files');

		if (showHidden) {
			index = this.collection.indexOf(item.model);
		} else {
			let items = this.collection.filter((child) => !child.isHidden());
			index = items.indexOf(item.model);
		}

		// item not found
		//
		if (index == -1) {
			index = undefined;
		}

		return index;
	},

	//
	// counting methods
	//

	numItems: function() {
		return this.model.numVisibleItems(this.options.preferences.get('show_hidden_files'));
	},

	//
	// opening methods
	//

	openCurrentItem: function() {
		let item = this.getCurrentItem();
		if (item) {
			item.open();
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

		// check non-control key events
		//
		if (!event.metaKey && !event.ctrlKey) {

			// check non control key events
			//
			switch (event.keyCode) {

				// open current item
				//
				case Keyboard.keyCodes.enter:
					this.openCurrentItem();
					break;

				// select current item
				//
				case Keyboard.keyCodes['up arrow']:
					this.selectCurrentItem();
					break;

				// go to prev item
				//
				case Keyboard.keyCodes['left arrow']:
					this.prev();
					break;

				// go to next item
				//
				case Keyboard.keyCodes['right arrow']:
					this.next();
					break;

				// deselect current item
				//
				case Keyboard.keyCodes['down arrow']:
					this.deselectCurrentItem();
					break;

				default:
					return;
			}
		} else {
			return;
		}

		// block event from parent
		//
		this.block(event);
	}
});