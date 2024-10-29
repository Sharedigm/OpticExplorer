/******************************************************************************\
|                                                                              |
|                            user-book-form-view.js                            |
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
		<div class="title form-group">
			<label class="required control-label"><i class="fa fa-id-card"></i>Title</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= title %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Job title" data-content="This is the title of this book."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="authors form-group">
			<label class="control-label"><i class="fa fa-user"></i>Authors</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= authors %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Authors" data-content="This is the authors of this book."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="subjects form-group">
			<label class="control-label"><i class="fa fa-key"></i>Subjects</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= subjects %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Subjects" data-content="This is the subjects of this book."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="publisher form-group">
			<label class="control-label"><i class="fa fa-building"></i>Publisher</label>
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
		
		<div class="isbn_number form-group">
			<label class="control-label"><i class="fa fa-hashtag"></i>ISBN Number</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= isbn_number %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="ISBN Number" data-content="This is the International Standard Book Number of this book."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="url form-group">
			<label class="control-label"><i class="fa fa-cloud"></i>URL</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= url %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="When" data-content="This is the year that this book was published."></i>
					</div>
				</div>
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
			case 'authors':
				return this.$el.find('.authors input').val();
			case 'title':
				return this.$el.find('.title input').val();
			case 'subjects':
				return this.$el.find('.subjects input').val();
			case 'year':
				return this.$el.find('.year input').val();
			case 'publisher':
				return this.$el.find('.publisher input').val();
			case 'city':
				return this.$el.find('.city [name="city"]').val();
			case 'state':
				return this.$el.find('.city [name="state"]').val();
			case 'country':
				return this.getChildView('country').getValue();
			case 'isbn_number':
				return this.$el.find('.isbn_number input').val();
			case 'url':
				return this.$el.find('.url input').val();
		}
	},

	getValues: function() {
		return {
			authors: this.getValue('authors'),
			title: this.getValue('title'),
			subjects: this.getValue('subjects'),
			year: this.getValue('year'),
			publisher: this.getValue('publisher'),
			city: this.getValue('city'),
			state: this.getValue('state'),
			country: this.getValue('country'),
			isbn_number: this.getValue('isbn_number'),
			url: this.getValue('url'),
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
