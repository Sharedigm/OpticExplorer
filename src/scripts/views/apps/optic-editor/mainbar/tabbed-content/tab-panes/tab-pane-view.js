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

import EditableTabPaneView from '../../../../../../views/apps/common/mainbar/tabbed-content/editable-tab-panes/editable-tab-pane-view.js';
import OpticsPanelView from '../../../../../../views/apps/optic-editor/mainbar/tabbed-content/panels/optics-panel-view.js';

export default EditableTabPaneView.extend({

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
		EditableTabPaneView.prototype.setActive.call(this, active);

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

	readFile: function(file) {
		file.read({

			// callbacks
			//
			success: (text) => {
				this.getParentView('app').parseFile(file, text, {

					// callbacks
					//
					success: (optics) => {

						// set attributes
						//
						this.optics = optics;

						// update views
						//
						if (this.hasChildView('content')) {
							this.getChildView('content').showOptics(optics);
						}
						this.onLoad();
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
		EditableTabPaneView.prototype.onAttach.call(this);

		// load tab pane contents
		//
		this.loadFile(this.model);
	},

	getContentView: function() {
		return new OpticsPanelView({
			model: this.optics,

			// options
			//
			preferences: this.options.preferences,
			show_sidebar: this.options.show_sidebar,
			sidebar_size: this.options.sidebar_size,

			// callbacks
			//
			onmousemove: this.options.onmousemove,
			onchange: this.options.onchange,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onchangeselection: this.options.onchangeselection,
			onopen: this.options.onopen,
			ondropin: this.options.ondropin,
			onreorder: this.options.onreorder
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