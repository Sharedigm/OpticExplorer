/******************************************************************************\
|                                                                              |
|                            user-job-form-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for showing job info about a user.                |
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
import JobPositionFormView from '../../../../../views/apps/profile-viewer/forms/profile/job/job-position-form-view.js';
import JobLocationFormView from '../../../../../views/apps/profile-viewer/forms/profile/job/job-location-form-view.js';
import JobDescriptionFormView from '../../../../../views/apps/profile-viewer/forms/profile/job/job-description-form-view.js';
import JobActivityFormView from '../../../../../views/apps/profile-viewer/forms/profile/job/job-activity-form-view.js';

export default TabbedFormView.extend({

	//
	// attributes
	//

	tabs: [
		{
			"name": "Position",
			"icon": "fa fa-briefcase"
		},
		{
			"name": "Location",
			"icon": "fa fa-map"
		},
		{
			"name": "Description",
			"icon": "fa fa-quote-left"
		},
		{
			"name": "Activity",
			"icon": "fa fa-list"
		}
	],

	//
	// rendering methods
	//

	showTab: function(tab) {
		switch (tab) {
			case 'position':
				this.showPositionForm();
				break;
			case 'location':
				this.showLocationForm();
				break;
			case 'description':
				this.showDescriptionForm();
				break;
			case 'activity':
				this.showActivityForm();
				break;
		}
	},

	showPositionForm: function() {
		this.showChildView('position', new JobPositionFormView({
			model: this.model
		}));
	},

	showLocationForm: function() {
		this.showChildView('location', new JobLocationFormView({
			model: this.model
		}));
	},

	showDescriptionForm: function() {
		this.showChildView('description', new JobDescriptionFormView({
			model: this.model
		}));
	},

	showActivityForm: function() {
		this.showChildView('activity', new JobActivityFormView({
			model: this.model
		}));
	}
});