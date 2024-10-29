/******************************************************************************\
|                                                                              |
|                             page-index-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a type of sidebar panel.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import LeafView from '../../../../../views/items/trees/leaf-view.js';

export default LeafView.extend({

	//
	// getting methods
	//

	getIcon: function() {
		return this.model.get('icon');
	},

	getName: function() {
		return this.model.get('name');
	}
});