/******************************************************************************\
|                                                                              |
|                         email-link-info-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for defining link attributes.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPreferences from '../../../../../../models/preferences/user-preferences.js';
import Items from '../../../../../../collections/storage/items.js';
import InfoFormView from '../../../../../../views/apps/common/forms/info-form-view.js';
import FilesView from '../../../../../../views/apps/file-browser/mainbar/files/files-view.js';
import LinkExpirationFormView from '../../../../../../views/apps/file-browser/sharing/links/forms/link-expiration-form-view.js';
import LinkPasswordFormView from '../../../../../../views/apps/file-browser/sharing/links/forms/link-password-form-view.js';

export default InfoFormView.extend({

	//
	// attributes
	//

	tabs: [
		{
			"name": "Expiration",
			"icon": "fa fa-clock"
		},
		{
			"name": "Protection",
			"icon": "fa fa-key"
		}
	],

	//
	// data getting methods
	//

	getData: function() {
		return {
			'limit': this.getChildView('expiration').getLimit(),
			'expiration_date': this.getChildView('expiration').getExpirationDate(),
			'password': this.getChildView('protection').getPassword()
		};
	},

	//
	// rendering methods
	//

	showRegion: function(name) {
		switch (name) {
			case 'item':
				this.showItem();
				break;
			case 'expiration':
				this.showExpirationPane();
				break;
			case 'protection':
				this.showProtectionPane();
				break;
		}
	},

	showItem: function() {
		this.showChildView('item', new FilesView({
			collection: new Items([this.model.get('target')], {
				parse: false
			}),

			// options
			//
			preferences: UserPreferences.create('file_browser', {
				view_kind: 'icons',
				detail_kind: null,
				show_hidden_files: true,
				sort_kind: null
			}),

			// capabilities
			//
			selectable: false
		}));
	},

	//
	// pane rendering methods
	//

	showExpirationPane: function() {
		this.showChildView('expiration', new LinkExpirationFormView({
			model: this.model
		}));
	},

	showProtectionPane: function() {
		this.showChildView('protection', new LinkPasswordFormView({
			model: this.model
		}));
	}
});