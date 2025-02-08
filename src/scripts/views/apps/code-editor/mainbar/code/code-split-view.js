/******************************************************************************\
|                                                                              |
|                              code-split-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying code files.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SplitView from '../../../../../views/layout/split-view.js';
import EditableCodeView from '../../../../../views/apps/code-editor/mainbar/code/editable-code-view.js';
import ConsoleView from '../../../../../views/apps/code-editor/mainbar/code/console-view.js';

export default SplitView.extend({

	//
	// attributes
	//

	orientation: 'vertical',
	flipped: true,

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {
			
			// mainbar options
			//
			case 'show_console':
				this.setSideBarVisibility(value);
				break;
			case 'console_size':
				this.setSideBarSize(value);
				break;

			default:
				this.getChildView('mainbar').setOption(key, value);
		}
	},

	//
	// rendering methods
	//

	getSideBarView: function() {
		return new ConsoleView({
			model: this.model
		});
	},

	getContentView: function() {
		return new EditableCodeView({
			model: this.model,

			// options
			//
			preferences: this.options.preferences,

			// callbacks
			//
			onchange: this.options.onchange,
			onchangeselection: this.options.onchangeselection
		});
	}
});