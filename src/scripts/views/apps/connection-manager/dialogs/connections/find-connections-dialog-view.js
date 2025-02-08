/******************************************************************************\
|                                                                              |
|                         find-connections-dialog-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box to find and create a new connection.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Users from '../../../../../collections/users/users.js';
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
					<div class="address-bar"></div>
					
					<div class="buttons">
						<button class="connect btn btn-primary" data-dismiss="modal" disabled>
							<i class="fa fa-handshake"></i>Connect
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
		profile_browser: {
			el: '.modal-body',
			replaceElement: true
		},
	},

	events: _.extend({}, DialogView.prototype.events, {
		'click button.connect': 'onClickConnect'
	}),

	//
	// dialog attributes
	//
	
	icon: '<i class="fa fa-search"></i>',
	title: "Find Connections",

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
		this.showProfileBrowser();
	},

	showProfileBrowser: function() {
		this.showChildApp('profile_browser', {
			model: this.model,

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

	onShown: function() {

		// call superclass method
		//
		DialogView.prototype.onShown.call(this);

		// set focus to search input
		//
		this.$el.find('input[type="search"]').focus();
	},
	
	update: function() {

		// update buttons
		//
		this.$el.find('.modal-footer .connect').prop('disabled', 
			!this.getChildView('profile_browser').hasSelected());
	},

	//
	// dialog rendering methods
	//

	showConnectionRequestDialog: function(users) {
		import(
			'../../../../../views/apps/connection-manager/dialogs/connections/connection-request-dialog-view.js'
		).then((ConnectionRequestDialogView) => {

			// show connection request dialog
			//
			application.show(new ConnectionRequestDialogView.default({
				model: application.session.user,
				collection: new Users(users)
			}));
		});
	},

	//
	// mouse event handling methods
	//

	onClickConnect: function() {
		let selected = this.getChildView('profile_browser').getSelectedModels();

		// open selected item
		//
		if (selected && selected.length > 0) {
			if (this.options.onconnect) {
				this.options.onconnect(selected);	
			} else {
				this.showConnectionRequestDialog(selected);
			}
		}

		// close dialog
		//
		this.close();
	},

	//
	// file event handling methods
	//

	onOpen: function(item) {

		// show selected user
		//
		application.showUser(item.model);
	},

	onChange: function() {

		// do nothing
		//
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		this.getChildView('profile_browser').onKeyDown(event);
	}
});