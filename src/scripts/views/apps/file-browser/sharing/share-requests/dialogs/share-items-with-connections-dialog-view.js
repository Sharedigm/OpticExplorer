/******************************************************************************\
|                                                                              |
|                  share-items-with-connections-dialog-view.js                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for sharing items with connections.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormDialogView from '../../../../../../views/forms/dialogs/form-dialog-view.js';
import ShareItemsWithConnectionsFormView from '../../../../../../views/apps/file-browser/sharing/share-requests/forms/share-items-with-connections-form-view.js';

export default FormDialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-share"></i>
					</div>
					<div class="title">
						Share <%= items || 'Files' %> with Connections
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
				
				<div class="modal-footer">
					<div class="notes">
						<span class="required"></span>Fields are required
					</div>
					
					<div class="buttons">
						<button class="share btn btn-primary" data-dismiss="modal"<% if (disabled) { %> disabled<% } %>>
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

	events: _.extend({}, FormDialogView.prototype.events, {
		'click .share': 'onClickShare'
	}),

	//
	// dialog attributes
	//

	size: config.defaults.dialogs.sizes.small,
	
	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('.share').prop('disabled', disabled !== false);
	},

	//
	// sharing methods
	//

	share: function() {
		let names = this.getChildView('form').getConnectionNames();
		
		// submit form
		//
		this.getChildView('form').submit({
			
			// callbacks
			//
			success: () => {

				// increment share counts
				//
				if (this.options.items) {
					for (let i = 0; i < this.options.items.length; i++) {
						this.options.items[i].set({
							num_shares: this.options.items[i].get('num_shares') + names.length
						});
					}
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
			disabled: !this.options.connections || this.options.connections.length == 0 ||
				!this.options.items || this.options.items.length == 0
		};
	},

	form: function() {
		return new ShareItemsWithConnectionsFormView({
			model: this.model,
			
			// options
			//
			items: this.options.items,
			connections: this.options.connections,
			message: this.options.message,
			sharing: this.options.sharing,

			// callbacks
			//
			onvalidate: () => this.onChange(),
			onselect: () => this.onChange()
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
	}
});