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
import BackButtonView from '../../../../../views/apps/contact-editor/header-bar/nav-bar/buttons/back-button-view.js';
import ForwardButtonView from '../../../../../views/apps/contact-editor/header-bar/nav-bar/buttons/forward-button-view.js';
import UpButtonView from '../../../../../views/apps/contact-editor/header-bar/nav-bar/buttons/up-button-view.js';

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

	history: {
		prev: [],
		next: []			
	},

	//
	// navigating methods
	//

	pushDirectory: function(directory, options) {

		// save previous directory
		//
		this.history.prev.push(this.app.directory);

		// set to new directory
		//
		this.onChange(directory, options);

		// update back button
		//
		this.getChildView('back').setDisabled(this.history.prev.length == 0);
	},

	popDirectory: function() {
		if (this.history.prev.length > 0) {

			// save current directory
			//
			this.history.next.push(this.app.model);

			// set to prev directory
			//
			this.onChange(this.history.prev.pop());

			// update forward button
			//
			this.getChildView('forward').setDisabled(this.history.next.length == 0);
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

	//
	// event handling methods
	//

	onChange: function(directory, options) {

		// update up button
		//
		this.getChildView('up').setDisabled(!directory.hasParent());

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(directory, options);
		}
	}
});
