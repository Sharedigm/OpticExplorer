/******************************************************************************\
|                                                                              |
|                             project-showable.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for displaying projects.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Projects from '../collections/projects/projects.js';

export default {

	//
	// project showing methods
	//

	showProject: function(project, options) {
		if (this.desktop) {
			if (this.desktop.hasApp('project_viewer')) {

				// open in desktop
				//
				this.desktop.setApp('project_viewer', () => {
					this.desktop.getAppView('project_viewer').openProject(project, options);
				});
			} else {

				// open in new window
				//
				this.launch('project_viewer', _.extend({}, options, {
					model: project
				}));
			}
		} else {

			// open in new page
			//
			application.showUrl(project.getUrl());
		}
	},

	showProjects: function(projects, options) {
		if (this.desktop.hasApp('project_viewer')) {

			// open in desktop
			//
			this.desktop.setApp('project_viewer', () => {
				this.desktop.getAppView('project_viewer').openProjects(projects, options);
			});
		} else {

			// open in new window
			//
			this.launch('project_viewer', _.extend({}, options, {
				collection: new Projects.default(projects)
			}));
		}
	}
};