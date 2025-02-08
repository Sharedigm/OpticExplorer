/******************************************************************************\
|                                                                              |
|                            link-info-form-view.js                            |
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

import File from '../../../../../../models/storage/files/file.js';
import Directory from '../../../../../../models/storage/directories/directory.js';
import Volume from '../../../../../../models/storage/directories/volume.js';
import InfoFormView from '../../../../../../views/apps/common/forms/info-form-view.js';
import FileIconView from '../../../../../../views/apps/file-browser/mainbar/files/icons/file-icon-view.js';
import DirectoryIconView from '../../../../../../views/apps/file-browser/mainbar/files/icons/directory-icon-view.js';
import VolumeIconView from '../../../../../../views/apps/file-browser/mainbar/files/icons/volume-icon-view.js';
import LinkAttributesFormView from '../../../../../../views/apps/file-browser/sharing/links/forms/link-attributes-form-view.js';
import LinkExpirationFormView from '../../../../../../views/apps/file-browser/sharing/links/forms/link-expiration-form-view.js';
import LinkPasswordFormView from '../../../../../../views/apps/file-browser/sharing/links/forms/link-password-form-view.js';

export default InfoFormView.extend({

	//
	// attributes
	//

	tabs: [
		{
			"name": "General",
			"icon": "fa fa-info-circle"
		},
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
			editable: this.getChildView('general').getValue('role') == 'editor',
			message: this.getChildView('general').getValue('message'),
			limit: this.getChildView('expiration').getValue('limit'),
			expiration_date: this.getChildView('expiration').getValue('expiration_date'),
			password: this.getChildView('protection').getValue('password')
		};
	},

	getItemIconView: function(item) {
		if (item instanceof Volume) {
			return VolumeIconView;
		} else if (item instanceof File) {
			return FileIconView;
		} else if (item instanceof Directory) {
			return DirectoryIconView;
		}
	},

	//
	// rendering methods
	//

	showRegion: function(name) {
		switch (name) {
			case 'item':
				this.showItem();
				break;
			case 'general':
				this.showGeneral();
				break;
			case 'expiration':
				this.showExpiration();
				break;
			case 'protection':
				this.showProtection();
				break;
		}
	},

	showItem: function() {
		let item = this.model.get('target');
		let ItemIconView = this.getItemIconView(item);

		this.showChildView('item', new ItemIconView({
			model: item,

			// capabilities
			//
			selectable: false
		}));
	},

	showGeneral: function() {
		this.showChildView('general', new LinkAttributesFormView({
			model: this.model
		}));
	},

	showExpiration: function() {
		this.showChildView('expiration', new LinkExpirationFormView({
			model: this.model
		}));
	},

	showProtection: function() {
		this.showChildView('protection', new LinkPasswordFormView({
			model: this.model
		}));
	}
});