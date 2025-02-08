/******************************************************************************\
|                                                                              |
|                            search-results-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for displaying search results.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import SearchIndexView from '../../../../../views/apps/search-viewer/mainbar/panes/search-index-view.js';
import SearchFilesView from '../../../../../views/apps/search-viewer/mainbar/panes/search-files-view.js';
import SearchPostsView from '../../../../../views/apps/search-viewer/mainbar/panes/search-posts-view.js';
import FileIndex from '../../../../../utilities/files/file-index.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'search-results',

	template: template(`
		<div class="well">
			Searching for "<%= query %>" ...

			<div class="buttons">
				<button class="search btn btn-sm" data-toggle="tooltip" title="Clear">
					<i class="fa fa-close"></i>
				</button>
			</div>
		</div>

		<div class="desktop-app-only options">
			<div class="view-kind" style="display:none">
				<label>View</label>
				<select>
					<option value="icons">Icons</option>
					<option value="lists">Lists</option>
					<option value="tiles">Tiles</option>
					<option value="cards">Cards</option>
				</select>
			</div>

			<div class="detail-kind" style="display:none">
				<label>Details</label>
				<select>
					<option value="size">Size</option>
					<option value="create_date">Date</option>
					<option value="">None</option>
				</select>
			</div>

			<div class="after-kind">
				<label>Since</label>
				<select>
					<option value="" selected>Whenever</option>
					<option value="span">Span</option>
					<option value="date">Date</option>
				</select>
			</div>

			<div class="after-span" style="display:none">
				<input type="number" width="2" style="width:3em; text-align:right" value="1" />
				<select>
					<option value="days">Days</option>
					<option value="weeks">Weeks</option>
					<option value="months">Months</option>
					<option value="years">Years</option>
				</select>
				Ago
			</div>

			<div class="after-date" style="display:none">
				<input type="date">
			</div>

			<div class="before-kind">
				<label>Until</label>
				<select>
					<option value="">Now</option>
					<option value="span">Span</option>
					<option value="date">Date</option>
				</select>
			</div>

			<div class="before-span" style="display:none">
				<input type="number" width="2" style="width:3em; text-align:right" value="1" />
				<select>
					<option value="days">Days</option>
					<option value="weeks">Weeks</option>
					<option value="months">Months</option>
					<option value="years">Years</option>
				</select>
				Ago
			</div>

			<div class="before-date" style="display:none">
				<input type="date">
			</div>
		</div>

		<ul class="nav nav-tabs" role="tablist">

			<% if (has_index) { %>
			<li role="presentation" class="search-index-tab active">
				<a role="tab" data-toggle="tab" href=".search-index">
					<i class="fa fa-file"></i>
					<label>Files</label>
					<div class="badges">
						<div class="badge"></div>
					</div>
				</a>
			</li>
			<% } %>

			<% if (has_files) { %>
			<li role="presentation" class="shared-files-tab<% if (!has_index) { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".shared-files">
					<i class="fa fa-share"></i>
					<label>Shared Files</label>
					<div class="badges">
						<div class="badge"></div>
					</div>
				</a>
			</li>
			<% } %>

			<% if (has_posts) { %>
			<li role="presentation" class="topic-posts-tab"<% if (!has_index && !has_files) { %> active<% } %>>
				<a role="tab" data-toggle="tab" href=".topic-posts">
					<i class="fa fa-hashtag"></i>
					<label>Posts</label>
					<div class="badges">
						<div class="badge"></div>
					</div>
				</a>
			</li>
			<% } %>
		</ul>

		<div class="tab-content">

			<% if (has_index) { %>
			<div role="tabpanel" class="search-index tab-pane active">
				<div class="results"></div>
			</div>
			<% } %>

			<% if (has_files) { %>
			<div role="tabpanel" class="shared-files tab-pane<% if (!has_index) { %> active<% } %>">
				<div class="results"></div>
			</div>
			<% } %>

			<% if (has_posts) { %>
			<div role="tabpanel" class="topic-posts tab-pane<% if (!has_index && !has_files) { %> active<% } %>">
				<div class="results"></div>
			</div>
			<% } %>
		</div>

		<div class="buttons">
			<button class="search btn btn-lg">
				<i class="fa fa-repeat"></i>Search Again
			</button>
		</div>
	`),

	regions: {
		search_index: {
			el: '.search-index .results',
			replaceElement: true
		},
		shared_files: {
			el: '.shared-files .results',
			replaceElement: true
		},
		topic_posts: {
			el: '.topic-posts .results',
			replaceElement: true
		}
	},

	events: {
		'change .view-kind select': 'onChangeViewKind',
		'change .detail-kind select': 'onChangeDetailKind',
		'change .after-kind select': 'onChangeAfterKind',

		'change .after-span input': 'onChangeAfterSpan',
		'change .after-span select': 'onChangeAfterSpan',

		'change .after-date input': 'onChangeAfterDate',
		'change .before-kind select': 'onChangeBeforeKind',

		'change .before-span input': 'onChangeBeforeSpan',
		'change .before-span select': 'onChangeBeforeSpan',

		'change .before-date input': 'onChangeBeforeDate',
		'click .search.btn': 'onClickSearch'
	},

	//
	// constructor
	//

	initialize: function() {
		this.options.date_range = [undefined, undefined];
	},

	//
	// querying methods
	//

	hasSelected: function() {
		switch (this.getActiveTabName()) {
			case 'search_index':
				return this.getChildView('search_index').hasSelected();
			case 'shared_files':
				return this.getChildView('shared_files').hasSelected();
		}
	},

	numResults: function() {
		let count = 0;

		if (this.hasChildView('search_index')) {
			count += this.getChildView('search_index').numResults();
		}
		if (this.hasChildView('shared_files')) {
			count += this.getChildView('shared_files').numResults();
		}
		if (this.hasChildView('topic_posts')) {
			count += this.getChildView('topic_posts').numResults();
		}

		return count;
	},

	//
	// getting methods
	//

	getValue: function(kind) {
		switch (kind) {
			case 'view_kind':
				return this.$el.find('.view-kind select').val();
			case 'detail_kind':
				return this.$el.find('.detail-kind select').val();
			case 'after_kind':
				return this.$el.find('.after-kind select').val();
			case 'after_value':
				return this.$el.find('.after-span input').val();
			case 'after_units':
				return this.$el.find('.after-span select').val();
			case 'after_date':
				return this.$el.find('.after-date input').val();
			case 'before_kind':
				return this.$el.find('.before-kind select').val();
			case 'before_value':
				return this.$el.find('.before-span input').val();
			case 'before_units':
				return this.$el.find('.before-span select').val();
			case 'before_date':
				return this.$el.find('.before-date input').val();
		}
	},

	getActiveTabName: function() {
		let activeTab = this.$el.find('li.active');
		let className = activeTab.attr('class');
		let tabName = className.replace('-tab', '').replace('active', '').trim();
		return tabName.replace(/-/g, '_');
	},

	getSelectedModels: function() {
		switch (this.getActiveTabName()) {
			case 'search_index':
				return this.getChildView('search_index').getSelectedModels();
			case 'shared_files':
				return this.getChildView('shared_files').getSelectedModels();
		}
	},

	//
	// setting methods
	//

	setOption: function(kind, value) {
		switch (kind) {
			case 'search':
				this.setSearch(value);
				break;
			case 'view_kind':
				this.options.view_kind = value;
				this.showResults();
				break;
			case 'detail_kind':
				this.options.detail_kind = value;
				this.showResults();
				break;
			case 'date_format':
				this.options.date_format = value;
				this.showResults();
				break;
		}
	},

	setSearch: function(search) {
		if (search.includes('index')) {
			this.$el.find('.search-index-tab').show();
			this.$el.find('.search-index').show();
		} else {
			this.$el.find('.search-index-tab').hide();
			this.$el.find('.search-index').hide();
		}

		if (search.includes('files')) {
			this.$el.find('.shared-files-tab').show();
			this.$el.find('.shared-files').show();
		} else {
			this.$el.find('.shared-files-tab').hide();
			this.$el.find('.shared-files').hide();
		}

		if (search.includes('posts')) {
			this.$el.find('.topic-posts-tab').show();
			this.$el.find('.topic-posts').show();
		} else {
			this.$el.find('.topic-posts-tab').hide();
			this.$el.find('.topic-posts').hide();
		}
	},

	setDaysAfter: function(numDays) {
		this.$el.find('.options .after-date').hide();
		this.$el.find('.options .after_date input').val();
		this.options.date_range[0] = (new Date(Date.now() - 24 * 3600 * 1000 * numDays)).format('yyyy-mm-dd');
		this.fetchAndShowResults();
	},

	setDaysBefore: function(numDays) {
		this.$el.find('.options .before-date').hide();
		this.$el.find('.options .before_date input').val();
		this.options.date_range[1] = (new Date(Date.now() - 24 * 3600 * 1000 * numDays)).format('yyyy-mm-dd');
		this.fetchAndShowResults();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let search_kind = this.options.search_kind;

		return {
			query: decodeURI(this.options.query),
			has_index: !search_kind || search_kind.includes('index'),
			has_files: !search_kind || search_kind.includes('files'),
			has_posts: !search_kind || search_kind.includes('posts')
		};
	},

	onRender: function() {
		this.fetchAndShowResults();

		// set initial state
		//
		if (this.options.search) {
			this.setSearch(this.options.search);
		}
		if (!config.defaults.search.options || config.defaults.search.options == false || config.defaults.search.options.length == 0) {
			this.$el.find('.options').hide();
		}
		if (config.defaults.search.options && config.defaults.search.options.length > 0) {
			if (!config.defaults.search.options.includes('view_kind')) {
				this.$el.find('.options .view-kind').hide();
			}
			if (!config.defaults.search.options.includes('detail_kind')) {
				this.$el.find('.options .detail-kind').hide();
			}
			if (!config.defaults.search.options.includes('create_date')) {
				this.$el.find('.options .create-date').hide();
			}
		}

		// set initial options
		//
		this.$el.find('.view-kind select').val(this.options.view_kind);
		this.$el.find('.detail-kind select').val(this.options.detail_kind);

		// add tooltip triggers
		//
		this.addTooltips();
	},

	showResults: function() {

		// update index
		//
		if (this.hasChildView('search_index')) {
			this.updateOptions(this.getChildView('search_index'));
			this.getChildView('search_index').showFiles();
		}

		// update files
		//
		if (this.hasChildView('shared_files')) {
			this.updateOptions(this.getChildView('shared_files'));
			this.getChildView('shared_files').showFiles();
		}
	},

	updateOptions: function(view) {
		view.options.view_kind = this.options.view_kind;
		view.options.detail_kind = this.options.detail_kind;
		view.options.date_format = this.options.date_format;
		view.options.date_range = this.options.date_range;
		view.options.multicolumn = this.options.multicolumn;
		view.options.items_per_page = this.options.items_per_page;
	},

	//
	// count rendering methods
	//

	showCount: function(kind, count) {
		this.$el.find('.' + kind.replace(/_/g, '-') + '-tab .badge').text(count);
		this.getChildView(kind).showCount(count);
	},

	//
	// fetching methods
	//

	fetchAndShowSearchIndexCount: function(query) {
		FileIndex.count(query, {

			// options
			//
			after: this.options.date_range? this.options.date_range[0] : undefined,
			before: this.options.date_range? this.options.date_range[1] : undefined,

			// callbacks
			//
			success: (count) => {
				count = parseInt(count);
				this.showCount('search_index', count);
				this.getChildView('search_index').setNumItems(count);
			}
		});
	},

	//
	// show results methods
	//

	fetchAndShowResults: function() {
		let query = this.options.query;
		let directory = config.defaults.search.directory;
		let search_kind = this.options.search_kind;

		// fetch and show results
		//
		if (!search_kind || search_kind.includes('index')) {
			this.fetchAndShowSearchIndexCount(query);
			this.fetchAndShowSearchIndex(query);
		}
		if (!search_kind || search_kind.includes('files')) {
			this.fetchAndShowSharedFiles(query, directory);
		}
		if (!search_kind || search_kind.includes('posts')) {
			this.fetchAndShowTopicPosts(query);
		}

		// show search page credits
		//
		this.$el.find('.credits').show();
	},

	fetchAndShowSearchIndex: function(query) {
		this.showChildView('search_index', new SearchIndexView({
			query: query,

			// options
			//
			view_kind: this.options.view_kind,
			detail_kind: this.options.detail_kind,
			date_format: this.options.date_format,
			date_range: this.options.date_range,
			multicolumn: this.options.multicolumn,
			items_per_page: this.options.items_per_page,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onchange: this.options.onchange
		}));
	},

	fetchAndShowSharedFiles: function(query, directory) {
		this.showChildView('shared_files', new SearchFilesView({
			query: query,
			directory: directory,

			// options
			//
			view_kind: this.options.view_kind,
			detail_kind: this.options.detail_kind,
			date_format: this.options.date_format,
			date_range: this.options.date_range,
			multicolumn: this.options.multicolumn,
			items_per_page: this.options.items_per_page,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onchange: (collection) => {
				this.showCount('shared_files', collection.length);

				// perform callback
				//
				if (this.options.onchange) {
					this.options.onchange();
				}
			}
		}));
	},

	fetchAndShowTopicPosts: function(query) {
		this.showChildView('topic_posts', new SearchPostsView({
			query: query,

			// callbacks
			//
			onchange: (collection) => {
				this.showCount('topic_posts', collection.length);

				// perform callback
				//
				if (this.options.onchange) {
					this.options.onchange();
				}
			}
		}));
	},

	//
	// mouse event handling methods
	//

	onChangeViewKind: function() {
		this.options.view_kind = this.getValue('view_kind');
		this.showResults();
	},

	onChangeDetailKind: function() {
		this.options.detail_kind = this.getValue('detail_kind');
		this.showResults();
	},

	onChangeAfterKind: function() {
		switch (this.getValue('after_kind')) {
			case 'date':
				this.$el.find('.options .after-date').show();
				this.$el.find('.options .after-span').hide();
				this.$el.find('.options .after_date input').val();
				this.options.date_range[0] = undefined;
				break;
			case 'span':
				this.$el.find('.options .after-span').show();
				this.$el.find('.options .after-date').hide();
				this.onChangeAfterSpan();
				break;
			default:
				this.$el.find('.options .after-date').hide();
				this.$el.find('.options .after-span').hide();
				this.options.date_range[0] = undefined;
				this.fetchAndShowResults();
				break;
		}
	},

	onChangeAfterSpan: function() {
		let value = this.getValue('after_value');
		let units = this.getValue('after_units');

		switch (units) {
			case 'days':
				this.setDaysAfter(value);
				break;
			case 'weeks':
				this.setDaysAfter(value * 7);
				break;
			case 'months':
				this.setDaysAfter(value * 30);
				break;
			case 'years':
				this.setDaysAfter(value * 365);
				break;
		}
	},

	onChangeAfterDate: function() {
		this.options.date_range[0] = this.getValue('after_date');
		this.fetchAndShowResults();
	},

	onChangeBeforeKind: function() {
		switch (this.getValue('before_kind')) {
			case 'date':
				this.$el.find('.options .before-date').show();
				this.$el.find('.options .before-span').hide();
				this.$el.find('.options .before_date input').val();
				this.options.date_range[1] = this.getValue('before_date');
				break;
			case 'span':
				this.$el.find('.options .before-span').show();
				this.$el.find('.options .before-date').hide();
				this.onChangeBeforeSpan();
				break;
			default:
				this.$el.find('.options .before-date').hide();
				this.$el.find('.options .before-span').hide();
				this.options.date_range[1] = undefined;
				this.fetchAndShowResults();
				break;
		}
	},

	onChangeBeforeSpan: function() {
		let value = this.getValue('before_value');
		let units = this.getValue('before_units');

		switch (units) {
			case 'days':
				this.setDaysBefore(value);
				break;
			case 'weeks':
				this.setDaysBefore(value * 7);
				break;
			case 'months':
				this.setDaysBefore(value * 30);
				break;
			case 'years':
				this.setDaysBefore(value * 365);
				break;
		}
	},

	onChangeBeforeDate: function() {
		this.options.date_range[1] = this.getValue('before_date');
		this.fetchAndShowResults();
	},

	onClickSearch: function() {

		// perform callback
		//
		if (this.options.onsearch) {
			this.options.onsearch();
		}
	}
});