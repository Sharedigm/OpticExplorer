/******************************************************************************\
|                                                                              |
|                          user-school-form-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for showing info about a user's school.           |
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
import SchoolDetailsFormView from '../../../../../views/apps/profile-viewer/forms/profile/school/school-details-form-view.js';
import SchoolProgramFormView from '../../../../../views/apps/profile-viewer/forms/profile/school/school-program-form-view.js';
import SchoolExtrasFormView from '../../../../../views/apps/profile-viewer/forms/profile/school/school-extras-form-view.js';

export default TabbedFormView.extend({

	//
	// attributes
	//

	tabs: [
		{
			"name": "School",
			"icon": "fa fa-info-institution"
		},
		{
			"name": "Program",
			"icon": "fa fa-list"
		},
		{
			"name": "Extras",
			"icon": "fa fa-smile"
		}
	],
	
	//
	// rendering methods
	//

	showTab: function(tab) {
		switch (tab) {
			case 'school':
				this.showSchoolDetails();
				break;
			case 'program':
				this.showSchoolProgram();
				break;
			case 'extras':
				this.showSchoolExtras();
				break;
		}
	},

	showSchoolDetails: function() {
		this.showChildView('school', new SchoolDetailsFormView({
			model: this.model
		}));
	},

	showSchoolProgram: function() {
		this.showChildView('program', new SchoolProgramFormView({
			model: this.model
		}));
	},

	showSchoolExtras: function() {
		this.showChildView('extras', new SchoolExtrasFormView({
			model: this.model
		}));
	}
});