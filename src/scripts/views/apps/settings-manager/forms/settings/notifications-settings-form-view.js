/******************************************************************************\
|                                                                              |
|                     notifications-settings-form-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for viewing and editing notification settings.    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SettingsFormView from '../../../../../views/apps/common/forms/settings-form-view.js';
import NotificationSettingsListView from '../../../../../views/apps/settings-manager/mainbar/notification-settings-list/notification-settings-list-view.js';

export default SettingsFormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="settings icon-grid">
			<div class="item">
				<div class="row">
					<div class="icon colored grey">
						<img src="images/icons/settings/notifications.svg" />
						<i class="fa fa-exclamation-triangle"></i>
					</div>
				</div>
				<div class="row">
					<div class="name">Notifications</div>
				</div>
			</div>
		</div>

		<ul class="nav nav-tabs" role="tablist">

			<li role="presentation" class="general-tab<% if (tab == 'general' || !tab) { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".general-settings">
					<i class="fa fa-check"></i>
					<label>General</label>
				</a>
			</li>

			<li role="presentation" class="events-tab<% if (tab == 'events') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".events-settings">
					<i class="fa fa-exclamation-triangle"></i>
					<label>Events</label>
				</a>
			</li>
		</ul>

		<div class="tab-content">

			<div role="tabpanel" class="general-settings tab-pane<% if (tab == 'general' || !tab) { %> active<% } %>">
				<div class="sms-notifications form-group">
					<label class="control-label"><i class="fa fa-mobile"></i>SMS Enabled</label>
					<div class="controls">
						<div class="checkbox-inline" style="float:left">
							<input type="checkbox"<% if (sms_notifications) { %> checked<% } %> />
						</div>
					</div>
				</div>

				<div class="sms-number form-group"<% if (!sms_notifications) { %>style="display:none"<% } %>>
					<label class="control-label"><i class="fa fa-hashtag"></i>SMS Number</label>
					<div class="controls">
						<div class="input-group" style="width:max-content">
							<input type="text" class="country-code form-control" style="width:2em" value="<%= country_code %>">

							<span class="input-group-addon">(</span>
							<input type="text" class="area-code form-control" style="width:3em" value="<%= area_code %>">
							<span class="input-group-addon">)</span>

							<input type="text" class="first-digits form-control" style="width:3em" value="<%= phone_number? phone_number.split('-')[0] : '' %>">
							<span class="input-group-addon">-</span>
							<input type="text" class="last-digits form-control" style="width:4em" value="<%= phone_number? phone_number.split('-')[1] : '' %>">

							<div class="input-group-addon">
								<i class="active fa fa-question-circle" data-toggle="popover" title="Number" data-content="This is your phone number (country code, area code, and phone number)."></i>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div role="tabpanel" class="events-settings tab-pane<% if (tab == 'events') { %> active<% } %>">
				<div class="list"></div>
			</div>
		</div>
	`),

	regions: {
		list: {
			el: '.list',
			replaceElement: true
		}
	},

	events: {
		'click .sms-notifications input': 'onClickSmsNotifications',
		'input .sms-number .input-group input': 'onInputSmsNumber'
	},

	//
	// constructor
	//

	initialize: function() {
		this.model = application.settings.notifications;
	},

	//
	// querying methods
	//

	getValue: function(name) {
		switch (name) {
			case 'sms_notifications':
				return this.$el.find('.sms-notifications input').is(':checked');
			case 'country_code':
				return this.$el.find('.country-code').val();
			case 'area_code':
				return this.$el.find('.area-code').val();
			case 'phone_number':
				return this.$el.find('.first-digits').val() + '-' + this.$el.find('.last-digits').val();
			case 'sms_number':
				return this.getValue('country_code') + ' ' + 
					this.getValue('area_code') + ' ' + 
					this.getValue('phone_number');			
		}
	},

	getValues: function() {
		return {
			enable_notifications: this.getValue('enable_notifications'),
			sms_number: this.getValue('sms_number')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let sms_notifications = application.settings.notifications.get('sms_notifications');
		let sms_number = application.settings.notifications.get('sms_number');
		let substrings = sms_number? sms_number.split(' ') : [];
		let country_code = 1;
		let area_code;
		let phone_number;

		if (substrings.length >= 3) {
			country_code = (substrings[0] != '' ? substrings[0] : undefined);
			area_code = (substrings[1] != '' ? substrings[1] : undefined);
			phone_number = (substrings[2] != '' ? substrings[2] : undefined);
		} else {
			phone_number = (substrings[0] != '' ? substrings[0] : undefined);
		}

		return {
			tab: this.options.tab,
			sms_notifications: sms_notifications,
			country_code: country_code,
			area_code: area_code,
			phone_number: phone_number
		};
	},

	onRender: function() {

		// show child views
		//
		this.showNotificationSettingsList();
	},

	showNotificationSettingsList: function() {
		this.showChildView('list', new NotificationSettingsListView({
			model: this.model,
			collection: this.model.toCollection('event', 'notifications'),
			channels: application.session.get('config').notification_channels
		}));
	},

	//
	// mouse event handling methods
	//

	onClickSmsNotifications: function() {
		let smsNotifications = this.getValue('sms_notifications');
		application.settings.notifications.set('sms_notifications', smsNotifications);

		// hide / show sms number
		//
		if (smsNotifications) {
			this.$el.find('.sms-number').show();
		} else {
			this.$el.find('.sms-number').hide();
		}
	},

	onInputSmsNumber: function() {
		application.settings.notifications.set('sms_number', this.getValue('sms_notifications')? this.getValue('sms_number') : '');
	}
});