/******************************************************************************\
|                                                                              |
|                          edit-sensor-dialog-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog used to edit a sensor element.                  |
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
import SensorFormView from '../../../../../views/apps/optic-editor/forms/elements/sensor-form-view.js';

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
						Edit Sensor
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
		<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 24 24">
			<path d="M19 17c0 1.104-.896 2-2 2h-11c-1.104 0-2-.896-2-2v-11c0-1.104.896-2 2-2h11c1.104 0 2 .896 2 2v11zm-11 3v3h-1v-3h1zm4 0v3h-1v-3h1zm2 0v3h-1v-3h1zm-4 0v3h-1v-3h1zm6 0v3h-1v-3h1zm-8-20v3h-1v-3h1zm4 0v3h-1v-3h1zm2 0v3h-1v-3h1zm-4 0v3h-1v-3h1zm6 0v3h-1v-3h1zm4 15h3v1h-3v-1zm0-4h3v1h-3v-1zm0-2h3v1h-3v-1zm0 4h3v1h-3v-1zm0-6h3v1h-3v-1zm-20 8h3v1h-3v-1zm0-4h3v1h-3v-1zm0-2h3v1h-3v-1zm0 4h3v1h-3v-1zm0-6h3v1h-3v-1z"/>
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

	loadSensors: function(done) {
		if (!window.config.sensors) {
			fetch('config/optics/sensors.json').then((response) => response.json()).then((json) => {
				window.config.sensors = json;
				done(window.config.sensors);
			});
		} else {
			done(window.config.sensors);
		}
	},

	//
	// rendering methods
	//

	showForm: function() {

		// load sensor data
		//
		this.loadSensors(() => {

			// render form
			//
			FormModalView.prototype.showForm.call(this);
			this.setDisabled(false);
		});
	},

	form: function() {
		return new SensorFormView({
			model: this.model,
			collection: this.collection,

			// options
			//
			sensors: window.config.sensors,
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