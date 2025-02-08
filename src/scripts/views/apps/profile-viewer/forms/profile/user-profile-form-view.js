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

import TabbedFormView from '../../../../../views/forms/tabbed-form-view.js';
import UserGeneralFormView from '../../../../../views/apps/profile-viewer/forms/profile/details/user-general-form-view.js';
import UserPreferencesFormView from '../../../../../views/apps/profile-viewer/forms/profile/details/user-preferences-form-view.js';
import UserTalentsFormView from '../../../../../views/apps/profile-viewer/forms/profile/details/user-talents-form-view.js';

export default TabbedFormView.extend({

	//
	// attributes
	//

	tabs: [
		{
			"name": "General",
			"icon": "fa fa-info-circle"
		},
		{
			"name": "Preferences",
			"icon": "fa fa-snowflake"
		},
		{
			"name": "Talents",
			"icon": "fa fa-lightbulb"
		}
	],

	//
	// rendering methods
	//

	showTab: function(tab) {
		switch (tab) {
			case 'general':
				this.showGeneralForm();
				break;
			case 'preferences':
				this.showPreferencesForm();
				break;
			case 'talents':
				this.showTalentsForm();
				break;
		}
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