/******************************************************************************\
|                                                                              |
|                           article-info-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an editable form view of a user's article.                    |
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

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="title form-group">
			<label class="required control-label"><i class="fa fa-id-card"></i>Title</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="2" maxlength="1000"><%= title %></textarea>
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
					<textarea class="form-control" rows="2" maxlength="1000"><%= authors %></textarea>
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
					<textarea class="form-control" rows="2" maxlength="1000"><%= subjects %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Subjects" data-content="This is the subjects of this book."></i>
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
			case 'title':
				return this.$el.find('.title textarea').val();
			case 'authors':
				return this.$el.find('.authors textarea').val();
			case 'subjects':
				return this.$el.find('.subjects textarea').val();
		}
	},

	getValues: function() {
		return {
			title: this.getValue('title'),
			authors: this.getValue('authors'),
			subjects: this.getValue('subjects')
		};
	}
});