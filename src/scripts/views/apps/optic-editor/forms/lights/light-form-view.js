/******************************************************************************\
|                                                                              |
|                              light-form-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying light attributes.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Spectrum from '../../../../../models/optics/lights/spectrum.js';
import FormView from '../../../../../views/forms/form-view.js';
import '../../../../../views/forms/validation/alphanumeric-rules.js';

export default FormView.extend({

	//
	// attributes
	//

	rules: {
		'number-of-rays': {
			positive: true,
			nonzero: true,
			integer: true
		}
	},
			
	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.color = this.model.get('color');
		this.spectrum = this.model.get('spectrum');
	},

	//
	// querying methods
	//

	useCustomColor: function() {
		return this.$el.find('.color input[type="checkbox"]').is(':checked');
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'spectrum':
				return this.spectrum;
			case 'color': {
				if (this.useCustomColor()) {
					return this.$el.find('.color input[type="color"]').val();
				} else {
					return null;
				}
			}
		}
	},

	getSpectraDirectory: function() {
		return application.getDirectory(config.apps.spectrum_editor.spectra_directory);
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'number_of_rays':
				this.$el.find('.number-of-rays input').val(value);
				break;
			case 'spectrum':
				this.$el.find('.spectrum input').val(value);
				break;
		}
	},

	//
	// loading methods
	//

	clearSpectrum: function() {

		// clear form
		//
		this.$el.find('.spectrum input').val('none');

		// clear selection
		//
		this.spectrum = null;

		// enable color input
		//
		this.enableColor();
	},

	loadSpectrum: function(file) {
		let self = this;
		let name = file.getBaseName();

		file.read({

			// callbacks
			//
			success: (text) => {
				Spectrum.parseYaml(text, {

					// callbacks
					//
					success: (model) => {

						// set name of model
						//
						model.set('name', name);

						// save selection
						//
						this.spectrum = model;

						// update form
						//
						self.setValue('spectrum', name);

						// reduce default number of rays
						//
						self.setValue('number_of_rays', 10);

						// disable color input
						//
						self.disableColor();
					}
				});
			},
		});
	},

	showWarning: function(message) {
		this.$el.find('.alert-warning .message').html(message);
		this.$el.find('.alert-warning').show();
	},

	hideWarning: function() {
		this.$el.find('.alert-warning').hide();
	},

	enableColor: function() {
		this.$el.find('.color input[type="checkbox"]').prop('disabled', false);
		if (this.$el.find('.color input[type="checkbox"]').is(':checked')) {
			this.showColor();
		}
	},

	disableColor: function() {
		this.$el.find('.color input[type="checkbox"]').prop('checked', false);
		this.$el.find('.color input[type="checkbox"]').prop('disabled', true);
		this.hideColor();
	},

	showColor: function() {
		this.$el.find('.color input[type="color"]').show();
	},

	hideColor: function() {
		this.$el.find('.color input[type="color"]').hide();
	},

	//
	// dialog rendering methods
	//

	showOpenDialog: function(directory) {
		import(
			'../../../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {

			// show open dialog
			//
			application.show(new OpenItemsDialogView.default({

				// start with home directory
				//
				model: directory || this.getSpectraDirectory(),

				// options
				//
				title: "Open Spectrum",

				// callbacks
				//
				onopen: (items) => this.loadSpectrum(items[0])
			}));
		});
	},

	//
	// event handling methods
	//

	onChange: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	//
	// mouse event handling methods
	//

	onClickAlertClose: function() {
		this.hideWarning();
	},

	onClickClearSpectrumButton: function() {
		this.clearSpectrum();
	},

	onClickSelectSpectrumButton: function() {
		this.showOpenDialog();
	},

	onClickColorCheckbox: function() {
		if (this.useCustomColor()) {
			this.showColor();
		} else {
			this.hideColor();
		}
		this.color = this.getValue('color');
		this.onChange();
	},

	onChangeColor: function() {
		this.color = this.getValue('color');
		this.onChange();
	}
});