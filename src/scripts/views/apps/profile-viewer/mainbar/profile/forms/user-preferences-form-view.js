/******************************************************************************\
|                                                                              |
|                         user-preferences-form-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a editable form view of a user's preferences info.            |
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

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="interests form-group">
			<label class="control-label"><i class="fa fa-skating"></i>Interests / Hobbies</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="4" maxlength="1000"><%= interests? interests.join(', ') : '' %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Interests / Hobbies" data-content="This is a list of things that interest and engage you."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="likes form-group">
			<label class="control-label"><i class="fa fa-thumbs-up"></i>Likes</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="4" maxlength="1000"><%= likes? likes.join(', ') : '' %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Likes" data-content="This is a list of things that you like."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="dislikes form-group">
			<label class="control-label"><i class="fa fa-thumbs-down"></i>Dislikes</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="4" maxlength="1000"><%= dislikes? dislikes.join(', ') : '' %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Dislikes" data-content="This is a list of things that you dislike."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	//
	// querying methods
	//

	hasValue: function(key) {
		switch (key) {
			case 'interests':
				return this.$el.find('.interests textarea').val() != '';
			case 'likes':
				return this.$el.find('.likes textarea').val() != '';
			case 'dislikes':
				return this.$el.find('.dislikes textarea').val() != '';
		}
	},

	//
	// getting methods
	//

	getValue: function(key) {
		let value;

		switch (key) {
			case 'interests':
				value = this.hasValue('interests')? this.$el.find('.interests textarea').val() : undefined;
				break;
			case 'likes':
				value = this.hasValue('likes')? this.$el.find('.likes textarea').val() : undefined;
				break;
			case 'dislikes':
				value = this.hasValue('dislikes')? this.$el.find('.dislikes textarea').val() : undefined;
				break;
		}

		if (value) {
			value = value.split(',').trim();
		}

		return value;
	},

	getValues: function() {
		return {
			interests: this.getValue('interests'),
			likes: this.getValue('likes'),
			dislikes: this.getValue('dislikes')
		};
	}
});