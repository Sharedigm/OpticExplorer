/******************************************************************************\
|                                                                              |
|                             save-as-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box to save a file.                             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DialogView from '../../../../../views/dialogs/dialog-view.js';
import FileNameFormView from '../../../../../views/apps/file-browser/forms/files/file-name-form-view.js';
import FileBrowserView from '../../../../../views/apps/file-browser/file-browser-view.js';

export default DialogView.extend({

	//
	// attributes
	//
	
	className: 'focused modal dialog',

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<% if (icon) { %>
						<%= icon %>
						<% } else { %>
						<i class="fa fa-save"></i>
						<% } %>
					</div>
					<div class="title">
						<%= title || "Save As" %>
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="file-browser"></div>
				<div class="panel">
					<div class="file-name-form"></div>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="save btn btn-primary">
							<i class="fa fa-save"></i>Save
						</button>
						<button class="cancel btn" data-dismiss="modal">
							<i class="fa fa-xmark"></i>Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		file_browser: {
			el: '.file-browser',
			replaceElement: true
		},
		form: {
			el: '.file-name-form',
			replaceElement: true
		}
	},

	events: _.extend({}, DialogView.prototype.events, {
		'click .save': 'onClickSave'
	}),

	//
	// dialog attributes
	//

	icon: '<i class="fa fa-save"></i>',
	title: "Save As",

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		DialogView.prototype.initialize.call(this);

		// set default attributes
		//
		if (!this.model) {
			this.model = application.getDirectory();
		}
	},

	//
	// setting methods
	//

	setDirectory: function(directory) {

		// check if directory needs loading
		//
		if (!directory.loaded) {

			// load directory
			//
			directory.load({

				// callbacks
				//
				success: (model) => {
					this.setDirectory(model);
				}
			});
		} else {

			// set attributes
			//
			this.model = directory;

			// update file browser view
			//
			this.getChildView('file_browser').model = directory;
			this.getChildView('file_browser').render();
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.options.icon,
			title: this.options.title
		};
	},

	onRender: function() {
		
		// call superclass method
		//
		DialogView.prototype.onRender.call(this);

		// show child views
		//
		this.showFileBrowser();
		this.showFileNameForm();
	},

	showFileBrowser: function() {
		this.showChildApp('file_browser', {
			model: this.model,

			// options
			//
			parent: FileBrowserView.root,

			// callbacks
			//
			save: (items) => {

				// close dialog
				//
				this.hide();

				// open selected items
				//
				if (items && this.options.onopen) {
					return this.options.onopen(items);
				}
			}
		});
	},

	showFileNameForm: function() {
		this.showChildView('form', new FileNameFormView({
			filename: this.options.filename,
			extensions: this.options.extensions
		}));
	},
	
	//
	// mouse event handling methods
	//

	onClickSave: function() {

		// check form validation
		//
		if (this.getChildView('form').isValid()) {
			let directory = this.getChildView('file_browser').model;
			let filename = this.getChildView('form').getValue('filename');

			// close dialog 
			//
			this.hide();
			
			// save file
			//
			if (this.options.save) {
				return this.options.save(directory, filename);
			}
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		this.getChildView('file_browser').onKeyDown(event);
	}
});