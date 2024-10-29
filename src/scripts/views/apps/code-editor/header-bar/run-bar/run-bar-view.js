/******************************************************************************\
|                                                                              |
|                                run-bar-view.js                               |
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
import RunButtonView from '../../../../../views/apps/code-editor/header-bar/run-bar/buttons/run-button-view.js';
import StopButtonView from '../../../../../views/apps/code-editor/header-bar/run-bar/buttons/stop-button-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="run" data-toggle="tooltip" title="Run" data-placement="bottom"></div>
		<div class="stop" data-toggle="tooltip" title="Stop" data-placement="bottom"></div>
	`),

	regions: {
		run: '.run',
		stop: '.stop'
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
		this.showChildView('run', new RunButtonView());
		this.showChildView('stop', new StopButtonView());
	}
});