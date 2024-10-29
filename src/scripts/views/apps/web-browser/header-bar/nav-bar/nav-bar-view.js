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
import BackButtonView from '../../../../../views/apps/web-browser/header-bar/nav-bar/buttons/back-button-view.js';
import ForwardButtonView from '../../../../../views/apps/web-browser/header-bar/nav-bar/buttons/forward-button-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="back" data-toggle="tooltip" title="Back" data-placement="bottom"></div>
		<div class="forward" data-toggle="tooltip" title="Forward" data-placement="bottom"></div>
	`),

	regions: {
		back: '.back',
		forward: '.forward'
	},

	history: [],

	//
	// querying methods
	//

	disabled: function() {
		return {
			back: this.history.current == 0,
			forward: this.history.current == this.history.length - 1
		};
	},

	//
	// navigating methods
	//

	push: function(address) {

		// update history
		//
		this.history.push(address);
		this.history.current = this.history.length - 1;

		// update buttons
		//
		this.update();
	},

	back: function() {
		if (this.history.current != undefined && 
			this.history[this.history.current - 1]) {

			// update history
			//
			this.history.current--;
			this.parent.setAddress(this.history[this.history.current], {
				silent: true
			});

			// update buttons
			//
			this.update();
		}
	},

	forward: function() {
		if (this.history.current != undefined &&
			this.history[this.history.current + 1]) {

			// update history
			//
			this.history.current++;
			this.parent.setAddress(this.history[this.history.current], {
				silent: true
			});

			// update buttons
			//
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
		this.showChildView('back', new BackButtonView({
			model: this.model,
			disabled: true
		}));
		this.showChildView('forward', new ForwardButtonView({
			model: this.model,
			disabled: true
		}));
	}
});
