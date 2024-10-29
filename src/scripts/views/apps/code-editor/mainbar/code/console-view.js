/******************************************************************************\
|                                                                              |
|                                 console-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a code console.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'item-list',

	template: template(`
	`),

	//
	// setting methods
	//

	setModel: function(model) {
		this.model = model;
		this.render();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
		};
	}
});