/******************************************************************************\
|                                                                              |
|                           clipboard-panel-view.js                            |
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
import BaseView from '../../../../../views/base-view.js';
import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import ItemOpenable from '../../../../../views/apps/common/behaviors/opening/item-openable.js';
import FilesView from '../../../../../views/apps/file-browser/mainbar/files/files-view.js';

export default SideBarPanelView.extend(_.extend({}, ItemOpenable, {

	//
	// attributes
	//

	className: 'clipboard panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-clipboard"></i>Clipboard</label>
		</div>
		
		<div class="items"></div>
	`),

	regions: {
		'items': {
			el: '.items',
			replaceElement: true
		}
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.model = application.getDirectory('.Clipboard');

		// listen for changes to home directory
		//
		this.listenTo(application.getDirectory(), 'change', this.onChange, this);
	},

	//
	// getting methods
	//

	getSelectedModels: function() {
		return this.getChildView('items').getSelectedModels();
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SideBarPanelView.prototype.onRender.call(this);

		// load model
		//
		if (this.model && !this.model.loaded) {
			this.request = this.model.load({

				// callbacks
				//
				success: () => this.showClipboard(),
				error: () => this.showClipboard()
			});
		} else {
			this.showClipboard();
		}
	},

	showClipboard: function() {
		if (!this.model) {
			this.showEmptyClipboard();
			return;
		}

		// show file icons
		//
		this.showChildView('items', new FilesView({
			model: this.model,
			collection: this.model.contents,

			// options
			//
			preferences: UserPreferences.create('file_browser', {
				view_kind: this.options.view_kind
			}),
			empty: "No items.",

			// capabilities
			//
			selectable: true,
			editable: false,
			draggable: false,
			droppable: true,

			// callbacks
			//
			onopen: () => {
				this.openItems(this.getSelectedModels());
			}
		}));
	},

	showEmptyClipboard: function() {
		this.showChildView('items', new BaseView({
			tagName: 'ul',
			className: 'empty',
			template: template('<li>No clipboard.</li>')
		}));
	},

	//
	// event handling methods
	//

	onChange: function() {

		// update view
		//
		this.model = application.getDirectory('.Clipboard');
		this.onRender();
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