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
import BackButtonView from '../../../../../views/apps/tune-editor/header-bar/nav-bar/buttons/back-button-view.js';
import ForwardButtonView from '../../../../../views/apps/tune-editor/header-bar/nav-bar/buttons/forward-button-view.js';
import UpButtonView from '../../../../../views/apps/tune-editor/header-bar/nav-bar/buttons/up-button-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="back" data-toggle="tooltip" title="Back" data-placement="bottom"></div>
		<div class="forward" data-toggle="tooltip" title="Forward" data-placement="bottom"></div>
		<div class="up" data-toggle="tooltip" title="Up" data-placement="bottom"></div>
	`),

	regions: {
		back: '.back',
		forward: '.forward',
		up: '.up',
	},

	//
	// constructor
	//

	initialize: function() {

		// create new history
		//
		this.history = {
			prev: [],
			next: []
		};
	},

	//
	// navigating methods
	//

	pushDirectory: function(directory) {

		// save previous directory
		//
		this.history.prev.push(this.model);
		this.model = directory;

		// set to new directory
		//
		this.parent.app.setDirectory(directory);
		this.update();
	},

	popDirectory: function() {
		if (this.history.prev.length > 0) {

			// save current directory
			//
			this.history.next.push(this.model);
			this.model = this.history.prev.pop();

			// set to prev directory
			//
			this.parent.app.setDirectory(this.model);
			this.update();
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
	},

	update: function() {
		this.getChildView('back').update();
		this.getChildView('forward').update();
		this.getChildView('up').update();
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.update();
	}
});
