/******************************************************************************\
|                                                                              |
|                           edit-stop-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an dialog used to edit an existing stop element.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormModalView from '../../../../../views/forms/dialogs/form-modal-view.js';
import StopFormView from '../../../../../views/apps/optic-editor/forms/elements/stop-form-view.js';

export default FormModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">

			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<%= icon %>
					</div>
					<div class="title">
						Edit Stop
					</div>
				</div>
			</div>
			
			<div class="modal-content">
				<div class="modal-body"></div>
			
				<div class="modal-footer">
					<div class="notes">
						<label><span class="required"></span>Fields are required</label>
					</div>
					
					<div class="buttons">
						<button id="done" class="btn btn-primary" data-dismiss="modal" disabled><i class="fa fa-check"></i>Done</button>
						<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-xmark"></i>Cancel</button>
					</div>
				</div>
			</div>
		</div>
	`),

	icon: `
		<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 1000 1000">
			<path d="M608 443.5l-225 -382q47 -8 81 -8 177 0 304 120zm-33 168l233 -395q103 125 103 283 0 53 -16 112l-320 0zm-96 -280l-427 0q37 -91 109 -158t167 -97zm-24 335l423 0q-37 90 -108.5 156.5t-164.5 98.5zm-99 -278l-234 396q-104 -126 -104 -285 0 -52 16 -111l322 0zm-33 165l227 384q-48 9 -86 9 -172 0 -302 -120z" />
		</svg>
	`,

	events: {
		'click #done': 'onClickDone',
		'click #cancel': 'onClickCancel'
	},

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('#done').prop('disabled', disabled);
	},

	//
	// loading methods
	//

	loadMounts: function(done) {
		if (!window.config.mounts) {
			fetch('config/optics/mounts.json').then((response) => response.json()).then((json) => {
				window.config.mounts = json;
				done(window.config.mounts);
			});
		} else {
			done(window.config.mounts);
		}
	},

	//
	// rendering methods
	//

	showForm: function() {

		// load mounts data
		//
		this.loadMounts(() => {
			FormModalView.prototype.showForm.call(this);
			this.setDisabled(false);
		});
	},

	form: function() {
		return new StopFormView({
			model: this.model,

			// options
			//
			stops: window.config.mounts,
			viewport: this.options.viewport,

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid)
		});
	},

	//
	// mouse event handling methods
	//

	onClickDone: function() {

		// update model
		//
		this.getChildView('form').apply();
	},

	onClickCancel: function() {
		this.hide();
	}
});