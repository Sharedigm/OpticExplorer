/******************************************************************************\
|                                                                              |
|                                 find-form-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form used to perform a text search.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="alert alert-warning alert-dismissable" style="display:none">
			<button type="button" class="close-btn btn btn-sm" data-dismiss="alert">
				<i class="fa fa-xmark"></i>
			</button>
			<label>Notice: </label><span class="message"></span>
		</div>
		
		<div class="find form-group">
			<label class="control-label"><i class="normal fa fa-search"></i>Find</label>
			<div class="controls">
			
				<div class="input-group">
					<input type="text" class="form-control" value="<%= needle %>">
					<div class="input-group-addon">
						<button type="button" class="btn btn-primary btn-sm" tabindex="-1">
							<i class="active fa fa-search"></i>
						</button>
					</div>			
				</div>
			</div>
		</div>
		
		<div class="options form-group">
			<label class="control-label"><i class="fa fa-check"></i>Options</label>
			<div class="controls">
		
				<div class="match-case checkbox-inline">
					<label><input type="checkbox"<% if (matchCase) { %> checked<% } %>>Match case</label>
				</div>
		
				<div class="whole-word checkbox-inline">
					<label><input type="checkbox"<% if (wholeWord) { %> checked<% } %>>Whole</label>
				</div>
		
				<div class="regex checkbox-inline">
					<label><input type="checkbox"<% if (regEx) { %> checked<% } %>>RegEx</label>
				</div>
			</div>
		</div>
	`),
	
	events: {
		'click .alert .close-btn': 'onClickAlertClose',
		'click .find button': 'onClickFindButton'
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			needle: this.options.needle,
			matchCase: this.options.matchCase,
			wholeWord: this.options.wholeWord,
			regEx: this.options.regEx
		};
	},

	showWarning: function(message) {	
		if (message) {
			this.$el.find('.alert-warning .message').html(message);
		}
		this.$el.find('.alert-warning').show();
	},

	hideWarning: function() {
		this.$el.find('.alert-warning').hide();
	},

	//
	// form methods
	//

	submit: function() {

		// check form validation
		//
		if (!this.isValid()) {
			return false;
		}
		
		// get form values
		//
		let needle = this.$el.find('.find input').val();
		let matchCase = this.$el.find('.match-case input').is(':checked');
		let wholeWord = this.$el.find('.whole-word input').is(':checked');
		let regEx = this.$el.find('.regex input').is(':checked');

		if (needle == '') {
			this.hideWarning();
			return;
		}

		// perform callback
		//
		if (this.options.find) {
			let options = {
				caseSensitive: matchCase,
				wholeWord: wholeWord,
				regExp: regEx
			};

			let cursor = this.options.find(needle, options);
			options.start = cursor;

			// hide / show alert
			//
			if (cursor) {
				this.hideWarning();
			} else {
				this.showWarning('The ' + (regEx? 'expression' : 'term') + ' "' + needle + '" was not found in the text.');
			}

			// perform callbacks
			//
			if (cursor) {
				if (this.options.found) {
					this.options.found(needle, options);
				}
			} else {
				if (this.options.notFound) {
					this.options.notFound(needle, options);
				}
			}
		}
	},

	//
	// mouse event handling methods
	//

	onClickAlertClose: function() {
		this.hideWarning();
	},

	onClickFindButton: function() {
		this.submit();
	}
});
