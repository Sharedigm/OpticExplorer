/******************************************************************************\
|                                                                              |
|                    share-with-connections-dialog-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box to share items with connections.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ShareRequests from '../../../../../collections/storage/sharing/share-requests.js';
import Users from '../../../../../collections/users/users.js';
import FormDialogView from '../../../../../views/forms/dialogs/form-dialog-view.js';
import ShareItemsMessageFormView from '../../../../../views/apps/connection-manager/forms/messages/share-items-message-form-view.js';

export default FormDialogView.extend({

	//
	// attributes
	//
	
	className: 'focused modal dialog',

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-share"></i>
					</div>
					<div class="title">
						Share <%= items || 'Files' %> with <%= names %>
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="file-browser"></div>
				<div class="panel">
					<div class="message-form"></div>
				</div>
		
				<div class="modal-footer">
					<div class="notes">
						<span class="required"></span>Fields are required
					</div>
					
					<div class="buttons">
						<button class="share btn btn-primary">
							<i class="fa fa-share"></i>Share
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
			el: '.message-form',
			replaceElement: true
		}
	},

	events: _.extend({}, FormDialogView.prototype.events, {
		'click .share': 'onClickShare'
	}),

	//
	// dialog attributes
	//

	size: undefined,

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		FormDialogView.prototype.initialize.call(this);

		// set directory
		//
		if (this.options.items) {
			this.model = this.options.items[0].parent;
		}
	},

	//
	// querying methods
	//

	isValid: function() {
		return this.hasSelected() && this.getChildView('form').isValid();
	},

	hasSelected: function() {
		return this.hasChildView('file_browser') && this.getChildView('file_browser').hasSelected();
	},

	//
	// getting methods
	//

	getSelected: function() {
		return this.getChildView('file_browser').getSelected();
	},

	getSelectedModels: function() {
		return this.getChildView('file_browser').getSelectedModels();
	},

	getItemNames: function(items) {
		if (items.length == 1) {
			return items[0].getName();
		} else {
			return items[0].getName() + ' and ' + (items.length - 1) + ' others';
		}
	},

	getConnectionNames: function(connections) {
		let names = [];
		if (connections) {
			for (let i = 0; i < connections.length; i++) {
				names.push(connections[i].getName());
			}
		}
		return names;
	},

	getValue: function(key) {
		return this.getChildView('form').getValue(key);
	},

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('.share').prop('disabled', disabled !== false);
	},

	//
	// sending methods
	//

	shareItems: function(items, options) {

		// create and save collection
		//
		ShareRequests.create(items, this.options.connections, {
			message: this.getValue('message'),
			copy: this.getValue('share_as') == 'copy'
		}).save(options);
	},

	share: function() {
		let items = this.getSelectedModels();
		let names = this.getConnectionNames(this.options.connections);

		// submit form
		//
		this.shareItems(items, {
			
			// callbacks
			//
			success: () => {

				// increment share counts
				//
				for (let i = 0; i < items.length; i++) {
					items[i].set({
						num_shares: items[i].get('num_shares') + names.length
					});
				}

				// play send sound
				//
				application.play('send');
				
				// close dialog
				//
				this.hide();

				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-envelope"></i>',
					title: 'Share Invitations Sent',
					message: names.toList() + ' ' + (names.length == 1? 'has' : 'have') + ' been sent ' +
						(names.length == 1? 'an invitation' : 'invitations') + ' to share these items.'
				});
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not send share invitations.",
					response: response
				});
			}
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			items: this.model? this.model.getName() : undefined,
			names: this.options.connections? this.getConnectionNames(this.options.connections) : '',
			disabled: !this.options.connections || this.options.connections.length == 0 ||
				!this.options.items || this.options.items.length == 0
		};
	},

	onRender: function() {
		
		// call superclass method
		//
		FormDialogView.prototype.onRender.call(this);

		// show child views
		//
		this.showFileBrowser();

		// set initial state
		//
		this.setDisabled(true);
	},

	showFileBrowser: function() {
		this.showChildApp('file_browser', {
			model: this.model,

			// options
			//
			selected: this.options.items,

			// callbacks
			//
			onselect: () => this.onChange(),
			ondeselect: () => this.onChange()
		});
	},

	form: function() {
		return new ShareItemsMessageFormView({
			collection: new Users(this.options.connections),

			// options
			//
			message: this.options.message,

			// callbacks
			//
			onvalidate: () => this.onChange()
		});
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.setDisabled(!this.isValid());
	},

	//
	// mouse event handling methods
	//

	onClickShare: function() {
		this.share();
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		this.getChildView('file_browser').onKeyDown(event);
	}
});