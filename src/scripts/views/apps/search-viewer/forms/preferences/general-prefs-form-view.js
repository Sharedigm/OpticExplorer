/******************************************************************************\
|                                                                              |
|                           general-prefs-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form used to specify user preferences.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import PreferencesFormView from '../../../../../views/apps/common/forms/preferences-form-view.js';
import RangeInputView from '../../../../../views/forms/inputs/range-input-view.js';

export default PreferencesFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="view-kind form-group">
			<label class="control-label"><i class="fa fa-paint-brush"></i>Appearance</label>
			<div class="controls">
				<select>
					<option data-subtext="<i class='fa fa-th'></i>" value="icons"<% if (view_kind == 'icons') { %> selected<% } %>>Icons</option>
					<option data-subtext="<i class='fa fa-list'></i>" value="lists"<% if (view_kind == 'lists') { %> selected<% } %>>Lists</option>
				</select>

				<i class="active fa fa-question-circle" data-toggle="popover" title="Appearance" data-content="This is how files and folders are to be visually displayed."></i>
			</div>
		</div>

		<div class="min-score form-group"<% if (!config.defaults.search || !config.defaults.search.index) { %> style="display:none"<% } %>>
			<label class="control-label"><i class="fa fa-arrow-down-wide-short"></i>Min Score</label>
			<div class="controls">
				<div class="range-input"></div>

				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Min Score" data-content="This is the minimum matching score."></i>
				</div>
			</div>
		</div>

		<div class="max-results form-group">
			<label class="control-label"><i class="fa fa-arrow-down-1-9"></i>Max Results</label>
			<div class="controls">
				<div class="range-input"></div>

				<div class="control-inline">
					<i class="active fa fa-question-circle" data-toggle="popover" title="Max Results" data-content="This is the maximum number of results to return."></i>
				</div>
			</div>
		</div>
	`),

	regions: {
		min_score: '.min-score .range-input',
		max_results: '.max-results .range-input'
	},

	events: {
		'change .view-kind select': 'onChangeViewKind',
		'change .min-score input': 'onChangeMinScore',
		'change .max-results input': 'onChangeMaxResults',
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'view_kind':
				return this.$el.find('.view-kind select').val();
			case 'min_score':
				return this.getChildView('min_score').getValue();
			case 'max_results':
				return this.getChildView('max_results').getValue();
		}
	},

	getValues: function() {
		return {
			view_kind: this.getValue('view_kind'),
			min_score: this.getValue('min_score'),
			max_results: this.getValue('max_results')
		};
	},

	//
	// rendering methods
	//

	showRegion: function(name) {
		switch (name) {
			case 'min_score':
				this.showMinScore();
				break;
			case 'max_results':
				this.showMaxResults();
				break;
		}
	},

	showMinScore: function() {
		this.showChildView('min_score', new RangeInputView({

			// options
			//
			value: this.model.get('min_score'),
			min: 0,
			max: 100,
			step: 5,

			// callbacks
			//
			onchange: () => this.onChangeMinScore()
		}));
	},

	showMaxResults: function() {
		this.showChildView('max_results', new RangeInputView({

			// options
			//
			value: this.model.get('max_results'),
			min: 0,
			max: 500,
			step: 10,

			// callbacks
			//
			onchange: () => this.onChangeMaxResults()
		}));
	},

	//
	// event handling methods
	//

	onChangeViewKind: function() {
		this.onChangeValue('view_kind', this.getValue('view_kind'));
	},

	onChangeMinScore: function() {
		this.onChangeValue('min_score', this.getValue('min_score'));
	},

	onChangeMaxResults: function() {
		this.onChangeValue('max_results', this.getValue('max_results'));
	}
});