/******************************************************************************\
|                                                                              |
|                               sidebar-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing an app's sidebar.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SideBarView from '../../../../views/apps/common/sidebar/sidebar-view.js';
import ChatInfoPanelView from '../../../../views/apps/chat-viewer/sidebar/panels/chat-info-panel-view.js';
import ChatsPanelView from '../../../../views/apps/chat-viewer/sidebar/panels/chats-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['info', 'chats'],

	//
	// attribute methods
	//

	enabled: function() {
		let hasModel = this.model != null;
		let isSignedIn = application.isSignedIn();

		return {
			'info': hasModel,
			'chats': isSignedIn
		};
	},

	//
	// setting methods
	//

	setChat: function(chat) {

		// set attributes
		//
		this.model = chat;

		// update child views
		//
		if (this.isPanelVisible('info')) {
			this.showPanel('info');
		}

		// set selected
		//
		// this.getChildView('chats').setSelectedModel(chat);

		// scroll into view
		//
		// this.scrollToView(this.findByModel(chat));
	},

	setSelectedModel: function(model, options) {
		this.getChildView('chats').setSelectedModels([model], options);

		// scroll into view
		//
		this.scrollTo(this.getSelected()[0]);
	},

	//
	// panel rendering methods
	//
	
	showPanel: function(panel) {

		// show specified panel
		//
		switch (panel) {
			case 'info':
				this.showChatInfoPanel();
				break;
			case 'chats':
				this.showChatsPanel();
				break;
		}
	},

	showChatInfoPanel: function() {
		this.showChildView('info', new ChatInfoPanelView({
			model: this.model,

			// options
			//
			view_kind: this.options.info_kind != 'auto'? this.options.info_kind : this.options.view_kind,
		}));		
	},

	showChatsPanel: function() {
		this.showChildView('chats', new ChatsPanelView({

			// options
			//
			view_kind: this.options.view_kind,

			// callbacks
			//
			onload: this.options.onload,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			ondrop: this.options.ondrop
		}));	
	}
});