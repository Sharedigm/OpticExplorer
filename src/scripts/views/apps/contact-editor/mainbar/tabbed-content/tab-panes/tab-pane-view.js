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
import ContactView from '../../../../../../views/apps/contact-editor/mainbar/contacts/contact-view.js';

export default EditableTabPaneView.extend({

	//
	// loading methods
	//

	loadFile: function(model) {
		
		// set attributes
		//
		this.model = model;

		// read contact file contents
		//
		if (this.model && !this.model.isNew()) {
			this.model.read({

				// callbacks
				//
				success: (data) => {
					let lines = data? data.trim('"').split(/\r?\n/) : [];

					// set contact to file contents
					//
					this.getChildView('content').setVCF(lines);
					this.onLoad();
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not read contact file.",
						response: response
					});
				}
			});
		} else {

			// set contact to file contents
			//
			this.getChildView('content').setVCF([]);
			this.onLoad();
		}
	},

	//
	// rendering methods
	//

	getContentView: function() {
		return new ContactView({

			// options
			//
			countries: this.options.countries,
			editable: this.options.editable,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,

			// handlers
			//
			onchange: () => this.onChange(),
			onadd: () => this.onChange(),
			onremove: () => this.onChange()
		});
	},

	onRender: function() {

		// call superclass method
		//
		EditableTabPaneView.prototype.onRender.call(this);

		// load contents
		//
		this.loadFile(this.model);
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// set initial state
		//
		this.setDirty(false);

		// perform callback
		//
		if (this.options.onload) {
			this.options.onload();
		}
	},

	onChange: function() {
		this.setDirty();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}	
	}
});