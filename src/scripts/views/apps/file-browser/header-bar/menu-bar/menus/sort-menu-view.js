/******************************************************************************\
|                                                                              |
|                               sort-menu-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying sort dropdown menus.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SortMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/sort-menu-view.js';

export default SortMenuView.extend({

	//
	// attributes
	//

	events: {
		'click .sort-by a': 'onClickSortBy',
		'click .sort-order a': 'onClickSortOrder'
	},

	//
	// querying methods
	//

	hidden: function() {
		return {
			'audio': this.parent.app.model.get('num_audio_files') == 0,
			'photo': this.parent.app.model.get('num_image_files') == 0
		};
	},

	selected: function() {
		let preferences = this.parent.app.preferences;
		let sortKind = preferences.get('sort_kind');
		let sortOrder = preferences.get('sort_order');

		return {
			'name': sortKind == 'name',
			'kind': sortKind == 'kind',
			'size': sortKind == 'size',
			'create-date': sortKind == 'create_date',
			'modify-date': sortKind == 'modify_date',
			'access-date': sortKind == 'access_date',
			'resolution': sortKind == 'resolution',
			'make-model': sortKind == 'make_model',
			'focal-length': sortKind == 'focal_length',
			'aperture': sortKind == 'aperture',
			'exposure': sortKind == 'exposure',
			'iso': sortKind == 'iso',
			'capture-date': sortKind == 'capture_date',
			'sort-increasing': sortOrder == 'increasing',
			'sort-decreasing': sortOrder == 'decreasing'
		};
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.setItemVisible('audio', this.parent.app.model.get('num_audio_files') > 0);
		this.setItemVisible('photo', this.parent.app.model.get('num_image_files') > 0);
	}
});