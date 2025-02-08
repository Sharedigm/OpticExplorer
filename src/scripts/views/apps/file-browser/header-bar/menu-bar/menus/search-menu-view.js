/******************************************************************************\
|                                                                              |
|                              search-menu-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying search dropdown menus.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SearchMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/search-menu-view.js';

export default SearchMenuView.extend({

	//
	// attributes
	//

	events: {
		'click .search-by > a': 'onClickSearchBy',
		'click .index-items': 'onClickIndexItems',
		'click .unindex-items': 'onClickUnindexItems'
	},

	//
	// querying methods
	//

	visible: function() {
		let hasConnectionManager = application.hasApp('connection_manager');

		return {
			'search-by-shared-with-me': hasConnectionManager,
			'search-by-shared-by-me': hasConnectionManager,
			'index-items': true,
			'unindex-items': true,
		}
	},

	enabled: function() {
		let hasSelected = this.parent.app.hasSelected();

		return {
			'index-items': hasSelected,
			'unindex-items': hasSelected
		}
	},

	selected: function() {
		let preferences = this.parent.app.preferences;
		let searchKind = preferences.get('search_kind');

		return {
			'name': searchKind == 'name',
			'kind': searchKind == 'kind',
			'size': searchKind == 'size',
			'keyword': searchKind == 'keyword',
			'meaning': searchKind == 'meaning',
			'create-date': searchKind == 'create_date',
			'modify-date': searchKind == 'modify_date',
			'access-date': searchKind == 'access_date',
			'resolution': searchKind == 'resolution',
			'make-model': searchKind == 'make_model',
			'focal-length': searchKind == 'focal_length',
			'aperture': searchKind == 'aperture',
			'exposure': searchKind == 'exposure',
			'iso': searchKind == 'iso',
			'capture-date': searchKind == 'capture_date'
		};
	},

	//
	// mouse event handling methods
	//

	onClickIndexItems: function() {

		// index selected items
		//
		this.parent.app.indexSelected();
	},

	onClickUnindexItems: function() {

		// unindex selected items
		//
		this.parent.app.unindexSelected();
	}
});