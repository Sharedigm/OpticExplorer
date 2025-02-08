/******************************************************************************\
|                                                                              |
|                                terminal-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for viewing a terminal.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import AppView from '../../../views/apps/common/app-view.js';
import HeaderBarView from '../../../views/apps/terminal/header-bar/header-bar-view.js';
import CommandLineView from '../../../views/apps/terminal/mainbar/command-line-view.js';
import FooterBarView from '../../../views/apps/terminal/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/terminal/forms/preferences/preferences-form-view.js'

export default AppView.extend({

	//
	// attributes
	//

	name: 'terminal',

	//
	// getting methods
	//

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// closing methods
	//

	close: function() {

		// close parent dialog
		//
		this.dialog.close();
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		AppView.prototype.onRender.call(this);

		// show child views
		//
		this.showHeaderBar();
		this.showContents();
		this.showFooterBar();

		// load menus
		//
		this.onLoad();
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView();
	},

	//
	// contents rendering methods
	//

	getContentsView: function() {
		return new CommandLineView({

			// options
			//
			preferences: this.preferences
		});
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView();
	},

	//
	// keyboard handling methods
	//

	onKeyDown: function(event) {

		// call superclass method
		//
		AppView.prototype.onKeyDown.call(this, event);

		// pass event to main view
		//
		if (!event.isPropagationStopped()) {
			this.getChildView('contents').onKeyDown(event);
		}
	},

	//
	// window event handling methods
	//

	onResize: function(event) {
		this.getChildView('contents').onResize(event);
	}
}, {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});