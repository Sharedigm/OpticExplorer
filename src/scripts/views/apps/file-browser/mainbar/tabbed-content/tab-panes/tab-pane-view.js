/******************************************************************************\
|                                                                              |
|                               tab-pane-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying code tabs.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TabPaneView from '../../../../../../views/apps/common/mainbar/tabbed-content/tab-panes/tab-pane-view.js';
import ContainableSelectable from '../../../../../../views/behaviors/containers/containable-selectable.js';
import EditableFilesView from '../../../../../../views/apps/file-browser/mainbar/files/editable-files-view.js';

export default TabPaneView.extend(_.extend({}, ContainableSelectable, {

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('content')) {
			this.getChildView('content').each(callback, filter, options);
		}
	},

	//
	// querying methods
	//

	hasDetails: function() {
		return this.options.preferences? this.options.preferences.has('detail_kind') : false;
	},

	//
	// getting methods
	//

	getDetails: function() {
		if (!this.options.preferences) {
			return [];
		}

		// get details
		//
		let details = this.options.preferences.get('properties');

		// add detail kind
		//
		if (this.options.preferences.has('detail_kind')) {
			details.push(this.options.preferences.get('detail_kind'))
		}

		return details;
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		this.getChildView('content').setOption(key, value);
	},

	setModel: function(model) {
		this.model.set(model.attributes);
		this.model.contents = model.contents;
	},

	//
	// rendering methods
	//

	getContentView: function() {
		return new EditableFilesView(_.extend({}, this.options, {
			model: this.model,
			collection: this.model.contents
		}));
	},

	onRender: function() {
		if (!this.model.loaded || this.hasDetails()) {

			// show loading message
			//
			this.getParentView('app').showMessage("Loading folder...", {
				icon: '<i class="fa fa-spin fa-spinner"></i>',
			});

			// load directory content
			//
			this.request = this.model.load({
				details: this.getDetails(),

				// callbacks
				//
				success: (model) => {
					this.showContent();

					// perform callback
					//
					if (this.options.onload) {
						this.options.onload(model);
					}
				}
			});
		} else {
			this.showContent();

			// perform callback
			//
			if (this.options.onload) {
				this.options.onload();
			}
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
}));