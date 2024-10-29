/******************************************************************************\
|                                                                              |
|                          user-profile-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for showing profile info about a user.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../../views/forms/form-view.js';
import UserGeneralFormView from '../../../../../../views/apps/profile-viewer/mainbar/profile/forms/user-general-form-view.js';
import UserPreferencesFormView from '../../../../../../views/apps/profile-viewer/mainbar/profile/forms/user-preferences-form-view.js';
import UserTalentsFormView from '../../../../../../views/apps/profile-viewer/mainbar/profile/forms/user-talents-form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<p>Tell us a bit about yourself...</p>
		
		<ul class="nav nav-tabs" role="tablist">
		
			<li role="presentation" class="general tab<% if (tab == 'general') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".general.tab-pane">
					<i class="fa fa-info-circle"></i>
					<label>General</label>
				</a>
			</li>
		
			<li role="presentation" class="preferences tab<% if (tab == 'preferences') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".preferences.tab-pane">
					<i class="fa fa-snowflake"></i>
					<label>Preferences</label>
				</a>
			</li>
		
			<li role="presentation" class="talents tab<% if (tab == 'talents') { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".talents.tab-pane">
					<i class="fa fa-lightbulb"></i>
					<label>Talents</label>
				</a>
			</li>
		</ul>
		
		<div class="tab-content">
		
			<div role="tabpanel" class="general tab-pane<% if (tab == 'general') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="preferences tab-pane<% if (tab == 'preferences') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" class="talents tab-pane<% if (tab == 'talents') { %> active<% } %>">
			</div>
		</div>
	`),

	regions: {
		general: '.general.tab-pane',
		preferences: '.preferences.tab-pane',
		talents: '.talents.tab-pane'
	},

	//
	// getting methods
	//

	getValues: function() {
		return _.extend(
			this.getChildView('general').getValues(),
			this.getChildView('preferences').getValues(),
			this.getChildView('talents').getValues()
		);
	},
	
	//
	// rendering methods
	//

	templateContext: function() {
		return {
			tab: 'general'
		};
	},
	
	onRender: function() {

		// show child views
		//
		this.showGeneralForm();
		this.showPreferencesForm();
		this.showTalentsForm();
	},

	showGeneralForm: function() {
		this.showChildView('general', new UserGeneralFormView({
			model: this.model
		}));
	},

	showPreferencesForm: function() {
		this.showChildView('preferences', new UserPreferencesFormView({
			model: this.model
		}));
	},

	showTalentsForm: function() {
		this.showChildView('talents', new UserTalentsFormView({
			model: this.model
		}));
	}
});
