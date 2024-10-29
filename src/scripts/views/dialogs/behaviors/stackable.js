/******************************************************************************\
|                                                                              |
|                                 stackable.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for stacking dialogs.                         |
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
	// focusing methods
	//

	focus: function() {

		// blur desktop
		//
		if (application.desktop) {
			application.desktop.blur();
		}

		// update view
		//
		this.modals.blurAll({
			except: this
		});
		this.$el.addClass('focused');

		// perform actions
		//
		this.onFocus();
	},

	blur: function() {

		// update view
		//
		this.$el.removeClass('focused');

		// perform actions
		//
		this.onBlur();
	},

	//
	// stacking methods
	//

	toTop: function() {
		if (this.modals) {
			this.modals.raise(this);
		}
	},

	toBottom: function() {
		if (this.modals) {
			this.modals.lower(this);
		}
	},

	//
	// focus event handling methods
	//

	onFocus: function() {

		// perform callback
		//
		if (this.options.onfocus) {
			this.options.onfocus(this);
		}
	},

	onBlur: function() {

		// perform callback
		//
		if (this.options.onblur) {
			this.options.onblur(this);
		}		
	}
};