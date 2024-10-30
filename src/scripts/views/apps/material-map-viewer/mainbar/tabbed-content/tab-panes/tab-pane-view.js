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
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TabPaneView from '../../../../../../views/apps/common/mainbar/tabbed-content/tab-panes/tab-pane-view.js';
import MaterialsPanelView from '../../../../../../views/apps/material-map-viewer/mainbar/tabbed-content/panels/materials-panel-view.js';

export default TabPaneView.extend({

	//
	// querying methods
	//

	hasSelected: function() {
		return this.getChildView('content').hasSelected();
	},

	//
	// getting methods
	//

	getZoom: function() {
		return this.getChildView('viewport').scale * 100;
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		this.getChildView('content').setOption(key, value);
	},

	setActive: function(active) {

		// call superclass method
		//
		TabPaneView.prototype.setActive.call(this, active);

		// perform callback
		//
		if (active) {
			if (this.options.onactivate) {
				this.options.onactivate();
			}
		} else {
			if (this.options.ondeactivate) {
				this.options.ondeactivate();
			}			
		}

		if (active) {
			this.onResize();
		}
	},

	//
	// loading methods
	//

	loadFile: function(model, options) {

		// set attributes
		//
		if (model) {
			this.model = model;
		}

		// read text file contents
		//
		if (!this.model.isNew()) {
			this.readFile(model, {

				// callbacks
				//
				success: (data) => {
					this.onLoad();

					// perform callback
					//
					if (options && options.success) {
						options.success(data);
					}
				}
			});
		} else {
			this.onLoad();
		}
	},

	readFile: function(file, options) {
		file.read({

			// callbacks
			//
			success: (text) => {
				this.getParentView('app').parseFile(file, text, {

					// callbacks
					//
					success: (data) => {

						// perform callback
						//
						if (options && options.success) {
							options.success(data);
						}
					}
				});
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not read file.",
					response: response
				});
			}
		});
	},

	//
	// rendering methods
	//

	onAttach: function() {

		// call superclass method
		//
		TabPaneView.prototype.onAttach.call(this);

		// load tab pane contents
		//
		this.loadFile(this.model);
	},

	getContentView: function() {
		return new MaterialsPanelView({

			// options
			//	
			preferences: this.options.preferences,
			show_grid: true,
			show_axes: true,

			// callbacks
			//
			onmousemove: this.options.onmousemove,
			onchange: this.options.onchange,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			ondropin: this.options.ondropin
		});
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.loaded = true;

		// perform callback
		//
		if (this.options.onload) {
			this.options.onload();
		}
	}
});