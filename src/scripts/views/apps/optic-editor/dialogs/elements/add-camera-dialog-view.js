/******************************************************************************\
|                                                                              |
|                           add-camera-dialog-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog view used to add new camera elements.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../../../models/base-model.js';
import Stop from '../../../../../models/optics/elements/stop.js';
import Sensor from '../../../../../models/optics/elements/sensor.js';
import FormModalView from '../../../../../views/forms/dialogs/form-modal-view.js';
import CameraFormView from '../../../../../views/apps/optic-editor/forms/elements/camera-form-view.js';
import Units from '../../../../../utilities/math/units.js';

export default FormModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-camera"></i>
					</div>
					<div class="title">
						Add Camera
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
			
				<div class="modal-footer">			
					<div class="buttons">
						<button id="ok" class="btn btn-primary" disabled><i class="fa fa-check"></i>OK</button>
						<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-xmark"></i>Cancel</button>
					</div>
				</div>
			</div>
		</div>
	`),

	events: {
		'click #ok': 'onClickOk'
	},

	//
	// constructor
	//

	initialize: function() {
		this.model = new BaseModel({
			mount: undefined,
			sensor: undefined
		});
	},

	//
	// getting methods
	//

	getMount: function(name, mounts) {
		let categories = Object.keys(mounts);
		for (let i = 0; i < categories.length; i++) {
			let category = categories[i];
			let types = Object.keys(mounts[category]);
			for (let i = 0; i < types.length; i++) {
				let type = types[i];
				let terms = type.split(', ');
				if (terms.includes(name)) {
					return mounts[category][type];
				}
			}
		}
	},

	getSensor: function(name, sensors) {
		let categories = Object.keys(sensors);
		for (let i = 0; i < categories.length; i++) {
			let category = categories[i];
			let types = Object.keys(sensors[category]);
			for (let i = 0; i < types.length; i++) {
				let type = types[i];
				let terms = type.split(', ');
				if (terms.includes(name)) {
					return sensors[category][type];
				}
			}
		}
	},

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('#ok').prop('disabled', disabled);
	},

	//
	// loading methods
	//

	loadCameras: function(done) {
		if (!window.config.cameras) {
			fetch('config/optics/cameras.json').then((response) => response.json()).then((json) => {
				window.config.cameras = json;
				done(window.config.cameras);
			});
		} else {
			done(window.config.cameras);
		}
	},

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

		// load camera data
		//
		this.loadCameras(() => {

			// render form
			//
			FormModalView.prototype.showForm.call(this);
			this.setDisabled(false);
		});
	},

	form: function() {
		return new CameraFormView({
			model: this.model,
			collection: this.collection,

			// options
			//
			cameras: window.config.cameras,
			viewport: this.options.viewport,

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid)
		});
	},

	//
	// mouse event handling methods
	//
	
	onClickOk: function() {
		if (this.getChildView('form').apply()) {

			// load mount and sensor data
			//
			this.loadMounts(() => {
				this.loadSensors(() => {

					// add mount
					//
					let mount = this.getMount(this.model.get('mount'), window.config.mounts);
					if (mount) {

						// add new mount to elements
						//
						this.collection.add(new Stop({
							aperture: new Units(mount.aperture, 'mm'),
							diameter: new Units(mount.diameter, 'mm'),
							spacing: new Units(mount.spacing, 'mm')
						}));			
					}

					// add sensor
					//
					let sensor = this.getSensor(this.model.get('sensor'), window.config.sensors);
					if (sensor) {

						// add new sensor to elements
						//
						this.collection.add(new Sensor({
							width: new Units(sensor.width, 'mm'),
							height: new Units(sensor.height, 'mm')						
						}));			
					}

					// play 'add' sound
					//
					application.play('add');

					// close dialog
					//
					this.hide();
				});
			});
		}
	}
});