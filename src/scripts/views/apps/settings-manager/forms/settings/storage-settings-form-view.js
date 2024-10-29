/******************************************************************************\
|                                                                              |
|                          storage-settings-form-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing an account settings form.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserStorage from '../../../../../models/users/storage/user-storage.js';
import SettingsFormView from '../../../../../views/apps/common/forms/settings-form-view.js';
import S3VolumeFormView from '../../../../../views/apps/file-browser/forms/volumes/s3-volume-form-view.js';
import PieView from '../../../../../views/forms/outputs/pie-view.js';
import '../../../../../utilities/scripting/string-utils.js';
import '../../../../../utilities/time/date-utils.js';
import '../../../../../utilities/time/time-utils.js';

export default SettingsFormView.extend({

	//
	// attributes
	//

	className: 'form-horizontal narrow',

	template: template(`
		<div class="settings icon-grid">
			<div class="item">
				<div class="row">
					<div class="icon colored grey">
						<img src="images/icons/settings/storage.svg" />
						<i class="fa fa-database"></i>
					</div>
				</div>
				<div class="row">
					<div class="name">Storage</div>
				</div>
			</div>
		</div>

		<ul class="nav nav-tabs" role="tablist">

			<% if (show_remote) { %>
			<li role="presentation" class="remote-tab<% if (tab == 'remote' || !tab) { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".remote-settings">
					<i class="fa fa-bucket"></i>
					<label>Remote</label>
				</a>
			</li>
			<% } else { %>
			<li role="presentation" class="quota-tab<% if (tab == 'quota' || (!tab && !show_remote)) { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".quota-settings">
					<i class="fa fa-less-than"></i>
					<label>Quota</label>
				</a>
			</li>

			<li role="presentation" class="graph-tab<% if (tab == 'graph') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".graph-settings">
					<i class="fa fa-chart-pie"></i>
					<label>Graph</label>
				</a>
			</li>
			<% } %>
		</ul>

		<div class="tab-content">

			<% if (show_remote) { %>
			<div role="tabpanel" class="remote-settings tab-pane<% if (tab == 'remote' || !tab) { %> active<% } %>">
				<div class="storage-settings"></div>

				<div class="center aligned buttons">
					<br />
					<button class="check-settings btn">
						<i class="fa fa-check"></i>Check Settings
					</button>
					<button class="update-settings btn">
						<i class="fa fa-gear"></i>Update Settings
					</button>
				</div>
			</div>
			<% } else { %>
			<div role="tabpanel" class="quota-settings tab-pane<% if (tab == 'quota' || (!tab && !show_remote)) { %> active<% } %>">
				<div class="disk-quota form-group">
					<label class="form-label">Quota</label>
					<p class="form-control-static">
						You are allocated <%= disk_quota? disk_quota + ' of': 'unlimited' %> storage.
					</p>
				</div>
				<div class="disk-used form-group">
					<label class="form-label">Used</label>
					<p class="form-control-static">
						<%= disk_used %> / <%= disk_quota %> = <%= percent_disk_used %>%
					</p>
				</div>
				<div class="disk-free form-group">
					<label class="form-label">Free</label>
					<p class="form-control-static">
						<%= disk_free %> / <%= disk_quota %> = <%= percent_disk_free %>%
					</p>
				</div>

				<% if (show_upgrade_account) { %>
				<div class="center aligned buttons">
					<button class="upgrade-account btn">
						<i class="fa fa-arrow-up"></i>Upgrade Account
					</button>
				</div>
				<% } %>
			</div>

			<div role="tabpanel" class="graph-settings tab-pane<% if (tab == 'graph') { %> active<% } %>">
				<div class="pie"></div>
				<div class="center aligned">
					<label>Used Storage</label>
				</div>
			</div>
			<% } %>
		</div>
	`),

	regions: {
		storage_settings: {
			el: '.storage-settings',
			replaceElement: false
		},
		pie: {
			el: '.pie',
			replaceElement: true
		}
	},
	
	events: {
		'click .check-settings': 'onClickCheckSettings',
		'click .update-settings': 'onClickUpdateSettings',
		'click .upgrade-account': 'onClickUpgradeAccount'
	},

	//
	// constructor
	//

	initialize: function(options) {

		// call superclass constructor
		//
		SettingsFormView.prototype.initialize.call(this, options);

		// set attributes
		//
		this.storage = new UserStorage();
	},

	//
	// querying methods
	//

	isRemote: function() {
		return application.session.get('config').user_storage == 's3';
	},

	//
	// methods
	//

	checkSettings: function() {
		this.getChildView('storage_settings').checkStorage({

			// callbacks
			//
			success: () => {
				application.notify({
					message: "Remote storage was accessed successfully."
				});
			},

			error: () => {
				application.notify({
					message: "Remote storage could not be found."
				});
			}
		});
	},

	updateSettings: function() {
		this.getChildView('storage_settings').checkStorage({

			// callbacks
			//
			success: () => {
				this.storage.save(this.getChildView('storage_settings').getValues(), {

					// callbacks
					//
					success: () => {
						application.notify({
							message: "Changes saved successfully."
						});
					},

					error: () => {
						application.error({
							message: "Your changes could not be saved."
						});
					}
				});
			},

			error: () => {
				application.notify({
					message: "Remote storage could not be found."
				});
			}
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			tab: this.options.tab,
			disk_used: this.model.getDiskUsed(),
			disk_free: this.model.getDiskFree(),
			percent_disk_used: Math.round(this.model.getPercentDiskUsed()),
			percent_disk_free: Math.round(this.model.getPercentDiskFree()),
			show_remote: this.isRemote(),
			show_upgrade_account: this.options.upgrade_account_url != undefined
		};
	},

	onRender: function() {
		if (!this.isRemote() && this.model.has('disk_quota')) {
			let percent = Math.min(this.model.getPercentDiskUsed(), 100);

			this.showChildView('pie', new PieView({
				angle: percent / 100 * 360
			}));
		}

		if (this.isRemote()) {
			this.storage.fetch({

				// callbacks
				//
				success: (userStorage) => {
					this.showRemoteSettings(userStorage);
				}
			});
		}
	},

	showRemoteSettings: function(userStorage) {
		this.showChildView('storage_settings', new S3VolumeFormView({
			model: userStorage
		}));
	},

	//
	// mouse event handlers
	//

	onClickCheckSettings: function() {
		this.checkSettings();
	},

	onClickUpdateSettings: function() {
		this.updateSettings();
	},

	onClickUpgradeAccount: function() {
		application.showUrl(this.options.upgrade_account_url);
	}
});