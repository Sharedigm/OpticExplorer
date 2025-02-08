/******************************************************************************\
|                                                                              |
|                         user-affiliation-form-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a editable form view of a user's affiliation.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<% let roles = ['member', 'supporter', 'partner', 'leader', 'organizer', 'believer', 'promoter', 'player', 'shareholder']; %>
		<div class="role form-group">
			<label class="control-label"><i class="fa fa-user"></i>Role</label>
			<div class="controls">
				<select>
					<option value="member"<% if (role == 'member') { %> selected<% } %>>Member</option>
					<option value="supporter"<% if (role == 'supporter') { %> selected<% } %>>Supporter</option>
					<option value="partner"<% if (role == 'partner') { %> selected<% } %>>Partner</option>
					<option value="leader"<% if (role == 'leader') { %> selected<% } %>>Leader</option>
					<option value="organizer"<% if (role == 'organizer') { %> selected<% } %>>Organizer</option>
					<option value="believer"<% if (role == 'believer') { %> selected<% } %>>Believer</option>
					<option value="promoter"<% if (role == 'promoter') { %> selected<% } %>>Promoter</option>
					<option value="player"<% if (role == 'player') { %> selected<% } %>>Player</option>
					<option value="shareholder"<% if (role == 'shareholder') { %> selected<% } %>>Shareholder</option>
					<option value="other"<% if (!roles.contains(role)) { %> selected<% } %>>Other</option>
				</select>
			</div>
		</div>
		
		<div class="other-role form-group"<% if (roles.contains(role)) { %> style="display:none"<% } %>>
			<label class="control-label"></label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= role %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Role" data-content="Your role in the organization that you are affiliated with."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="organization-name form-group">
			<label class="required control-label"><i class="fa fa-quote-left"></i>Organization</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= organization_name %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Organization" data-content="The name of the organization to which you belong."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="organization-website form-group">
			<label class="control-label"><i class="fa fa-cloud"></i>Website</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= organization_website %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Website" data-content="The URL of the website of the organization to which you belong."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="organization-unit form-group">
			<label class="control-label"><i class="fa fa-sitemap"></i>Unit</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= organization_unit %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Unit" data-content="The unit of the organization to which you belong."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="years form-group">
			<label class="control-label"><i class="fa fa-calendar-alt"></i>When</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="from-year form-control" placeholder="first year" value="<%= from_year %>" />
					<span class="input-group-addon">-</span>
					<input type="number" class="to-year form-control" placeholder="last year" value="<%= to_year %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="When" data-content="This is the span of years when you belonged to this organization."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	events: _.extend({}, FormView.prototype.events, {
		'change .role select': 'onChangeRole'
	}),

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'role':
				return this.$el.find('.role option:selected').val();
			case 'other_role':
				return this.$el.find('.other-role input').val();
			case 'organization_name':
				return this.$el.find('.organization-name input').val();
			case 'organization_website':
				return this.$el.find('.organization-website input').val();
			case 'organization_unit':
				return this.$el.find('.organization-unit input').val();
			case 'from_year':
				return parseInt(this.$el.find('.from-year').val());
			case 'to_year':
				return parseInt(this.$el.find('.to-year').val());
		}
	},

	getValues: function() {
		return {
			role: this.getValue('role') != 'other'? this.getValue('role') : this.getValue('other_role'),
			organization_name: this.getValue('organization_name'),
			organization_website: this.getValue('organization_website'),
			organization_unit: this.getValue('organization_unit'),
			from_year: this.getValue('from_year'),
			to_year: this.getValue('to_year')
		};
	},

	//
	// event handling methods
	//

	onChangeRole: function() {
		let role = this.$el.find('.role option:selected').val();
		if (role == 'other') {
			this.$el.find('.other-role').show();
		} else {
			this.$el.find('.other-role').hide();
		}
	}
});