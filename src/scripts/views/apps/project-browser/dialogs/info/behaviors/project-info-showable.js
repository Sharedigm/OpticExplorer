/******************************************************************************\
|                                                                              |
|                            project-info-showable.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for showing project information.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Projects from '../../../../../../collections/projects/projects.js';

export default {

	//
	// dialog rendering methods
	//

	showProjectInfoDialog: function(project, options) {
		import(
			'../../../../../../views/apps/project-browser/dialogs/info/project-info-dialog-view.js'
		).then((ProjectInfoDialogView) => {

			// show project info dialog
			//
			this.show(new ProjectInfoDialogView.default(_.extend({
				model: project
			}, options)));				
		});		
	},

	showProjectsInfoDialog: function(projects, options) {

		// show info for a single item
		//
		if (projects.length == 1) {
			this.showProjectInfoDialog(projects[0], options);
			return;
		}

		// show info for multiple items
		//
		import(
			'../../../../../../views/apps/project-browser/dialogs/info/projects-info-dialog-view.js'
		).then((ProjectsInfoDialogView) => {

			// show projects info dialog
			//
			this.show(new ProjectsInfoDialogView.default(_.extend({
				collection: new Projects(projects)
			}, options)));				
		});
	}
};