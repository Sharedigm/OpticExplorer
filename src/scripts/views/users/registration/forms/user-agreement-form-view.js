/******************************************************************************\
|                                                                              |
|                          user-agreement-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for certifying user agreement to terms.           |
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

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<h2><i class="fa fa-handshake"></i>Statement of Agreement</h2>
		<p>By clicking 'I Accept' it serves as acknowledgement that you have read and understand the Terms and Conditions.</p>
		
		<div class="alert alert-warning alert-dismissable" style="display:none">
			<button type="button" class="close-btn btn btn-sm" data-dismiss="alert">
				<i class="fa fa-xmark"></i>
			</button>
			<label>Error: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
		</div>
		
		<form action="/">
			<div class="well">
				<label>
					<input type="checkbox" name="accept" id="accept" class="required">
					I accept
				</label>
			</div>
		</form>
	`),

	events: {
		'click input': 'onClickCheckbox'
	},

	// do not automatically focus on accept checkbox
	// because we want users to read the text first
	//
	focusable: null,

	//
	// form attributes
	//

	rules: {
		'accept': {
			required: true
		}
	},

	messages: {
		'accept': {
			required: "You must accept the terms to continue."
		}
	},

	//
	// form methods
	//

	isValid: function() {
		return this.$el.find('input').is(':checked');
	},

	//
	// mouse event handling methods
	//

	onClickCheckbox: function() {

		// perform callback
		//
		if (this.options.onvalidate) {
			this.options.onvalidate(this.isValid());			
		}
	}
});
