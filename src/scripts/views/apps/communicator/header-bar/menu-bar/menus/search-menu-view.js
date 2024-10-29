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

import Topic from '../../../../../../models/topics/topic.js';
import Chat from '../../../../../../models/chats/chat.js';
import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';

export default MenuView.extend({

	//
	// attributes
	//

	template: template(`
		<li role="presentation" type="search-by">
			<a class="search-by-message"><i class="fa fa-check"></i><i class="fa fa-quote-left"></i>By Message</a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation" type="search-by">
			<a class="search-by-date"><i class="fa fa-check"></i><i class="fa fa-calendar-alt"></i>By Date</a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation" type="search-by">
			<a class="search-by-num-likes"><i class="fa fa-check"></i><i class="fa fa-thumbs-up"></i>By Likes</a>
		</li>
		
		<li role="presentation" type="search-by">
			<a class="search-by-num-comments"><i class="fa fa-check"></i><i class="fa fa-comment"></i>By Comments</a>
		</li>
	`),

	events: {
		'click li[type=search-by] a': 'onClickSearchBy'
	},

	//
	// querying methods
	//

	visible: function() {
		let isTopic = this.parent.app.model instanceof Topic;
		let isChat = this.parent.app.model instanceof Chat;

		return {
			'search-by-message': isTopic || isChat,
			'search-by-date': isTopic || isChat,
			'search-by-num-links': isTopic,
			'search-by-num-comments': isTopic
		};
	},

	selected: function() {
		let preferences = this.parent.app.preferences;
		let searchKind = preferences.get('search_kind');

		return {
			'search-by-message': searchKind == 'message',
			'search-by-date': searchKind == 'date',
			'search-by-num-links': searchKind == 'num_links',
			'search-by-num-comments': searchKind == 'num_comments'
		};
	},

	//
	// setting methods
	//

	setSearchKind: function(searchKind) {

		// deselect all search menu items
		//
		this.setItemsDeselected(this.$el.find('li[type=search-by]').map((index, element) => { 
			return $(element).find('a').attr('class');
		}).get());

		// set selected search menu item
		//
		if (searchKind) {
			this.setItemSelected('search-by-' + searchKind.replace(/_/g, '-'), true);
		}
	},

	//
	// mouse event handling methods
	//

	onClickSearchBy: function(event) {
		let className = $(event.currentTarget).attr('class');
		let searchKind = className.replace('search-by-', '').replace(/-/g, '_');

		// update search
		//
		if (!this.isItemSelected(className)) {
			let search = [];
			search[searchKind] = undefined;
			this.parent.app.setSearch(search);
		} else {
			this.parent.app.setSearch(null);
		}
	}
});