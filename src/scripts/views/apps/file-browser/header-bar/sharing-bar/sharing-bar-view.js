/******************************************************************************\
|                                                                              |
|                              sharing-bar-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a navigation toolbar.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ToolbarView from '../../../../../views/apps/common/toolbars/toolbar-view.js';
import ShareByInvitationButtonView from '../../../../../views/apps/file-browser/header-bar/sharing-bar/buttons/share-by-invitation-button-view.js';
import ShareByTopicButtonView from '../../../../../views/apps/file-browser/header-bar/sharing-bar/buttons/share-by-topic-button-view.js';
import ShareByMessageButtonView from '../../../../../views/apps/file-browser/header-bar/sharing-bar/buttons/share-by-message-button-view.js';
import ShareByLinkButtonView from '../../../../../views/apps/file-browser/header-bar/sharing-bar/buttons/share-by-link-button-view.js';
import ShareByEmailButtonView from '../../../../../views/apps/file-browser/header-bar/sharing-bar/buttons/share-by-email-button-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="share-by-invitation" data-toggle="tooltip" title="Share by Invitation" data-placement="bottom"></div>
		<div class="share-by-topic" data-toggle="tooltip" title="Share by Topic" data-placement="bottom"></div>
		<div class="share-by-message" data-toggle="tooltip" title="Share by Message" data-placement="bottom"></div>
		<div class="share-by-link" data-toggle="tooltip" title="Share by Link" data-placement="bottom"></div>
		<div class="share-by-email" data-toggle="tooltip" title="Share by Email" data-placement="bottom"></div>
	`),

	regions: {
		invitation: '.share-by-invitation',
		topic: '.share-by-topic',
		message: '.share-by-message',
		link: '.share-by-link',
		email: '.share-by-email'
	},

	enabled: function() {
		let isHome = this.app.isHome();
		let hasSelected = this.app.hasSelected();
		let numSelected = this.app.numSelected();
		let oneSelected = numSelected == 1;

		return {
			'share-by-invitation': hasSelected || !isHome,
			'share-by-topic': hasSelected || !isHome,
			'share-by-message': hasSelected || !isHome,
			'share-by-link': oneSelected || !isHome,
			'share-by-email': oneSelected || !isHome
		};
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ToolbarView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('invitation', new ShareByInvitationButtonView());
		this.showChildView('topic', new ShareByTopicButtonView());
		this.showChildView('message', new ShareByMessageButtonView());
		this.showChildView('link', new ShareByLinkButtonView());
		this.showChildView('email', new ShareByEmailButtonView());
	},

	//
	// selection event handling methods
	//

	onSelect: function() {
		this.update();
	},

	onDeselect: function() {
		this.update();
	}
});