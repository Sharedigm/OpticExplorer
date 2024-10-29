/******************************************************************************\
|                                                                              |
|                                nav-bar-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a navigation toolbar.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ToolbarView from '../../../../../views/apps/common/toolbars/toolbar-view.js';
import BackButtonView from '../../../../../views/apps/file-browser/header-bar/nav-bar/buttons/back-button-view.js';
import ForwardButtonView from '../../../../../views/apps/file-browser/header-bar/nav-bar/buttons/forward-button-view.js';
import UpButtonView from '../../../../../views/apps/file-browser/header-bar/nav-bar/buttons/up-button-view.js';
import NewFolderButtonView from '../../../../../views/apps/file-browser/header-bar/nav-bar/buttons/new-folder-button-view.js';
import DeleteItemsButtonView from '../../../../../views/apps/file-browser/header-bar/nav-bar/buttons/delete-items-button-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="back" data-toggle="tooltip" title="Back" data-placement="bottom"></div>
		<div class="forward" data-toggle="tooltip" title="Forward" data-placement="bottom"></div>
		<div class="up" data-toggle="tooltip" title="Up" data-placement="bottom"></div>
		<div class="new" data-toggle="tooltip" title="New Folder" data-placement="bottom"></div>
		<div class="delete" data-toggle="tooltip" title="Delete" data-placement="bottom"></div>
	`),

	regions: {
		back: '.back',
		forward: '.forward',
		up: '.up',
		new: '.new',
		delete: '.delete',
	},

	history: {
		prev: [],
		next: []			
	},

	visible: function() {
		let isDesktop = this.app.isDesktop();
		let hasSelected = this.app.hasSelected();

		return {
			back: true && !isDesktop,
			forward: true && !isDesktop,
			up: true && !isDesktop,
			new: !hasSelected,
			delete: hasSelected
		};
	},

	enabled: function() {
		return {
			back: this.history.prev.length != 0,
			forward: this.history.next.length != 0,
			up: this.parent.app.hasActiveModel() && this.parent.app.getActiveModel().hasParent(),
			new: true,
			delete: true
		};
	},

	//
	// setting methods
	//

	setDirectory: function(directory, options) {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(directory, options);
		}

		// update buttons
		//
		this.update();
	},

	//
	// navigating methods
	//

	pushDirectory: function(directory, options) {

		// save previous directory
		//
		this.history.prev.push(this.app.model);

		// set to new directory
		//
		this.setDirectory(directory, options);
	},

	popDirectory: function() {
		if (this.history.prev.length > 0) {

			// save current directory
			//
			this.history.next.push(this.app.model);

			// set to prev directory
			//
			this.setDirectory(this.history.prev.pop());
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ToolbarView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('back', new BackButtonView());
		this.showChildView('forward', new ForwardButtonView());
		this.showChildView('up', new UpButtonView());
		this.showChildView('new', new NewFolderButtonView());
		this.showChildView('delete', new DeleteItemsButtonView());

		// set initial state
		//
		this.getChildView('delete').$el.addClass('hidden');
		this.update();
	},

	//
	// selection event handling methods
	//

	onSelect: function() {
		this.update();
	},

	onDeselect: function() {
		this.update();
	}
});