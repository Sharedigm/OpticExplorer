/******************************************************************************\
|                                                                              |
|                               event-form-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form used to specify a user (calendar) event.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../views/forms/form-view.js';
import '../../../../../../vendor/bootstrap/js/plugins/bootstrap-select/bootstrap-select.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="name form-group">
			<label class="required control-label"><i class="fa fa-font"></i>Name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= name %>">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Name" data-content="This is the name of this event."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="date form-group">
			<label class="required control-label"><i class="fa fa-calendar-alt"></i>Date</label>
			<div class="controls">
				<div class="input-group">
					<input type="date" class="required form-control" value="<%= event_date? event_date.format('yyyy-mm-dd') : '' %>">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Date" data-content="This is the date of this event."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="time form-group">
			<label class="control-label"><i class="fa fa-clock"></i>Time</label>
			<div class="controls">
				<div class="input-group">
					<input type="time" class="form-control" value="<%= event_date? event_date.format('HH:MM') : '' %>">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Time" data-content="This is the time of this event."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="description form-group">
			<label class="control-label"><i class="fa fa-quote-left"></i>Description</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="8" maxlength="1000"><%= description %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Description" data-content="This is a short description of this event."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'name':
				return this.$el.find('.name input').val();
			case 'description':
				return this.$el.find('.description textarea').val();
			case 'event_date': {
				let date = this.getValue('date');
				let time = this.getValue('time');
				let datetime = new Date(date + ' ' + time);
				return datetime.format('yyyy-mm-dd HH:MM', true);
			}
			case 'date':
				return this.$el.find('.date input').val();
			case 'time':
				return this.$el.find('.time input').val();
		}
	},

	getValues: function() {
		return {
			name: this.getValue('name'),
			description: this.getValue('description'),
			event_date: this.getValue('event_date')
		};
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'name':
				this.$el.find('.name input').val(value);
				break;
			case 'description':
				this.$el.find('.description textarea').val(value);
				break;
			case 'date':
				this.$el.find('.date').val(value);
				break;
			case 'time':
				this.$el.find('.time').val(value);
				break;
		}
	},

	/*
	//
	// rendering methods
	//

	templateContext: function() {

		// convert date to local time
		//
		return {
			event_date: this.model.has('event_date')? DateUtils.UTCToLocalDate(this.model.get('event_date')) : undefined
		};
	}
	*/
});
