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
import CodeSplitView from '../../../../../../views/apps/code-editor/mainbar/code/code-split-view.js';

export default EditableTabPaneView.extend({

	//
	// getting methods
	//

	getLanguage: function(extension) {
		if (window.config.files.languages.extensions[extension]) {
			return window.config.files.languages.extensions[extension];
		} else {
			return extension;
		}
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		this.getChildView('content').setOption(key, value);
	},

	setLanguage: function(language) {
		this.getChildView('content mainbar').setLanguage(language);
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

					// set code to file contents
					//
					if (this.hasChildView('content mainbar')) {
						this.getChildView('content mainbar').loadText(data);
						this.onLoad();
					}
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not read code file.",
						response: response
					});
				}
			});
		} else {

			// set code to file contents
			//
			this.getChildView('content mainbar').loadText(this.model? this.model.get('contents') : '');
			this.onLoad();
		}
	},

	//
	// rendering methods
	//

	getContentView: function() {
		return new CodeSplitView(this.options);
	},

	onRender: function() {

		// call superclass method
		//
		EditableTabPaneView.prototype.onRender.call(this);

		// set language / styling
		//
		let extension = this.model? this.model.getFileExtension() : '';
		let language = this.getLanguage(extension);
		if (language) {
			this.setLanguage(language);
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
		if (this.hasChildView('content mainbar')) {
			this.getChildView('content mainbar').onResize(event);
		}
	}
});