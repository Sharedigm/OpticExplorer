/******************************************************************************\
|                                                                              |
|                           preferences-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract base class for form views.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../views/forms/form-view.js';
import '../../../../../vendor/bootstrap/js/tab.js';

export default FormView.extend({

	//
	// attributes
	//

	className: 'preferences narrow form-horizontal',

	//
	// form queryimg methods
	//

	hasChanged: function() {
		let values = this.getValues();
		for (let key in values) {
			let value = values[key];
			if (value != this.model.get(key)) {
				return true;
			}
		}
		return false;
	},

	getChanged: function() {
		let changed = [];
		let values = this.getValues();
		for (let key in values) {
			let value = values[key];
			if (value != this.model.get(key)) {
				changed.push(key);
			}			
		}
		return changed;
	},

	getChangedValues: function() {
		let changed = {};

		// get list of modified values for changed attributes
		//
		let values = this.getValues();
		for (let key in values) {
			let value = values[key];
			if (value != this.model.get(key)) {
				changed[key] = value;
			}			
		}
		return changed;
	},

	getOriginalValues: function() {
		let changed = {};

		// get list of original values for changed attributes
		//
		let values = this.getValues();
		for (let key in values) {
			let value = values[key];

			// save value if changed
			//
			if (Array.isArray(value)? !value.equals(this.values[key]) : value != this.values[key]) {
				changed[key] = this.values[key];
			}			
		}
		return changed;
	},

	//
	// form validating methods
	//

	validate: function() {
	},

	isValid: function() {
		return true;
	},

	//
	// form submission methods
	//
	
	submit: function(options) {

		// check form validation
		//
		if (!this.isValid()) {
			return false;
		} else {

			// save model
			//
			if (application.isSignedIn()) {
				this.model.save(this.getValues(), options);
			} else if (options && options.success) {
				options.success();
			}
			return true;
		}
	},

	//
	// form rendering methods
	//

	container: function() {
		return '.modal-dialog';
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		FormView.prototype.onRender.call(this);

		// set initial form values
		//
		if (this.setValue) {
			this.setValues(this.model.attributes);
		}
	},

	onAttach: function() {

		// call superclass method
		//
		FormView.prototype.onAttach.call(this);

		// get initial values
		//
		this.values = this.getValues();
	},

	//
	// form event handling methods
	//

	onChangeValue: function(key, value) {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(key, value);
		}
	}
});
