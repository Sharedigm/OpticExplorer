/******************************************************************************\
|                                                                              |
|                                 loadable.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view behavior for displaying loading spinners.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// get element to append loading spinner to
	//

	getElement: function() {
		if (this.$el) {
			return this.$el;
		} else if (this._region.$el) {
			return $('body');
		}
	},

	//
	// rendering methods
	//

	showSpinner: function(options) {

		// check if spinner is already shown
		//
		if (this.spinner) {
			return;
		}

		// check if there's a delay
		//
		if (options && options.delay) {

			// check if spinner is already shown
			//
			if (this.timeout) {
				return;
			}

			// show spinner after a slight delay
			//
			this.timeout = window.setTimeout(() => {
				this.showSpinner();
				this.timeout = null;
			}, options.delay);
		} else {
			this.addSpinner();
		}
	},

	addSpinner: function() {
		this.spinner = $('<div class="loading spinner">');
		this.getElement().append(this.spinner);
	},

	hideSpinner: function() {

		// remove existing spinner
		//
		if (this.spinner) {
			this.spinner.remove();
			this.spinner = null;
		}

		// remove pending spinner
		//
		this.cancelSpinner();
	},

	cancelSpinner: function() {

		// clear pending spinner
		//
		if (this.timeout) {
			window.clearTimeout(this.timeout);
			this.timeout = null;
		}
	}
};