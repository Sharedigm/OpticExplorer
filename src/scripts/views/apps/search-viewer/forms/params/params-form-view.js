/******************************************************************************\
|                                                                              |
|                              params-form-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form used to specify search params.                    |
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

		<div class="search form-group">
			<label class="control-label"><i class="fa fa-search"></i>Search</label>
			<div class="controls">
				<% if (has_index) { %>
				<div class="checkbox-inline">
					<label><input type="checkbox" value="index"<% if (show_index) { %> checked<% } %>>Files</label>
				</div>
				<% } %>
				<% if (has_files) { %>
				<div class="checkbox-inline">
					<label><input type="checkbox" value="files"<% if (show_files) { %> checked<% } %>>Shared Files</label>
				</div>
				<% } %>
				<% if (has_posts) { %>
				<div class="checkbox-inline">
					<label><input type="checkbox" value="posts"<% if (show_posts) { %> checked<% } %>>Posts</label>
				</div>
				<% } %>
				<i class="active fa fa-question-circle" data-toggle="popover" title="Search Items" data-content="This is which items to search."></i>
			</div>
		</div>

		<div class="target form-group" style="display:none">
			<label class="control-label"><i class="fa fa-bullseye"></i>Search By</label>
			<div class="controls">
				<div class="radio-inline">
					<label><input type="radio" name="target" value="text" checked>Text</label>
				</div>
				<div class="radio-inline">
					<label><input type="radio" name="target" value="url">URL</label>
				</div>
				<div class="radio-inline">
					<label><input type="radio" name="target" value="file">File</label>
				</div>
				<i class="active fa fa-question-circle" data-toggle="popover" title="Search By" data-content="This what to search for."></i>
			</div>
		</div>
	`),

	focusable: false,

	events: {
		'change .search': 'onChangeSearch'
	},

	search_kind: ['index', 'files', 'posts'],

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (this.options.search_kind) {
			this.search_kind = this.options.search_kind;
		}
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'search':
				return this.getElementsValues('.search input:checked');
			case 'target':
				return this.$el.find('.target input:checked').val();
		}
	},

	getValues: function() {
		return {
			search: this.getValue('search'),
			target: this.getValue('target')
		};
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'target':
				this.$el.find('.target input[value = "' + value + '"]').prop('checked', true);
				break;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			has_index: !this.search_kind || this.search_kind.includes('index'),
			has_files: !this.search_kind || this.search_kind.includes('files'),
			has_posts: !this.search_kind || this.search_kind.includes('posts'),
			show_index: this.options.show_index !== false,
			show_files: this.options.show_files !== false,
			show_posts: this.options.show_posts !== false,
			min_score: 0,
			top_k: 100
		};
	},

	onRender: function() {

		// add tooltip triggers
		//
		this.addTooltips();
	},

	//
	// mouse event handling methods
	//

	onChangeSearch: function() {
		let search = this.getValue('search');

		// perform callback
		//
		if (this.options.onchangesearch) {
			this.options.onchangesearch(search);
		}
	}
});