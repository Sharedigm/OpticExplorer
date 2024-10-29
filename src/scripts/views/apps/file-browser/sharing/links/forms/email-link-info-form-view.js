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

	template: template(`
		<div class="item"></div>
		
		<ul class="nav nav-tabs" role="tablist">
		
			<li role="presentation" class="expiration-tab active">
				<a role="tab" data-toggle="tab" href=".expiration-panel">
					<i class="fa fa-clock"></i>
					<label>Expiration</label>
				</a>
			</li>
			
			<li role="presentation" class="protection-tab">
				<a role="tab" data-toggle="tab" href=".protection-panel">
					<i class="fa fa-key"></i>
					<label>Protection</label>
				</a>
			</li>
		</ul>
		
		<div class="tab-content">
		
			<div role="tabpanel" class="expiration-panel tab-pane active">
				<p>Links can be set to self destruct after which they can no longer be used. </p>
				<div class="link-expiration-form"></div>
			</div>
		
			<div role="tabpanel" class="protection-panel tab-pane">
				<p>Links can be be protected so that the user of a link must provide a password. </p>
				<div class="link-password-form"></div>
			</div>
		</div>
	`),

	regions: {
		item: {
			el: '.item',
			replaceElement: true
		},
		expiration: '.link-expiration-form',
		protection: '.link-password-form'
	},

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
