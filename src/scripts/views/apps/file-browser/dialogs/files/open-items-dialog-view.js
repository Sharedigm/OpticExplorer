/******************************************************************************\
|                                                                              |
|                          open-items-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box to open a file or directory.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Directory from '../../../../../models/storage/directories/directory.js';
import DialogView from '../../../../../views/dialogs/dialog-view.js';
import FileBrowserView from '../../../../../views/apps/file-browser/file-browser-view.js';
import AddressBarView from '../../../../../views/apps/file-browser/footer-bar/address-bar/address-bar-view.js';

export default DialogView.extend({

	//
	// attributes
	//
	
	className: 'modal dialog',

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<%= icon %>
					</div>
					<div class="title">
						<%= title %>
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
				
				<div class="modal-footer">
					<div class="address-bar"></div>
					
					<div class="buttons">
						<button class="open btn btn-primary" data-dismiss="modal">
							<i class="fa fa-check"></i>Open
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
			el: '.modal-body',
			replaceElement: true
		},
		address: {
			el: '.address-bar',
			replaceElement: true
		}
	},

	events: _.extend({}, DialogView.prototype.events, {
		'click button.open': 'onClickOpenButton'
	}),

	//
	// dialog attributes
	//
	
	icon: '<i class="fa fa-folder-open"></i>',
	title: "Open",

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (this.options.title) {
			this.title = this.options.title;
		}

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
	// querying methods
	//

	hasSelected: function() {
		return this.getChildView('file_browser').hasSelected() == true;
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

	setDisabled: function(disabled) {
		this.$el.find('.modal-footer .open').prop('disabled', disabled);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.icon,
			title: this.title
		};
	},

	onRender: function() {
		
		// call superclass method
		//
		DialogView.prototype.onRender.call(this);

		// show child views
		//
		this.showFileBrowser();
		this.showAddressBar();
	},

	showFileBrowser: function() {
		this.showChildApp('file_browser', {
			model: this.model,

			// options
			//
			filter: this.filter || this.options.filter,
			parent: FileBrowserView.root,

			// state
			//
			selected: this.options.selected,

			// callbacks
			//
			onopen: (items) => this.onOpen(items),
			onchange: () => this.onChange(),
			onselect: () => this.update(),
			ondeselect: () => this.update()
		});
	},

	showAddressBar: function() {
		this.showChildView('address', new AddressBarView({
			model: this.model,

			// callbacks
			//
			onclick: (path) => {
				this.setDirectory(new Directory({
					path: path
				}));
			}
		}));
	},

	update: function() {
		this.setDisabled(!this.hasSelected());	
	},

	//
	// event handling methods
	//

	onChange: function() {

		// update address
		//
		if (this.hasChildView('address')) {
			this.getChildView('address').model = this.getChildView('file_browser').getActiveModel();
			this.getChildView('address').onChange();
		}
	},

	//
	// mouse event handling methods
	//

	onClickOpenButton: function() {
		let selected = this.getChildView('file_browser').getSelectedModels();

		// no items selected, return current directory
		//
		if (selected.length == 0) {
			selected = [this.getChildView('file_browser').getActiveModel()];
		}

		// open selected item
		//
		if (selected && this.options.onopen) {
			this.options.onopen(selected);	
		}

		this.close();
	},

	//
	// file event handling methods
	//

	onOpen: function(items) {

		// close dialog
		//
		this.hide();

		// open selected items
		//
		if (items && this.options.onopen) {
			return this.options.onopen(items);
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		this.getChildView('file_browser').onKeyDown(event);
	}
});