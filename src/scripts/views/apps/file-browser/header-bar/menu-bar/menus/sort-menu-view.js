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

import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';

export default MenuView.extend({

	//
	// attributes
	//

	template: template(`
		<li role="presentation" type="sort-by">
			<a class="sort-by-name"><i class="fa fa-check"></i><i class="fa fa-font"></i>By Name</a>
		</li>
		
		<li role="presentation" type="sort-by">
			<a class="sort-by-kind"><i class="fa fa-check"></i><i class="fa fa-file"></i>By Kind</a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation" type="sort-by">
			<a class="sort-by-size"><i class="fa fa-check"></i><i class="fa fa-download"></i>By Size</a>
		</li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="sort-by-date dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-calendar-alt"></i>By Date<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
				<li role="presentation" type="sort-by">
					<a class="sort-by-create-date"><i class="fa fa-check"></i><i class="fa fa-magic"></i>Create Date</a>
				</li>
		
				<li role="presentation" type="sort-by">
					<a class="sort-by-modify-date"><i class="fa fa-check"></i><i class="fa fa-edit"></i>Modify Date</a>
				</li>
		
				<li role="presentation" type="sort-by">
					<a class="sort-by-access-date"><i class="fa fa-check"></i><i class="fa fa-eye"></i>Access Date</a>
				</li>
			</ul>
		</li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="sort-by-audio dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-music"></i>By Audio<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
				<li role="presentation" type="sort-by">
					<a class="sort-by-album"><i class="fa fa-check"></i><i class="fa fa-folder"></i>Album</a>
				</li>
				<li role="presentation" type="sort-by">
					<a class="sort-by-artist"><i class="fa fa-check"></i><i class="fa fa-user"></i>Artist</a>
				</li>
				<li role="presentation" type="sort-by">
					<a class="sort-by-band"><i class="fa fa-check"></i><i class="fa fa-users"></i>Band</a>
				</li>
				<li role="presentation" type="sort-by">
					<a class="sort-by-composer"><i class="fa fa-check"></i><i class="fa fa-magic"></i>Composer</a>
				</li>
				<li role="presentation" type="sort-by">
					<a class="sort-by-genre"><i class="fa fa-check"></i><i class="fa fa-tags"></i>Genre</a>
				</li>
				<li role="presentation" type="sort-by">
					<a class="sort-by-length"><i class="fa fa-check"></i><i class="fa fa-clock"></i>Length</a>
				</li>
				<li role="presentation" type="sort-by">
					<a class="sort-by-publisher"><i class="fa fa-check"></i><i class="fa fa-money-bill"></i>Publisher</a>
				</li>
				<li role="presentation" type="sort-by">
					<a class="sort-by-track-number"><i class="fa fa-check"></i><i class="fa fa-list-ol"></i>Track Number</a>
				</li>
				<li role="presentation" type="sort-by">
					<a class="sort-by-year"><i class="fa fa-check"></i><i class="fa fa-calendar-alt"></i>Year</a>
				</li>
			</ul>
		</li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="sort-by-photo dropdown-toggle"><i class="fa fa-check"></i><i class="fa fa-image"></i>By Photo<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
				<li role="presentation" type="sort-by">
					<a class="sort-by-resolution"><i class="fa fa-check"></i><i class="fa fa-arrows-alt"></i>Resolution</a>
				</li>
		
				<li role="presentation" type="sort-by">
					<a class="sort-by-make-model"><i class="fa fa-check"></i><i class="fa fa-camera"></i>Make / Model</a>
				</li>
		
				<li role="presentation" type="sort-by">
					<a class="sort-by-focal-length"><i class="fa fa-check"></i><i class="fa fa-arrows-alt-h"></i>Focal Length</a>
				</li>
		
				<li role="presentation" type="sort-by">
					<a class="sort-by-aperture"><i class="fa fa-check"></i><i class="fa fa-dot-circle"></i>Aperture</a>
				</li>
				
				<li role="presentation" type="sort-by">
					<a class="sort-by-exposure"><i class="fa fa-check"></i><i class="fa fa-clock"></i>Exposure</a>
				</li>
		
				<li role="presentation" type="sort-by">
					<a class="sort-by-iso"><i class="fa fa-check"></i><i class="fa fa-film"></i>ISO</a>
				</li>
		
				<li role="presentation" type="sort-by">
					<a class="sort-by-capture-date"><i class="fa fa-check"></i><i class="fa fa-calendar-alt"></i>Capture Date</a>
				</li>
			</ul>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation" type="sort-order">
			<a class="sort-increasing"><i class="fa fa-check"></i><i class="fa fa-sort-amount-up"></i>Increasing</a>
		</li>
		
		<li role="presentation" type="sort-order">
			<a class="sort-decreasing"><i class="fa fa-check"></i><i class="fa fa-sort-amount-down"></i>Decreasing</a>
		</li>
	`),

	events: {
		'click li[type=sort-by] a': 'onClickSortBy',
		'click li[type=sort-order] a': 'onClickSortOrder'
	},

	//
	// querying methods
	//

	hidden: function() {
		return {
			'sort-by-audio': this.parent.app.model.get('num_audio_files') == 0,
			'sort-by-photo': this.parent.app.model.get('num_image_files') == 0
		};
	},

	selected: function() {
		let preferences = this.parent.app.preferences;
		let sortKind = preferences.get('sort_kind');
		let sortOrder = preferences.get('sort_order');

		return {
			'sort-by-name': sortKind == 'name',
			'sort-by-kind': sortKind == 'kind',
			'sort-by-size': sortKind == 'size',
			'sort-by-create-date': sortKind == 'create_date',
			'sort-by-modify-date': sortKind == 'modify_date',
			'sort-by-access-date': sortKind == 'access_date',
			'sort-by-resolution': sortKind == 'resolution',
			'sort-by-make-model': sortKind == 'make_model',
			'sort-by-focal-length': sortKind == 'focal_length',
			'sort-by-aperture': sortKind == 'aperture',
			'sort-by-exposure': sortKind == 'exposure',
			'sort-by-iso': sortKind == 'iso',
			'sort-by-capture-date': sortKind == 'capture_date',
			'sort-increasing': sortOrder == 'increasing',
			'sort-decreasing': sortOrder == 'decreasing'
		};
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.setItemVisible('sort-by-audio', this.parent.app.model.get('num_audio_files') > 0);
		this.setItemVisible('sort-by-photo', this.parent.app.model.get('num_image_files') > 0);
	},

	//
	// mouse event handling methods
	//

	onClickSortBy: function(event) {
		let className = $(event.currentTarget).attr('class');
		let sortKind = className.replace('sort-by-', '').replace(/-/g, '_');

		// update menu
		//
		this.$el.find('li[type="sort-by"]').removeClass('selected');
		this.$el.find('li .' + className).closest('li').addClass('selected');

		// update files
		//
		this.parent.app.setOption('sort_kind', sortKind);
		this.parent.app.getActiveView().onChange();
	},

	onClickSortOrder: function(event) {
		let className = $(event.currentTarget).attr('class');
		let sortOrder = className.replace('sort-', '').replace(/-/g, '_');

		// update menu
		//
		this.$el.find('li[type="sort-order"]').removeClass('selected');
		this.$el.find('li .' + className).closest('li').addClass('selected');

		// update files
		//
		this.parent.app.setOption('sort_order', sortOrder);
		this.parent.app.getActiveView().onChange();
	}
});