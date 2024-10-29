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

import EditableTabPaneView from '../../../../../../views/apps/common/mainbar/tabbed-content/editable-tab-panes/editable-tab-pane-view.js';
import TuneSplitView from '../../../../../../views/apps/tune-editor/mainbar/tunes/tune-split-view.js';

export default EditableTabPaneView.extend({

	//
	// getting methods
	//

	getTrackTime: function() {
		return this.getChildView('content').getTrackTime();
	},

	getCursor: function() {
		return this.getChildView('content').getCursor();
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		this.getChildView('content').setOption(key, value);
	},

	setTrackTime: function(time) {
		return this.getChildView('content').setTrackTime(time);
	},

	//
	// playing methods
	//

	play: function() {
		this.getChildView('content').play();
	},

	pause: function() {
		this.getChildView('content').pause();
	},

	//
	// loading methods
	//

	loadFile: function(model) {
		
		// set attributes
		//
		this.model = model;

		// read text file contents
		//
		if (this.model && !this.model.isNew()) {
			this.model.read({

				// callbacks
				//
				success: (data) => {

					// show tab to be rendered
					//
					this.parent.parent.setActiveIndex(this.options.index);

					// show tune
					//
					this.getChildView('content').loadTune(data);
					this.onLoad();
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not read tune file.",
						response: response
					});
				}
			});
		} else {

			// set tune to empty contents
			//
			this.getChildView('content').loadTune(this.options.sample);
			this.onLoad();
		}
	},

	//
	// rendering methods
	//

	getContentView: function() {
		return new TuneSplitView(this.options);
	},

	onAttach: function() {

		// set initial state
		//
		if (this.options.active) {
			this.setActive(true);
		}

		// load contents
		//
		this.loadFile(this.model);
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// perform callback
		//		
		if (this.options.onload) {
			this.options.onload();
		}
	},

	//
	// window event handling methods
	//

	onResize: function(event) {
		if (this.hasChildView('content')) {
			this.getChildView('content').onResize(event);
		}
	}
});