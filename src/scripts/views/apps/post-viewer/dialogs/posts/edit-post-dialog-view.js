/******************************************************************************\
|                                                                              |
|                            edit-post-dialog-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a modal dialog box used for editing existing posts.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormDialogView from '../../../../../views/forms/dialogs/form-dialog-view.js';
import PostFormView from '../../../../../views/apps/post-viewer/forms/posts/post-form-view.js';

export default FormDialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-pencil-alt"></i>
					</div>
					<div class="title">
						Edit Post
					</div>
				</div>
			</div>
			
			<div class="modal-content">
				<div class="modal-body">
					<div class="new-post panel"></div>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="submit btn btn-primary" data-dismiss="modal" disabled>
							<i class="active fa fa-save"></i>Save
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
		form: {
			el: '.new-post',
			replaceElement: false
		}
	},

	events: _.extend({}, FormDialogView.prototype.events, {
		'click .submit': 'onClickSubmit'
	}),

	//
	// setting methods
	//

	setSubmitDisabled: function(disabled) {
		this.$el.find('.submit').prop('disabled', disabled !== false);
	},

	//
	// rendering methods
	//

	form: function() {
		return new PostFormView({
			model: this.model,

			// options
			//
			preferences: this.options.preferences,

			// capabilities
			//
			submitable: false,
			cancelable: false,

			// callbacks
			//
			onvalidate: (valid) => this.setSubmitDisabled(!valid),
			onchange: () => this.setSubmitDisabled(false),
			onsubmit: () => this.onSubmit()
		});
	},

	//
	// event handling methods
	//

	onSubmit: function() {

		// perform callback
		//
		if (this.options.onsubmit) {
			this.options.onsubmit();
		}
	},

	onClickSubmit: function() {
		this.getChildView('form').submit();
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		if (this.hasChildView('form')) {
			this.getChildView('form').onKeyDown(event);
		}
	}
});