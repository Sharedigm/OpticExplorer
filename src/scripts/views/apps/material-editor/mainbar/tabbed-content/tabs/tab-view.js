/******************************************************************************\
|                                                                              |
|                                  tab-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing tabs.                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import EditableTabView from '../../../../../../views/apps/common/mainbar/tabbed-content/tabs/editable-tab-view.js';

export default EditableTabView.extend({

	//
	// getting methods
	//

	getIcon: function() {
		return '<i class="fa fa-gem"></i>';
	},

	getName: function() {

		// check if material has been previously saved
		//
		if (this.model.isNew()) {
			return this.getMaterialName();
		} else {
			return this.getFileName();	
		}
	},

	getMaterialName: function() {
		let app = this.getParentView('app');
		let material = app && app.options? app.options.material : undefined;	
		return material? material.toString() : 'Untitled';		
	},

	getFileName: function() {
		return this.model.getName();
	}
});