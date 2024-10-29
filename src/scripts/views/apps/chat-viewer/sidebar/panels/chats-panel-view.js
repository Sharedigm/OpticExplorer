/******************************************************************************\
|                                                                              |
|                              chats-panel-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a type of sidebar panel.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import Chats from '../../../../../collections/chats/chats.js';
import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import ContainableSelectable from '../../../../../views/behaviors/containers/containable-selectable.js';
import ChatsView from '../../../../../views/apps/chat-browser/mainbar/chats/chats-view.js';

export default SideBarPanelView.extend(_.extend({}, ContainableSelectable, {

	//
	// attributes
	//

	className: 'chats panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-comment"></i>Chats</label>
			
			<div class="buttons">
				<button type="button" class="add-chat success btn btn-sm" data-toggle="tooltip" title="Add Chat">
					<i class="fa fa-plus"></i>
				</button>
			</div>
		</div>
		
		<div class="items"></div>
	`),

	regions: {
		'items': {
			el: '.items',
			replaceElement: true
		}
	},	

	events: {
		'click .add-chat': 'onClickAddChat'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.collection = new Chats();
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('items')) {
			this.getChildView('items').each(callback, filter, options);
		}
	},

	//
	// fetching methods
	//

	fetchChats: function(done) {
		return this.collection.fetch({

			// callbacks
			//
			success: (collection) => {
				if (done) {
					done();
				}

				// perform callback
				//
				if (this.options.onload) {
					this.options.onload(collection);
				}
			}
		});
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SideBarPanelView.prototype.onRender.call(this);

		// show child views
		//
		this.request = this.fetchChats(() => {
			this.showChats();
		});
	},

	showChats: function() {

		// show list of chats
		//
		this.showChildView('items', new ChatsView({
			collection: this.collection,

			// options
			//
			preferences: UserPreferences.create('chat_viewer', {
				view_kind: this.options.view_kind
			}),
			selected: [this.model],
			empty: "No chats",

			// capabilities
			//
			selectable: true,
			deselectable: true,
			draggable: true,
			editable: false,

			// callbacks
			//
			onload: this.options.onload,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			ondrop: this.options.ondrop
		}));
	},

	//
	// mouse event handling methods
	//

	onClickAddChat: function() {

		// show new chat invitations dialog
		//
		this.app.showChatInvitationsDialog();
	},

	//
	// selection event handling methods
	//

	onSelect: function(item) {
		let index = this.collection.indexOf(item.model);
		this.app.setModel(this.collection.at(index));		
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// abort request
		//
		if (this.request && this.request.state() == 'pending') {
			this.request.abort();
		}
	}
}));