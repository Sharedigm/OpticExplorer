/******************************************************************************\
|                                                                              |
|                      select-connections-dialog-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box to select a set of connections.             |
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
					<div class="buttons">
						<button class="select btn btn-primary" data-dismiss="modal"<% if (disabled) { %>disabled<% } %>>
							<i class="fa fa-check"></i>Select
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
		connection_manager: {
			el: '.modal-body',
			replaceElement: true
		}
	},

	events: _.extend({}, DialogView.prototype.events, {
		'click button.select': 'onClickSelect'
	}),

	//
	// dialog attributes
	//

	icon: '<i class="fa fa-user-friends"></i>',
	title: "Select Connections",

	//
	// querying methodsd
	//

	hasSelected: function() {
		if (this.hasChildView('connection_manager')) {
			return this.getChildView('connection_manager').getChildView('content').hasSelected();
		}
	},

	//
	// getting methods
	//

	getSelected: function() {
		return this.getChildView('connection_manager').getChildView('content').getSelected();
	},

	getSelectedModels: function() {
		return this.getChildView('connection_manager').getChildView('content').getSelectedModels();
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
			this.getChildView('connection_manager').model = directory;
			this.getChildView('connection_manager').render();
		}
	},

	setDisabled: function(disabled) {
		this.$el.find('.modal-footer .select').prop('disabled', disabled !== false);
	},
	
	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.icon,
			title: this.title,
			disabled: !this.options.selected
		};
	},

	onRender: function() {
		
		// call superclass method
		//
		DialogView.prototype.onRender.call(this);

		// show child views
		//
		this.showConnectionManager();

		// set initial state
		//
		this.setDisabled(true);
	},

	showConnectionManager: function() {
		this.showChildApp('connection_manager', {
			model: this.model,

			// options
			//
			filter: this.filter || this.options.filter,

			// state
			//
			selected: this.options.selected,
			
			// callbacks
			//
			onopen: (items) => this.onOpen(items),
			onselect: () => this.update(),
			ondeselect: () => this.update()
		});
	},

	update: function() {
		this.setDisabled(!this.hasSelected());
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
	// mouse event handling methods
	//

	onClickSelect: function() {
		let selected = this.getSelectedModels();
		if (selected && this.options.select) {
			return this.options.select(selected);
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {

		// check menu keyboard shortcuts
		//
		if (this.hasChildView('connection_manager')) {
			this.getChildView('connection_manager').onKeyDown(event);
		}
	}
});