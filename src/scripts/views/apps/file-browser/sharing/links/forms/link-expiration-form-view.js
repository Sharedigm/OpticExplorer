/******************************************************************************\
|                                                                              |
|                         link-expiration-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for defining link expiration attributes.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../../views/forms/form-view.js';
import DateUtils from '../../../../../../utilities/time/date-utils.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="well">
			<i class="fa fa-info-circle"></i>
			Links can be set to self destruct after which they can no longer be used.
		</div>

		<div class="limit form-group">
			<label class="control-label"><i class="fa fa-step-forward"></i>Limit</label>
			<div class="controls">
		
				<select style="float:left; margin-right:15px">
					<option value="none"<% if (!limit) { %> selected<% } %>>None</option>
					<option value="single-use"<% if (limit == 1) { %> selected<% } %>>single use</option>
					<option value="multi-use"<% if (limit > 1) { %> selected<% } %>>multi use</option>
				</select>
		
				<div class="number"<% if (!limit || limit < 2) {%> style="display:none"<% } %>>
					<input type="number" class="form-control" min="2" value="<%= limit || 2 %>" style="width:33%; float:left; margin-right:15px" />
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Limit" data-content="This is a a limit on the number of times this link can be accessed."></i>
			</div>
		</div>
		
		<div class="expiration form-group">
			<label class="control-label"><i class="fa fa-clock"></i>Expiration</label>
			<div class="controls" style="width:auto">
		
				<select style="float:left; margin-right:15px">
					<option value="none">None</option>
					<option value="lifetime">Lifetime</option>
					<option value="date"<% if (expiration_date) { %> selected<% } %>>Date</option>
				</select>
		
				<span class="lifetime" style="display:none">
					<div style="display:inline-block; float:left; margin-right:15px; padding-left:0; width:175px">
						<div class="input-group">
							<input type="number" class="form-control" min="0" />
							<div class="input-group-addon select">
								<select class="units">
									<option value="hours">hours</option>
									<option value="days">days</option>
									<option value="weeks">weeks</option>
									<option value="months">months</option>
									<option value="years">years</option>
								</select>
							</div>
						</div>
					</div>
				</span>
		
				<span class="date"<% if (!expiration_date) { %> style="display:none"<% } %>>
					<div style="display:inline-block; float:left; margin-right:15px; padding-left:0; width:175px">
						<input type="date" class="form-control"<% if (expiration_date) {%> value="<%= expiration_date.format('mediumDate') %>"<% } %> />
					</div>
				</span>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Date" data-content="This is how long the link will persist until it expires."></i>
			</div>
		</div>
	`),

	events: {
		'change .limit select': 'onChangeLimitSelect',
		'change .expiration select': 'onChangeExpirationSelect'
	},

	//
	// form querying methods
	//

	getLimit: function() {
		let limit;
		switch (this.$el.find('.limit select').val()) {
			case 'none':
				limit = 0;
				break;
			case 'single-use':
				limit = 1;
				break;
			case 'multi-use':
				limit = this.$el.find('.limit input').val();
				break;
		}
		return limit;
	},

	getCreateDate: function() {
		if (this.model.has('created_at')) {
			return new Date(this.model.get('created_at'));
		} else {
			return new Date();
		}
	},

	getLifetimeExpirationDate: function() {
		let date = this.getCreateDate();
		let value = parseFloat(this.$el.find('.expiration .lifetime input').val());
		let units = this.$el.find('.expiration .lifetime .units').val();
		DateUtils.offsetDate(date, value, units);
		return date;
	},

	getExpirationDate: function() {
		switch (this.$el.find('.expiration select').val()) {
			case 'lifetime':
				return this.getLifetimeExpirationDate();
			case 'date': {
				let date = new Date("UTC " + this.$el.find('.expiration .date input').val());
				return date.format('yyyy-mm-dd');
			}
		}
	},

	getValue: function(kind) {
		switch (kind) {
			case 'limit':
				return this.getLimit();
			case 'create_date':
				return this.getCreateDate();
			case 'expiration_date':
				return this.getExpirationDate();
		}
	},

	//
	// form event handling methods
	//

	onChangeLimitSelect: function() {
		let limitSelect = this.$el.find('.limit select').val();
		if (limitSelect == 'multi-use') {
			this.$el.find('.limit .number').show();
		} else {
			this.$el.find('.limit .number').hide();
		}
	},

	onChangeExpirationSelect: function() {
		let expirationSelect = this.$el.find('.expiration select').val();
		switch (expirationSelect) {
			case 'none':
				this.$el.find('.expiration .date').hide();
				this.$el.find('.expiration .lifetime').hide();
				break;
			case 'date':
				this.$el.find('.expiration .date').show();
				this.$el.find('.expiration .lifetime').hide();
				break;
			case 'lifetime':
				this.$el.find('.expiration .date').hide();
				this.$el.find('.expiration .lifetime').show();
				break;
		}	
	}
});
