/******************************************************************************\
|                                                                              |
|                            chat-info-panel-view.js                           |
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
import ChatsView from '../../../../../views/apps/chat-browser/mainbar/chats/chats-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'chat-info panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-info-circle"></i>Chat</label>
		
			<div class="buttons">
				<button type="button" class="show-info success btn btn-sm" data-toggle="tooltip" title="Show Info">
					<i class="fa fa-info-circle"></i>
				</button>
			</div>
		</div>
		
		<div class="item-info">
			<div class="item"></div>
		
			<div class="num-members form-group" style="display:none">
				<label class="control-label"><i class="fa fa-quote-left"></i>Description</label>
				<div class="controls">
					<div class="well"><%= members? members.length : 0 %> members</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		items: '.item'
	},

	events: {
		'click .show-info': 'onClickShowInfo'
	},

	//
	// constructor
	//

	initialize: function() {

		// call superclass method
		//
		SideBarPanelView.prototype.initialize.call(this);

		// set defaults
		//
		/*
		if (this.options.view_kind == undefined) {
			this.options.view_kind = 'icons';
		}
		*/
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			members: this.model? this.model.get('members') : []
		};
	},

	onRender: function() {

		// call superclass method
		//
		SideBarPanelView.prototype.onRender.call(this);
		
		// show child views
		//
		if (this.model) {
			this.showItem();
		}
	},

	showItem: function() {
		this.showChildView('items', new ChatsView({
			collection: new Chats([this.model], {
				parse: false
			}),

			// options
			//
			preferences: UserPreferences.create('chat_viewer', {
				view_kind: this.options.view_kind
			}),

			// capabilities
			//
			selectable: false
		}));
	},

	//
	// mouse event handling methods
	//

	onClickShowInfo: function() {
		this.getParentView('app').showInfoDialog();
	}
});