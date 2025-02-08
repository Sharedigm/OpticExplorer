/******************************************************************************\
|                                                                              |
|                          user-patent-form-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for showing info about a user's patent.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TabbedFormView from '../../../../../../../views/forms/tabbed-form-view.js';
import PatentInfoFormView from '../../../../../../../views/apps/profile-viewer/forms/profile/publications/patents/patent-info-form-view.js';
import PatentDetailsFormView from '../../../../../../../views/apps/profile-viewer/forms/profile/publications/patents/patent-details-form-view.js';

export default TabbedFormView.extend({

	//
	// attributes
	//

	tabs: [
		{
			"name": "Info",
			"icon": "fa fa-info-circle"
		},
		{
			"name": "Details",
			"icon": "fa fa-list"
		}
	],
	
	//
	// rendering methods
	//

	showTab: function(tab) {
		switch (tab) {
			case 'info':
				this.showPatentInfo();
				break;
			case 'details':
				this.showPatentDetails();
				break;
		}
	},

	showPatentInfo: function() {
		this.showChildView('info', new PatentInfoFormView({
			model: this.model
		}));
	},

	showPatentDetails: function() {
		this.showChildView('details', new PatentDetailsFormView({
			model: this.model
		}));
	}
});