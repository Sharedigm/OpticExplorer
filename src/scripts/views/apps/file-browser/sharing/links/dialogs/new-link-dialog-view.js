/******************************************************************************\
|                                                                              |
|                            new-link-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for creating a new link.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Link from '../../../../../../models/storage/sharing/link.js';
import FormDialogView from '../../../../../../views/forms/dialogs/form-dialog-view.js';
import LinkInfoFormView from '../../../../../../views/apps/file-browser/sharing/links/forms/link-info-form-view.js';

export default FormDialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-link"></i>
					</div>
					<div class="title">
						New Link
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
		
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

	events: _.extend({}, FormDialogView.prototype.events, {
		'click .save': 'onClickSave'
	}),

	//
	// dialog attributes
	//

	size: config.defaults.dialogs.sizes.tiny,

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		FormDialogView.prototype.initialize.call(this);

		// set attributes
		//
		this.model = new Link({
			target: this.options.target
		});
	},

	//
	// linking methods
	//

	createLink: function(options) {

		// create link to file
		//
		this.options.target.createLink(this.getChildView('form').getData(), {
			
			// callbacks
			//
			success: (model) => {

				// perform callback
				//
				if (options && options.success) {
					options.success(model);
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not create link.",
					response: response
				});
			}
		});
	},

	//
	// rendering methods
	//

	form: function(options) {
		return new LinkInfoFormView(_.extend(options, {
			model: this.model
		}));
	},

	//
	// dialog rendering methods
	//

	showLink: function(link) {
		import(
			'../../../../../../views/apps/file-browser/dialogs/links/copy-link-dialog-view.js'
		).then((CopyLinkDialogView) => {

			// show copy link dialog
			//
			application.show(new CopyLinkDialogView.default({
				url: link.getUrl()
			}));
		});
	},

	//
	// mouse event handling methods
	//

	onClickSave: function() {

		// create and save new link
		//
		this.createLink({

			// callbacks
			//
			success: (model) => {

				// close dialog
				//
				this.hide();

				// show link to user
				//
				this.showLink(model);

				// perform callback
				//
				if (this.options.success) {
					this.options.success();
				}
			}
		});
	}
});