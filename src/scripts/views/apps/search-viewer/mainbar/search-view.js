/******************************************************************************\
|                                                                              |
|                                search-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a search bar and results.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';
import SearchBarView from '../../../../views/apps/search-viewer/mainbar/panels/search-bar-view.js';
import SearchPanelView from '../../../../views/apps/search-viewer/mainbar/panels/search-panel-view.js';
import SearchResultsView from '../../../../views/apps/search-viewer/mainbar/results/search-results-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'search content',

	template: template(`
		<div class='form'></div>
	`),

	regions: {
		form: '.form',
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.target = this.options.preferences.get('target');
	},

	//
	// querying methods
	//

	hasSelected: function() {
		if (this.getChildView('form').hasSelected) {
			return this.getChildView('form').hasSelected();
		} else {
			return false;
		}
	},

	numResults: function() {
		if (this.getChildView('form').numResults) {
			return this.getChildView('form').numResults();
		} else {
			return 0;
		}
	},

	//
	// getting methods
	//

	getValue: function(kind) {
		switch (kind) {
			case 'query':
				return this.getChildView('form').getQuery();
		}
	},

	getOption: function(kind) {
		return this.getParentView('app').getOption(kind);
	},

	getSelectedModels: function() {
		if (this.getChildView('form').getSelectedModels) {
			return this.getChildView('form').getSelectedModels();
		}
	},

	//
	// setting methods
	//

	setOption: function(key, value) {

		// update view
		//
		switch (key) {
			case 'search':
				if (this.getChildView('form').setSearch) {
					this.getChildView('form').setSearch(value);
				}
				break;
			case 'target':
				this.setSearchTarget(value);
				this.target = value;
				break;
			default:
				this.getChildView('form').setOption(key, value);
				break;
		}
	},

	setSearchTarget: function(target) {
		if (target != 'file') {
			this.showSearchBar();
			this.getChildView('form').setOption('target', target);
		} else {
			this.showSearchPanel();
		}
	},

	//
	// form methods
	//

	searchFor: function(query) {
		this.showChildView('form', new SearchResultsView({
			query: query,

			// options
			//
			search_kind: this.options.preferences.get('search'),
			view_kind: this.options.preferences.get('view_kind'),
			items_per_page: this.options.preferences.get('items_per_page'),
			detail_kind: this.options.preferences.get('detail_kind'),
			date_format: this.options.preferences.get('date_format'),
			multicolumn: this.options.multicolumn,

			// callbacks
			//
			onsearch: this.options.onsearch,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onchange: this.options.onchange
		}));
	},

	//
	// rendering methods
	//

	onRender: function() {

		// set initial state
		//
		this.setSearchTarget(this.target);
	},

	showSearchBar: function() {
		this.showChildView('form', new SearchBarView({
			preferences: this.options.preferences,

			// callbacks
			//
			onsubmit: (query) => {
				this.searchFor(query);
			}
		}));
	},

	showSearchPanel: function() {
		this.showChildView('form', new SearchPanelView({
			preferences: this.options.preferences
		}));
	}
});