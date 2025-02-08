/******************************************************************************\
|                                                                              |
|                          book-publisher-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an editable form view of a user's book.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../../../views/forms/form-view.js';
import CountrySelectorView from '../../../../../../../views/forms/selectors/country-selector-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="publisher form-group">
			<label class="control-label"><i class="fa fa-building"></i>Company</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= publisher %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="When" data-content="This is the publisher of this book."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="year form-group">
			<label class="control-label"><i class="fa fa-calendar-alt"></i>When</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="form-control" placeholder="year" value="<%= year || '' %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="When" data-content="This is the year that this book was published."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="city form-group">
			<label class="control-label"><i class="fa fa-building"></i>City</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" name="city" placeholder="City" value="<%= city %>" />
					<span class="input-group-addon">,</span>
					<input type="text" class="form-control" name="state" placeholder="State" value="<%= state %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="City" data-content="The city and state of the publisher."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="country form-group">
			<label class="control-label"><i class="fa fa-globe-americas"></i>Country</label>
			<div class="controls">
			</div>
		</div>
	`),

	regions: {
		country: '.country .controls'
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'publisher':
				return this.$el.find('.publisher input').val();
			case 'year':
				return this.$el.find('.year input').val();
			case 'city':
				return this.$el.find('.city [name="city"]').val();
			case 'state':
				return this.$el.find('.city [name="state"]').val();
			case 'country':
				return this.getChildView('country').getValue();
		}
	},

	getValues: function() {
		return {
			publisher: this.getValue('publisher'),
			year: this.getValue('year'),
			city: this.getValue('city'),
			state: this.getValue('state'),
			country: this.getValue('country')
		};
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		FormView.prototype.onRender.call(this);

		// show child views
		//
		this.showCountrySelector();
	},

	showCountrySelector: function() {
		this.showChildView('country', new CountrySelectorView({
			initialValue: this.model.has('country')? this.model.get('country') : 'United States'
		}));
	}
});